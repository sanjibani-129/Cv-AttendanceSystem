"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Moon, Menu } from "lucide-react";

const CRUMB: Record<string, string> = {
  "/": "dashboard",
  "/camera": "camera",
  "/members": "members",
  "/attendance": "attendance",
  "/analytics": "analytics",
  "/reports": "reports",
  "/settings": "settings",
};

export default function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const crumb = CRUMB[pathname] ?? pathname.replace("/", "");

  return (
    <header className="flex items-center justify-between border-b border-base-700 px-4 py-4 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-lg border border-base-700 p-2 text-white/60 hover:text-white lg:hidden"
        >
          <Menu size={18} />
        </button>
        <p className="font-mono text-xs text-white/50 sm:text-sm">
          <span className="text-brand">&gt;_</span>{" "}
          <span className="text-brand-dim">$</span> nexus / {crumb}
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden items-center gap-2 rounded-lg border border-base-700 bg-base-900 px-3 py-1.5 text-sm text-white/40 md:flex">
          <Search size={15} />
          <span className="font-mono text-xs">Search members, IDs, timestamps</span>
        </div>
        <button
          aria-label="Notifications"
          className="rounded-lg border border-base-700 p-2 text-white/60 hover:text-white"
        >
          <Bell size={16} />
        </button>
        <button
          aria-label="Toggle theme"
          className="hidden rounded-lg border border-base-700 p-2 text-white/60 hover:text-white sm:block"
        >
          <Moon size={16} />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand font-semibold text-base-950">
          AI
        </div>
      </div>
    </header>
  );
}