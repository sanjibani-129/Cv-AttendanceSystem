"use client";

import { useEffect, useState } from "react";
import { AttendanceRecord } from "@/lib/types";
import { formatTime } from "@/lib/utils";

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    fetch("/api/attendance")
      .then((r) => r.json())
      .then((d) => setRecords(d.attendance ?? []));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">// session log</p>
        <h1 className="mt-1 text-2xl font-bold">Attendance</h1>
        <p className="mt-1 text-sm text-white/50">
          Every check-in and check-out recorded by the live camera.
        </p>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-base-700 text-left font-mono text-xs uppercase tracking-wide text-white/30">
              <th className="px-5 py-3">Member</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Check-in</th>
              <th className="px-5 py-3">Check-out</th>
              <th className="px-5 py-3">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-b border-base-800 last:border-0 hover:bg-base-800/40">
                <td className="px-5 py-3">
                  <p>{r.members?.name ?? "—"}</p>
                  <p className="font-mono text-xs text-white/30">{r.members?.roll_no}</p>
                </td>
                <td className="px-5 py-3 text-white/50">{r.session_date}</td>
                <td className="px-5 py-3 font-mono text-brand">{formatTime(r.check_in)}</td>
                <td className="px-5 py-3 font-mono text-white/50">{formatTime(r.check_out)}</td>
                <td className="px-5 py-3 text-white/50">
                  {r.confidence != null ? `${r.confidence}%` : "—"}
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-white/30">
                  No attendance recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
