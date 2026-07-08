"use client";

import { useEffect, useRef, useState } from "react";

type CursorIntent = "default" | "open" | "tap" | "type";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "[role='button']",
  "[data-cursor]",
].join(", ");

function getCursorLabel(target: HTMLElement | null) {
  if (!target) return { active: false, label: "", intent: "default" as CursorIntent };

  if (target.closest("[data-cursor-ignore='true']")) {
    return { active: false, label: "", intent: "default" as CursorIntent };
  }

  const interactiveNode = target.closest(INTERACTIVE_SELECTOR) as HTMLElement | null;
  if (!interactiveNode) {
    return { active: false, label: "", intent: "default" as CursorIntent };
  }

  const customLabel = interactiveNode.dataset.cursor?.trim();
  if (customLabel) {
    return { active: true, label: customLabel, intent: "open" as CursorIntent };
  }

  const tag = interactiveNode.tagName.toLowerCase();

  if (tag === "input" || tag === "textarea" || interactiveNode.isContentEditable) {
    return { active: true, label: "Type", intent: "type" as CursorIntent };
  }

  if (tag === "button") {
    return { active: true, label: "Tap", intent: "tap" as CursorIntent };
  }

  return { active: true, label: "Open", intent: "open" as CursorIntent };
}

function getHoverStateFromPoint(x: number, y: number) {
  const target = document.elementFromPoint(x, y) as HTMLElement | null;
  return getCursorLabel(target);
}

export function CustomCursor() {
  const TARGET_FRAME_MS = 1000 / 60;
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -200, y: -200 });
  const dot = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const label = useRef({ x: -200, y: -200 });
  const rafId = useRef<number>();
  const lastFrameRef = useRef(0);
  const isPressed = useRef(false);
  const isVisibleTab = useRef(true);
  const hoverState = useRef<{ active: boolean; label: string; intent: CursorIntent }>({
    active: false,
    label: "",
    intent: "default",
  });

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const largeViewport = window.innerWidth >= 1024;

    if (!isFinePointer || prefersReducedMotion || !largeViewport) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const refreshHoverState = () => {
      if (mouse.current.x < 0 || mouse.current.y < 0) return;
      hoverState.current = getHoverStateFromPoint(mouse.current.x, mouse.current.y);
    };

    const onMove = (event: MouseEvent) => {
      mouse.current = { x: event.clientX, y: event.clientY };
      hoverState.current = getHoverStateFromPoint(event.clientX, event.clientY);
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
      hoverState.current = { active: false, label: "", intent: "default" };
    };

    const onEnter = () => {
      setVisible(true);
      refreshHoverState();
    };

    const onScroll = () => {
      refreshHoverState();
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

      const now = performance.now();
      if (now - lastFrameRef.current < TARGET_FRAME_MS) {
        rafId.current = requestAnimationFrame(animate);
        return;
      }

      lastFrameRef.current = now;

      const hovered = hoverState.current.active;
      const isTypeIntent = hoverState.current.intent === "type";

      dot.current.x += (mouse.current.x - dot.current.x) * 0.34;
      dot.current.y += (mouse.current.y - dot.current.y) * 0.34;
      ring.current.x += (mouse.current.x - ring.current.x) * 0.2;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.2;
      label.current.x += (mouse.current.x - label.current.x) * 0.16;
      label.current.y += (mouse.current.y - label.current.y) * 0.16;

      const dotScale = hovered ? 0.45 : isPressed.current ? 0.72 : 1;
      const ringScale = hovered ? 1.35 : isPressed.current ? 0.92 : 1;
      const labelScale = hovered ? ringScale : 0.9;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${dot.current.x}px, ${dot.current.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;
        cursorRef.current.style.opacity = hovered ? "0" : "1";
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%) scale(${ringScale})`;
        ringRef.current.dataset.intent = hoverState.current.intent;
        ringRef.current.dataset.hovered = hovered ? "true" : "false";
        ringRef.current.style.opacity = isTypeIntent ? "0" : "1";
      }

      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${label.current.x}px, ${label.current.y}px, 0) translate(-50%, -50%) scale(${labelScale})`;
        labelRef.current.style.opacity = hovered && !isTypeIntent ? "1" : "0";
        labelRef.current.textContent = hoverState.current.label;
        labelRef.current.dataset.hovered = hovered ? "true" : "false";
      }

      if (caretRef.current) {
        caretRef.current.style.transform = `translate3d(${label.current.x}px, ${label.current.y}px, 0) translate(-50%, -50%)`;
        caretRef.current.style.opacity = hovered && isTypeIntent ? "1" : "0";
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
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
        ref={ringRef}
        className="cursor-ring fixed top-0 left-0 rounded-full"
        data-hovered="false"
        data-intent="default"
        style={{ width: 28, height: 28 }}
      />

      <div
        ref={cursorRef}
        className="cursor-dot fixed top-0 left-0 rounded-full"
        style={{ width: 8, height: 8 }}
      />

      <div ref={labelRef} className="cursor-label fixed top-0 left-0">
        Open
      </div>

      <div ref={caretRef} className="cursor-type-glyph fixed top-0 left-0" aria-hidden>
        <span className="cursor-type-cap cursor-type-cap-top" />
        <span className="cursor-type-stem" />
        <span className="cursor-type-cap cursor-type-cap-bottom" />
      </div>
    </div>
  );
}
