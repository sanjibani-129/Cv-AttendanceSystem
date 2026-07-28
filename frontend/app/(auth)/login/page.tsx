'use client';

import { Lock, Mail, Shield } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#181818] border border-[#2A2A2A] rounded-2xl p-8 space-y-6 shadow-neon-strong">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#39FF14] rounded-xl flex items-center justify-center mx-auto text-black font-bold text-xl shadow-neon">
            N
          </div>
          <h1 className="text-2xl font-mono font-bold text-white tracking-wider pt-2">
            NEXUS<span className="text-[#39FF14]">.AI</span>
          </h1>
          <p className="text-xs text-[#808080]">Enter credentials to access the admin portal.</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#C0C0C0] uppercase mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
              <input
                type="email"
                placeholder="admin@nexus.ai"
                className="w-full bg-[#101010] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#39FF14] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#C0C0C0] uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#101010] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#39FF14] focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="button"
            className="w-full bg-[#39FF14] hover:bg-[#00FF66] text-black font-semibold py-2.5 rounded-lg shadow-neon transition-all text-sm mt-2"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
