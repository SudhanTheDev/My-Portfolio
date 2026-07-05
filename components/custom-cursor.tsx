"use client";

import { useEffect, useRef, useState } from "react";

const STAR_COUNT = 20;

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  life: number;
  vx: number;
  vy: number;
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mouse = useRef({ x: -100, y: -100 });
  const cursor = useRef({ x: -100, y: -100 });
  const stars = useRef<Star[]>([]);
  const rafId = useRef<number>();
  const clicking = useRef(false);
  const lastStarTime = useRef(0);
  const shakeOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFinePointer || prefersReducedMotion) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
      setVisible(true);

      // Add star trail on movement
      const now = Date.now();
      if (now - lastStarTime.current > 50) {
        stars.current.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 4 + 2,
          opacity: 1,
          rotation: Math.random() * 360,
          life: 1,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
        });
        if (stars.current.length > STAR_COUNT) {
          stars.current.shift();
        }
        lastStarTime.current = now;
      }
    };

    const onDown = () => {
      clicking.current = true;
    };
    const onUp = () => {
      clicking.current = false;
      shakeOffset.current = { x: 0, y: 0 };
    };
    const onLeave = () => {
      setVisible(false);
      clicking.current = false;
    };
    const onEnter = () => setVisible(true);

    const animate = () => {
      // Real-time cursor following with shake effect when clicking
      if (clicking.current) {
        shakeOffset.current = {
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4,
        };
      } else {
        shakeOffset.current = { x: 0, y: 0 };
      }

      cursor.current.x = mouse.current.x + shakeOffset.current.x;
      cursor.current.y = mouse.current.y + shakeOffset.current.y;

      const scale = clicking.current ? 0.85 : 1;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }
      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0) translate(-50%, -50%) scale(${clicking.current ? 0.95 : 1})`;
      }

      // Continuous sparkles when clicking
      if (clicking.current) {
        const now = Date.now();
        if (now - lastStarTime.current > 30) {
          for (let i = 0; i < 3; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 20 + 10;
            stars.current.push({
              x: mouse.current.x + Math.cos(angle) * 15,
              y: mouse.current.y + Math.sin(angle) * 15,
              size: Math.random() * 5 + 3,
              opacity: 1,
              rotation: Math.random() * 360,
              life: 1,
              vx: Math.cos(angle) * distance * 0.1,
              vy: Math.sin(angle) * distance * 0.1,
            });
          }
          if (stars.current.length > STAR_COUNT) {
            stars.current.shift();
          }
          lastStarTime.current = now;
        }
      }

      // Animate stars
      stars.current.forEach((star, i) => {
        star.life -= 0.025;
        star.opacity = star.life;
        star.rotation += 3;
        star.x += star.vx;
        star.y += star.vy;

        const el = starsRef.current[i];
        if (el && star.life > 0) {
          el.style.transform = `translate3d(${star.x}px, ${star.y}px, 0) translate(-50%, -50%) rotate(${star.rotation}deg) scale(${star.life})`;
          el.style.opacity = String(star.opacity);
        }
      });

      // Remove dead stars
      stars.current = stars.current.filter(star => star.life > 0);

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden
    >
      {Array.from({ length: STAR_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            starsRef.current[i] = el;
          }}
          className="cursor-star fixed top-0 left-0"
          style={{ opacity: 0 }}
        />
      ))}

      <div
        ref={auraRef}
        className="cursor-aura fixed top-0 left-0 rounded-full"
        style={{ width: 40, height: 40 }}
      />

      <div
        ref={cursorRef}
        className="cursor-dot fixed top-0 left-0 rounded-full"
        style={{ width: 16, height: 16 }}
      />
    </div>
  );
}
