import { NextResponse } from "next/server";
import { z } from "zod";
import { RAZORPAY_CURRENCY, calculateTax, DEFAULT_PRICES, cartTotal } from "@thumba/shared";
import { prisma } from "@thumba/shared/db";
import { createRazorpayInstance, getPublicRazorpayKey, isRazorpayTestKey } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
  shipping: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    zipCode: z.string().min(1),
  }),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
  }

  const productIds = [...new Set(parsed.data.items.map((item) => item.productId))];
  const dbProducts = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const byId = new Map(dbProducts.map((product) => [product.id, product]));
  const unavailable = parsed.data.items.some((item) => {
    const product = byId.get(item.productId);
    return !product || product.stock < item.quantity || !product.inStock;
  });
  if (unavailable) {
    return NextResponse.json({ error: "One or more items are unavailable or out of stock" }, { status: 409 });
  }
  const catalogItems = parsed.data.items.map((item) => {
    const product = byId.get(item.productId)!;
    return { price: product.discountedPrice ?? product.price, quantity: item.quantity };
  });

  const subtotal = cartTotal(catalogItems);
  const totalRupees = subtotal + calculateTax(subtotal, DEFAULT_PRICES.TAX_RATE) + DEFAULT_PRICES.SHIPPING_FEE;
  const amountPaise = totalRupees * 100;
  const keyId = getPublicRazorpayKey();

  if (!keyId || !isRazorpayTestKey(keyId)) {
    return NextResponse.json(
      {
        error:
          "Add Razorpay test-mode keys (rzp_test_) to the root .env as RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, and NEXT_PUBLIC_RAZORPAY_KEY_ID.",
      },
      { status: 503 },
    );
  }

  try {
    const razorpay = createRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: RAZORPAY_CURRENCY,
      notes: {
        source: "thumba-storefront",
        city: parsed.data.shipping.city,
        subtotal: String(subtotal),
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create Razorpay order";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
