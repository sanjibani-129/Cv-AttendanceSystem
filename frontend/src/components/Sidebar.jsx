import { LayoutGrid, Camera, Users, Activity, BarChart2, FileText, Settings, ScanFace, ChevronRight } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'live', label: 'Live Camera', icon: Camera },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'attendance', label: 'Attendance', icon: Activity },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function Sidebar({ active, onNavigate, systemOnline }) {
  return (
    <aside className="w-64 shrink-0 bg-black border-r border-neon/10 flex flex-col justify-between h-screen sticky top-0">
      <div>
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="w-10 h-10 rounded-xl border border-neon/40 flex items-center justify-center shadow-glow">
            <ScanFace className="w-5 h-5 text-neon" />
          </div>
          <div>
            <div className="text-white font-bold leading-tight">NEXUS</div>
            <div className="text-[10px] tracking-widest text-neon/70 font-mono">ATTENDANCE AI</div>
          </div>
        </div>

        <nav className="px-3 mt-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = active === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-neon/10 text-neon border border-neon/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </span>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="p-4">
        <div className="rounded-xl border border-neon/20 bg-neon/5 p-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-neon">
            <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
            SYSTEM {systemOnline ? 'ONLINE' : 'OFFLINE'}
          </div>
          <div className="text-gray-400 mt-1">DeepFace engine · SQLite</div>
          <div className="text-gray-400">latency 42ms</div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
