'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Camera, 
  Users, 
  UserPlus, 
  CalendarCheck, 
  BarChart3, 
  FileSpreadsheet, 
  Settings, 
  User 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Live Camera', href: '/camera', icon: Camera },
  { name: 'Members', href: '/members', icon: Users },
  { name: 'Register Member', href: '/members/register', icon: UserPlus },
  { name: 'Attendance', href: '/attendance', icon: CalendarCheck },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/reports', icon: FileSpreadsheet },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Profile', href: '/profile', icon: User },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#101010]/80 backdrop-blur-xl border-r border-[#2A2A2A] h-screen flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6 flex items-center space-x-3 border-b border-[#2A2A2A]">
        <div className="w-8 h-8 rounded-lg bg-[#39FF14] flex items-center justify-center font-bold text-black shadow-neon">
          N
        </div>
        <span className="font-mono text-lg font-bold tracking-wider text-white">
          NEXUS<span className="text-[#39FF14]">.AI</span>
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30 shadow-neon'
                  : 'text-[#C0C0C0] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-[#39FF14]' : 'text-[#808080]'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
