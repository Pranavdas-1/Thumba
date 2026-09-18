import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, Package, Users, type LucideIcon } from "lucide-react";
import { formatCurrency, formatDate } from "@thumba/shared";
import { prisma } from "@thumba/shared/db";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const [incompleteCount, revenue, monthRevenue, customerCount, productCount, delayedOrders, recentOrders] = await Promise.all([
    prisma.order.count({ where: { status: "INCOMPLETE" } }),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.aggregate({ where: { createdAt: { gte: monthStart } }, _sum: { total: true } }),
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.findMany({ where: { status: "INCOMPLETE", createdAt: { lt: twoDaysAgo } }, include: { user: true }, orderBy: { createdAt: "asc" } }),
    prisma.order.findMany({ include: { user: true, items: { include: { product: true } } }, orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  return (
    <main>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-500">Thumba operations</p><h1 className="mt-2 font-serif text-4xl text-navy-900">Overview</h1></div><p className="text-sm text-navy-500">Live from PostgreSQL · {formatDate(now)}</p></div>

      {delayedOrders.length > 0 && <section className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-red-900"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" /><div><h2 className="font-semibold">{delayedOrders.length} delayed {delayedOrders.length === 1 ? "order" : "orders"}</h2><p className="mt-1 text-sm text-red-800">These incomplete orders are more than two days old and need urgent attention.</p><div className="mt-3 flex flex-wrap gap-2">{delayedOrders.slice(0, 6).map((order) => <Link key={order.id} href={`/orders?order=${order.id}`} className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-red-800 shadow-sm hover:bg-red-100">{order.user.name} · {formatDate(order.createdAt)}</Link>)}</div></div></div></section>}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat icon={Clock3} label="Incomplete orders" value={String(incompleteCount)} tone="amber" />
        <Stat icon={CheckCircle2} label="Revenue total" value={formatCurrency(revenue._sum.total ?? 0)} />
        <Stat icon={ArrowRight} label="Revenue this month" value={formatCurrency(monthRevenue._sum.total ?? 0)} />
        <Stat icon={Users} label="Customers" value={String(customerCount)} />
        <Stat icon={Package} label="Products" value={String(productCount)} />
      </div>

      <section className="mt-10 rounded-xl bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold text-navy-900">Recent orders</h2><p className="mt-1 text-sm text-navy-500">Incomplete orders remain open until packed and handed off.</p></div><Link href="/orders" className="inline-flex items-center gap-1 text-xs font-semibold text-gold-600 hover:text-gold-700">View all <ArrowRight className="h-3.5 w-3.5" /></Link></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="text-xs uppercase tracking-wider text-navy-500"><tr><th className="py-2">Customer</th><th>Date</th><th>Items</th><th>Status</th><th>Total</th></tr></thead><tbody>{recentOrders.map((order) => { const delayed = order.status === "INCOMPLETE" && order.createdAt < twoDaysAgo; return <tr key={order.id} className={`border-t border-navy-100 ${delayed ? "bg-red-50/70" : ""}`}><td className="py-3 font-medium text-navy-900">{order.user.name}<span className="block text-xs font-normal text-navy-500">{order.user.email}</span></td><td className="text-xs text-navy-500">{formatDate(order.createdAt)}</td><td className="text-xs text-navy-600">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td><td><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${delayed ? "bg-red-100 text-red-800" : order.status === "COMPLETE" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{delayed ? "Delayed" : order.status === "COMPLETE" ? "Complete" : "Incomplete"}</span></td><td className="font-medium">{formatCurrency(order.total)}</td></tr>; })}</tbody></table>{recentOrders.length === 0 && <p className="py-8 text-center text-sm text-navy-500">No orders yet.</p>}</div></section>
    </main>
  );
}

function Stat({ icon: Icon, label, value, tone = "navy" }: { icon: LucideIcon; label: string; value: string; tone?: "navy" | "amber" }) {
  return <div className="rounded-xl bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm text-navy-500">{label}</p><Icon className={tone === "amber" ? "h-5 w-5 text-amber-600" : "h-5 w-5 text-gold-500"} /></div><p className="mt-3 text-2xl font-semibold text-navy-900">{value}</p></div>;
}
