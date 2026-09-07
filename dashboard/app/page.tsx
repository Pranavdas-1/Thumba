import { formatCurrency } from "@thumba/shared";
import { catalog } from "@thumba/shared";
import { mockCustomers, mockOrders } from "@/lib/mock-data";

export default function DashboardHome() {
  const revenue = mockOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <main>
      <h1 className="font-serif text-3xl text-navy-900">Overview</h1>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <Stat label="Revenue (sample)" value={formatCurrency(revenue)} />
        <Stat label="Orders" value={String(mockOrders.length)} />
        <Stat label="Customers" value={String(mockCustomers.length)} />
        <Stat label="Products" value={String(catalog.length)} />
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
            {mockOrders.map((order) => (
              <tr key={order.id} className="border-t border-navy-100">
                <td className="py-3">{order.id}</td>
                <td className="capitalize">{order.status}</td>
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
