"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cx } from "@/lib/utils";

export default function StatusBadge({ inside }: { inside: boolean }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={inside ? "inside" : "away"}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.2 }}
        className={cx(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs",
          inside
            ? "border-brand/30 bg-brand-muted text-brand"
            : "border-base-600 bg-base-800 text-white/40"
        )}
      >
        <span className={cx("h-1.5 w-1.5 rounded-full", inside ? "bg-brand animate-pulseDot" : "bg-white/30")} />
        {inside ? "Inside" : "Away"}
      </motion.span>
    </AnimatePresence>
  );
}