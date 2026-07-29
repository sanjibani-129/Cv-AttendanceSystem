"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { CheckCircle2, Camera as CameraIcon, Loader2, RotateCw, VideoOff } from "lucide-react";
import {
  loadFaceModels,
  detectSingleFace,
  matchFace,
  MatchCandidate,
  MatchResult,
} from "@/lib/faceEngine";
import { initials } from "@/lib/utils";
import { useToast } from "@/components/Toast";

interface LogEntry {
  name: string;
  time: string;
  action: "check_in" | "check_out";
}

// After a confirmed check-in/out, ignore repeat confirms for the same
// member for this long ΓÇö stops the scan loop's next frame from immediately
// re-matching the same face and letting a double-click toggle it right back.
const ACTION_COOLDOWN_MS = 5000;

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const candidatesRef = useRef<MatchCandidate[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cooldownRef = useRef<Map<string, number>>(new Map());
  const { push } = useToast();

  const [status, setStatus] = useState<"loading" | "scanning" | "error" | "stopped">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);

  // Single source of truth for "is the camera hardware currently held open".
  // Always stop through this ref, never by reading video.srcObject ΓÇö the
  // video element can be re-used/re-rendered independently of the stream's
  // real lifecycle, which is how streams used to leak.
  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const boot = useCallback(async () => {
    setStatus("loading");
    setErrorMsg("");
    setPermissionDenied(false);

    // Local flag captured by this specific boot() call. If the effect that
    // called us gets cleaned up (component unmounts, or React Strict Mode's
    // dev-only mountΓåÆunmountΓåÆremount cycle fires) before getUserMedia
    // resolves, `cancelled` flips true and we kill the stream the instant
    // it arrives instead of handing it to a video element that no longer
    // wants it ΓÇö this is what previously left the camera light stuck on.
    let cancelled = false;

    try {
      await loadFaceModels();

      const res = await fetch("/api/members/descriptors");
      if (!res.ok) throw new Error("Couldn't load the member roster to match against.");
      const { members } = await res.json();
      candidatesRef.current = members ?? [];

      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });

      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("scanning");
    } catch (err) {
      if (cancelled) return;
      console.error(err);
      const isPermission =
        err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError");
      setPermissionDenied(isPermission);
      setErrorMsg(
        isPermission
          ? "Camera access was blocked. Allow camera permission for this site and try again."
          : err instanceof Error
          ? err.message
          : "Could not access the camera or face models."
      );
      setStatus("error");
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const cancelBootRef = useRef<(() => void) | undefined>(undefined);

  const runBoot = useCallback(() => {
    cancelBootRef.current?.(); // a previous in-flight boot (if any) gets cancelled first
    boot().then((c) => {
      cancelBootRef.current = c;
    });
  }, [boot]);

  useEffect(() => {
    runBoot();
    return () => {
      cancelBootRef.current?.();
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const onCooldown = result ? (cooldownRef.current.get(result.member.id) ?? 0) > Date.now() : false;

      ctx.strokeStyle = result ? (onCooldown ? "#7dffb8" : "#39ff8a") : "#f43f5e";
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      const label = result
        ? `${result.member.name} ┬╖ ${result.confidence.toFixed(1)}%${onCooldown ? " ┬╖ logged" : ""}`
        : "Unrecognized";
      ctx.font = "600 14px 'JetBrains Mono', monospace";
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle = result ? (onCooldown ? "#7dffb8" : "#39ff8a") : "#f43f5e";
      ctx.fillRect(x, y - 24, textWidth + 16, 22);
      ctx.fillStyle = "#04140b";
      ctx.fillText(label, x + 8, y - 8);
    }, 700);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  const onCooldown = match ? (cooldownRef.current.get(match.member.id) ?? 0) > Date.now() : false;

  const confirmCheckIn = useCallback(async () => {
    if (!match || onCooldown) return;
    setConfirming(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id: match.member.id, confidence: match.confidence }),
      });
      if (!res.ok) throw new Error("The server rejected that check-in/out.");
      const data = await res.json();

      cooldownRef.current.set(match.member.id, Date.now() + ACTION_COOLDOWN_MS);
      setLog((prev) => [
        { name: match.member.name, time: new Date().toLocaleTimeString(), action: data.action },
        ...prev,
      ]);
      push(
        `${match.member.name} ${data.action === "check_in" ? "checked in" : "checked out"}.`,
        "success"
      );
    } catch (err) {
      push(err instanceof Error ? err.message : "Couldn't log attendance ΓÇö try again.", "error");
    } finally {
      setConfirming(false);
    }
  }, [match, onCooldown, push]);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">// face recognition ┬╖ live</p>
        <h1 className="mt-1 text-2xl font-bold">Live Camera Console</h1>
        <p className="mt-1 text-sm text-white/50">
          Real-time face detection, bounding-box preview and confidence scoring ΓÇö all running
          in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Video panel */}
        <div className="card relative overflow-hidden p-3">
          <div className="mb-3 flex items-center justify-between px-2">
            <span className="flex items-center gap-2 font-mono text-xs text-white/50">
              <span className="h-2 w-2 rounded-full bg-red-500" /> REC ┬╖ CAM01
            </span>
            <div className="flex items-center gap-2">
              <span
                className={
                  status === "scanning"
                    ? "rounded-full border border-brand/30 bg-brand-muted px-3 py-1 font-mono text-xs text-brand"
                    : "rounded-full border border-base-600 px-3 py-1 font-mono text-xs text-white/40"
                }
              >
                {status === "scanning"
                  ? "Scanning..."
                  : status === "loading"
                  ? "Loading models..."
                  : status === "stopped"
                  ? "Stopped"
                  : "Camera error"}
              </span>
              {status === "scanning" && (
                <button
                  onClick={() => {
                    stopStream();
                    setStatus("stopped");
                    setMatch(null);
                  }}
                  aria-label="Stop camera"
                  className="rounded-full border border-base-600 p-1.5 text-white/50 hover:text-white"
                >
                  <VideoOff size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
            <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
            {status === "loading" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-base-950/80 text-white/60">
                <Loader2 className="animate-spin" />
                <p className="font-mono text-xs">Loading face modelsΓÇª</p>
              </div>
            )}
            {(status === "error" || status === "stopped") && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-base-950/90 px-6 text-center text-white/60">
                {status === "error" ? <CameraIcon /> : <VideoOff />}
                <p className="font-mono text-xs">
                  {status === "error" ? errorMsg : "Camera stopped."}
                </p>
                {status === "error" && permissionDenied && (
                  <p className="max-w-xs text-[11px] text-white/30">
                    Click the camera icon in your browser's address bar to allow access, then retry.
                  </p>
                )}
                <button
                  onClick={runBoot}
                  className="flex items-center gap-2 rounded-lg border border-brand/30 bg-brand-muted px-3 py-1.5 text-xs font-medium text-brand"
                >
                  <RotateCw size={13} /> {status === "error" ? "Retry" : "Restart camera"}
                </button>
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
              <p className="text-sm text-white/30">No face matched yet ΓÇö step into frame.</p>
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
              disabled={!match || confirming || onCooldown}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-semibold text-base-950 shadow-glow disabled:cursor-not-allowed disabled:opacity-30"
            >
              <CheckCircle2 size={16} />
              {confirming ? "ConfirmingΓÇª" : onCooldown ? "Logged ΓÇö wait a moment" : "Confirm Check-in / Check-out"}
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
                    {entry.time} ┬╖ {entry.action === "check_in" ? "in" : "out"}
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