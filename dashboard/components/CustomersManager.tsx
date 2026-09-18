"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@thumba/shared";
import { ChevronRight, Mail, Phone, UserRound, X } from "lucide-react";

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  orders: { id: string; total: number; createdAt: string; status: "complete" | "incomplete" }[];
};

export function CustomersManager({ initialCustomers }: { initialCustomers: AdminCustomer[] }) {
  const [selected, setSelected] = useState<AdminCustomer | null>(null);
  return (
    <div>
      <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-500">Relationships</p><h1 className="mt-2 font-serif text-4xl text-navy-900">Customers</h1><p className="mt-2 text-sm text-navy-500">Live customer accounts and their order history.</p></div><span className="text-sm text-navy-500">{initialCustomers.length} total</span></div>
      <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow-sm"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-navy-50 text-xs uppercase tracking-wider text-navy-500"><tr><th className="px-4 py-3">Customer</th><th>Phone</th><th>Latest address</th><th>Orders</th><th>Open</th></tr></thead><tbody>{initialCustomers.map((customer) => <tr key={customer.id} onClick={() => setSelected(customer)} className="cursor-pointer border-t border-navy-100 hover:bg-navy-50/60"><td className="px-4 py-4"><span className="font-medium text-navy-900">{customer.name}</span><span className="block text-xs text-navy-500">{customer.email}</span></td><td className="py-4 text-navy-600">{customer.phone || "—"}</td><td className="max-w-[300px] py-4 text-xs text-navy-600">{customer.address}</td><td className="py-4 text-navy-600">{customer.orders.length}</td><td className="py-4"><ChevronRight className="h-4 w-4 text-navy-400" /></td></tr>)}</tbody></table>{initialCustomers.length === 0 && <p className="p-10 text-center text-sm text-navy-500">No customers yet.</p>}</div>
      {selected && <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-900/40 p-0 sm:items-center sm:p-6" onClick={() => setSelected(null)}><section className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-500">Customer profile</p><h2 className="mt-1 font-serif text-3xl text-navy-900">{selected.name}</h2></div><button type="button" onClick={() => setSelected(null)} aria-label="Close customer details" className="rounded-lg p-2 text-navy-500 hover:bg-navy-100"><X className="h-5 w-5" /></button></div><div className="mt-6 space-y-3 rounded-lg bg-navy-50 p-4 text-sm text-navy-700"><p className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold-500" />{selected.email}</p>{selected.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold-500" />{selected.phone}</p>}<p className="flex items-start gap-2"><UserRound className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />{selected.address}</p></div><h3 className="mt-7 text-xs font-semibold uppercase tracking-wider text-navy-500">Order history</h3><ul className="mt-2 divide-y divide-navy-100 rounded-lg border border-navy-100">{selected.orders.map((order) => <li key={order.id} className="flex items-center justify-between gap-3 p-3 text-sm"><div><p className="font-mono text-xs text-navy-700">{order.id}</p><p className="mt-1 text-xs text-navy-500">{formatDate(order.createdAt)}</p></div><div className="text-right"><p className="font-medium">{formatCurrency(order.total)}</p><span className={`text-[10px] font-semibold uppercase ${order.status === "complete" ? "text-emerald-700" : "text-amber-700"}`}>{order.status}</span></div></li>)}</ul>{selected.orders.length === 0 && <p className="mt-3 text-sm text-navy-500">No orders yet.</p>}</section></div>}
    </div>
  );
}
