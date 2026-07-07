"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

const motionProps = {
  whileHover: { scale: 1.04, y: -2 },
  whileTap: { scale: 0.96, y: 0 },
  transition: { type: "spring" as const, stiffness: 420, damping: 22 },
};

const variants = {
  primary:
    "text-white overflow-hidden bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:shadow-[0_0_55px_rgba(168,85,247,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]",
  secondary:
    "text-foreground border border-white/20 bg-white/[0.03] backdrop-blur-sm hover:border-white/40 hover:bg-white/10 hover:shadow-[0_0_28px_rgba(99,102,241,0.28),inset_0_1px_0_rgba(255,255,255,0.12)]",
  ghost:
    "text-muted hover:text-foreground border border-transparent hover:border-white/10 hover:shadow-[0_0_18px_rgba(147,197,253,0.16)]",
  pill:
    "text-sm rounded-full glass-effect hover:border-violet-400/50 hover:shadow-[0_0_24px_rgba(139,92,246,0.32)]",
  nav:
    "text-sm rounded-lg hover:bg-white/10 data-[active=true]:text-white data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-500/30 data-[active=true]:to-violet-500/30 data-[active=true]:shadow-[0_0_16px_rgba(99,102,241,0.3)]",
  icon: "p-2 rounded-lg glass-effect hover:border-violet-400/40 hover:shadow-[0_0_18px_rgba(139,92,246,0.28)]",
};

interface Spark {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
}

interface InteractiveButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof variants;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  active?: boolean;
  showArrow?: boolean;
  target?: string;
  rel?: string;
  "aria-label"?: string;
}

export function InteractiveButton({
  children,
  className,
  variant = "primary",
  href,
  onClick,
  type = "button",
  disabled,
  active,
  showArrow,
  target,
  rel,
  "aria-label": ariaLabel,
}: InteractiveButtonProps) {
  const [sparks, setSparks] = useState<Spark[]>([]);

  const classes = cn(
    "btn-interactive relative inline-flex items-center justify-center gap-2 overflow-hidden px-6 py-3 rounded-xl text-sm font-semibold transition-[box-shadow,border-color,background] duration-300",
    variants[variant],
    disabled && "opacity-50 pointer-events-none",
    className
  );

  const burst = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const next = Array.from({ length: 16 }, (_, index) => {
      const angle = (Math.PI * 2 * index) / 16 + Math.random() * 0.5;
      const distance = 30 + Math.random() * 40;
      return {
        id: Date.now() + index,
        x,
        y,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        size: 4 + Math.random() * 6,
      };
    });

    setSparks(next);
    window.setTimeout(() => setSparks([]), 1000);
  };

  const content = (
    <>
      <span className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.22),transparent_34%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      {sparks.map((spark) => (
        <motion.span
          key={spark.id}
          initial={{ x: spark.x, y: spark.y, opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            x: spark.x + spark.dx,
            y: spark.y + spark.dy,
            opacity: 0,
            scale: 0,
            rotate: 360,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pointer-events-none absolute left-0 top-0 z-20 rounded-full bg-white shadow-[0_0_20px_rgba(147,197,253,1),0_0_40px_rgba(168,85,247,0.8)]"
          style={{ width: spark.size, height: spark.size }}
        />
      ))}
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {showArrow && (
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        onPointerDown={burst}
        data-cursor={showArrow ? "Open" : undefined}
        className={cn(classes, "group")}
        {...motionProps}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      onPointerDown={burst}
      disabled={disabled}
      data-active={active}
      data-cursor={variant === "icon" ? "Tap" : undefined}
      aria-label={ariaLabel}
      className={cn(classes, "group")}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
}
