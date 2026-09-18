import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma, prismaOrderStatusToOrderStatus } from "@thumba/shared/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { user: true, items: { include: { product: true } }, shippingAddress: true },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const delayedBefore = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    return NextResponse.json({
      order: {
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
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Database request failed" }, { status: 500 });
  }
}

const allowedStatuses = new Set(["incomplete", "complete"]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = body && typeof body === "object" ? String((body as Record<string, unknown>).status) : "";
  if (!allowedStatuses.has(status)) {
    return NextResponse.json({ error: "Status must be incomplete or complete" }, { status: 400 });
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status: status.toUpperCase() as "INCOMPLETE" | "COMPLETE" },
    });
    revalidatePath("/");
    revalidatePath("/orders");
    revalidatePath("/customers");
    return NextResponse.json({ id: order.id, status: prismaOrderStatusToOrderStatus(order.status) });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code === "P2025") return NextResponse.json({ error: "Order not found" }, { status: 404 });
    console.error(error);
    return NextResponse.json({ error: "Database request failed" }, { status: 500 });
  }
}
