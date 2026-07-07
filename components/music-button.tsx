"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Music2, Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const AUDIO_SOURCE =
  process.env.NEXT_PUBLIC_BACKGROUND_AUDIO_URL || "/music/background.mp3";
const INITIAL_VOLUME = 55;

export function MusicButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedAudioRef = useRef(false);

  const [expanded, setExpanded] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(INITIAL_VOLUME);
  const [hasSource, setHasSource] = useState(false);

  const isOpen = expanded || pinned;

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.preload = "metadata";
    audio.loop = true;
    audio.volume = INITIAL_VOLUME / 100;
    audio.muted = true;

    const source = AUDIO_SOURCE.trim();
    setHasSource(Boolean(source));

    if (!source) {
      return () => {
        audio.pause();
        audioRef.current = null;
      };
    }

    audio.src = source;

    const onCanPlay = () => setReady(true);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      audio.currentTime = 0;
      void audio.play().catch(() => {
        setPlaying(false);
      });
    };

    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    void audio.play().catch(() => {
      setPlaying(false);
    });

    return () => {
      audio.pause();
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = null;
    navigator.mediaSession.playbackState = playing ? "playing" : "paused";
    navigator.mediaSession.setActionHandler("play", () => {
      void audioRef.current?.play();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      audioRef.current?.pause();
    });

    return () => {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
    };
  }, [playing]);

  useEffect(() => {
    if (!ready || unlockedAudioRef.current || !audioRef.current) return;

    const unlockAudio = () => {
      const audio = audioRef.current;
      if (!audio || unlockedAudioRef.current) return;

      unlockedAudioRef.current = true;
      audio.muted = false;
      audio.volume = volume / 100;
      void audio.play().catch(() => {
        setPlaying(false);
      });
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, [ready, volume]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setPinned(false);
        setExpanded(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !ready || !hasSource) return;

    unlockedAudioRef.current = true;
    audio.muted = false;

    if (playing) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch {
      setPlaying(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => {
        if (!pinned) setExpanded(false);
      }}
    >
      <motion.div
        animate={{
          width: isOpen ? 164 : 42,
          borderColor: isOpen ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.15)",
          boxShadow: isOpen
            ? "0 0 24px rgba(59,130,246,0.18)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ type: "spring", stiffness: 180, damping: 28, mass: 0.95 }}
        className="music-toggle-shell flex h-[42px] items-center overflow-hidden rounded-full border bg-white/5 pr-2 backdrop-blur-sm"
      >
        <motion.button
          type="button"
          onClick={() => {
            setPinned((value) => !value);
            setExpanded(true);
          }}
          whileTap={{ scale: 0.95 }}
          className="music-toggle-button flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-cyan-300 transition-[box-shadow,border-color,background,color] duration-300 hover:border-violet-400/40 hover:bg-white/12 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          aria-label="Toggle music controls"
        >
          <Music2 className="h-4 w-4" />
        </motion.button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="flex min-w-0 flex-1 items-center justify-end gap-2 pl-2"
            >
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    void togglePlayback();
                  }}
                  disabled={!ready || !hasSource}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/85 transition-colors duration-300 hover:bg-white/12 disabled:opacity-50"
                  aria-label={playing ? "Pause music" : "Play music"}
                >
                  {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="ml-0.5 h-3.5 w-3.5" />}
                </button>

                <div className="flex items-center gap-2">
                  <Volume2 className="h-3.5 w-3.5 text-white/50" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(event) => setVolume(Number(event.target.value))}
                    className="music-volume w-12 accent-cyan-400"
                    aria-label="Music volume"
                    disabled={!hasSource}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
