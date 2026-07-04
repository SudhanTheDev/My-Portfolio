"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { scaleIn, transition } from "@/lib/motion";

const PROFILE_IMAGE = "/profile.jpg";

export function HeroProfile() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 18 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), springConfig);
  const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-16, 16]), springConfig);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      transition={transition.slow}
      className="relative w-full max-w-[340px] mx-auto lg:mx-0"
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="absolute -inset-6 rounded-[2.5rem] opacity-80"
        style={{
          x: glowX,
          y: glowY,
          background: "radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(168,85,247,0.2) 40%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />

      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative">
        <div className="relative rounded-[2rem] p-[3px] bg-gradient-to-br from-blue-400/60 via-violet-500/50 to-fuchsia-500/40 shadow-[0_0_60px_rgba(99,102,241,0.35)]">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.85rem] bg-surface">
            <Image
              src={PROFILE_IMAGE}
              alt="Sudhan Bhattarai"
              fill
              priority
              sizes="(max-width: 768px) 300px, 340px"
              className="object-cover object-[center_18%] scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030014]/80 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-violet-500/10 mix-blend-overlay" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[1.85rem]" />
          </div>
        </div>

        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-2 rounded-[2.1rem] border border-violet-400/30 pointer-events-none"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition.default, delay: 0.45 }}
        className="absolute -bottom-5 left-4 px-5 py-2.5 glass-card rounded-xl text-xs font-bold tracking-[0.2em] uppercase text-foreground"
      >
        <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
          Creative Developer
        </span>
      </motion.div>
    </motion.div>
  );
}
