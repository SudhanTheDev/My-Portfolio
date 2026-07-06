"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "@/app/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!mounted) return;

    setShowHint(true);
    const timeoutId = window.setTimeout(() => {
      setShowHint(false);
    }, 3200);

    return () => window.clearTimeout(timeoutId);
  }, [mounted]);

  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden />;
  }

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={showHint ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 6, scale: 0.96 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="theme-toggle-hint pointer-events-none absolute right-full top-1/2 mr-4 -translate-y-1/2 whitespace-nowrap rounded-full border px-4 py-2 text-[11px] font-mono uppercase tracking-[0.26em] shadow-[0_16px_40px_rgba(59,130,246,0.2)] backdrop-blur-md"
      >
        Change Theme Here
        <span className="theme-toggle-hint-pointer" aria-hidden />
      </motion.div>

      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.08, rotate: 15 }}
        whileTap={{ scale: 0.92, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="btn-interactive theme-toggle-spotlight p-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm hover:border-violet-400/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-[box-shadow,border-color] duration-300 flex items-center justify-center"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-accent-blue" />
          )}
        </motion.span>
      </motion.button>
    </div>
  );
}
