"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";

export default function LampToggle() {
  const [isOn, setIsOn] = useState(true);
  const [pulling, setPulling] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("nexus-lamp-on");
    if (stored !== null) setIsOn(stored === "true");
  }, []);

  function toggle() {
    setPulling(true);
    setTimeout(() => setPulling(false), 400);
    setIsOn((prev) => {
      const next = !prev;
      localStorage.setItem("nexus-lamp-on", String(next));
      document.documentElement.style.setProperty("--lamp-glow", next ? "1" : "0.35");
      return next;
    });
  }

  return (
    <button
      onClick={toggle}
      aria-label={isOn ? "Dim ambient glow" : "Brighten ambient glow"}
      className="relative hidden rounded-lg border border-base-700 p-2 text-white/60 hover:text-white sm:block"
    >
      {/* Pull string */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-full h-3 w-px -translate-x-1/2 bg-white/20"
        animate={pulling ? { height: 10, opacity: [1, 0.4, 1] } : { height: 6 }}
        transition={{ duration: 0.35 }}
      />
      <motion.div
        animate={
          pulling
            ? { rotate: [0, -18, 14, -8, 4, 0] }
            : { rotate: 0 }
        }
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="relative">
          <Lightbulb
            size={16}
            className={isOn ? "text-brand" : "text-white/40"}
            fill={isOn ? "currentColor" : "none"}
            fillOpacity={isOn ? 0.15 : 0}
          />
          <AnimatePresence>
            {isOn && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.5, scale: 1.8 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                className="pointer-events-none absolute inset-0 rounded-full bg-brand/40 blur-sm"
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </button>
  );
}