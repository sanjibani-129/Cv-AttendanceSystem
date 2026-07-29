"use client";

import { useEffect, useRef, useState } from "react";
import { X, Camera, Loader2, Check, Undo2 } from "lucide-react";
import { loadFaceModels, detectSingleFace, toStoredSamples } from "@/lib/faceEngine";

const CAPTURES_NEEDED = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterMemberModal({
  onClose,
  onRegistered,
}: {
  onClose: () => void;
  onRegistered: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const capturesRef = useRef<Float32Array[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [form, setForm] = useState({ name: "", roll_no: "", email: "" });
  const [ready, setReady] = useState(false);
  const [captureCount, setCaptureCount] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await loadFaceModels();
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360 } });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setReady(true);
      } catch (e) {
        if (cancelled) return;
        setCameraError(
          e instanceof DOMException && e.name === "NotAllowedError"
            ? "Camera access blocked ΓÇö allow it in your browser and reopen this dialog."
            : e instanceof Error
            ? e.message
            : "Couldn't start the camera."
        );
      }
    })();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  // Close on Escape, but never mid-submit (avoid losing an in-flight registration silently)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  async function captureFrame() {
    if (!videoRef.current || capturing) return;
    setCapturing(true);
    setError("");
    try {
      const face = await detectSingleFace(videoRef.current);
      if (!face) {
        setError("No face detected ΓÇö center your face in the frame, ensure good lighting, and try again.");
        return;
      }
      capturesRef.current.push(face.descriptor);
      setCaptureCount(capturesRef.current.length);
    } finally {
      setCapturing(false);
    }
  }

  function undoLastCapture() {
    capturesRef.current.pop();
    setCaptureCount(capturesRef.current.length);
    setError("");
  }

  function validateForm(): string | null {
    if (!form.name.trim()) return "Full name is required.";
    if (!form.roll_no.trim()) return "Roll number is required.";
    if (!form.email.trim() || !EMAIL_RE.test(form.email.trim())) return "Enter a valid email address.";
    return null;
  }

  async function submit() {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (capturesRef.current.length < CAPTURES_NEEDED) {
      setError(`Capture ${CAPTURES_NEEDED} face samples first (${captureCount}/${CAPTURES_NEEDED} so far).`);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const descriptors = toStoredSamples(capturesRef.current);
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          roll_no: form.roll_no.trim(),
          email: form.email.trim(),
          descriptors,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 409) {
          throw new Error("That roll number or email is already registered.");
        }
        throw new Error(data.error ?? "Registration failed ΓÇö please try again.");
      }
      onRegistered();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  const progressPct = Math.round((captureCount / CAPTURES_NEEDED) * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={() => !submitting && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-member-title"
    >
      <div ref={dialogRef} onClick={(e) => e.stopPropagation()} className="card w-full max-w-lg animate-modalIn p-6">
        <div className="mb-4 flex items-center justify-between">
          <p id="register-member-title" className="eyebrow">
            // register member
          </p>
          <button
            onClick={() => !submitting && onClose()}
            aria-label="Close registration dialog"
            className="text-white/40 hover:text-white disabled:opacity-30"
            disabled={submitting}
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative mb-2 aspect-video overflow-hidden rounded-xl bg-black">
          <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
          {!ready && !cameraError && (
            <div className="absolute inset-0 flex items-center justify-center text-white/50">
              <Loader2 className="animate-spin" />
            </div>
          )}
          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-950/90 px-6 text-center">
              <p className="text-xs text-white/50">{cameraError}</p>
            </div>
          )}
        </div>

        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-base-700">
          <div className="h-full bg-brand transition-all" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="mb-4 grid grid-cols-3 gap-3">
          <input
            placeholder="Full name"
            value={form.name}
            disabled={submitting}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="col-span-3 rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm outline-none focus:border-brand/50 disabled:opacity-50"
          />
          <input
            placeholder="Roll no."
            value={form.roll_no}
            disabled={submitting}
            onChange={(e) => setForm({ ...form, roll_no: e.target.value })}
            className="col-span-1 rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm outline-none focus:border-brand/50 disabled:opacity-50"
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            disabled={submitting}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="col-span-2 rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm outline-none focus:border-brand/50 disabled:opacity-50"
          />
        </div>

        <div className="mb-3 flex gap-2">
          <button
            onClick={captureFrame}
            disabled={!ready || capturing || captureCount >= CAPTURES_NEEDED || submitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-base-600 py-2.5 text-sm font-medium text-white/80 disabled:opacity-40"
          >
            {capturing ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            Capture sample ({captureCount}/{CAPTURES_NEEDED})
          </button>
          <button
            onClick={undoLastCapture}
            disabled={captureCount === 0 || submitting}
            aria-label="Undo last capture"
            className="flex items-center justify-center rounded-xl border border-base-600 px-3 text-white/60 disabled:opacity-30"
          >
            <Undo2 size={16} />
          </button>
        </div>

        <p className="mb-3 text-[11px] text-white/30">
          Tip: tilt your head slightly (straight on, left, right, up, down) between each capture ΓÇö
          a few different angles recognize far better in varied lighting than 5 identical shots.
        </p>

        {error && <p className="mb-3 text-xs text-red-400">{error}</p>}

        <button
          onClick={submit}
          disabled={submitting || captureCount < CAPTURES_NEEDED}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-semibold text-base-950 shadow-glow disabled:cursor-not-allowed disabled:opacity-30"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          {submitting ? "RegisteringΓÇª" : "Register Member"}
        </button>
      </div>
    </div>
  );
}