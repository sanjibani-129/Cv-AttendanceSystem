'use client';

import { Calendar, Download, Filter, Search, CheckCircle, Clock } from 'lucide-react';

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-mono font-bold text-white tracking-tight">
            ATTENDANCE <span className="text-[#39FF14]">LOGS</span>
          </h1>
          <p className="text-[#808080] text-sm mt-1">Audit daily check-ins, timestamps, and verification confidence.</p>
        </div>

        <button className="flex items-center space-x-2 bg-[#181818] border border-[#2A2A2A] hover:border-[#39FF14] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all">
          <Download className="w-4 h-4 text-[#39FF14]" />
          <span>Export Logs</span>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
          <input
            type="text"
            placeholder="Search by name, ID or department..."
            className="w-full bg-[#101010] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#39FF14] focus:outline-none transition-all"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2.5 bg-[#101010] border border-[#2A2A2A] text-white rounded-lg text-sm">
          <Filter className="w-4 h-4 text-[#808080]" />
          <span>Filters</span>
        </button>
      </div>

      <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-[#C0C0C0]">
          <thead className="bg-[#101010] border-b border-[#2A2A2A] text-xs font-mono text-[#808080] uppercase">
            <tr>
              <th className="px-6 py-4">Member</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 font-mono">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            <tr className="hover:bg-[#101010]/50 transition-all">
              <td className="px-6 py-4 font-medium text-white">Alex Morgan</td>
              <td className="px-6 py-4 font-mono text-[#39FF14]">CHECK_IN</td>
              <td className="px-6 py-4 font-mono text-xs">2026-07-28 09:14:02</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 text-xs">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>PRESENT</span>
                </span>
              </td>
              <td className="px-6 py-4 font-mono text-white">98.4%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
