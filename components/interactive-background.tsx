"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    document.documentElement.style.setProperty("--mouse-x", "50vw");
    document.documentElement.style.setProperty("--mouse-y", "50vh");

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouseX = width / 2;
    let mouseY = height / 2;
    let animationId = 0;
    let particles: Particle[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const count = Math.min(120, Math.floor((width * height) / 12000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
      }));
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);

      const blobX = (e.clientX - width / 2) * 0.06;
      const blobY = (e.clientY - height / 2) * 0.06;
      document.documentElement.style.setProperty("--blob-x", `${blobX}px`);
      document.documentElement.style.setProperty("--blob-y", `${blobY}px`);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / 280);
        const glow = p.alpha + proximity * 0.8;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + proximity * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 210, 255, ${Math.min(glow, 1)})`;
        ctx.fill();

        if (proximity > 0.3) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(
            p.x - (dx / dist) * proximity * 30,
            p.y - (dy / dist) * proximity * 30
          );
          ctx.strokeStyle = `rgba(147, 197, 253, ${proximity * 0.35})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden>
      <div className="absolute inset-0 bg-mesh-base" />

      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="aurora aurora-3" />

      <div
        className="blob-1 absolute top-[-10%] left-[10%] w-[36rem] h-[36rem] rounded-full blur-[100px] cursor-blob"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 70%)",
          transform: "translate(calc(var(--blob-x, 0px)), calc(var(--blob-y, 0px)))",
        }}
      />
      <div
        className="blob-2 absolute top-[20%] right-[-5%] w-[32rem] h-[32rem] rounded-full blur-[100px] cursor-blob"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)",
          transform: "translate(calc(var(--blob-x, 0px) * -0.6), calc(var(--blob-y, 0px) * 0.8))",
        }}
      />
      <div
        className="blob-3 absolute bottom-[-5%] left-[30%] w-[28rem] h-[28rem] rounded-full blur-[90px] cursor-blob"
        style={{
          background: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)",
          transform: "translate(calc(var(--blob-x, 0px) * 0.4), calc(var(--blob-y, 0px) * -0.5))",
        }}
      />

      <div className="cursor-glow-core absolute inset-0" />
      <div className="cursor-glow-blue absolute inset-0" />
      <div className="cursor-glow-purple absolute inset-0" />
      <div className="cursor-glow-ring absolute inset-0" />

      <canvas ref={canvasRef} className="absolute inset-0 opacity-80" />

      <div className="grid-floor absolute inset-0" />
      <div className="absolute inset-0 noise-overlay opacity-[0.035]" />
      <div className="absolute inset-0 vignette" />
    </div>
  );
}
