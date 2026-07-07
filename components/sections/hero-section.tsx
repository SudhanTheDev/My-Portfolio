"use client";

import { motion } from "framer-motion";
import { HeroProfile } from "@/components/hero-profile";
import { GlowButton } from "@/components/glow-button";

const repeatViewport = { once: true, amount: 0.35 } as const;

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-x-hidden overflow-y-visible"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={repeatViewport}
            transition={{ duration: 0.6 }}
            className="order-2 flex justify-center lg:order-1 lg:justify-start"
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
                className="inline-flex items-center gap-2.5 rounded-full glass-card px-5 py-2.5 text-xs font-mono uppercase tracking-widest transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
              >
                <span className="status-dot h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)]" />
                <span className="font-semibold text-emerald-400">Available</span>
                <span className="text-white/72">for freelance ðŸ‘‹</span>
              </motion.a>
            </motion.div>

            <h1 className="mb-8 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-8xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={repeatViewport}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mb-2 block text-3xl font-medium text-white/72 drop-shadow-[0_0_15px_rgba(147,197,253,0.4)] md:text-4xl lg:text-5xl"
              >
                Hey, I&apos;m
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={repeatViewport}
                transition={{ duration: 0.5, delay: 0.32 }}
                className="block"
              >
                <span className="brand-logo-glow relative inline-block overflow-visible leading-[0.88]">
                  <span
                    className="brand-logo-halo absolute inset-[-0.16em] rounded-full opacity-90 blur-2xl"
                    aria-hidden
                  />
                  <span
                    className="brand-logo-aura absolute inset-0 select-none bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent blur-lg opacity-70"
                    aria-hidden
                  >
                    Sudhan
                  </span>
                  <span className="brand-logo-text relative inline-block bg-gradient-to-r from-white via-blue-200 to-violet-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                    Sudhan
                  </span>
                </span>
              </motion.span>
            </h1>

            <div className="mb-10 max-w-2xl space-y-5 text-lg leading-relaxed text-white/78">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={repeatViewport}
                transition={{ duration: 0.5, delay: 0.38 }}
              >
                A{" "}
                <span className="font-semibold text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                  20-year-old developer
                </span>{" "}
                from{" "}
                <span className="font-semibold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Nepal
                </span>{" "}
                ðŸ‡³ðŸ‡µ passionate about crafting{" "}
                <span className="font-medium text-cyan-300">immersive websites ðŸŒ</span>,{" "}
                <span className="font-medium text-fuchsia-300">powerful mobile applications ðŸ“±</span>, and{" "}
                <span className="font-medium text-amber-300">AI-driven experiences ðŸ¤–</span>.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={repeatViewport}
                transition={{ duration: 0.5, delay: 0.44 }}
              >
                I combine <span className="font-medium text-pink-300">creativity âœ¨</span>,{" "}
                <span className="font-medium text-yellow-300">modern technologies âš¡</span>, and{" "}
                <span className="font-medium text-violet-300">thoughtful design ðŸŽ¨</span> to build digital products that are{" "}
                <span className="font-medium text-cyan-300">fast</span>,{" "}
                <span className="font-medium text-white">interactive</span>, and{" "}
                <span className="font-medium text-emerald-300">memorable</span> â€” always learning ðŸ“š, always creating ðŸš€.
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
              className="mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-8"
            >
              {[
                { value: "25+", label: "Projects", gradient: "from-blue-400 to-cyan-400" },
                { value: "20+", label: "Technologies", gradient: "from-violet-400 to-purple-400" },
                { value: "100%", label: "Passion", gradient: "from-pink-400 to-rose-400" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
                  <div className={`bg-gradient-to-r ${stat.gradient} bg-clip-text text-2xl font-bold text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-white/62">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
