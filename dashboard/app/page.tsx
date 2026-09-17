import { formatCurrency } from "@thumba/shared";
import { prisma } from "@thumba/shared/db";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const [orders, customerCount, productCount] = await Promise.all([
    prisma.order.findMany({ select: { id: true, status: true, total: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
  ]);
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <main>
      <h1 className="font-serif text-3xl text-navy-900">Overview</h1>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <Stat label="Revenue" value={formatCurrency(revenue)} />
        <Stat label="Orders" value={String(orders.length)} />
        <Stat label="Customers" value={String(customerCount)} />
        <Stat label="Products" value={String(productCount)} />
      </div>
      <section className="mt-10 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Recent orders</h2>
        <table className="mt-4 w-full text-left text-sm">
          <thead className="text-navy-500">
            <tr>
              <th className="py-2">Order</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-navy-100">
                <td className="py-3">{order.id}</td>
                <td className="capitalize">{order.status.toLowerCase()}</td>
                <td>{formatCurrency(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <p className="text-sm text-navy-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-navy-900">{value}</p>
    </div>
  );
}
