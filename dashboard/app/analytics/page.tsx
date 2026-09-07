"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { month: "May", revenue: 18200 },
  { month: "Jun", revenue: 24100 },
  { month: "Jul", revenue: 19800 },
  { month: "Aug", revenue: 31200 },
  { month: "Sep", revenue: 16600 },
];

export default function AnalyticsPage() {
  return (
    <main>
      <h1 className="font-serif text-3xl text-navy-900">Analytics</h1>
      <p className="mt-2 text-sm text-navy-500">Sample revenue until Prisma orders are live.</p>
      <div className="mt-8 h-80 rounded-xl bg-white p-6 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#c4a574" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
