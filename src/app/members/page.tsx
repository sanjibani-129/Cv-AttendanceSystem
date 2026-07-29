"use client";

import { useEffect, useState } from "react";
import { UserPlus, Search, Trash2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import RegisterMemberModal from "@/components/RegisterMemberModal";
import { MemberStats } from "@/lib/types";
import { formatHours, initials } from "@/lib/utils";

export default function MembersPage() {
  const [members, setMembers] = useState<MemberStats[]>([]);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/members");
    const data = await res.json();
    setMembers(data.members ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Remove this member and all their attendance records?")) return;
    await fetch(`/api/members/${id}`, { method: "DELETE" });
    load();
  }

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.roll_no.toLowerCase().includes(query.toLowerCase()) ||
      m.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">// registry</p>
          <h1 className="mt-1 text-2xl font-bold">Members</h1>
          <p className="mt-1 text-sm text-white/50">
            All registered Build Club members with attendance metrics and live status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-base-700 bg-base-900 px-3 py-2">
            <Search size={15} className="text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, roll, email…"
              className="bg-transparent text-sm outline-none placeholder:text-white/30"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-base-950 shadow-glow"
          >
            <UserPlus size={16} /> Register
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-base-700 text-left font-mono text-xs uppercase tracking-wide text-white/30">
              <th className="px-5 py-3">Member</th>
              <th className="px-5 py-3">Roll no.</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Hours</th>
              <th className="px-5 py-3">Attendance</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-base-800 last:border-0 hover:bg-base-800/40">
                <td className="flex items-center gap-3 px-5 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brand/30 bg-brand-muted font-mono text-xs text-brand">
                    {initials(m.name)}
                  </div>
                  {m.name}
                </td>
                <td className="px-5 py-3 font-mono text-xs text-white/50">{m.roll_no}</td>
                <td className="px-5 py-3 text-white/50">{m.email}</td>
                <td className="px-5 py-3 font-mono text-brand">{formatHours(m.hours)}</td>
                <td className="px-5 py-3">
                  <div className="h-1.5 w-28 overflow-hidden rounded-full bg-base-700">
                    <div
                      className="h-full bg-brand"
                      style={{ width: `${Math.min(100, (m.hours / 150) * 100)}%` }}
                    />
                  </div>
                </td>
                <td className="px-5 py-3">
                  <StatusBadge inside={m.is_inside} />
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => remove(m.id)} className="text-white/30 hover:text-red-400">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-white/30">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <RegisterMemberModal onClose={() => setShowModal(false)} onRegistered={load} />
      )}
    </div>
  );
}
