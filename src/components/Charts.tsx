"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function TasksPerWeekChart({ data }: { data: { week: string; done: number }[] }) {
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-paper-line)" vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 10, fill: "var(--color-ink-faint)" }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "var(--color-ink-faint)" }} axisLine={false} tickLine={false} width={24} />
          <Tooltip
            contentStyle={{ background: "var(--color-paper-raised)", border: "1px solid var(--color-paper-line)", fontSize: 12 }}
          />
          <Bar dataKey="done" fill="#8a9a5b" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HabitConsistencyChart({ data }: { data: { name: string; pct: number }[] }) {
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-paper-line)" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--color-ink-faint)" }} axisLine={false} tickLine={false} />
          <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fill: "var(--color-ink)" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "var(--color-paper-raised)", border: "1px solid var(--color-paper-line)", fontSize: 12 }}
            formatter={(v: number) => `${v}%`}
          />
          <Bar dataKey="pct" fill="#b9883f" radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
