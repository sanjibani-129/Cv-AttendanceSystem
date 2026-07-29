import { LucideIcon } from "lucide-react";

export default function KpiCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="card flex items-center gap-4 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/30 bg-brand-muted text-brand">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-lg font-semibold text-brand">{value}</p>
        <p className="text-xs text-white/40">{label}</p>
      </div>
    </div>
  );
}
