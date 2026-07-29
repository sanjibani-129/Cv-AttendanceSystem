"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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
  const awayCount = members.length - insideCount;
  const occupancyData = [
    { name: "Inside", value: insideCount },
    { name: "Away", value: awayCount || 0 },
  ];
  const COLORS = ["#39ff8a", "#2a362f"];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="eyebrow">// makerspace analytics</p>
        <h1 className="mt-1 text-2xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-white/50">
          Hours logged and live occupancy across all registered members.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="card p-5"
        >
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
                <Bar dataKey="hours" fill="#39ff8a" radius={[6, 6, 0, 0]} animationDuration={900} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="card p-5"
        >
          <p className="eyebrow mb-4">// live occupancy</p>
          <div className="relative h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={occupancyData}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  animationDuration={900}
                >
                  {occupancyData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-bold text-brand">{insideCount}</p>
              <p className="text-[11px] text-white/40">inside now</p>
            </div>
          </div>
          <p className="mt-2 text-center font-mono text-xs text-white/30">
            out of {members.length} registered
          </p>
        </motion.div>
      </div>
    </div>
  );
}