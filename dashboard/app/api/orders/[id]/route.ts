import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma, prismaOrderStatusToOrderStatus } from "@thumba/shared/db";

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
