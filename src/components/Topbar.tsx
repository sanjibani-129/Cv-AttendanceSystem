"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Moon, Menu, User, Settings, LogOut, CheckCircle2, XCircle } from "lucide-react";
import { MemberStats } from "@/lib/types";
import LampToggle from "./LampToggle";

const CRUMB: Record<string, string> = {
  "/": "dashboard",
  "/camera": "camera",
  "/members": "members",
  "/attendance": "attendance",
  "/analytics": "analytics",
  "/reports": "reports",
  "/settings": "settings",
};

interface ActivityItem {
  name: string;
  action: "check_in" | "check_out";
  time: string;
}

export default function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const crumb = CRUMB[pathname] ?? pathname.replace("/", "");

  const [allMembers, setAllMembers] = useState<MemberStats[]>([]);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then((d) => setAllMembers(d.members ?? []))
      .catch(() => setAllMembers([]));
  }, []);

  useEffect(() => {
    if (!notifOpen) return;
    fetch("/api/attendance?limit=8")
      .then((r) => r.json())
      .then((d) => {
        const items: ActivityItem[] = (d.attendance ?? []).map((r: any) => ({
          name: r.members?.name ?? "Unknown",
          action: r.check_out ? "check_out" : "check_in",
          time: new Date(r.check_out ?? r.check_in).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setActivity(items);
      })
      .catch(() => setActivity([]));
  }, [notifOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = query.trim()
    ? allMembers.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.roll_no.toLowerCase().includes(query.toLowerCase())
      )
    : [];

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
        {/* Search */}
        <div ref={searchRef} className="relative hidden md:block">
          <div className="flex items-center gap-2 rounded-lg border border-base-700 bg-base-900 px-3 py-1.5 text-sm text-white/40 focus-within:border-brand/40">
            <Search size={15} />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search members, IDs, timestamps"
              className="w-56 bg-transparent font-mono text-xs text-white outline-none placeholder:text-white/40"
            />
          </div>
          <AnimatePresence>
            {searchOpen && query.trim() && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-base-700 bg-base-900 shadow-lg"
              >
                {results.length === 0 ? (
                  <p className="px-4 py-3 text-xs text-white/30">No members match "{query}"</p>
                ) : (
                  results.slice(0, 6).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        router.push("/members");
                        setSearchOpen(false);
                        setQuery("");
                      }}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-base-800"
                    >
                      <span>{m.name}</span>
                      <span className="font-mono text-xs text-white/40">{m.roll_no}</span>
                    </button>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            className="rounded-lg border border-base-700 p-2 text-white/60 hover:text-white"
          >
            <Bell size={16} />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-base-700 bg-base-900 shadow-lg"
              >
                <p className="border-b border-base-700 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wide text-white/40">
                  Recent activity
                </p>
                {activity.length === 0 ? (
                  <p className="px-4 py-4 text-xs text-white/30">No recent activity yet.</p>
                ) : (
                  <div className="max-h-72 overflow-y-auto">
                    {activity.map((a, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-base-800">
                        {a.action === "check_in" ? (
                          <CheckCircle2 size={14} className="shrink-0 text-brand" />
                        ) : (
                          <XCircle size={14} className="shrink-0 text-white/30" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate">{a.name}</p>
                          <p className="font-mono text-[11px] text-white/40">
                            {a.action === "check_in" ? "Checked in" : "Checked out"} · {a.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <LampToggle />

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            aria-label="Profile menu"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand font-semibold text-base-950"
          >
            AI
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-base-700 bg-base-900 shadow-lg"
              >
                <div className="border-b border-base-700 px-4 py-3">
                  <p className="text-sm font-semibold">Nexus Admin</p>
                  <p className="font-mono text-[11px] text-white/40">Build Club · Makerspace 01</p>
                </div>
                <button
                  onClick={() => {
                    router.push("/settings");
                    setProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-white/70 hover:bg-base-800 hover:text-white"
                >
                  <Settings size={14} /> Settings
                </button>
                <button
                  disabled
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-white/30 cursor-not-allowed"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}