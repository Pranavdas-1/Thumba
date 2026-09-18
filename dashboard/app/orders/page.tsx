import { prisma } from "@thumba/shared/db";
import { OrdersManager, type AdminOrder } from "@/components/OrdersManager";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const rows = await prisma.order.findMany({
    include: { user: true, items: { include: { product: true } }, shippingAddress: true },
    orderBy: { createdAt: "desc" },
  });
  const delayedBefore = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const orders: AdminOrder[] = rows.map((order) => ({
    id: order.id,
    total: order.total,
    status: order.status === "COMPLETE" ? "complete" : "incomplete",
    createdAt: order.createdAt.toISOString(),
    delayed: order.status === "INCOMPLETE" && order.createdAt < delayedBefore,
    customerName: order.user.name,
    customerEmail: order.user.email,
    customerPhone: order.user.phone ?? "",
    shipping: order.shippingAddress ? { street: order.shippingAddress.street, city: order.shippingAddress.city, state: order.shippingAddress.state, country: order.shippingAddress.country, zipCode: order.shippingAddress.zipCode } : null,
    items: order.items.map((item) => ({ productId: item.productId, name: item.product.name, quantity: item.quantity, price: item.price })),
  }));

  return <main><OrdersManager initialOrders={orders} /></main>;
}
