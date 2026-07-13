"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyTheme(newTheme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("light-mode", newTheme === "light");
  root.style.colorScheme = newTheme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingTheme, setPendingTheme] = useState<Theme | null>(null);
  const switchTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const defaultTheme: Theme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : "light";
    setTheme(defaultTheme);
    localStorage.setItem("theme", defaultTheme);
    applyTheme(defaultTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      if (switchTimerRef.current !== null) {
        window.clearTimeout(switchTimerRef.current);
      }
      if (finishTimerRef.current !== null) {
        window.clearTimeout(finishTimerRef.current);
      }
      document.documentElement.classList.remove("theme-transitioning");
    };
  }, []);

  const selectTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
    setTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    if (isTransitioning) return;

    const newTheme = theme === "dark" ? "light" : "dark";

    localStorage.setItem("theme", newTheme);
    setPendingTheme(newTheme);
    setIsTransitioning(true);
    document.documentElement.classList.add("theme-transitioning");

    switchTimerRef.current = window.setTimeout(() => {
      applyTheme(newTheme);
      setTheme(newTheme);
    }, 260);

    finishTimerRef.current = window.setTimeout(() => {
      setPendingTheme(null);
      setIsTransitioning(false);
      document.documentElement.classList.remove("theme-transitioning");
    }, 920);
  }, [isTransitioning, theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: selectTheme, mounted, isTransitioning }}>
      {children}
      <AnimatePresence>
        {isTransitioning && pendingTheme ? (
          <motion.div
            key={pendingTheme}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-0 z-[115] overflow-hidden"
            aria-hidden
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              className={
                pendingTheme === "light"
                  ? "absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(255,255,255,0.88)_0%,rgba(236,244,255,0.86)_18%,rgba(221,234,255,0.72)_36%,rgba(164,202,255,0.34)_56%,rgba(255,255,255,0)_74%),linear-gradient(135deg,rgba(246,250,255,0.88),rgba(244,232,255,0.78))] backdrop-blur-[10px]"
                  : "absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(125,211,252,0.28)_0%,rgba(99,102,241,0.26)_18%,rgba(91,33,182,0.32)_38%,rgba(8,5,24,0.82)_68%,rgba(3,0,20,0.96)_100%),linear-gradient(160deg,rgba(4,1,15,0.94),rgba(19,8,41,0.92))] backdrop-blur-[10px]"
              }
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.68 }}
              animate={{ opacity: [0.48, 0.9, 0.3], scale: [0.68, 1.08, 1.22] }}
              exit={{ opacity: 0, scale: 1.28 }}
              transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
              className={
                pendingTheme === "light"
                  ? "absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.92)_0%,rgba(191,219,254,0.72)_32%,rgba(196,181,253,0.34)_54%,transparent_74%)] blur-3xl"
                  : "absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.48)_0%,rgba(168,85,247,0.38)_34%,rgba(236,72,153,0.2)_58%,transparent_78%)] blur-3xl"
              }
            />

            <div className="absolute inset-0 flex items-center justify-center px-6">
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                className={
                  pendingTheme === "light"
                    ? "rounded-[2rem] border border-slate-200/70 bg-white/48 px-7 py-5 text-center shadow-[0_24px_90px_rgba(148,163,184,0.24)] backdrop-blur-xl"
                    : "rounded-[2rem] border border-white/14 bg-white/8 px-7 py-5 text-center shadow-[0_24px_90px_rgba(88,28,135,0.28)] backdrop-blur-xl"
                }
              >
                <motion.div
                  animate={{ opacity: [0.55, 1, 0.55], letterSpacing: ["0.28em", "0.38em", "0.28em"] }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                  className={
                    pendingTheme === "light"
                      ? "text-[0.72rem] font-mono uppercase text-slate-500"
                      : "text-[0.72rem] font-mono uppercase text-white/56"
                  }
                >
                  Theme Shift
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.42, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={
                    pendingTheme === "light"
                      ? "mt-3 text-2xl font-semibold tracking-[0.08em] text-slate-900"
                      : "mt-3 text-2xl font-semibold tracking-[0.08em] text-white"
                  }
                >
                  {pendingTheme === "light" ? "Light Mode" : "Night Mode"}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
