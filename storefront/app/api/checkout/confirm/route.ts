import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { RAZORPAY_CURRENCY } from "@thumba/shared";
import { prisma } from "@thumba/shared/db";
import { createRazorpayInstance, verifyRazorpaySignature } from "@/lib/razorpay";
import {
  hashReservationToken,
  parseReservationItems,
  releaseExpiredStockReservations,
  StockReservationError,
} from "@/lib/stock-reservations";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  razorpayOrderId: z.string().min(1),
  paymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
  reservationToken: z.string().min(1),
  customer: z.object({ name: z.string().min(1), email: z.string().email(), phone: z.string().optional() }),
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().positive() })).min(1).optional(),
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
  await releaseExpiredStockReservations();

  if (!verifyRazorpaySignature(parsed.data.razorpayOrderId, parsed.data.paymentId, parsed.data.razorpaySignature)) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  let razorpayOrder;
  let razorpayPayment;
  try {
    const razorpay = createRazorpayInstance();
    [razorpayOrder, razorpayPayment] = await Promise.all([
      razorpay.orders.fetch(parsed.data.razorpayOrderId),
      razorpay.payments.fetch(parsed.data.paymentId),
    ]);
  } catch {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  if (
    razorpayPayment.order_id !== parsed.data.razorpayOrderId ||
    razorpayPayment.status !== "captured" ||
    !razorpayPayment.captured ||
    razorpayPayment.currency !== RAZORPAY_CURRENCY ||
    razorpayOrder.currency !== RAZORPAY_CURRENCY ||
    razorpayOrder.status !== "paid"
  ) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({ where: { razorpayOrderId: parsed.data.razorpayOrderId } });
      if (existing) return existing;

      const reservation = await tx.stockReservation.findUnique({ where: { razorpayOrderId: parsed.data.razorpayOrderId } });
      if (!reservation || reservation.tokenHash !== hashReservationToken(parsed.data.reservationToken)) {
        throw new CheckoutError("Payment reservation could not be verified");
      }
      if (reservation.status !== "PENDING" || reservation.expiresAt <= new Date()) {
        throw new CheckoutError("Payment reservation has expired; please try again");
      }

      const lineItems = parseReservationItems(reservation.items);
      if (reservation.amountPaise !== Number(razorpayOrder.amount) || Math.round(reservation.total * 100) !== Number(razorpayOrder.amount)) {
        throw new CheckoutError("Payment amount does not match the checkout");
      }

      const products = await tx.product.findMany({ where: { id: { in: lineItems.map((item) => item.productId) } }, select: { id: true } });
      if (products.length !== lineItems.length) {
        throw new CheckoutError("A reserved product is no longer available");
      }

      const user = await tx.user.upsert({
        where: { email: parsed.data.customer.email },
        update: { name: parsed.data.customer.name, phone: parsed.data.customer.phone || undefined },
        create: { name: parsed.data.customer.name, email: parsed.data.customer.email, phone: parsed.data.customer.phone || null },
      });

      const order = await tx.order.create({
        data: {
          user: { connect: { id: user.id } },
          total: reservation.total,
          status: "INCOMPLETE",
          paymentId: parsed.data.paymentId,
          razorpayOrderId: parsed.data.razorpayOrderId,
          shippingAddress: { create: { ...parsed.data.shipping, country: "India" } },
          items: {
            create: lineItems.map(({ productId, quantity, price }) => ({
              product: { connect: { id: productId } },
              quantity,
              price,
            })),
          },
        },
      });

      const confirmed = await tx.stockReservation.updateMany({
        where: { id: reservation.id, tokenHash: reservation.tokenHash, status: "PENDING" },
        data: { status: "CONFIRMED" },
      });
      if (confirmed.count !== 1) throw new CheckoutError("Payment reservation could not be completed");

      return order;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    revalidatePath("/", "layout");
    revalidatePath("/shop");
    revalidatePath("/new-arrivals");

    return NextResponse.json({ orderId: order.id, status: order.status.toLowerCase() });
  } catch (error) {
    if (error instanceof CheckoutError || error instanceof StockReservationError) return NextResponse.json({ error: error.message }, { status: 409 });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      return NextResponse.json({ error: "Stock changed while checking out; please try again" }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: "Could not save the order" }, { status: 500 });
  }
}

class CheckoutError extends Error {}
