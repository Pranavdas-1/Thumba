"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@thumba/shared";
import { AlertTriangle, CheckCircle2, ChevronRight, Clock3, MapPin, X } from "lucide-react";

export type AdminOrder = {
  id: string;
  total: number;
  status: "incomplete" | "complete";
  createdAt: string;
  delayed: boolean;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shipping: { street: string; city: string; state: string; country: string; zipCode: string } | null;
  items: { productId: string; name: string; quantity: number; price: number }[];
};

export function OrdersManager({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function updateStatus(id: string, status: "incomplete" | "complete") {
    setSavingId(id);
    setError("");
    try {
      const response = await fetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update order");
      setOrders((current) => current.map((order) => order.id === id ? { ...order, status: data.status, delayed: false } : order));
      setSelected((current) => current?.id === id ? { ...current, status: data.status, delayed: false } : current);
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Could not update order");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-500">Operations</p><h1 className="mt-2 font-serif text-4xl text-navy-900">Orders</h1><p className="mt-2 text-sm text-navy-500">Open an order for customer, address, and item details.</p></div><div className="text-sm text-navy-500">{orders.length} total</div></div>
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow-sm"><table className="w-full min-w-[920px] text-left text-sm"><thead className="bg-navy-50 text-xs uppercase tracking-wider text-navy-500"><tr><th className="px-4 py-3">Customer</th><th>Date placed</th><th>Items</th><th>Status</th><th>Total</th><th>Open</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} onClick={() => setSelected(order)} className={`cursor-pointer border-t border-navy-100 align-top hover:bg-navy-50/60 ${order.delayed ? "bg-red-50" : ""}`}><td className="px-4 py-4"><span className="font-medium text-navy-900">{order.customerName}</span><span className="block text-xs text-navy-500">{order.customerEmail}</span></td><td className="py-4 text-xs text-navy-500">{formatDate(order.createdAt)}</td><td className="py-4 text-xs text-navy-700">{order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)</td><td className="py-4"><div className="flex flex-wrap items-center gap-2">{order.delayed && <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-[10px] font-semibold uppercase text-red-800"><AlertTriangle className="h-3 w-3" />Delayed</span>}<span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${order.status === "complete" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{order.status}</span></div></td><td className="py-4 font-medium">{formatCurrency(order.total)}</td><td className="py-4"><ChevronRight className="h-4 w-4 text-navy-400" /></td></tr>)}</tbody></table>{orders.length === 0 && <p className="p-10 text-center text-sm text-navy-500">No orders yet.</p>}</div>

      {selected && <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-900/40 p-0 sm:items-center sm:p-6" onClick={() => setSelected(null)}><section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-500">Order detail</p><h2 className="mt-1 font-mono text-lg text-navy-900">{selected.id}</h2><p className="mt-1 text-xs text-navy-500">Placed {formatDate(selected.createdAt)}</p></div><button type="button" onClick={() => setSelected(null)} aria-label="Close order details" className="rounded-lg p-2 text-navy-500 hover:bg-navy-100"><X className="h-5 w-5" /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-lg bg-navy-50 p-4"><h3 className="text-xs font-semibold uppercase tracking-wider text-navy-500">Customer</h3><p className="mt-2 font-medium text-navy-900">{selected.customerName}</p><p className="text-sm text-navy-600">{selected.customerEmail}</p>{selected.customerPhone && <p className="text-sm text-navy-600">{selected.customerPhone}</p>}</div><div className="rounded-lg bg-navy-50 p-4"><h3 className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-navy-500"><MapPin className="h-3.5 w-3.5" />Shipping address</h3>{selected.shipping ? <p className="mt-2 text-sm leading-6 text-navy-700">{selected.shipping.street}<br />{selected.shipping.city}, {selected.shipping.state}<br />{selected.shipping.zipCode}, {selected.shipping.country}</p> : <p className="mt-2 text-sm text-navy-500">No address saved.</p>}</div></div><div className="mt-6"><h3 className="text-xs font-semibold uppercase tracking-wider text-navy-500">Items</h3><ul className="mt-2 divide-y divide-navy-100 rounded-lg border border-navy-100">{selected.items.map((item) => <li key={item.productId} className="flex justify-between gap-4 p-3 text-sm"><span className="text-navy-800">{item.name} <span className="text-navy-500">× {item.quantity}</span></span><span className="font-medium">{formatCurrency(item.price * item.quantity)}</span></li>)}</ul><div className="flex justify-between border-t border-navy-200 py-4 text-base font-semibold"><span>Total</span><span>{formatCurrency(selected.total)}</span></div></div><div className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-navy-200 p-3"><div className="flex items-center gap-2 text-sm text-navy-700">{selected.status === "complete" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Clock3 className="h-4 w-4 text-amber-600" />}Mark order status</div><select aria-label="Order status" value={selected.status} disabled={savingId === selected.id} onChange={(event) => updateStatus(selected.id, event.target.value as "incomplete" | "complete")} className="rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm"><option value="incomplete">Incomplete</option><option value="complete">Complete</option></select></div></section></div>}
    </div>
  );
}
