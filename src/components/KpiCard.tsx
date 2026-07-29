"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import AnimatedNumber from "./AnimatedNumber";

export default function KpiCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  const match = value.match(/^(-?\d+(\.\d+)?)(.*)$/);
  const numeric = match ? parseFloat(match[1]) : null;
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0;
  const suffix = match ? match[3] : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: "0 0 24px rgba(57,255,138,0.15)" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="card flex items-center gap-4 p-4"
    >
      <motion.div
        whileHover={{ rotate: 6, scale: 1.08 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/30 bg-brand-muted text-brand"
      >
        <Icon size={18} />
      </motion.div>
      <div>
        <p className="text-lg font-semibold text-brand">
          {numeric !== null ? (
            <AnimatedNumber value={numeric} decimals={decimals} suffix={suffix} />
          ) : (
            value
          )}
        </p>
        <p className="text-xs text-white/40">{label}</p>
      </div>
    </motion.div>
  );
}