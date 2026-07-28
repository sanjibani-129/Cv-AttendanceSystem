'use client';

import { KpiCard } from '@/components/KpiCard';
import { Users, UserCheck, UserX, Clock, Target, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-mono font-bold text-white tracking-tight">
          SYSTEM <span className="text-[#39FF14]">OVERVIEW</span>
        </h1>
        <p className="text-[#808080] text-sm mt-1">Real-time attendance & facial recognition metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard title="Today's Attendance" value="88.4%" change="+2.1%" isPositive={true} icon={UserCheck} />
        <KpiCard title="Present Today" value="142" change="142 / 160" isPositive={true} icon={Users} />
        <KpiCard title="Absent Today" value="18" change="-4 vs yesterday" isPositive={true} icon={UserX} />
        <KpiCard title="Late Arrivals" value="6" change="12.5% avg stay" isPositive={false} icon={Clock} />
        <KpiCard title="Recognition Accuracy" value="99.2%" change="ArcFace Model" isPositive={true} icon={Target} />
        <KpiCard title="Unknown Faces" value="3" change="Alerts triggered" isPositive={false} icon={AlertTriangle} />
      </div>
    </div>
  );
}
