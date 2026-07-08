"use client";

import { motion, useInView } from "framer-motion";
import { Gamepad2, Sparkles, Swords, Grid3X3, Orbit, Boxes, Ghost, Rabbit, Keyboard, Play } from "lucide-react";
import { useRef } from "react";
import { SectionHeader } from "@/components/section-header";
import { viewport } from "@/lib/motion";
import { unavailableUserGames, userGames } from "@/lib/user-games";

const iconMap = {
  "rock-paper-scissors": Swords,
  "tic-tac-toe": Grid3X3,
  snake: Orbit,
  "game-2048": Boxes,
  pacman: Ghost,
  "dino-runner": Rabbit,
  "typing-speed": Keyboard,
} as const;

export function GamingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewport);

  const openGame = (slug: string) => {
    window.dispatchEvent(new CustomEvent("portfolio:open-game", { detail: { slug } }));
  };

  return (
    <section id="games" className="relative overflow-hidden border-t border-border py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.12),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(34,211,238,0.08),transparent_28%)]" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
          transition={{ duration: 0.55 }}
          className="mb-16"
        >
          <div className="games-badge mb-6 inline-flex items-center gap-3 rounded-full px-5 py-3">
            <span className="games-badge-icon flex h-11 w-11 items-center justify-center rounded-2xl">
              <Gamepad2 className="h-5 w-5 text-white" />
            </span>
            <span className="text-sm font-mono uppercase tracking-[0.36em] text-white/90">Games</span>
            <Sparkles className="h-4 w-4 text-cyan-200" />
          </div>

          <SectionHeader
            label="Your Arcade"
            title="Actual Game Files"
            description="The portfolio now launches your real game projects instead of the built-in demo games."
            className="mb-0"
          />
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {userGames.map((game, index) => {
            const Icon = iconMap[game.slug as keyof typeof iconMap] ?? Gamepad2;

            return (
              <motion.button
                key={game.slug}
                type="button"
                onClick={() => openGame(game.slug)}
                initial={{ opacity: 0, y: 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="game-card group rounded-[2rem] p-6 text-left"
              >
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.24em] text-cyan-300/90">{game.subtitle}</p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-white">{game.title}</h3>
                  </div>
                  <div className="game-icon-shell">
                    <Icon className="h-5 w-5 text-cyan-100" />
                  </div>
                </div>

                <p className="min-h-[72px] text-sm leading-relaxed text-white/68">{game.description}</p>

                <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.22em] text-cyan-100">
                  <Play className="h-3.5 w-3.5" />
                  Launch inside portfolio
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="game-card mt-8 rounded-[2rem] p-6"
        >
          <p className="text-xs font-mono uppercase tracking-[0.28em] text-amber-300/85">Not Added Yet</p>
          <div className="mt-4 grid gap-3">
            {unavailableUserGames.map((game) => (
              <div key={game.title} className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-4 py-4">
                <p className="text-sm font-semibold text-white">{game.title}</p>
                <p className="mt-1 text-sm text-white/62">{game.reason}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
