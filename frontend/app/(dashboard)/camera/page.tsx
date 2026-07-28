'use client';

import { useEffect } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { Camera, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function CameraPage() {
  const { videoRef, isStreaming, startCamera, stopCamera } = useCamera();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-mono font-bold text-white tracking-tight">
            LIVE <span className="text-[#39FF14]">RECOGNITION</span>
          </h1>
          <p className="text-[#808080] text-sm mt-1">Real-time facial detection & attendance logging stream.</p>
        </div>

        <button
          onClick={isStreaming ? stopCamera : startCamera}
          className="flex items-center space-x-2 px-4 py-2 bg-[#181818] border border-[#2A2A2A] hover:border-[#39FF14] text-white text-sm font-medium rounded-lg transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isStreaming ? 'animate-spin text-[#39FF14]' : ''}`} />
          <span>{isStreaming ? 'Restart Feed' : 'Start Feed'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#101010] border border-[#2A2A2A] rounded-xl p-4 relative overflow-hidden flex items-center justify-center min-h-[480px]">
          <video ref={videoRef} className="w-full h-full object-cover rounded-lg" autoPlay playsInline muted />
          
          {!isStreaming && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505]/80">
              <Camera className="w-12 h-12 text-[#808080] mb-2 animate-bounce" />
              <p className="text-[#808080] text-sm font-mono">Initializing Camera Feed...</p>
            </div>
          )}

          {isStreaming && (
            <div className="absolute top-8 left-8 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#39FF14]/40">
              <span className="w-2.5 h-2.5 rounded-full bg-[#39FF14] animate-ping" />
              <span className="text-xs font-mono text-white">LIVE FEED (720P)</span>
            </div>
          )}
        </div>

        <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-mono font-bold text-white border-b border-[#2A2A2A] pb-3">
            RECENT <span className="text-[#39FF14]">LOGS</span>
          </h2>

          <div className="space-y-4">
            <div className="p-3 bg-[#101010] border border-[#2A2A2A] rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#00FF66]" />
                <div>
                  <p className="text-sm font-medium text-white">Alex Morgan</p>
                  <p className="text-xs text-[#808080]">Engineering • 09:14:02 AM</p>
                </div>
              </div>
              <span className="text-xs font-mono text-[#39FF14] bg-[#39FF14]/10 px-2 py-1 rounded">98.4%</span>
            </div>

            <div className="p-3 bg-[#101010] border border-[#2A2A2A] rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShieldAlert className="w-5 h-5 text-[#FF4D4F]" />
                <div>
                  <p className="text-sm font-medium text-white">Unknown Person</p>
                  <p className="text-xs text-[#808080]">Unregistered • 09:12:45 AM</p>
                </div>
              </div>
              <span className="text-xs font-mono text-[#FF4D4F] bg-[#FF4D4F]/10 px-2 py-1 rounded">No Match</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
