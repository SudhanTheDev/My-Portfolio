"use client";

import { useEffect, useRef, useState } from "react";

const TRAIL_COUNT = 4;

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mouse = useRef({ x: -200, y: -200 });
  const dot = useRef({ x: -200, y: -200 });
  const aura = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const trail = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -200, y: -200 }))
  );
  const rafId = useRef<number>();
  const isPressed = useRef(false);
  const isVisibleTab = useRef(true);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const largeViewport = window.innerWidth >= 1280;

    if (!isFinePointer || prefersReducedMotion || !largeViewport) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");
    document.documentElement.style.setProperty("--mouse-x", "-200px");
    document.documentElement.style.setProperty("--mouse-y", "-200px");

    const onMove = (event: MouseEvent) => {
      mouse.current = { x: event.clientX, y: event.clientY };
      document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
      setVisible(true);
    };

    const onDown = () => {
      isPressed.current = true;
    };

    const onUp = () => {
      isPressed.current = false;
    };

    const onLeave = () => {
      setVisible(false);
      isPressed.current = false;
    };

    const onEnter = () => {
      setVisible(true);
    };

    const onVisibilityChange = () => {
      isVisibleTab.current = !document.hidden;
      if (document.hidden) {
        setVisible(false);
      }
    };

    const animate = () => {
      if (!isVisibleTab.current) {
        rafId.current = requestAnimationFrame(animate);
        return;
      }

      dot.current.x += (mouse.current.x - dot.current.x) * 0.32;
      dot.current.y += (mouse.current.y - dot.current.y) * 0.32;
      aura.current.x += (mouse.current.x - aura.current.x) * 0.16;
      aura.current.y += (mouse.current.y - aura.current.y) * 0.16;
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;

      trail.current.forEach((point, index) => {
        const target =
          index === 0 ? dot.current : trail.current[index - 1];
        point.x += (target.x - point.x) * (0.22 - index * 0.018);
        point.y += (target.y - point.y) * (0.22 - index * 0.018);
      });

      const dotScale = isPressed.current ? 0.9 : 1;
      const auraScale = isPressed.current ? 0.88 : 1;
      const ringScale = isPressed.current ? 0.92 : 1;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${dot.current.x}px, ${dot.current.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;
      }

      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${aura.current.x}px, ${aura.current.y}px, 0) translate(-50%, -50%) scale(${auraScale})`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%) scale(${ringScale}) rotate(${performance.now() * 0.015}deg)`;
      }

      trailRefs.current.forEach((node, index) => {
        const point = trail.current[index];
        if (!node) return;
        const offset = index * 0.9;
        node.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%) scale(${1 - index * 0.08})`;
        node.style.opacity = `${0.55 - offset * 0.06}`;
      });

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      document.documentElement.style.removeProperty("--mouse-x");
      document.documentElement.style.removeProperty("--mouse-y");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("visibilitychange", onVisibilityChange);
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
      <div
        ref={auraRef}
        className="cursor-aura fixed top-0 left-0 rounded-full"
        style={{ width: 34, height: 34 }}
      />

      <div
        ref={ringRef}
        className="cursor-ring fixed top-0 left-0 rounded-full"
        style={{ width: 60, height: 60 }}
      />

      <div
        ref={cursorRef}
        className="cursor-dot fixed top-0 left-0 rounded-full"
        style={{ width: 12, height: 12 }}
      />

      {Array.from({ length: TRAIL_COUNT }).map((_, index) => (
        <div
          key={index}
          ref={(node) => {
            trailRefs.current[index] = node;
          }}
          className="cursor-trail-node fixed top-0 left-0 rounded-full"
          style={{
            width: index < 2 ? 8 : 6,
            height: index < 2 ? 8 : 6,
          }}
        />
      ))}
    </div>
  );
}
