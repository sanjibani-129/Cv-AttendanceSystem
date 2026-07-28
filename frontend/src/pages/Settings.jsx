import { Settings as SettingsIcon } from 'lucide-react'

function Settings() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  return (
    <div className="p-8">
      <div className="text-xs font-mono text-neon/70 mb-2">// CONFIG</div>
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 max-w-lg space-y-4 font-mono text-sm">
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          <SettingsIcon className="w-4 h-4 text-neon" /> System configuration
        </div>
        <Row label="API endpoint" value={apiUrl} />
        <Row label="Recognition model" value="ArcFace (DeepFace)" />
        <Row label="Detection engine" value="MediaPipe" />
        <Row label="Match threshold" value="0.6" />
        <Row label="Session timeout" value="5 minutes" />
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-white/5 pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="text-neon">{value}</span>
    </div>
  )
}

export default Settings
