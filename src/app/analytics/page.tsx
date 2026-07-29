"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MemberStats } from "@/lib/types";

export default function AnalyticsPage() {
  const [members, setMembers] = useState<MemberStats[]>([]);

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then((d) => setMembers(d.members ?? []));
  }, []);

  const chartData = members
    .slice()
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 10)
    .map((m) => ({ name: m.name.split(" ")[0], hours: m.hours }));

  const insideCount = members.filter((m) => m.is_inside).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">// makerspace analytics</p>
        <h1 className="mt-1 text-2xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-white/50">
          Hours logged and live occupancy across all registered members.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="card p-5">
          <p className="eyebrow mb-4">// top 10 by hours logged</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2620" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "#0e1310", border: "1px solid #2a362f", borderRadius: 8 }}
                  labelStyle={{ color: "#39ff8a" }}
                />
                <Bar dataKey="hours" fill="#39ff8a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <p className="eyebrow mb-4">// live occupancy</p>
          <div className="flex h-72 flex-col items-center justify-center">
            <p className="text-5xl font-bold text-brand">{insideCount}</p>
            <p className="mt-2 text-sm text-white/40">members currently inside</p>
            <p className="mt-6 font-mono text-xs text-white/30">
              out of {members.length} registered
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
