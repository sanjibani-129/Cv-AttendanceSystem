"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, CheckCircle2 } from "lucide-react";
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
  const [done, setDone] = useState(false);
  const [recordCount, setRecordCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/attendance?limit=5000")
      .then((r) => r.json())
      .then((d) => setRecordCount((d.attendance ?? []).length))
      .catch(() => setRecordCount(null));
  }, []);

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
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="eyebrow">// exports</p>
        <h1 className="mt-1 text-2xl font-bold">Reports</h1>
        <p className="mt-1 text-sm text-white/50">
          Download the full attendance log as a spreadsheet-ready CSV.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card flex items-center justify-between p-6"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand/30 bg-brand-muted text-brand">
            <FileText size={22} />
          </div>
          <div>
            <p className="font-semibold">Full attendance report</p>
            <p className="text-sm text-white/40">
              {recordCount !== null ? `${recordCount} records ready` : "Every check-in / check-out, CSV format"}
            </p>
          </div>
        </div>
        <button
          onClick={download}
          disabled={downloading}
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-base-950 shadow-glow disabled:opacity-50"
        >
          <AnimatePresence mode="wait">
            {done ? (
              <motion.span key="done" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-2">
                <CheckCircle2 size={16} /> Downloaded
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-2">
                <Download size={16} /> {downloading ? "Preparing…" : "Download CSV"}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.div>
    </div>
  );
}