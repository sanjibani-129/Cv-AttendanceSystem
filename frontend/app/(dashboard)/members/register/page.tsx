'use client';

import { UserPlus, Upload, ShieldCheck } from 'lucide-react';

export default function RegisterMemberPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-mono font-bold text-white tracking-tight">
          REGISTER <span className="text-[#39FF14]">MEMBER</span>
        </h1>
        <p className="text-[#808080] text-sm mt-1">Add new staff or student profile with facial recognition embeddings.</p>
      </div>

      <form className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono text-[#C0C0C0] uppercase mb-2">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Sarah Connor"
              className="w-full bg-[#101010] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#39FF14] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#C0C0C0] uppercase mb-2">Roll / ID Number</label>
            <input
              type="text"
              placeholder="e.g. EMP-2026-09"
              className="w-full bg-[#101010] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#39FF14] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#C0C0C0] uppercase mb-2">Email Address</label>
            <input
              type="email"
              placeholder="e.g. sarah@nexus.ai"
              className="w-full bg-[#101010] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#39FF14] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#C0C0C0] uppercase mb-2">Department</label>
            <select className="w-full bg-[#101010] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#39FF14] focus:outline-none transition-all">
              <option value="engineering">Engineering</option>
              <option value="product">Product & Design</option>
              <option value="operations">Operations</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-[#C0C0C0] uppercase mb-2">Face Dataset Images</label>
          <div className="border-2 border-dashed border-[#2A2A2A] hover:border-[#39FF14]/50 rounded-xl p-8 text-center bg-[#101010]/50 transition-all cursor-pointer">
            <Upload className="w-8 h-8 text-[#808080] mx-auto mb-2" />
            <p className="text-sm text-white font-medium">Click to upload face images or drag & drop</p>
            <p className="text-xs text-[#808080] mt-1">Upload 3-5 clear front-facing photos (PNG, JPG)</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            className="flex items-center space-x-2 bg-[#39FF14] hover:bg-[#00FF66] text-black font-semibold px-6 py-2.5 rounded-lg shadow-neon transition-all"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Register & Train Face</span>
          </button>
        </div>
      </form>
    </div>
  );
}
