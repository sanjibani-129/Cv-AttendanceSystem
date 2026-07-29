"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
        <AlertOctagon size={26} />
      </div>
      <div>
        <p className="text-lg font-semibold">Something broke on this page</p>
        <p className="mt-1 max-w-sm text-sm text-white/40">
          {error.message || "An unexpected error occurred."}
        </p>
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-base-950 shadow-glow"
      >
        <RotateCw size={16} /> Try again
      </button>
    </div>
  );
}