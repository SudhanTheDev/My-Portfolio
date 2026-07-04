"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, transition, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeUp}
      transition={{ ...transition.default, delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
