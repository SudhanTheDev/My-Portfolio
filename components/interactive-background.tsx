"use client";

import { useEffect, useRef, useState } from "react";

interface DustParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkle: number;
  drift: number;
  phase: number;
  depth: number;
  orbitX: number;
  orbitY: number;
  orbitSpeed: number;
  color: string;
  kind: "dot" | "star";
}

interface FloatingGlyph {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  driftX: number;
  driftY: number;
  phase: number;
  alpha: number;
  kind: "diamond" | "triangle" | "ring" | "star" | "cross";
  color: string;
}

interface RenderedParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  color: string;
  kind: "dot" | "star";
  glow: number;
}

type EffectsMode = "full" | "balanced" | "light";
const TARGET_FRAME_MS = 1000 / 60;

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollProgressRef = useRef(0);
  const scrollDirectionRef = useRef(1);
  const scrollEnergyRef = useRef(0);
  const mouseRef = useRef({ x: -320, y: -320, active: false });
  const [lightMode, setLightMode] = useState(false);
  const [effectsMode, setEffectsMode] = useState<EffectsMode>("full");

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => setLightMode(root.classList.contains("light-mode"));

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");

    const syncEffectsMode = () => {
      if (reducedMotionQuery.matches) {
        setEffectsMode("light");
        return;
      }

      const lowPowerDevice =
        coarsePointerQuery.matches ||
        window.innerWidth < 900 ||
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

      setEffectsMode(lowPowerDevice ? "balanced" : "full");
    };

    syncEffectsMode();
    window.addEventListener("resize", syncEffectsMode);
    reducedMotionQuery.addEventListener("change", syncEffectsMode);
    coarsePointerQuery.addEventListener("change", syncEffectsMode);

    return () => {
      window.removeEventListener("resize", syncEffectsMode);
      reducedMotionQuery.removeEventListener("change", syncEffectsMode);
      coarsePointerQuery.removeEventListener("change", syncEffectsMode);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animationId = 0;
    let lastFrameTime = 0;
    let lastScrollY = window.scrollY;
    let isDocumentVisible = !document.hidden;
    let particles: DustParticle[] = [];
    let glyphs: FloatingGlyph[] = [];
    let pausedAt: number | null = null;
    let pausedDuration = 0;

    const isLightEffects = effectsMode === "light";
    const isBalancedEffects = effectsMode === "balanced";
    const supportsMouseEffects = effectsMode === "full";

    const glyphColors = [
      "rgba(96, 165, 250, 0.24)",
      "rgba(168, 85, 247, 0.22)",
      "rgba(244, 114, 182, 0.18)",
      "rgba(45, 212, 191, 0.16)",
    ];
    const particleColors = [
      "96, 165, 250",
      "168, 85, 247",
      "244, 114, 182",
      "45, 212, 191",
      "251, 191, 36",
      "129, 140, 248",
    ];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(
        window.devicePixelRatio || 1,
        isLightEffects ? 1 : lightMode || isBalancedEffects ? 1.1 : 1.35
      );

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const particleCount = isLightEffects
        ? Math.min(44, Math.floor((width * height) / 32000))
        : lightMode || isBalancedEffects
          ? Math.min(84, Math.floor((width * height) / 22000))
          : Math.min(132, Math.floor((width * height) / 15000));
      const glyphCount = isLightEffects
        ? 0
        : lightMode || isBalancedEffects
          ? Math.min(6, Math.floor((width * height) / 160000))
          : Math.min(12, Math.floor((width * height) / 98000));

      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.36 + 0.18,
        twinkle: Math.random() * 0.9 + 0.3,
        drift: Math.random() * 22 + 8,
        phase: Math.random() * Math.PI * 2,
        depth: Math.random() * 1.4 + 0.4,
        orbitX: Math.random() * 30 + 8,
        orbitY: Math.random() * 24 + 6,
        orbitSpeed: Math.random() * 0.0016 + 0.0005,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        kind: Math.random() > 0.82 ? "star" : "dot",
      }));

      glyphs = Array.from({ length: glyphCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 40 + 18,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.007,
        driftX: Math.random() * 75 + 18,
        driftY: Math.random() * 60 + 16,
        phase: Math.random() * Math.PI * 2,
        alpha: Math.random() * 0.12 + 0.06,
        kind: ["diamond", "triangle", "ring", "star", "cross"][
          Math.floor(Math.random() * 5)
        ] as FloatingGlyph["kind"],
        color: glyphColors[Math.floor(Math.random() * glyphColors.length)],
      }));
    };

    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const delta = scrollY - lastScrollY;

      scrollProgressRef.current = maxScroll > 0 ? scrollY / maxScroll : 0;
      if (delta !== 0) {
        scrollDirectionRef.current = delta > 0 ? 1 : -1;
        scrollEnergyRef.current = Math.min(1, Math.abs(delta) / 120 + scrollEnergyRef.current * 0.35);
      }

      lastScrollY = scrollY;
    };

    const onMouseMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY, active: true };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -320, y: -320, active: false };
    };

    const onVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
      if (!isDocumentVisible) {
        mouseRef.current = { x: -320, y: -320, active: false };
      }
    };

    const drawGlyph = (glyph: FloatingGlyph, time: number, scrollProgress: number) => {
      const driftX = Math.sin(time * 0.00038 + glyph.phase) * glyph.driftX;
      const driftY =
        Math.cos(time * 0.00029 + glyph.phase) * glyph.driftY -
        scrollDirectionRef.current * scrollEnergyRef.current * 24;
      const x = glyph.x + driftX;
      const y =
        ((glyph.y + driftY - scrollProgress * 100) % (height + 120) + (height + 120)) %
          (height + 120) -
        60;
      const size = glyph.size * (1 + Math.sin(time * 0.0014 + glyph.phase) * 0.06);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(glyph.rotation + time * glyph.rotationSpeed);
      ctx.globalAlpha = glyph.alpha;
      ctx.strokeStyle = glyph.color;
      ctx.fillStyle = glyph.color;
      ctx.lineWidth = 1.1;
      ctx.shadowColor = glyph.color;
      ctx.shadowBlur = isBalancedEffects ? 16 : 22;

      if (glyph.kind === "diamond") {
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(size / 2, 0);
        ctx.lineTo(0, size / 2);
        ctx.lineTo(-size / 2, 0);
        ctx.closePath();
        ctx.stroke();
      } else if (glyph.kind === "triangle") {
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(size / 2, size / 2);
        ctx.lineTo(-size / 2, size / 2);
        ctx.closePath();
        ctx.stroke();
      } else if (glyph.kind === "star") {
        ctx.beginPath();
        for (let i = 0; i < 5; i += 1) {
          const outerAngle = (i * Math.PI * 2) / 5 - Math.PI / 2;
          const innerAngle = outerAngle + Math.PI / 5;
          const outerX = Math.cos(outerAngle) * (size / 2);
          const outerY = Math.sin(outerAngle) * (size / 2);
          const innerX = Math.cos(innerAngle) * (size * 0.22);
          const innerY = Math.sin(innerAngle) * (size * 0.22);

          if (i === 0) ctx.moveTo(outerX, outerY);
          else ctx.lineTo(outerX, outerY);

          ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        ctx.stroke();
      } else if (glyph.kind === "cross") {
        ctx.beginPath();
        ctx.moveTo(-size / 2, 0);
        ctx.lineTo(size / 2, 0);
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(0, size / 2);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawStar = (x: number, y: number, size: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgba(${color}, ${alpha})`;
      ctx.shadowColor = `rgba(${color}, 0.7)`;
      ctx.shadowBlur = isBalancedEffects ? 10 : 14;
      ctx.beginPath();
      for (let i = 0; i < 5; i += 1) {
        const outerAngle = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const innerAngle = outerAngle + Math.PI / 5;
        const outerX = Math.cos(outerAngle) * size;
        const outerY = Math.sin(outerAngle) * size;
        const innerX = Math.cos(innerAngle) * size * 0.45;
        const innerY = Math.sin(innerAngle) * size * 0.45;

        if (i === 0) ctx.moveTo(outerX, outerY);
        else ctx.lineTo(outerX, outerY);

        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const renderParticles = (time: number, scrollProgress: number) => {
      const { x: mouseX, y: mouseY, active } = mouseRef.current;
      const rendered: RenderedParticle[] = [];

      for (const particle of particles) {
        const orbitX =
          Math.sin(time * particle.orbitSpeed * particle.twinkle + particle.phase) *
          (particle.drift + particle.orbitX);
        const orbitY =
          Math.cos(time * particle.orbitSpeed * 1.35 + particle.phase) *
          (particle.drift + particle.orbitY);
        const scrollShift = scrollDirectionRef.current * scrollEnergyRef.current * particle.depth * 16;
        let x = particle.x + orbitX;
        let y = particle.y + orbitY - scrollProgress * particle.depth * 28 - scrollShift;

        if (y < -24) y += height + 48;
        if (y > height + 24) y -= height + 48;

        let pullX = 0;
        let pullY = 0;
        let lineAlpha = 0;

        if (active && supportsMouseEffects) {
          const dx = mouseX - x;
          const dy = mouseY - y;
          const distance = Math.hypot(dx, dy);
          const mouseInfluenceRadius = lightMode ? 150 : 220;

          if (distance < mouseInfluenceRadius) {
            const influence = 1 - distance / mouseInfluenceRadius;
            pullX = dx * influence * 0.18;
            pullY = dy * influence * 0.18;
            lineAlpha = influence * 0.24;
          }
        }

        x += pullX;
        y += pullY;

        const alpha =
          particle.alpha +
          Math.sin(time * 0.0018 * particle.twinkle + particle.phase) * 0.14 +
          lineAlpha * 0.7;
        const glow = lightMode || isBalancedEffects ? 1.15 : 1;

        rendered.push({
          x,
          y,
          size: particle.size,
          alpha: Math.max(0.08, alpha),
          color: particle.color,
          kind: particle.kind,
          glow,
        });
      }

      return rendered;
    };

    const drawParticleWeb = (rendered: RenderedParticle[]) => {
      if (isLightEffects) return;

      const { x: mouseX, y: mouseY, active } = mouseRef.current;

      ctx.save();
      ctx.lineWidth = 0.6;
      const neighborWindow = lightMode || isBalancedEffects ? 3 : 6;
      const connectionDistance = lightMode || isBalancedEffects ? 54 : 76;
      const mouseConnectionDistance = supportsMouseEffects ? 180 : 0;

      for (let i = 0; i < rendered.length; i += 1) {
        const source = rendered[i];

        for (let j = i + 1; j < Math.min(rendered.length, i + neighborWindow); j += 1) {
          const target = rendered[j];
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const distance = Math.hypot(dx, dy);

          if (distance < connectionDistance) {
            const alpha = (1 - distance / connectionDistance) * (lightMode ? 0.12 : 0.2);
            ctx.strokeStyle = `rgba(${source.color}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(source.x, source.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
          }
        }

        if (active && mouseConnectionDistance > 0) {
          const mouseDistance = Math.hypot(mouseX - source.x, mouseY - source.y);
          if (mouseDistance < mouseConnectionDistance) {
            const alpha = (1 - mouseDistance / mouseConnectionDistance) * 0.32;
            ctx.strokeStyle = `rgba(${source.color}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(source.x, source.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
          }
        }
      }

      ctx.restore();
    };

    const drawParticles = (rendered: RenderedParticle[]) => {
      for (const particle of rendered) {
        if (particle.kind === "star") {
          drawStar(particle.x, particle.y, particle.size * 1.6, particle.color, particle.alpha);
          continue;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particle.color}, ${particle.alpha})`;
        ctx.shadowColor = `rgba(${particle.color}, ${lightMode ? 0.76 : 0.56})`;
        ctx.shadowBlur = 10 * particle.glow;
        ctx.fill();
      }
    };

    const drawMouseBloom = (time: number) => {
      if (!supportsMouseEffects) return;

      const { x: mouseX, y: mouseY, active } = mouseRef.current;
      if (!active) return;

      const pulse = 0.65 + Math.sin(time * 0.008) * 0.18;

      ctx.save();

      const core = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, lightMode ? 48 : 64);
      core.addColorStop(0, "rgba(255,255,255,0.9)");
      core.addColorStop(0.18, "rgba(147,197,253,0.45)");
      core.addColorStop(0.42, "rgba(168,85,247,0.2)");
      core.addColorStop(1, "rgba(168,85,247,0)");
      ctx.fillStyle = core;
      ctx.globalAlpha = lightMode ? pulse * 0.55 : pulse * 0.85;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, lightMode ? 48 : 64, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(191, 219, 254, 0.2)";
      ctx.shadowColor = "rgba(125, 211, 252, 0.4)";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 24 + Math.sin(time * 0.006) * 3, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    };

    const draw = (time: number) => {
      if (!isDocumentVisible) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      if (pausedAt !== null) {
        pausedDuration += time - pausedAt;
        pausedAt = null;
      }

      const effectiveTime = time - pausedDuration;

      if (effectiveTime - lastFrameTime < TARGET_FRAME_MS) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      lastFrameTime = effectiveTime;

      ctx.clearRect(0, 0, width, height);

      const scrollProgress = scrollProgressRef.current;
      scrollEnergyRef.current *= 0.95;
      const renderedParticles = renderParticles(effectiveTime, scrollProgress);

      if (glyphs.length > 0) {
        glyphs.forEach((glyph) => drawGlyph(glyph, effectiveTime, scrollProgress));
      }
      drawParticleWeb(renderedParticles);
      drawMouseBloom(effectiveTime);
      drawParticles(renderedParticles);

      animationId = requestAnimationFrame(draw);
    };

    resize();
    onScroll();
    draw(0);

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    if (supportsMouseEffects) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("mouseleave", onMouseLeave);
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      if (supportsMouseEffects) {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseleave", onMouseLeave);
      }
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [effectsMode, lightMode]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden -z-10 ${
        lightMode ? "light-theme-canvas" : ""
      }`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-mesh-base" />

      {lightMode ? <div className="absolute inset-0 light-theme-wash" /> : null}
      {lightMode && effectsMode !== "light" ? (
        <div className="absolute inset-0 light-theme-colorwave" />
      ) : null}

      <div
        className="absolute inset-0"
        style={{
          background: lightMode
            ? "radial-gradient(circle at 10% 12%, rgba(59,130,246,0.24), transparent 26%), radial-gradient(circle at 84% 18%, rgba(168,85,247,0.22), transparent 24%), radial-gradient(circle at 46% 82%, rgba(244,114,182,0.18), transparent 28%), radial-gradient(circle at 64% 36%, rgba(45,212,191,0.14), transparent 18%)"
            : "radial-gradient(circle at 12% 10%,rgba(59,130,246,0.22),transparent 32%),radial-gradient(circle at 86% 22%,rgba(168,85,247,0.18),transparent 28%),radial-gradient(circle at 48% 78%,rgba(244,114,182,0.14),transparent 30%)",
        }}
      />

      {effectsMode !== "light" ? (
        <div
          className="absolute inset-0 mix-blend-screen"
          style={{
            opacity: lightMode ? 0.82 : 0.8,
            background: `
              radial-gradient(${lightMode ? "220px" : "260px"} circle at var(--mouse-x, -320px) var(--mouse-y, -320px), ${lightMode ? "rgba(59,130,246,0.18)" : "rgba(96,165,250,0.18)"} 0%, ${lightMode ? "rgba(59,130,246,0.08)" : "rgba(96,165,250,0.08)"} 34%, transparent 68%),
              radial-gradient(${lightMode ? "380px" : "520px"} circle at var(--mouse-x, -320px) var(--mouse-y, -320px), ${lightMode ? "rgba(168,85,247,0.1)" : "rgba(168,85,247,0.12)"} 0%, ${lightMode ? "rgba(236,72,153,0.05)" : "rgba(236,72,153,0.06)"} 38%, transparent 72%)
            `,
          }}
        />
      ) : null}

      {!lightMode && effectsMode === "full" ? (
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.6,
            background:
              "conic-gradient(from 0deg at var(--mouse-x, -320px) var(--mouse-y, -320px), rgba(59,130,246,0.1), rgba(168,85,247,0.06), rgba(45,212,191,0.08), rgba(59,130,246,0.1))",
            maskImage:
              "radial-gradient(280px circle at var(--mouse-x, -320px) var(--mouse-y, -320px), rgba(0,0,0,0.9) 0%, transparent 74%)",
            WebkitMaskImage:
              "radial-gradient(280px circle at var(--mouse-x, -320px) var(--mouse-y, -320px), rgba(0,0,0,0.9) 0%, transparent 74%)",
          }}
        />
      ) : null}

      <canvas ref={canvasRef} className={`absolute inset-0 ${lightMode ? "opacity-100" : "opacity-95"}`} />

      <div className="absolute inset-0 vignette" />
    </div>
  );
}
