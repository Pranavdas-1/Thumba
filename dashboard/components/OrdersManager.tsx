"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@thumba/shared";

export type AdminOrder = {
  id: string;
  total: number;
  status: "pending" | "packed" | "shipped" | string;
  paymentId: string | null;
  razorpayOrderId: string | null;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  city: string;
  items: { name: string; quantity: number; price: number }[];
};

export function OrdersManager({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function updateStatus(id: string, status: string) {
    setSavingId(id);
    setError("");
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update order");
      setOrders((current) => current.map((order) => (order.id === id ? { ...order, status: data.status } : order)));
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Could not update order");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy-900">Orders</h1>
      <p className="mt-2 text-sm text-navy-500">Live orders from PostgreSQL.</p>
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-navy-50 text-navy-500"><tr><th className="px-4 py-3">Order</th><th>Customer</th><th>Items</th><th>Status</th><th>Total</th><th>City</th><th>Date</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-navy-100 align-top">
                <td className="px-4 py-4 font-mono text-xs text-navy-700">{order.id}<span className="block text-[10px] text-navy-400">{order.razorpayOrderId ?? ""}</span></td>
                <td className="py-4"><span className="block font-medium text-navy-900">{order.customerName}</span><span className="text-xs text-navy-500">{order.customerEmail}</span></td>
                <td className="max-w-[220px] py-4 text-xs text-navy-700">{order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}</td>
                <td className="py-4"><select aria-label={`Status for ${order.id}`} value={order.status} disabled={savingId === order.id} onChange={(event) => updateStatus(order.id, event.target.value)} className="rounded-lg border border-navy-200 bg-white px-2.5 py-2 text-xs capitalize"><option value="pending">Pending</option><option value="packed">Packed</option><option value="shipped">Shipped</option></select></td>
                <td className="py-4 font-medium">{formatCurrency(order.total)}</td>
                <td className="py-4">{order.city}</td>
                <td className="py-4 text-xs text-navy-500">{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-8 text-center text-sm text-navy-500">No orders yet.</p>}
      </div>
    </div>
  );
}
