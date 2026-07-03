"use client";

import { useEffect, useState } from "react";

export function InteractiveBackground() {
  const [scrollY, setScrollY] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-black" />

      {/* Animated blobs that respond to scroll */}
      <div
        className="blob-1 absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />

      <div
        className="blob-2 absolute top-1/3 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        style={{
          transform: `translate(${-scrollY * 0.2}px, ${scrollY * 0.5}px)`,
        }}
      />

      <div
        className="blob-3 absolute bottom-0 left-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl"
        style={{
          transform: `translateY(${-scrollY * 0.4}px)`,
        }}
      />

      {/* Grid overlay that scrolls */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          transform: `translateY(${scrollY * 0.2}px)`,
        }}
      />

      {/* Animated lines */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />
    </div>
  );
}
