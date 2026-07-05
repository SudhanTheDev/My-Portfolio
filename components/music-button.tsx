"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Music2, Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT?: {
      PlayerState?: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
      };
      Player: new (
        element: HTMLElement,
        options: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
          };
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  destroy: () => void;
}

const VIDEO_ID = "8GW6sLrK40k";

export function MusicButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  const [expanded, setExpanded] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(55);

  const isOpen = expanded || pinned;
  useEffect(() => {
    const mountPlayer = () => {
      if (!window.YT?.Player || !playerHostRef.current || playerRef.current) return;

      playerRef.current = new window.YT.Player(playerHostRef.current, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          loop: 1,
          playlist: VIDEO_ID,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(volume);
            event.target.playVideo();
            event.target.unMute();
            setReady(true);
            setPlaying(true);
          },
          onStateChange: (event) => {
            const playerState = window.YT?.PlayerState;
            if (!playerState) return;
            setPlaying(event.data === playerState.PLAYING);
            if (event.data === playerState.ENDED) {
              event.target.playVideo();
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      mountPlayer();
    } else {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        mountPlayer();
      };

      const existing = document.querySelector('script[data-yt-api="true"]');
      if (!existing) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        script.dataset.ytApi = "true";
        document.body.appendChild(script);
      }
    }

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!playerRef.current || !ready) return;
    playerRef.current.setVolume(volume);
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

  const togglePlayback = () => {
    if (!playerRef.current || !ready) return;
    playerRef.current.unMute();
    if (playing) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
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
      <div ref={playerHostRef} className="absolute h-px w-px overflow-hidden opacity-0 pointer-events-none" />

      <motion.div
        animate={{
          width: isOpen ? 164 : 42,
          borderColor: isOpen ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.15)",
          boxShadow: isOpen
            ? "0 0 24px rgba(59,130,246,0.18)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ type: "spring", stiffness: 180, damping: 28, mass: 0.95 }}
        className="flex h-[42px] items-center overflow-hidden rounded-full border bg-white/5 pr-2 backdrop-blur-sm"
      >
        <motion.button
          type="button"
          onClick={() => {
            setPinned((value) => !value);
            setExpanded(true);
          }}
          whileTap={{ scale: 0.95 }}
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-white/8 text-cyan-300 transition-colors duration-300 hover:bg-white/12"
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
                  onClick={togglePlayback}
                  disabled={!ready}
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
