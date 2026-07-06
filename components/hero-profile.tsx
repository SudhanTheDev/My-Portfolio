"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { scaleIn, transition } from "@/lib/motion";
import { Crown, Github, Linkedin, Instagram, Mail } from "lucide-react";

const PROFILE_IMAGES = [
  { src: "/profile.jpg", position: "center 18%" },
  { src: "/profile-gallery/photo-3.jpg", position: "center 22%" },
  { src: "/profile-gallery/photo-7.jpg", position: "center 18%" },
  { src: "/profile-gallery/photo-8.jpg", position: "center 18%" },
];

export function HeroProfile() {
  const [crownHovered, setCrownHovered] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
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

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % PROFILE_IMAGES.length);
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      transition={transition.slow}
      className="relative w-full max-w-[390px] mx-auto lg:mx-0"
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

      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative overflow-visible">
        <div
          onMouseEnter={() => setCrownHovered(true)}
          onMouseLeave={() => setCrownHovered(false)}
          onFocus={() => setCrownHovered(true)}
          onBlur={() => setCrownHovered(false)}
          className="absolute left-1/2 top-0 z-[80] -translate-x-1/2 -translate-y-1/2"
        >
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [-2, 2.5, -2], scale: [1, 1.04, 1] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.08, y: -8 }}
          className="group relative profile-crown-wrap"
        >
          <button
            type="button"
            className="profile-crown flex items-center justify-center rounded-full border border-amber-300/30 bg-[#120a1f]/75 p-3 backdrop-blur-md"
            aria-label="Show Sujan crown label"
          >
            <Crown className="h-5 w-5 text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.55)]" />
          </button>
          <div
            className={`pointer-events-none absolute bottom-full left-1/2 z-[90] -translate-x-1/2 transition-all duration-200 ${
              crownHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <div className="profile-crown-label relative mb-4 rounded-full border border-white/10 bg-[#120a1f]/92 px-3 py-1 text-[0.65rem] uppercase tracking-[0.24em] text-amber-200 shadow-[0_0_25px_rgba(251,191,36,0.12)] backdrop-blur-md">
              Sujan
              <span className="profile-crown-label-line absolute left-1/2 top-full h-5 w-px -translate-x-1/2 bg-gradient-to-b from-amber-200/85 to-transparent" />
              <span className="profile-crown-label-dot absolute left-1/2 top-[calc(100%+15px)] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-amber-200/85 shadow-[0_0_10px_rgba(251,191,36,0.55)]" />
            </div>
          </div>
        </motion.div>
        </div>

        <div className="relative rounded-[2rem] p-[3px] bg-gradient-to-br from-blue-400/60 via-violet-500/50 to-fuchsia-500/40 shadow-[0_0_60px_rgba(99,102,241,0.35)]">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.85rem] bg-surface">
            <AnimatePresence mode="wait">
              <motion.div
                key={PROFILE_IMAGES[activeImage].src}
                initial={{ opacity: 0, scale: 1.12, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1.04, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={PROFILE_IMAGES[activeImage].src}
                  alt="Sudhan Bhattarai"
                  fill
                  priority={activeImage === 0}
                  sizes="(max-width: 768px) 340px, 390px"
                  className="object-cover scale-105"
                  style={{ objectPosition: PROFILE_IMAGES[activeImage].position }}
                />
              </motion.div>
            </AnimatePresence>
            <motion.div
              key={`profile-sweep-${activeImage}`}
              initial={{ opacity: 0, x: "-120%" }}
              animate={{ opacity: [0, 0.3, 0], x: ["-120%", "5%", "120%"] }}
              transition={{ duration: 1.15, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent mix-blend-screen"
            />
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

      {/* Social Media Links */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition.default, delay: 0.5 }}
        className="absolute -bottom-20 left-0 right-0 flex items-center justify-center gap-3"
      >
        <a
          href="https://github.com/Sujan-Nepal"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/10 hover:scale-110 hover:shadow-[0_0_30px_rgba(59,130,246,0.6),0_0_60px_rgba(59,130,246,0.3)] transition-all duration-300 group"
        >
          <Github className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,1)] transition-colors" />
        </a>
        <a
          href="https://www.linkedin.com/in/sudhan-bhattarai-662769392/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/10 hover:scale-110 hover:shadow-[0_0_30px_rgba(59,130,246,0.6),0_0_60px_rgba(59,130,246,0.3)] transition-all duration-300 group"
        >
          <Linkedin className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,1)] transition-colors" />
        </a>
        <a
          href="https://www.instagram.com/suzzy.3x3"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/10 hover:scale-110 hover:shadow-[0_0_30px_rgba(236,72,153,0.6),0_0_60px_rgba(236,72,153,0.3)] transition-all duration-300 group"
        >
          <Instagram className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(236,72,153,1)] transition-colors" />
        </a>
        <a
          href="mailto:sudhan.bhattarainp@gmail.com"
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/10 hover:scale-110 hover:shadow-[0_0_30px_rgba(34,211,238,0.6),0_0_60px_rgba(34,211,238,0.3)] transition-all duration-300 group"
        >
          <Mail className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,1)] transition-colors" />
        </a>
      </motion.div>
    </motion.div>
  );
}
