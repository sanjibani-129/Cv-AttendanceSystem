"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Camera,
  Users,
  Activity,
  BarChart3,
  FileText,
  Settings,
  ScanFace,
} from "lucide-react";
import { cx } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/camera", label: "Live Camera", icon: Camera },
  { href: "/members", label: "Members", icon: Users },
  { href: "/attendance", label: "Attendance", icon: Activity },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col justify-between border-r border-base-700 bg-base-900/60 px-4 py-6">
      <div>
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand/40 bg-brand-muted text-brand shadow-glow-sm">
            <ScanFace size={20} />
          </div>
          <div>
            <p className="font-semibold leading-tight">NEXUS</p>
            <p className="font-mono text-[10px] tracking-widest text-white/40">
              ATTENDANCE AI
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cx(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "border border-brand/30 bg-brand-muted text-brand shadow-glow-sm"
                    : "text-white/60 hover:bg-base-800 hover:text-white"
                )}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="rounded-xl border border-base-700 bg-base-850 p-3">
        <p className="flex items-center gap-2 font-mono text-xs text-brand">
          <span className="status-dot" /> SYSTEM ONLINE
        </p>
        <p className="mt-1 font-mono text-[11px] leading-snug text-white/40">
          face-api.js engine · Supabase · realtime
        </p>
      </div>
    </aside>
  );
}
