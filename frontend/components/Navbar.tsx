'use client';

import { Bell, Search, ShieldCheck } from 'lucide-react';

export const Navbar = () => {
  return (
    <header className="h-16 border-b border-[#2A2A2A] bg-[#101010]/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-30 ml-64">
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
          <input
            type="text"
            placeholder="Search members, logs, reports..."
            className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/30 text-xs text-[#39FF14]">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-mono">CAMERA ONLINE</span>
        </div>

        <button className="p-2 text-[#C0C0C0] hover:text-white hover:bg-[#181818] rounded-lg transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />
        </button>

        <div className="w-8 h-8 rounded-full bg-[#2A2A2A] border border-[#39FF14]/50 flex items-center justify-center font-bold text-xs text-white">
          AD
        </div>
      </div>
    </header>
  );
};
