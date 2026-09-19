import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { RAZORPAY_CURRENCY } from "@thumba/shared";
import { prisma } from "@thumba/shared/db";
import { createRazorpayInstance, getPublicRazorpayKey, isRazorpayTestKey } from "@/lib/razorpay";
import {
  hashReservationToken,
  releaseExpiredStockReservations,
  releaseStockReservation,
  reserveStock,
  StockReservationError,
} from "@/lib/stock-reservations";

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
    zipCode: z.string().min(1),
  }),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
  }

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

  await releaseExpiredStockReservations();

  let reservation;
  try {
    // This transaction conditionally decrements every requested product before
    // Razorpay is contacted. If any line loses a race, the whole transaction
    // rolls back and no payment order is created.
    reservation = await reserveStock(parsed.data.items);
    const razorpay = createRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: reservation.amountPaise,
      currency: RAZORPAY_CURRENCY,
      notes: {
        source: "thumba-storefront",
        city: parsed.data.shipping.city,
        reservationId: reservation.id,
      },
    });

    const attached = await prisma.stockReservation.updateMany({
      where: { id: reservation.id, tokenHash: hashReservationToken(reservation.token), status: "PENDING" },
      data: { razorpayOrderId: order.id },
    });
    if (attached.count !== 1) {
      await releaseStockReservation({ id: reservation.id, token: reservation.token });
      return NextResponse.json({ error: "Checkout reservation expired; please try again" }, { status: 409 });
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      reservationId: reservation.id,
      reservationToken: reservation.token,
      reservationExpiresAt: reservation.expiresAt,
    });
  } catch (error) {
    if (reservation) {
      await releaseStockReservation({ id: reservation.id, token: reservation.token }).catch(() => undefined);
    }
    if (error instanceof StockReservationError || error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      return NextResponse.json({ error: "One or more items are out of stock or unavailable" }, { status: 409 });
    }
    const message = error instanceof Error ? error.message : "Could not create Razorpay order";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
