"use client";

import { useEffect, useRef, useState } from "react";
import { X, Camera, Loader2, Check } from "lucide-react";
import { loadFaceModels, detectSingleFace, averageDescriptors } from "@/lib/faceEngine";

const CAPTURES_NEEDED = 5;

export default function RegisterMemberModal({
  onClose,
  onRegistered,
}: {
  onClose: () => void;
  onRegistered: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const capturesRef = useRef<Float32Array[]>([]);

  const [form, setForm] = useState({ name: "", roll_no: "", email: "" });
  const [ready, setReady] = useState(false);
  const [captureCount, setCaptureCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let stream: MediaStream | null = null;
    (async () => {
      await loadFaceModels();
      stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setReady(true);
    })().catch((e) => setError(e.message));

    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  async function captureFrame() {
    if (!videoRef.current) return;
    const face = await detectSingleFace(videoRef.current);
    if (!face) {
      setError("No face detected — center your face in the frame and try again.");
      return;
    }
    setError("");
    capturesRef.current.push(face.descriptor);
    setCaptureCount(capturesRef.current.length);
  }

  async function submit() {
    if (!form.name || !form.roll_no || !form.email) {
      setError("Fill in name, roll number and email.");
      return;
    }
    if (capturesRef.current.length < CAPTURES_NEEDED) {
      setError(`Capture ${CAPTURES_NEEDED} face samples first.`);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const descriptor = averageDescriptors(capturesRef.current);
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, descriptor }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Registration failed");
      }
      onRegistered();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="card w-full max-w-lg p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="eyebrow">// register member</p>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="relative mb-4 aspect-video overflow-hidden rounded-xl bg-black">
          <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center text-white/50">
              <Loader2 className="animate-spin" />
            </div>
          )}
        </div>

        <div className="mb-4 grid grid-cols-3 gap-3">
          <input
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="col-span-3 rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm outline-none focus:border-brand/50"
          />
          <input
            placeholder="Roll no."
            value={form.roll_no}
            onChange={(e) => setForm({ ...form, roll_no: e.target.value })}
            className="col-span-1 rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm outline-none focus:border-brand/50"
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="col-span-2 rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm outline-none focus:border-brand/50"
          />
        </div>

        <button
          onClick={captureFrame}
          disabled={!ready || captureCount >= CAPTURES_NEEDED}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-base-600 py-2.5 text-sm font-medium text-white/80 disabled:opacity-40"
        >
          <Camera size={16} />
          Capture sample ({captureCount}/{CAPTURES_NEEDED})
        </button>

        {error && <p className="mb-3 text-xs text-red-400">{error}</p>}

        <button
          onClick={submit}
          disabled={submitting || captureCount < CAPTURES_NEEDED}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-semibold text-base-950 shadow-glow disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Check size={16} />
          {submitting ? "Registering…" : "Register Member"}
        </button>
      </div>
    </div>
  );
}
