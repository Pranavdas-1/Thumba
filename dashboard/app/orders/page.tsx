import { formatCurrency, ORDER_STATUS_LABELS } from "@thumba/shared";
import { mockOrders } from "@/lib/mock-data";

export default function OrdersPage() {
  return (
    <main>
      <h1 className="font-serif text-3xl text-navy-900">Orders</h1>
      <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-50 text-navy-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th>Items</th>
              <th>Status</th>
              <th>Total</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order) => (
              <tr key={order.id} className="border-t border-navy-100">
                <td className="px-4 py-3">{order.id}</td>
                <td>{order.items.map((item) => item.productName).join(", ")}</td>
                <td>{ORDER_STATUS_LABELS[order.status]}</td>
                <td>{formatCurrency(order.total)}</td>
                <td>{order.shippingAddress.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
