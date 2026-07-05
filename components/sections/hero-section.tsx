"use client";

import { motion } from "framer-motion";
import { HeroProfile } from "@/components/hero-profile";
import { GlowButton } from "@/components/glow-button";
import { fadeUp, staggerContainer, transition } from "@/lib/motion";

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <HeroProfile />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="order-1 lg:order-2"
          >
            <motion.div variants={fadeUp} transition={transition.default} className="mb-6">
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-card text-xs font-mono tracking-widest uppercase hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105">
                <span className="status-dot w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)]" />
                <span className="text-emerald-400 font-semibold">Available</span>
                <span className="text-muted">for freelance</span>
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.02] font-display">
              <motion.span
                variants={fadeUp}
                transition={{ ...transition.default, delay: 0.05 }}
                className="block text-muted text-3xl md:text-4xl lg:text-5xl font-medium mb-2"
              >
                Hey, I&apos;m
              </motion.span>
              <motion.span
                variants={fadeUp}
                transition={{ ...transition.default, delay: 0.12 }}
                className="block text-shimmer drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]"
              >
                Sudhan.
              </motion.span>
            </h1>

            <div className="space-y-5 text-lg text-muted leading-relaxed max-w-2xl mb-10">
              <motion.p variants={fadeUp} transition={{ ...transition.default, delay: 0.18 }}>
                A <span className="text-blue-400 font-semibold drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">20-year-old developer</span> from{" "}
                <span className="text-foreground font-semibold drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">Nepal</span> crafting stunning digital
                experiences — mobile apps, websites, and AI-powered products.
              </motion.p>
            </div>

            <motion.div
              variants={fadeUp}
              transition={{ ...transition.default, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <GlowButton href="#projects">Explore My Work</GlowButton>
              <GlowButton href="#contact" variant="secondary">
                Get In Touch
              </GlowButton>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ ...transition.default, delay: 0.36 }}
              className="grid grid-cols-3 gap-6 mt-14 pt-8 border-t border-white/10"
            >
              {[
                { value: "25+", label: "Projects", gradient: "from-blue-400 to-cyan-400" },
                { value: "20+", label: "Technologies", gradient: "from-violet-400 to-purple-400" },
                { value: "100%", label: "Passion", gradient: "from-pink-400 to-rose-400" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted mt-1 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
