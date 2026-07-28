"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { CheckCircle2, Camera as CameraIcon, Loader2 } from "lucide-react";
import {
  loadFaceModels,
  detectSingleFace,
  matchFace,
  MatchCandidate,
  MatchResult,
} from "@/lib/faceEngine";
import { initials } from "@/lib/utils";

interface LogEntry {
  name: string;
  time: string;
  action: "check_in" | "check_out";
}

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const candidatesRef = useRef<MatchCandidate[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [status, setStatus] = useState<"loading" | "scanning" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);

  // Boot: load models, camera stream, and the roster of known descriptors.
  useEffect(() => {
    let stream: MediaStream | null = null;

    (async () => {
      try {
        await loadFaceModels();

        const res = await fetch("/api/members/descriptors");
        const { members } = await res.json();
        candidatesRef.current = members ?? [];

        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setStatus("scanning");
      } catch (err) {
        console.error(err);
        setErrorMsg(
          err instanceof Error ? err.message : "Could not access the camera or face models."
        );
        setStatus("error");
      }
    })();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Scan loop: every 700ms, grab a frame, detect + match, draw the box.
  useEffect(() => {
    if (status !== "scanning") return;

    intervalRef.current = setInterval(async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) return;

      const face = await detectSingleFace(video);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!face) {
        setMatch(null);
        return;
      }

      const result = matchFace(face.descriptor, candidatesRef.current);
      setMatch(result);

      const { x, y, width, height } = face.box;
      ctx.strokeStyle = result ? "#39ff8a" : "#f43f5e";
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      const label = result
        ? `${result.member.name} · ${result.confidence.toFixed(1)}%`
        : "Unrecognized";
      ctx.font = "600 14px 'JetBrains Mono', monospace";
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle = result ? "#39ff8a" : "#f43f5e";
      ctx.fillRect(x, y - 24, textWidth + 16, 22);
      ctx.fillStyle = "#04140b";
      ctx.fillText(label, x + 8, y - 8);
    }, 700);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  const confirmCheckIn = useCallback(async () => {
    if (!match) return;
    setConfirming(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id: match.member.id, confidence: match.confidence }),
      });
      const data = await res.json();
      setLog((prev) => [
        { name: match.member.name, time: new Date().toLocaleTimeString(), action: data.action },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setConfirming(false);
    }
  }, [match]);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">// face recognition · live</p>
        <h1 className="mt-1 text-2xl font-bold">Live Camera Console</h1>
        <p className="mt-1 text-sm text-white/50">
          Real-time face detection, bounding-box preview and confidence scoring — all running
          in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Video panel */}
        <div className="card relative overflow-hidden p-3">
          <div className="mb-3 flex items-center justify-between px-2">
            <span className="flex items-center gap-2 font-mono text-xs text-white/50">
              <span className="h-2 w-2 rounded-full bg-red-500" /> REC · CAM01
            </span>
            <span
              className={
                status === "scanning"
                  ? "rounded-full border border-brand/30 bg-brand-muted px-3 py-1 font-mono text-xs text-brand"
                  : "rounded-full border border-base-600 px-3 py-1 font-mono text-xs text-white/40"
              }
            >
              {status === "scanning" ? "Scanning..." : status === "loading" ? "Loading models..." : "Camera error"}
            </span>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
            <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
            {status === "loading" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-base-950/80 text-white/60">
                <Loader2 className="animate-spin" />
                <p className="font-mono text-xs">Loading face models…</p>
              </div>
            )}
            {status === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-base-950/90 px-6 text-center text-white/60">
                <CameraIcon />
                <p className="font-mono text-xs">{errorMsg}</p>
              </div>
            )}
          </div>
        </div>

        {/* Current subject + log */}
        <div className="space-y-6">
          <div className="card p-5">
            <p className="eyebrow mb-4">// current subject</p>
            {match ? (
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand/30 bg-brand-muted font-mono text-brand">
                  {initials(match.member.name)}
                </div>
                <div>
                  <p className="font-semibold">{match.member.name}</p>
                  <p className="font-mono text-xs text-white/40">ID {match.member.roll_no}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/30">No face matched yet — step into frame.</p>
            )}

            {match && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-base-700 p-3">
                  <p className="font-mono text-[10px] uppercase text-white/30">Confidence</p>
                  <p className="text-lg font-semibold text-brand">{match.confidence.toFixed(1)}%</p>
                </div>
                <div className="rounded-xl border border-base-700 p-3">
                  <p className="font-mono text-[10px] uppercase text-white/30">Distance</p>
                  <p className="text-lg font-semibold text-white/80">{match.distance.toFixed(3)}</p>
                </div>
              </div>
            )}

            <button
              onClick={confirmCheckIn}
              disabled={!match || confirming}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-semibold text-base-950 shadow-glow disabled:cursor-not-allowed disabled:opacity-30"
            >
              <CheckCircle2 size={16} />
              {confirming ? "Confirming…" : "Confirm Check-in / Check-out"}
            </button>
          </div>

          <div className="card p-5">
            <p className="eyebrow mb-4">// session log</p>
            <div className="space-y-2">
              {log.length === 0 && <p className="text-sm text-white/30">Nothing logged yet.</p>}
              {log.map((entry, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span>{entry.name}</span>
                  <span className="font-mono text-xs text-white/40">
                    {entry.time} · {entry.action === "check_in" ? "in" : "out"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
