"use client";

import { useEffect, useState } from "react";

const GAMES_OPEN_CLASS = "games-open";

export function useGamesPaused() {
  const [gamesPaused, setGamesPaused] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setGamesPaused(root.classList.contains(GAMES_OPEN_CLASS));

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return gamesPaused;
}
