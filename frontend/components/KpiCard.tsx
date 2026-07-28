'use client';

import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
}

export const KpiCard = ({ title, value, change, isPositive = true, icon: Icon }: KpiCardProps) => {
  return (
    <div className="bg-[#181818]/80 border border-[#2A2A2A] rounded-xl p-6 backdrop-blur-md hover:border-[#39FF14]/40 transition-all duration-300 hover:shadow-neon group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-[#808080]">{title}</span>
        <div className="p-2.5 rounded-lg bg-[#101010] border border-[#2A2A2A] text-[#39FF14] group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-mono font-bold text-white tracking-tight">{value}</h3>
        {change && (
          <span
            className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
              isPositive
                ? 'bg-[#00FF66]/10 text-[#00FF66] border-[#00FF66]/30'
                : 'bg-[#FF4D4F]/10 text-[#FF4D4F] border-[#FF4D4F]/30'
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
};
