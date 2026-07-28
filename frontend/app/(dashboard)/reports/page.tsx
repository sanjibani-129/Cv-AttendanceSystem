'use client';

import { FileSpreadsheet, Download, Printer, Calendar } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-mono font-bold text-white tracking-tight">
          EXECUTIVE <span className="text-[#39FF14]">REPORTS</span>
        </h1>
        <p className="text-[#808080] text-sm mt-1">Generate and download official CSV/Excel attendance summaries.</p>
      </div>

      <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-mono text-[#C0C0C0] uppercase mb-2">Start Date</label>
            <input type="date" className="w-full bg-[#101010] border border-[#2A2A2A] rounded-lg px-4 py-2 text-sm text-white focus:border-[#39FF14] focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-mono text-[#C0C0C0] uppercase mb-2">End Date</label>
            <input type="date" className="w-full bg-[#101010] border border-[#2A2A2A] rounded-lg px-4 py-2 text-sm text-white focus:border-[#39FF14] focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-mono text-[#C0C0C0] uppercase mb-2">Format</label>
            <select className="w-full bg-[#101010] border border-[#2A2A2A] rounded-lg px-4 py-2 text-sm text-white focus:border-[#39FF14] focus:outline-none">
              <option value="csv">CSV Spreadsheet</option>
              <option value="excel">Excel (.xlsx)</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-4 border-t border-[#2A2A2A] pt-4">
          <button className="flex items-center space-x-2 bg-[#39FF14] text-black font-semibold px-6 py-2.5 rounded-lg shadow-neon hover:bg-[#00FF66] transition-all text-sm">
            <Download className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
