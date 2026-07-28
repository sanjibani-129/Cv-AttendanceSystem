'use client';

import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-mono font-bold text-white tracking-tight">
          SYSTEM <span className="text-[#39FF14]">ANALYTICS</span>
        </h1>
        <p className="text-[#808080] text-sm mt-1">Deep insights on peak arrival times, model performance, and team activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
            <h2 className="text-base font-mono font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[#39FF14]" />
              <span>Weekly Attendance Trend</span>
            </h2>
          </div>
          <div className="h-48 flex items-center justify-center text-[#808080] font-mono text-sm border border-dashed border-[#2A2A2A] rounded-lg">
            [ Recharts Chart Area ]
          </div>
        </div>

        <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
            <h2 className="text-base font-mono font-bold text-white flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-[#39FF14]" />
              <span>Department Breakdown</span>
            </h2>
          </div>
          <div className="h-48 flex items-center justify-center text-[#808080] font-mono text-sm border border-dashed border-[#2A2A2A] rounded-lg">
            [ Recharts Pie Chart Area ]
          </div>
        </div>
      </div>
    </div>
  );
}
