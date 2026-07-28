export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">// configuration</p>
        <h1 className="mt-1 text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-white/50">System configuration and environment info.</p>
      </div>

      <div className="card p-6">
        <p className="eyebrow mb-4">// recognition engine</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl border border-base-700 p-4">
            <p className="text-white/40">Detector</p>
            <p className="mt-1 font-mono text-brand">face-api.js · TinyFaceDetector</p>
          </div>
          <div className="rounded-xl border border-base-700 p-4">
            <p className="text-white/40">Descriptor length</p>
            <p className="mt-1 font-mono text-brand">128-d embedding</p>
          </div>
          <div className="rounded-xl border border-base-700 p-4">
            <p className="text-white/40">Match threshold (env)</p>
            <p className="mt-1 font-mono text-brand">
              NEXT_PUBLIC_FACE_MATCH_THRESHOLD (default 0.5)
            </p>
          </div>
          <div className="rounded-xl border border-base-700 p-4">
            <p className="text-white/40">Database</p>
            <p className="mt-1 font-mono text-brand">Supabase (Postgres)</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-white/30">
          Lower the threshold for stricter matching (fewer false positives, more re-scans
          needed); raise it if legitimate members are frequently going unrecognized.
        </p>
      </div>
    </div>
  );
}
