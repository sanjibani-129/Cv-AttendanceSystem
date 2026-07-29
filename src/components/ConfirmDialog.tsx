"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  danger = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(e) => e.stopPropagation()}
        className="card w-full max-w-sm animate-modalIn p-6"
      >
        <div className="mb-3 flex items-center gap-3">
          <div
            className={
              danger
                ? "flex h-9 w-9 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400"
                : "flex h-9 w-9 items-center justify-center rounded-full border border-brand/30 bg-brand-muted text-brand"
            }
          >
            <AlertTriangle size={16} />
          </div>
          <p id="confirm-dialog-title" className="font-semibold">
            {title}
          </p>
        </div>
        <p className="mb-5 text-sm text-white/50">{description}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl border border-base-600 px-4 py-2 text-sm text-white/70 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={
              danger
                ? "rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg"
                : "rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-base-950 shadow-glow"
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}