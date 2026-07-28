"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Sparkles, ScanFace, Gauge, Zap, Radio } from "lucide-react";
import KpiCard from "@/components/KpiCard";
import StatusBadge from "@/components/StatusBadge";
import { DashboardStats, MemberStats } from "@/lib/types";
import { formatHours } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [members, setMembers] = useState<MemberStats[]>([]);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
    fetch("/api/members")
      .then((r) => r.json())
      .then((d) => setMembers(d.members ?? []))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="card relative overflow-hidden p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-muted px-3 py-1">
              <span className="status-dot" /> LIVE Build Club · Makerspace 01
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight">
              AI Smart <span className="text-brand">Attendance</span> System
            </h1>
            <p className="mt-3 max-w-md text-sm text-white/50">
              Face recognition attendance for the modern makerspace. Browser-based
              check-ins, live analytics and heatmaps — powered by face-api.js,
              Supabase and Next.js.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="/camera"
                className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-base-950 shadow-glow"
              >
                <Play size={16} /> Launch Live Camera
              </Link>
              <Link
                href="/members"
                className="flex items-center gap-2 rounded-xl border border-base-600 px-4 py-2.5 text-sm font-semibold text-white/80 hover:text-white"
              >
                <Sparkles size={16} /> Register Member
              </Link>
            </div>
            <div className="mt-6 flex gap-6 font-mono text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <Gauge size={13} className="text-brand" /> {stats ? stats.avgConfidence : "—"}% accuracy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap size={13} className="text-brand" /> ~120ms latency
              </span>
              <span className="flex items-center gap-1.5">
                <Radio size={13} className="text-brand" /> Realtime
              </span>
            </div>
          </div>

          <div className="relative flex items-center justify-center rounded-2xl border border-brand/20 bg-base-850">
            <div className="flex h-40 w-40 items-center justify-center rounded-full border border-brand/30 text-brand shadow-glow">
              <ScanFace size={56} />
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div>
        <p className="eyebrow mb-3">// realtime kpis</p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Total members" value={String(stats?.totalMembers ?? "—")} icon={ScanFace} />
          <KpiCard label="Inside now" value={String(stats?.insideNow ?? "—")} icon={Radio} />
          <KpiCard label="Hours logged today" value={formatHours(stats?.hoursToday ?? 0)} icon={Gauge} />
          <KpiCard label="Avg. match confidence" value={`${stats?.avgConfidence ?? 0}%`} icon={Zap} />
        </div>
      </div>

      {/* Today at a glance */}
      <div className="card p-5">
        <p className="eyebrow mb-4">// today at a glance</p>
        <div className="space-y-2">
          {members.slice(0, 6).map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-xl border border-base-700 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium">{m.name}</p>
                <p className="font-mono text-xs text-white/40">{m.roll_no}</p>
              </div>
              <div className="flex items-center gap-6">
                <p className="font-mono text-sm text-brand">{formatHours(m.hours)}h</p>
                <StatusBadge inside={m.is_inside} />
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <p className="py-6 text-center text-sm text-white/30">
              No members registered yet — head to the Members tab to add your first one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
