import { Play, Sparkles, ShieldCheck, Zap, Wifi, ScanFace } from 'lucide-react'

function Dashboard({ sessions, summary, onNavigate }) {
  const activeCount = sessions.filter((s) => !s.end_time).length
  const totalMembers = summary.leaderboard?.length || 0
  const totalHours = summary.leaderboard
    ? Math.round(summary.leaderboard.reduce((sum, m) => sum + m.total_seconds, 0) / 3600)
    : 0

  return (
    <div className="p-8 space-y-10">
      {/* Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-gradient-to-b from-neon/5 to-transparent border border-neon/10 rounded-2xl p-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon/30 bg-neon/5 text-xs font-mono text-neon mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
            LIVE Build Club · Makerspace 01
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            <span className="text-white">AI Smart</span>
            <br />
            <span className="text-neon">Attendance</span>
            <br />
            <span className="text-neon">System</span>
          </h1>
          <p className="text-gray-400 max-w-md mb-6">
            Face recognition attendance for the modern makerspace. Neural check-ins, live analytics
            and heatmaps — powered by OpenCV, DeepFace and FastAPI.
          </p>
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => onNavigate('live')}
              className="flex items-center gap-2 bg-neon text-black font-semibold px-5 py-3 rounded-xl hover:shadow-glow transition"
            >
              <Play className="w-4 h-4" /> Launch Live Camera
            </button>
            <button
              onClick={() => onNavigate('members')}
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-200 font-semibold px-5 py-3 rounded-xl hover:border-neon/40 transition"
            >
              <Sparkles className="w-4 h-4" /> Register Member
            </button>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400 font-mono">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-neon" /> 98.7% accuracy</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-neon" /> 42ms latency</span>
            <span className="flex items-center gap-1.5"><Wifi className="w-4 h-4 text-neon" /> Realtime</span>
          </div>
        </div>

        <div className="relative aspect-square max-w-md mx-auto w-full rounded-2xl border border-neon/20 bg-black flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-neon/20 to-transparent" />
          <div className="w-40 h-40 rounded-full border border-neon/40 flex items-center justify-center shadow-glow relative">
            <ScanFace className="w-16 h-16 text-neon" />
          </div>
          <span className="absolute bottom-4 left-4 text-[10px] font-mono text-gray-500">// live_preview</span>
          <span className="absolute bottom-4 right-4 text-[10px] font-mono text-neon/70">HERO ROBOT</span>
        </div>
      </div>

      {/* KPIs */}
      <div>
        <div className="text-xs font-mono text-neon/70 mb-2">// REALTIME KPIS</div>
        <h2 className="text-2xl font-bold mb-5">Today at a glance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <KpiCard label="Currently present" value={activeCount} />
          <KpiCard label="Registered members" value={totalMembers} />
          <KpiCard label="Total hours logged" value={`${totalHours}h`} />
        </div>
      </div>
    </div>
  )
}

function KpiCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-gray-400 text-sm mb-2 font-mono">{label}</div>
      <div className="text-3xl font-bold text-neon">{value}</div>
    </div>
  )
}

export default Dashboard
