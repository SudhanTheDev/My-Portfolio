"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

const motionProps = {
  whileHover: { scale: 1.04, y: -2 },
  whileTap: { scale: 0.96, y: 0 },
  transition: { type: "spring" as const, stiffness: 420, damping: 22 },
};

const variants = {
  primary:
    "text-white overflow-hidden bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)]",
  secondary:
    "text-foreground border border-white/20 backdrop-blur-sm hover:border-white/40 hover:bg-white/8 hover:shadow-[0_0_24px_rgba(99,102,241,0.2)]",
  ghost:
    "text-muted hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10",
  pill:
    "text-sm rounded-full glass-effect hover:border-violet-400/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.25)]",
  nav:
    "text-sm rounded-lg hover:bg-white/8 data-[active=true]:text-white data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-500/30 data-[active=true]:to-violet-500/30 data-[active=true]:shadow-[0_0_16px_rgba(99,102,241,0.3)]",
  icon: "p-2 rounded-lg glass-effect hover:border-violet-400/30 hover:shadow-[0_0_16px_rgba(139,92,246,0.2)]",
};

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
  const classes = cn(
    "btn-interactive relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-[box-shadow,border-color,background] duration-300",
    variants[variant],
    disabled && "opacity-50 pointer-events-none",
    className
  );

  const content = (
    <>
      {variant === "primary" && (
        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      )}
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
      disabled={disabled}
      data-active={active}
      aria-label={ariaLabel}
      className={cn(classes, "group")}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
}
