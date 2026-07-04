"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden />;
  }

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.08, rotate: 15 }}
      whileTap={{ scale: 0.92, rotate: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="btn-interactive p-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm hover:border-violet-400/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-[box-shadow,border-color] duration-300 flex items-center justify-center"
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
  );
}
