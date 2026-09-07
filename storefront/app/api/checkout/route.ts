import { NextResponse } from "next/server";
import { z } from "zod";
import { RAZORPAY_CURRENCY, cartTotal } from "@thumba/shared";
import { products } from "@/lib/products";
import { createRazorpayInstance, getPublicRazorpayKey, isRazorpayTestKey } from "@/lib/razorpay";

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

  const catalogItems = parsed.data.items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product || !product.inStock) {
      throw new Error("One or more items are unavailable");
    }
    return {
      price: product.discountedPrice ?? product.price,
      quantity: item.quantity,
    };
  });

  const totalRupees = cartTotal(catalogItems);
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
