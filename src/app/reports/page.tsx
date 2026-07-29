"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { AttendanceRecord } from "@/lib/types";

function toCsv(records: AttendanceRecord[]): string {
  const header = "Name,Roll No,Date,Check-in,Check-out,Confidence\n";
  const rows = records.map((r) =>
    [
      r.members?.name ?? "",
      r.members?.roll_no ?? "",
      r.session_date,
      r.check_in,
      r.check_out ?? "",
      r.confidence ?? "",
    ].join(",")
  );
  return header + rows.join("\n");
}

export default function ReportsPage() {
  const [downloading, setDownloading] = useState(false);

  async function download() {
    setDownloading(true);
    try {
      const res = await fetch("/api/attendance?limit=5000");
      const { attendance } = await res.json();
      const csv = toCsv(attendance ?? []);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-report-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">// exports</p>
        <h1 className="mt-1 text-2xl font-bold">Reports</h1>
        <p className="mt-1 text-sm text-white/50">
          Download the full attendance log as a spreadsheet-ready CSV.
        </p>
      </div>

      <div className="card flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand/30 bg-brand-muted text-brand">
            <FileText size={22} />
          </div>
          <div>
            <p className="font-semibold">Full attendance report</p>
            <p className="text-sm text-white/40">Every check-in / check-out, all members, CSV format</p>
          </div>
        </div>
        <button
          onClick={download}
          disabled={downloading}
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-base-950 shadow-glow disabled:opacity-50"
        >
          <Download size={16} /> {downloading ? "Preparing…" : "Download CSV"}
        </button>
      </div>
    </div>
  );
}
