"use client";

import { motion } from "framer-motion";
import { HeroProfile } from "@/components/hero-profile";
import { GlowButton } from "@/components/glow-button";

const repeatViewport = { once: false, amount: 0.35 } as const;

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-x-hidden overflow-y-visible"
    >
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={repeatViewport}
            transition={{ duration: 0.6 }}
            className="flex justify-center lg:justify-start order-2 lg:order-1"
          >
            <HeroProfile />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={repeatViewport}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={repeatViewport}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <motion.a
                href="#contact"
                animate={{
                  y: [0, -10, -4, -12, 0],
                  x: [0, 6, -4, 5, 0],
                  rotate: [0, 1.2, -0.8, 1, 0],
                  boxShadow: [
                    "0 0 0 rgba(16,185,129,0)",
                    "0 0 24px rgba(16,185,129,0.16)",
                    "0 0 16px rgba(59,130,246,0.14)",
                    "0 0 28px rgba(168,85,247,0.18)",
                    "0 0 0 rgba(16,185,129,0)",
                  ],
                }}
                transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.06, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-card text-xs font-mono tracking-widest uppercase hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
              >
                <span className="status-dot w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)]" />
                <span className="text-emerald-400 font-semibold">Available</span>
                <span className="text-white/72">for freelance 👋</span>
              </motion.a>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.02] font-display">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={repeatViewport}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="block text-white/72 text-3xl md:text-4xl lg:text-5xl font-medium mb-2 drop-shadow-[0_0_15px_rgba(147,197,253,0.4)]"
              >
                Hey, I&apos;m
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={repeatViewport}
                transition={{ duration: 0.5, delay: 0.32 }}
                className="block text-shimmer drop-shadow-[0_0_40px_rgba(168,85,247,0.7)]"
              >
                Sudhan.
              </motion.span>
            </h1>

            <div className="space-y-5 text-lg text-white/78 leading-relaxed max-w-2xl mb-10">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={repeatViewport}
                transition={{ duration: 0.5, delay: 0.38 }}
              >
                A{" "}
                <span className="text-blue-400 font-semibold drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                  20-year-old developer
                </span>{" "}
                from{" "}
                <span className="text-white font-semibold drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Nepal
                </span>{" "}
                🇳🇵 passionate about crafting{" "}
                <span className="text-cyan-300 font-medium">immersive websites 🌐</span>,{" "}
                <span className="text-fuchsia-300 font-medium">
                  powerful mobile applications 📱
                </span>
                , and{" "}
                <span className="text-amber-300 font-medium">
                  AI-driven experiences 🤖
                </span>
                .
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={repeatViewport}
                transition={{ duration: 0.5, delay: 0.44 }}
              >
                I combine{" "}
                <span className="text-pink-300 font-medium">creativity ✨</span>,{" "}
                <span className="text-yellow-300 font-medium">
                  modern technologies ⚡
                </span>
                , and{" "}
                <span className="text-violet-300 font-medium">
                  thoughtful design 🎨
                </span>{" "}
                to build digital products that are{" "}
                <span className="text-cyan-300 font-medium">fast</span>,{" "}
                <span className="text-white font-medium">interactive</span>, and{" "}
                <span className="text-emerald-300 font-medium">memorable</span> —
                always learning 📚, always creating 🚀.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={repeatViewport}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <GlowButton href="#projects">Explore My Work</GlowButton>
              <GlowButton href="#contact" variant="secondary" className="hero-contact-rgb">
                Get In Touch
              </GlowButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={repeatViewport}
              transition={{ duration: 0.5, delay: 0.56 }}
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
                  <div className="text-xs text-white/62 mt-1 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
