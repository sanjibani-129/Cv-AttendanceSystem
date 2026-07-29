import { cx } from "@/lib/utils";

export default function StatusBadge({ inside }: { inside: boolean }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs",
        inside
          ? "border-brand/30 bg-brand-muted text-brand"
          : "border-base-600 bg-base-800 text-white/40"
      )}
    >
      <span className={cx("h-1.5 w-1.5 rounded-full", inside ? "bg-brand animate-pulseDot" : "bg-white/30")} />
      {inside ? "Inside" : "Away"}
    </span>
  );
}
