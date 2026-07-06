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

    const showTimerId = window.setTimeout(() => {
      setShowHint(true);
    }, 1000);

    const hideTimerId = window.setTimeout(() => {
      setShowHint(false);
    }, 5600);

    return () => {
      window.clearTimeout(showTimerId);
      window.clearTimeout(hideTimerId);
    };
  }, [mounted]);

  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden />;
  }

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.94 }}
        animate={showHint ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -8, scale: 0.94 }}
        transition={{ duration: 0.34, ease: "easeOut" }}
        className="theme-toggle-hint pointer-events-none absolute right-0 top-full z-20 mt-4 whitespace-nowrap rounded-2xl border px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.26em] shadow-[0_16px_40px_rgba(59,130,246,0.2)] backdrop-blur-md"
      >
        Change Theme Here
        <span className="theme-toggle-hint-pointer" aria-hidden />
        <span className="theme-toggle-hint-line" aria-hidden />
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
