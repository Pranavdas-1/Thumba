import { prisma, prismaOrderStatusToOrderStatus } from "@thumba/shared/db";
import { OrdersManager, type AdminOrder } from "@/components/OrdersManager";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const rows = await prisma.order.findMany({
    include: { user: true, items: { include: { product: true } }, shippingAddress: true },
    orderBy: { createdAt: "desc" },
  });
  const orders: AdminOrder[] = rows.map((order) => ({
    id: order.id,
    total: order.total,
    status: prismaOrderStatusToOrderStatus(order.status),
    paymentId: order.paymentId,
    razorpayOrderId: order.razorpayOrderId,
    createdAt: order.createdAt.toISOString(),
    customerName: order.user.name,
    customerEmail: order.user.email,
    city: order.shippingAddress?.city ?? "—",
    items: order.items.map((item) => ({ name: item.product.name, quantity: item.quantity, price: item.price })),
  }));

  return <main><OrdersManager initialOrders={orders} /></main>;
}
