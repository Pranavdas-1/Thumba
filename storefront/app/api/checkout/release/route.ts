import { NextResponse } from "next/server";
import { z } from "zod";
import { releaseExpiredStockReservations, releaseStockReservation } from "@/lib/stock-reservations";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  reservationId: z.string().min(1),
  reservationToken: z.string().min(1),
});

export async function POST(request: Request) {
  await releaseExpiredStockReservations();
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid reservation release payload" }, { status: 400 });

  const status = await releaseStockReservation({
    id: parsed.data.reservationId,
    token: parsed.data.reservationToken,
  });
  if (status === "not_found") return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  return NextResponse.json({ status });
}
