'use client';

import { Users, Search, Plus, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-mono font-bold text-white tracking-tight">
            MEMBER <span className="text-[#39FF14]">DIRECTORY</span>
          </h1>
          <p className="text-[#808080] text-sm mt-1">Manage registered personnel and facial embedding statuses.</p>
        </div>

        <Link
          href="/members/register"
          className="flex items-center space-x-2 bg-[#39FF14] hover:bg-[#00FF66] text-black font-semibold px-4 py-2.5 rounded-lg shadow-neon transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Member</span>
        </Link>
      </div>

      <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-[#C0C0C0]">
          <thead className="bg-[#101010] border-b border-[#2A2A2A] text-xs font-mono text-[#808080] uppercase">
            <tr>
              <th className="px-6 py-4">Member</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Face Status</th>
              <th className="px-6 py-4">Attendance Rate</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            <tr className="hover:bg-[#101010]/50 transition-all">
              <td className="px-6 py-4 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-white font-bold text-xs">
                  AM
                </div>
                <div>
                  <p className="text-white font-medium">Alex Morgan</p>
                  <p className="text-xs text-[#808080]">EMP-1021</p>
                </div>
              </td>
              <td className="px-6 py-4">Engineering</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enrolled</span>
                </span>
              </td>
              <td className="px-6 py-4 font-mono text-white">96.8%</td>
              <td className="px-6 py-4 text-right">
                <button className="text-xs font-mono text-[#39FF14] hover:underline">View Profile</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
