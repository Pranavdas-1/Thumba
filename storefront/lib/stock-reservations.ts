import crypto from "node:crypto";
import { Prisma, StockReservationStatus } from "@prisma/client";
import { calculateTax, cartTotal, DEFAULT_PRICES } from "@thumba/shared";
import { prisma } from "@thumba/shared/db";

export const STOCK_RESERVATION_MINUTES = 15;

export type ReservationItem = {
  productId: string;
  quantity: number;
  price: number;
};

export class StockReservationError extends Error {
  constructor(message = "One or more products are out of stock") {
    super(message);
    this.name = "StockReservationError";
  }
}

export function hashReservationToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function parseReservationItems(value: Prisma.JsonValue): ReservationItem[] {
  if (!Array.isArray(value)) throw new StockReservationError("Stock reservation is invalid");
  const items = value.filter((item): item is Prisma.JsonObject => (
    typeof item === "object" && item !== null && !Array.isArray(item)
  )).map((item) => ({
    productId: typeof item.productId === "string" ? item.productId : "",
    quantity: Number(item.quantity),
    price: Number(item.price),
  }));
  if (items.length === 0 || items.some((item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity <= 0 || !Number.isFinite(item.price) || item.price < 0)) {
    throw new StockReservationError("Stock reservation is invalid");
  }
  return items;
}

export async function reserveStock(items: { productId: string; quantity: number }[]) {
  const quantities = new Map<string, number>();
  for (const item of items) quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashReservationToken(token);
  const expiresAt = new Date(Date.now() + STOCK_RESERVATION_MINUTES * 60 * 1000);

  const reservation = await prisma.$transaction(async (tx) => {
    const rows = await tx.product.findMany({ where: { id: { in: [...quantities.keys()] } } });
    const byId = new Map(rows.map((row) => [row.id, row]));
    const lineItems: ReservationItem[] = [];

    for (const [productId, quantity] of quantities) {
      const product = byId.get(productId);
      if (!product || product.hidden || !product.inStock || product.stock < quantity) {
        throw new StockReservationError();
      }
      lineItems.push({ productId, quantity, price: product.discountedPrice ?? product.price });
    }

    const subtotal = cartTotal(lineItems);
    const total = subtotal + calculateTax(subtotal, DEFAULT_PRICES.TAX_RATE) + DEFAULT_PRICES.SHIPPING_FEE;

    for (const item of lineItems) {
      const product = byId.get(item.productId)!;
      const updated = await tx.product.updateMany({
        where: {
          id: item.productId,
          hidden: false,
          inStock: true,
          stock: { gte: item.quantity },
        },
        data: {
          stock: { decrement: item.quantity },
          inStock: product.stock > item.quantity,
        },
      });
      if (updated.count !== 1) throw new StockReservationError();
    }

    return tx.stockReservation.create({
      data: {
        tokenHash,
        items: lineItems,
        total,
        amountPaise: Math.round(total * 100),
        expiresAt,
      },
    });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

  return {
    id: reservation.id,
    token,
    expiresAt: reservation.expiresAt.toISOString(),
    items: parseReservationItems(reservation.items),
    total: reservation.total,
    amountPaise: reservation.amountPaise,
  };
}

type ReleaseInput = {
  id?: string;
  razorpayOrderId?: string;
  tokenHash?: string;
};

async function releaseReservation(input: ReleaseInput) {
  return prisma.$transaction(async (tx) => {
    const reservation = input.id
      ? await tx.stockReservation.findUnique({ where: { id: input.id } })
      : input.razorpayOrderId
        ? await tx.stockReservation.findUnique({ where: { razorpayOrderId: input.razorpayOrderId } })
        : null;
    if (!reservation) return "not_found" as const;
    if (input.tokenHash && reservation.tokenHash !== input.tokenHash) return "not_found" as const;
    if (reservation.status !== StockReservationStatus.PENDING) return reservation.status.toLowerCase() as Lowercase<StockReservationStatus>;

    const claimed = await tx.stockReservation.updateMany({
      where: { id: reservation.id, status: StockReservationStatus.PENDING },
      data: { status: StockReservationStatus.RELEASED },
    });
    if (claimed.count !== 1) return "already_released" as const;

    for (const item of parseReservationItems(reservation.items)) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity }, inStock: true },
      });
    }
    return "released" as const;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export function releaseStockReservation(input: { id: string; token: string }) {
  return releaseReservation({ id: input.id, tokenHash: hashReservationToken(input.token) });
}

export async function releaseExpiredStockReservations() {
  const expired = await prisma.stockReservation.findMany({
    where: { status: StockReservationStatus.PENDING, expiresAt: { lte: new Date() } },
    select: { id: true },
  });
  let released = 0;
  for (const reservation of expired) {
    const result = await releaseReservation({ id: reservation.id });
    if (result === "released") released += 1;
  }
  return released;
}

export function releaseReservationAfterProviderFailure(razorpayOrderId: string, token: string) {
  return releaseReservation({ razorpayOrderId, tokenHash: hashReservationToken(token) });
}
