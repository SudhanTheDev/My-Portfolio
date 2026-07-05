"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  vx: number;
  vy: number;
}

interface PlayfulShape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  type: 'circle' | 'square' | 'triangle' | 'hexagon' | 'diamond' | 'star';
  color: string;
  opacity: number;
  morphProgress: number;
  pulseSpeed: number;
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollProgressRef = useRef(0);

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
    let stars: Star[] = [];
    let shapes: PlayfulShape[] = [];

    const colors = [
      'rgba(59, 130, 246, 0.6)',
      'rgba(168, 85, 247, 0.6)',
      'rgba(236, 72, 153, 0.6)',
      'rgba(34, 211, 238, 0.6)',
      'rgba(251, 146, 60, 0.6)',
    ];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const starCount = Math.min(80, Math.floor((width * height) / 20000));
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));

      const shapeCount = Math.min(35, Math.floor((width * height) / 50000));
      shapes = Array.from({ length: shapeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 60 + 20,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
        type: ['circle', 'square', 'triangle', 'hexagon', 'diamond', 'star'][Math.floor(Math.random() * 6)] as 'circle' | 'square' | 'triangle' | 'hexagon' | 'diamond' | 'star',
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.3 + 0.1,
        morphProgress: Math.random(),
        pulseSpeed: Math.random() * 0.02 + 0.01,
      }));
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);

      const blobX = (e.clientX - width / 2) * 0.08;
      const blobY = (e.clientY - height / 2) * 0.08;
      document.documentElement.style.setProperty("--blob-x", `${blobX}px`);
      document.documentElement.style.setProperty("--blob-y", `${blobY}px`);
    };

    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgressRef.current = scrollY / maxScroll;
    };

    const drawShape = (shape: PlayfulShape, scrollProgress: number) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate((shape.rotation + scrollProgress * 360) * Math.PI / 180);
      ctx.globalAlpha = shape.opacity;

      ctx.fillStyle = shape.color;
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 2;

      const size = shape.size * (1 + scrollProgress * 0.5);
      const morph = (scrollProgress + shape.morphProgress) % 1;

      if (shape.type === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (shape.type === 'square') {
        ctx.fillRect(-size / 2, -size / 2, size, size);
      } else if (shape.type === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(size / 2, size / 2);
        ctx.lineTo(-size / 2, size / 2);
        ctx.closePath();
        ctx.fill();
      } else if (shape.type === 'hexagon') {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * 60 - 90) * Math.PI / 180;
          const r = size / 2;
          const x = r * Math.cos(angle);
          const y = r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      } else if (shape.type === 'diamond') {
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(size / 2, 0);
        ctx.lineTo(0, size / 2);
        ctx.lineTo(-size / 2, 0);
        ctx.closePath();
        ctx.fill();
      } else if (shape.type === 'star') {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 72 - 90) * Math.PI / 180;
          const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180;
          const outerR = size / 2;
          const innerR = size / 4;
          const outerX = outerR * Math.cos(angle);
          const outerY = outerR * Math.sin(angle);
          const innerX = innerR * Math.cos(innerAngle);
          const innerY = innerR * Math.sin(innerAngle);
          if (i === 0) ctx.moveTo(outerX, outerY);
          else {
            ctx.lineTo(innerX, innerY);
            ctx.lineTo(outerX, outerY);
          }
        }
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const scrollProgress = scrollProgressRef.current;

      // Draw playful shapes
      shapes.forEach((shape) => {
        // Move shapes slightly toward cursor
        const dx = mouseX - shape.x;
        const dy = mouseY - shape.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          shape.x += (dx / dist) * 0.5;
          shape.y += (dy / dist) * 0.5;
        }

        // Keep shapes in bounds
        if (shape.x < 0) shape.x = width;
        if (shape.x > width) shape.x = 0;
        if (shape.y < 0) shape.y = height;
        if (shape.y > height) shape.y = 0;

        drawShape(shape, scrollProgress);
      });

      // Draw stars
      for (const star of stars) {
        // Twinkle effect
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 0.8 || star.opacity < 0.2) {
          star.twinkleSpeed *= -1;
        }

        // Move stars
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        const dx = star.x - mouseX;
        const dy = star.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / 350);
        const glow = star.opacity + proximity * 0.4;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size + proximity * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(glow, 1)})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden>
      <div className="absolute inset-0 bg-mesh-base" />

      <div
        className="blob-1 absolute top-[-10%] left-[10%] w-[35rem] h-[35rem] rounded-full blur-[120px] cursor-blob"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
          transform: "translate(calc(var(--blob-x, 0px)), calc(var(--blob-y, 0px)))",
        }}
      />
      <div
        className="blob-2 absolute top-[20%] right-[-5%] w-[32rem] h-[32rem] rounded-full blur-[120px] cursor-blob"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)",
          transform: "translate(calc(var(--blob-x, 0px) * -0.6), calc(var(--blob-y, 0px) * 0.8))",
        }}
      />
      <div
        className="blob-3 absolute bottom-[-5%] left-[30%] w-[28rem] h-[28rem] rounded-full blur-[110px] cursor-blob"
        style={{
          background: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)",
          transform: "translate(calc(var(--blob-x, 0px) * 0.4), calc(var(--blob-y, 0px) * -0.5))",
        }}
      />

      <div className="cursor-glow-core absolute inset-0" />
      <div className="cursor-glow-blue absolute inset-0" />
      <div className="cursor-glow-purple absolute inset-0" />

      <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />

      <div className="absolute inset-0 vignette" />
    </div>
  );
}
