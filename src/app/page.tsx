"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Sparkles, ScanFace, Gauge, Zap, Radio } from "lucide-react";
import KpiCard from "@/components/KpiCard";
import StatusBadge from "@/components/StatusBadge";
import { KpiSkeleton, Skeleton } from "@/components/Skeleton";
import { ErrorBanner, EmptyState } from "@/components/StateBlocks";
import { DashboardStats, MemberStats } from "@/lib/types";
import { formatHours } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [members, setMembers] = useState<MemberStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, membersRes] = await Promise.all([
        fetch("/api/stats"),
        fetch("/api/members"),
      ]);
      if (!statsRes.ok || !membersRes.ok) {
        throw new Error("The dashboard couldn't load live data from the server.");
      }
      const statsData = await statsRes.json();
      const membersData = await membersRes.json();
      setStats(statsData);
      setMembers(membersData.members ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong loading the dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      {error && <ErrorBanner message={error} onRetry={load} />}

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card relative overflow-hidden p-5 sm:p-8"
      >
        {/* Animated ambient glow background */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand/5 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-muted px-3 py-1">
              <span className="status-dot" /> LIVE Build Club • Makerspace 01
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              AI Smart <span className="text-brand">Attendance</span> System
            </h1>
            <p className="mt-3 max-w-md text-sm text-white/50">
              Face recognition attendance for the modern makerspace. Browser-based
              check-ins, live analytics and heatmaps — powered by face-api.js,
              Supabase and Next.js.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/camera"
                  className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-base-950 shadow-glow"
                >
                  <Play size={16} /> Launch Live Camera
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/members"
                  className="flex items-center gap-2 rounded-xl border border-base-600 px-4 py-2.5 text-sm font-semibold text-white/80 hover:text-white"
                >
                  <Sparkles size={16} /> Register Member
                </Link>
              </motion.div>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 font-mono text-xs text-white/40 sm:gap-6">
              <span className="flex items-center gap-1.5">
                <Gauge size={13} className="text-brand" />{" "}
                {loading ? "…" : `${stats?.avgConfidence ?? 0}%`} accuracy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap size={13} className="text-brand" /> ~120ms latency
              </span>
              <span className="flex items-center gap-1.5">
                <Radio size={13} className="text-brand" /> Realtime
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            className="relative flex items-center justify-center rounded-2xl border border-brand/20 bg-base-850"
          >
            {/* Scanning ring sweep */}
            <motion.div
              aria-hidden
              className="absolute h-32 w-32 rounded-full border-2 border-brand/40 sm:h-40 sm:w-40"
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
            />
            <div className="flex h-32 w-32 items-center justify-center rounded-full border border-brand/30 text-brand shadow-glow animate-floaty sm:h-40 sm:w-40">
              <ScanFace size={56} />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div>
        <p className="eyebrow mb-3">// realtime kpis</p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {loading ? (
            <>
              <KpiSkeleton />
              <KpiSkeleton />
              <KpiSkeleton />
              <KpiSkeleton />
            </>
          ) : (
            <>
              <KpiCard label="Total members" value={String(stats?.totalMembers ?? 0)} icon={ScanFace} />
              <KpiCard label="Inside now" value={String(stats?.insideNow ?? 0)} icon={Radio} />
              <KpiCard label="Hours logged today" value={formatHours(stats?.hoursToday ?? 0)} icon={Gauge} />
              <KpiCard label="Avg. match confidence" value={`${stats?.avgConfidence ?? 0}%`} icon={Zap} />
            </>
          )}
        </div>
      </div>

      {/* Today at a glance */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="card p-5"
      >
        <p className="eyebrow mb-4">// today at a glance</p>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <EmptyState
            title="No members registered yet"
            description="Head to the Members tab to enroll your first Build Club member."
            action={
              <Link href="/members" className="mt-2 text-xs font-semibold text-brand hover:underline">
                Go to Members →
              </Link>
            }
          />
        ) : (
          <div className="space-y-2">
            {members.slice(0, 6).map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.3 }}
                className="flex items-center justify-between rounded-xl border border-base-700 px-4 py-3 transition-colors hover:border-brand/30"
              >
                <div>
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="font-mono text-xs text-white/40">{m.roll_no}</p>
                </div>
                <div className="flex items-center gap-3 sm:gap-6">
                  <p className="font-mono text-sm text-brand">{formatHours(m.hours)}</p>
                  <StatusBadge inside={m.is_inside} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}