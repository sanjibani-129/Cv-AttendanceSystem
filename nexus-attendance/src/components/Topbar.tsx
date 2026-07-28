"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Moon } from "lucide-react";

const CRUMB: Record<string, string> = {
  "/": "dashboard",
  "/camera": "camera",
  "/members": "members",
  "/attendance": "attendance",
  "/analytics": "analytics",
  "/reports": "reports",
  "/settings": "settings",
};

export default function Topbar() {
  const pathname = usePathname();
  const crumb = CRUMB[pathname] ?? pathname.replace("/", "");

  return (
    <header className="flex items-center justify-between border-b border-base-700 px-8 py-4">
      <p className="font-mono text-sm text-white/50">
        <span className="text-brand">&gt;_</span>{" "}
        <span className="text-brand-dim">$</span> nexus / {crumb}
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-lg border border-base-700 bg-base-900 px-3 py-1.5 text-sm text-white/40">
          <Search size={15} />
          <span className="font-mono text-xs">Search members, IDs, timestamps</span>
        </div>
        <button className="rounded-lg border border-base-700 p-2 text-white/60 hover:text-white">
          <Bell size={16} />
        </button>
        <button className="rounded-lg border border-base-700 p-2 text-white/60 hover:text-white">
          <Moon size={16} />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand font-semibold text-base-950">
          AI
        </div>
      </div>
    </header>
  );
}
