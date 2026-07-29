import { AlertTriangle, RotateCw, Inbox } from "lucide-react";

export function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
      <div className="flex items-center gap-2">
        <AlertTriangle size={16} className="shrink-0" />
        <span>{message}</span>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/10"
      >
        <RotateCw size={13} /> Retry
      </button>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-base-700 text-white/20">
        <Inbox size={20} />
      </div>
      <p className="text-sm font-medium text-white/60">{title}</p>
      {description && <p className="max-w-sm text-xs text-white/30">{description}</p>}
      {action}
    </div>
  );
}