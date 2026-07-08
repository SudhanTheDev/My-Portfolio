"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  ChevronRight,
  Gamepad2,
  Swords,
  Grid3X3,
  Orbit,
  Boxes,
  Ghost,
  Rabbit,
  Keyboard,
  X,
  ExternalLink,
} from "lucide-react";
import { userGames } from "@/lib/user-games";

type OpenGameEventDetail = {
  slug?: string;
};

const iconMap = {
  "rock-paper-scissors": Swords,
  "tic-tac-toe": Grid3X3,
  snake: Orbit,
  "game-2048": Boxes,
  pacman: Ghost,
  "dino-runner": Rabbit,
  "typing-speed": Keyboard,
} as const;

const GameLibraryCard = memo(function GameLibraryCard({
  game,
  selected,
  onSelect,
}: {
  game: (typeof userGames)[number];
  selected: boolean;
  onSelect: (slug: string) => void;
}) {
  const Icon = iconMap[game.slug as keyof typeof iconMap] ?? Gamepad2;

  return (
    <button
      type="button"
      onClick={() => onSelect(game.slug)}
      className={`games-arcade-card rounded-[1.35rem] border p-4 text-left transition-colors duration-200 ${
        selected
          ? "border-cyan-300/40 bg-cyan-400/8"
          : "border-white/8 bg-white/[0.025] hover:border-white/16 hover:bg-white/[0.05]"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="games-neon-panel flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
          <Icon className="h-5 w-5 text-cyan-100" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-white/48">
            {game.subtitle}
          </p>
          <h3 className="mt-2 text-base font-semibold text-white">{game.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/56">{game.description}</p>
        </div>
      </div>
    </button>
  );
});

export function GamesHubButton() {
  const [open, setOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState(userGames[0]?.slug ?? "");
  const [mounted, setMounted] = useState(false);

  const activeGame = useMemo(
    () => userGames.find((game) => game.slug === activeSlug) ?? userGames[0] ?? null,
    [activeSlug],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("games-open", open);
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.documentElement.classList.remove("games-open");
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleOpenRequest = (event: Event) => {
      const detail = (event as CustomEvent<OpenGameEventDetail>).detail;
      if (detail?.slug && userGames.some((game) => game.slug === detail.slug)) {
        setActiveSlug(detail.slug);
      }
      setOpen(true);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("portfolio:open-game", handleOpenRequest as EventListener);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("portfolio:open-game", handleOpenRequest as EventListener);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="games-top-button relative flex h-[42px] items-center gap-2 overflow-hidden rounded-full px-4 text-white"
        aria-label="Open games hub"
      >
        <span className="games-top-button-icon flex h-7 w-7 items-center justify-center rounded-full">
          <Gamepad2 className="h-4 w-4" />
        </span>
        <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-white/88">Games</span>
      </button>

      {mounted && open && activeGame
        ? createPortal(
            <div className="fixed inset-0 z-[140] flex items-center justify-center px-4 py-6 md:px-6">
              <button
                type="button"
                aria-label="Close games popup"
                className="absolute inset-0 bg-slate-950/88"
                onClick={() => setOpen(false)}
              />

              <div className="games-popup relative z-[141] flex h-[94vh] w-full max-w-[1520px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(6,10,22,0.985),rgba(8,12,30,0.97))] shadow-[0_18px_60px_rgba(0,0,0,0.38)] [contain:layout_paint_style]">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 md:px-6">
                  <div className="min-w-0">
                    <p className="games-popup-kicker text-[10px] font-mono uppercase tracking-[0.32em] text-cyan-200/80">
                      Play First
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <h2 id="games-popup-title" className="games-popup-title truncate font-display text-2xl font-bold text-white md:text-[2rem]">
                        {activeGame.title}
                      </h2>
                      <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-white/55 md:inline-flex">
                        {activeGame.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <a
                      href={activeGame.href}
                      target="_blank"
                      rel="noreferrer"
                      className="games-action-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-white/85"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open
                    </a>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="games-popup-close flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                      aria-label="Close games popup"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>

                <div className="grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-5">
                  <div className="games-popup-inner order-1 flex min-h-0 flex-col rounded-[1.7rem] border border-cyan-300/10 bg-black/20 p-3 [contain:layout_paint]">
                    <div className="mb-3 flex items-center justify-between gap-3 rounded-[1.3rem] border border-white/8 bg-white/[0.025] px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-mono uppercase tracking-[0.26em] text-white/45">Now Playing</p>
                        <p className="mt-1 truncate text-sm text-white/82">{activeGame.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const currentIndex = userGames.findIndex((game) => game.slug === activeGame.slug);
                          const nextGame = userGames[(currentIndex + 1) % userGames.length];
                          setActiveSlug(nextGame.slug);
                        }}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
                        aria-label="Next game"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="min-h-0 flex-1 overflow-hidden rounded-[1.45rem] border border-white/10 bg-white">
                      <iframe
                        key={activeGame.slug}
                        src={activeGame.href}
                        title={activeGame.title}
                        className="h-full min-h-[68vh] w-full border-0 [contain:strict] lg:min-h-0"
                        loading="lazy"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  <div className="games-popup-inner order-2 min-h-0 overflow-auto rounded-[1.7rem] border border-white/10 bg-white/[0.02] p-3 [contain:layout_paint]">
                    <div className="mb-3 rounded-[1.3rem] border border-white/8 bg-white/[0.025] px-4 py-3">
                      <p className="text-[11px] font-mono uppercase tracking-[0.26em] text-white/45">Switch Games</p>
                      <p className="mt-2 text-sm leading-relaxed text-white/62">
                        Pick another title without losing focus on the playable area.
                      </p>
                    </div>

                    <div className="grid gap-3">
                      {userGames.map((game) => (
                        <GameLibraryCard
                          key={game.slug}
                          game={game}
                          selected={game.slug === activeGame.slug}
                          onSelect={setActiveSlug}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
