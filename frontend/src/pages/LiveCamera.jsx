import { Camera, ScanFace } from 'lucide-react'

function LiveCamera() {
  return (
    <div className="p-8">
      <div className="text-xs font-mono text-neon/70 mb-2">// LIVE FEED</div>
      <h2 className="text-2xl font-bold mb-6">Live Camera</h2>

      <div className="rounded-2xl border border-neon/20 bg-black aspect-video flex flex-col items-center justify-center text-gray-500">
        <Camera className="w-10 h-10 mb-3 text-neon/50" />
        <p className="font-mono text-sm">
          The webcam feed runs locally via <span className="text-neon">python -m src.vision.camera_stream</span>
        </p>
        <p className="text-xs text-gray-600 mt-1">Browsers can't access a remote server's webcam — this view is for local demo use.</p>
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-gray-400 font-mono">
        <ScanFace className="w-4 h-4 text-neon" />
        Recognized faces will appear in Attendance in real time once the local script is running.
      </div>
    </div>
  )
}

export default LiveCamera
