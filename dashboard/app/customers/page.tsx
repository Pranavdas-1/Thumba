import { prisma } from "@thumba/shared/db";
import { CustomersManager, type AdminCustomer } from "@/components/CustomersManager";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const users = await prisma.user.findMany({ include: { orders: { include: { shippingAddress: true }, orderBy: { createdAt: "desc" } } }, orderBy: { createdAt: "desc" } });
  const customers: AdminCustomer[] = users.map((user) => {
    const latestAddress = user.orders.find((order) => order.shippingAddress)?.shippingAddress;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      address: latestAddress ? `${latestAddress.street}, ${latestAddress.city}, ${latestAddress.state} ${latestAddress.zipCode}` : "No address saved",
      orders: user.orders.map((order) => ({ id: order.id, total: order.total, createdAt: order.createdAt.toISOString(), status: order.status === "COMPLETE" ? "complete" : "incomplete" })),
    };
  });

  return <main><CustomersManager initialCustomers={customers} /></main>;
}
