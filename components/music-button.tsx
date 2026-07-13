"use client";

import { motion } from "framer-motion";
import { Music2, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const AUDIO_SOURCE =
  process.env.NEXT_PUBLIC_BACKGROUND_AUDIO_URL || "/music/background.mp3";
const INITIAL_VOLUME = 4;

export function MusicButton() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedAudioRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hasSource, setHasSource] = useState(false);

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
      void audio.play().catch(() => setPlaying(false));
    };

    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    void audio.play().catch(() => setPlaying(false));

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
      audio.volume = INITIAL_VOLUME / 100;
      void audio.play().catch(() => setPlaying(false));
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, [ready]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !ready || !hasSource) return;

    unlockedAudioRef.current = true;
    audio.muted = false;
    audio.volume = INITIAL_VOLUME / 100;

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
    <motion.button
      type="button"
      data-cursor-ignore="true"
      onClick={() => {
        void togglePlayback();
      }}
      whileTap={{ scale: 0.94 }}
      disabled={!ready || !hasSource}
      className="music-toggle-button flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/15 bg-white/5 text-cyan-300 backdrop-blur-sm transition-[box-shadow,border-color,background,color,opacity] duration-300 hover:border-violet-400/40 hover:bg-white/12 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50"
      aria-label={playing ? "Pause music" : "Play music"}
      aria-pressed={playing}
    >
      {playing ? <Pause className="h-4 w-4" /> : <Music2 className="h-4 w-4" />}
    </motion.button>
  );
}
