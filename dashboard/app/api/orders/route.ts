import { NextResponse } from "next/server";
import { prisma, prismaOrderStatusToOrderStatus } from "@thumba/shared/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await prisma.order.findMany({
      include: { user: true, items: { include: { product: true } }, shippingAddress: true },
      orderBy: { createdAt: "desc" },
    });
    const delayedBefore = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    return NextResponse.json({
      orders: rows.map((order) => ({
        id: order.id,
        total: order.total,
        status: prismaOrderStatusToOrderStatus(order.status),
        createdAt: order.createdAt.toISOString(),
        delayed: order.status === "INCOMPLETE" && order.createdAt < delayedBefore,
        customerName: order.user.name,
        customerEmail: order.user.email,
        customerPhone: order.user.phone ?? "",
        shipping: order.shippingAddress ? {
          street: order.shippingAddress.street,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          country: order.shippingAddress.country,
          zipCode: order.shippingAddress.zipCode,
        } : null,
        items: order.items.map((item) => ({
          productId: item.productId,
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
        })),
      })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Database request failed" }, { status: 500 });
  }
}
