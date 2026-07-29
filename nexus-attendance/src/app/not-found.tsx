import Link from "next/link";
import { ScanFace } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brand/30 bg-brand-muted text-brand">
        <ScanFace size={26} />
      </div>
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-brand-dim">404</p>
        <p className="mt-1 text-lg font-semibold">This route wasn't recognized</p>
        <p className="mt-1 max-w-sm text-sm text-white/40">
          The page you're looking for doesn't exist or has moved.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-base-950 shadow-glow"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}