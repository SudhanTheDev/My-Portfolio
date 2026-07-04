"use client";

import { useEffect, useRef, useState } from "react";

const TRAIL_COUNT = 12;

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouse = useRef({ x: -100, y: -100 });
  const cursor = useRef({ x: -100, y: -100 });
  const trail = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  );
  const rafId = useRef<number>();
  const clicking = useRef(false);

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
    };

    const onDown = () => {
      clicking.current = true;
    };
    const onUp = () => {
      clicking.current = false;
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const animate = () => {
      cursor.current.x += (mouse.current.x - cursor.current.x) * 0.2;
      cursor.current.y += (mouse.current.y - cursor.current.y) * 0.2;

      const scale = clicking.current ? 0.75 : 1;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0) translate(-50%, -50%) scale(${clicking.current ? 1.12 : 1})`;
      }

      let prev = cursor.current;
      trail.current.forEach((point, i) => {
        const ease = 0.35 - i * 0.02;
        point.x += (prev.x - point.x) * ease;
        point.y += (prev.y - point.y) * ease;

        const el = trailRefs.current[i];
        if (el) {
          const size = Math.max(1.5, 5 - i * 0.35);
          const opacity = Math.max(0, 0.45 - i * 0.038);
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
          el.style.opacity = String(opacity);
          el.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`;
        }
        prev = point;
      });

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
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="cursor-trail-dot fixed top-0 left-0 rounded-full bg-white"
        />
      ))}

      <div
        ref={ringRef}
        className="cursor-outer-ring fixed top-0 left-0 rounded-full border border-white/25"
        style={{ width: 22, height: 22 }}
      />

      <div
        ref={cursorRef}
        className="cursor-dot fixed top-0 left-0 rounded-full bg-white"
        style={{ width: 6, height: 6 }}
      />
    </div>
  );
}
