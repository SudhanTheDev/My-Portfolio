"use client";

import { motion, useInView } from "framer-motion";
import { BrainCircuit, Gamepad2, Sparkles, Swords, TimerReset } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { InteractiveButton } from "@/components/interactive-button";
import { SectionHeader } from "@/components/section-header";
import { viewport } from "@/lib/motion";

const rpsChoices = ["Rock", "Paper", "Scissors"] as const;
type RpsChoice = (typeof rpsChoices)[number];

function getRpsResult(player: RpsChoice, cpu: RpsChoice) {
  if (player === cpu) return "Draw";
  if (
    (player === "Rock" && cpu === "Scissors") ||
    (player === "Paper" && cpu === "Rock") ||
    (player === "Scissors" && cpu === "Paper")
  ) {
    return "Win";
  }

  return "Lose";
}

export function GamingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewport);
  const reactionTimerRef = useRef<number | null>(null);
  const reactionStartRef = useRef<number | null>(null);

  const [reactionState, setReactionState] = useState<"idle" | "arming" | "ready" | "result">("idle");
  const [reactionMs, setReactionMs] = useState<number | null>(null);

  const [guessInput, setGuessInput] = useState("");
  const [guessTarget, setGuessTarget] = useState(() => Math.floor(Math.random() * 15) + 1);
  const [guessMessage, setGuessMessage] = useState("Pick a number from 1 to 15.");
  const [guessWins, setGuessWins] = useState(0);

  const [playerChoice, setPlayerChoice] = useState<RpsChoice | null>(null);
  const [cpuChoice, setCpuChoice] = useState<RpsChoice | null>(null);
  const [rpsResult, setRpsResult] = useState("Choose your move.");
  const [rpsScore, setRpsScore] = useState({ player: 0, cpu: 0 });

  useEffect(() => {
    return () => {
      if (reactionTimerRef.current) {
        window.clearTimeout(reactionTimerRef.current);
      }
    };
  }, []);

  const startReactionGame = () => {
    if (reactionTimerRef.current) {
      window.clearTimeout(reactionTimerRef.current);
    }

    setReactionState("arming");
    setReactionMs(null);

    const delay = 1400 + Math.floor(Math.random() * 2200);
    reactionTimerRef.current = window.setTimeout(() => {
      reactionStartRef.current = performance.now();
      setReactionState("ready");
    }, delay);
  };

  const handleReactionTap = () => {
    if (reactionState === "arming") {
      if (reactionTimerRef.current) {
        window.clearTimeout(reactionTimerRef.current);
      }

      setReactionState("idle");
      setReactionMs(null);
      return;
    }

    if (reactionState !== "ready" || !reactionStartRef.current) return;

    const elapsed = Math.round(performance.now() - reactionStartRef.current);
    setReactionMs(elapsed);
    setReactionState("result");
  };

  const handleGuessSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = Number(guessInput);

    if (!Number.isFinite(value) || value < 1 || value > 15) {
      setGuessMessage("Use a number between 1 and 15.");
      return;
    }

    if (value === guessTarget) {
      setGuessWins((current) => current + 1);
      setGuessMessage("Perfect hit. New number loaded.");
      setGuessTarget(Math.floor(Math.random() * 15) + 1);
      setGuessInput("");
      return;
    }

    setGuessMessage(value < guessTarget ? "Too low. Push higher." : "Too high. Come down a bit.");
  };

  const playRps = (choice: RpsChoice) => {
    const cpu = rpsChoices[Math.floor(Math.random() * rpsChoices.length)];
    const result = getRpsResult(choice, cpu);

    setPlayerChoice(choice);
    setCpuChoice(cpu);
    setRpsResult(result === "Draw" ? "Dead even." : result === "Win" ? "You take the round." : "CPU steals it.");
    setRpsScore((current) => ({
      player: current.player + (result === "Win" ? 1 : 0),
      cpu: current.cpu + (result === "Lose" ? 1 : 0),
    }));
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
            label="Play Zone"
            title="Mini Games"
            description="A playful corner inside the portfolio. Quick taps, tiny challenges, and a glowing arcade-style UI that still fits the site."
            className="mb-0"
          />
        </motion.div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="game-card group rounded-[2rem] p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.24em] text-cyan-300/90">Reaction Test</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-white">Light Trigger</h3>
              </div>
              <div className="game-icon-shell">
                <TimerReset className="h-5 w-5 text-cyan-200" />
              </div>
            </div>

            <p className="text-sm leading-relaxed text-white/68">
              Press start, wait for the live cue, then tap as fast as you can.
            </p>

            <button
              type="button"
              onClick={reactionState === "ready" || reactionState === "arming" ? handleReactionTap : startReactionGame}
              className={`mt-8 flex min-h-[190px] w-full items-center justify-center rounded-[1.7rem] border text-center transition-all duration-500 ${
                reactionState === "ready"
                  ? "border-emerald-300/60 bg-emerald-400/18 shadow-[0_0_32px_rgba(52,211,153,0.22)]"
                  : reactionState === "arming"
                    ? "border-amber-300/40 bg-white/6"
                    : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <div className="space-y-3 px-8">
                <p className="text-xs font-mono uppercase tracking-[0.3em] text-white/55">
                  {reactionState === "idle"
                    ? "Ready"
                    : reactionState === "arming"
                      ? "Wait"
                      : reactionState === "ready"
                        ? "Tap Now"
                        : "Result"}
                </p>
                <p className="font-display text-3xl font-bold text-white">
                  {reactionState === "idle" && "Start the test"}
                  {reactionState === "arming" && "Hold your nerve"}
                  {reactionState === "ready" && "GO"}
                  {reactionState === "result" && `${reactionMs ?? 0} ms`}
                </p>
                {reactionState === "arming" && (
                  <p className="text-sm text-amber-200/90">Too early will reset the round.</p>
                )}
              </div>
            </button>

            <div className="mt-5 flex items-center justify-between text-sm text-white/70">
              <span>Best feel: under 250 ms</span>
              <InteractiveButton variant="pill" onClick={startReactionGame} className="px-4 py-2 text-xs">
                Restart
              </InteractiveButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="game-card group rounded-[2rem] p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.24em] text-fuchsia-300/90">Mind Vault</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-white">Guess the Code</h3>
              </div>
              <div className="game-icon-shell">
                <BrainCircuit className="h-5 w-5 text-fuchsia-200" />
              </div>
            </div>

            <p className="text-sm leading-relaxed text-white/68">
              A hidden number is waiting between 1 and 15. Crack it and the vault rolls a new one.
            </p>

            <form onSubmit={handleGuessSubmit} className="mt-8 space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-mono uppercase tracking-[0.26em] text-white/45">Vault Status</p>
                <p className="mt-3 text-lg text-white/88">{guessMessage}</p>
                <p className="mt-4 text-sm text-cyan-200">Solved rounds: {guessWins}</p>
              </div>

              <div className="flex gap-3">
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={guessInput}
                  onChange={(event) => setGuessInput(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition-colors duration-300 placeholder:text-white/30 focus:border-fuchsia-400/60"
                  placeholder="Enter 1 - 15"
                />
                <InteractiveButton type="submit" variant="primary" className="px-5 py-3">
                  Check
                </InteractiveButton>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="game-card group rounded-[2rem] p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.24em] text-amber-300/90">Arcade Duel</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-white">Rock Paper Scissors</h3>
              </div>
              <div className="game-icon-shell">
                <Swords className="h-5 w-5 text-amber-200" />
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between text-sm text-white/62">
                <span>You: {rpsScore.player}</span>
                <span>CPU: {rpsScore.cpu}</span>
              </div>
              <p className="mt-4 text-lg text-white/90">{rpsResult}</p>
              <p className="mt-2 text-sm text-white/60">
                {playerChoice && cpuChoice ? `You picked ${playerChoice}. CPU picked ${cpuChoice}.` : "Pick your first move."}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {rpsChoices.map((choice) => (
                <InteractiveButton
                  key={choice}
                  onClick={() => playRps(choice)}
                  variant="secondary"
                  className="rounded-2xl px-3 py-4 text-xs font-mono uppercase tracking-[0.18em]"
                >
                  {choice}
                </InteractiveButton>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
