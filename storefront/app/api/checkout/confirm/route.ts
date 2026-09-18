import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { calculateTax, DEFAULT_PRICES, cartTotal } from "@thumba/shared";
import { prisma } from "@thumba/shared/db";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  razorpayOrderId: z.string().min(1),
  paymentId: z.string().min(1),
  customer: z.object({ name: z.string().min(1), email: z.string().email(), phone: z.string().optional() }),
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().positive() })).min(1),
  shipping: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
  }),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payment confirmation payload" }, { status: 400 });

  try {
    const order = await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({ where: { razorpayOrderId: parsed.data.razorpayOrderId } });
      if (existing) return existing;

      const quantities = new Map<string, number>();
      for (const item of parsed.data.items) quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);

      const rows = await tx.product.findMany({ where: { id: { in: [...quantities.keys()] } } });
      const byId = new Map(rows.map((row) => [row.id, row]));
      for (const [productId, quantity] of quantities) {
        const product = byId.get(productId);
        if (!product || !product.inStock || product.stock < quantity) throw new CheckoutError("One or more products are out of stock");
      }

      const lineItems = [...quantities.entries()].map(([productId, quantity]) => {
        const product = byId.get(productId)!;
        return { product, quantity, price: product.discountedPrice ?? product.price };
      });
      const subtotal = cartTotal(lineItems);
      const total = subtotal + calculateTax(subtotal, DEFAULT_PRICES.TAX_RATE) + DEFAULT_PRICES.SHIPPING_FEE;

      // Reserve every line inside the same transaction as order creation. The
      // conditional update is the oversell guard when two checkouts race.
      for (const { product, quantity } of lineItems) {
        const updated = await tx.product.updateMany({
          where: { id: product.id, inStock: true, stock: { gte: quantity } },
          data: { stock: { decrement: quantity }, inStock: product.stock > quantity },
        });
        if (updated.count !== 1) throw new CheckoutError("Stock changed while checking out; please try again");
      }

      const user = await tx.user.upsert({
        where: { email: parsed.data.customer.email },
        update: { name: parsed.data.customer.name, phone: parsed.data.customer.phone || undefined },
        create: { name: parsed.data.customer.name, email: parsed.data.customer.email, phone: parsed.data.customer.phone || null },
      });

      const order = await tx.order.create({
        data: {
          user: { connect: { id: user.id } },
          total,
          status: "INCOMPLETE",
          paymentId: parsed.data.paymentId,
          razorpayOrderId: parsed.data.razorpayOrderId,
          shippingAddress: { create: { ...parsed.data.shipping, country: "India" } },
          items: {
            create: lineItems.map(({ product, quantity, price }) => ({
              product: { connect: { id: product.id } },
              quantity,
              price,
            })),
          },
        },
      });

      return order;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    revalidatePath("/", "layout");
    revalidatePath("/shop");
    revalidatePath("/new-arrivals");

    return NextResponse.json({ orderId: order.id, status: order.status.toLowerCase() });
  } catch (error) {
    if (error instanceof CheckoutError) return NextResponse.json({ error: error.message }, { status: 409 });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      return NextResponse.json({ error: "Stock changed while checking out; please try again" }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: "Could not save the order" }, { status: 500 });
  }
}

class CheckoutError extends Error {}
