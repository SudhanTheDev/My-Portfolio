"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const gamingSkills = [
  { title: "Strategic Thinking", desc: "Analyzing situations and planning moves with precision." },
  { title: "Fast Decision Making", desc: "Split-second decisions under pressure." },
  { title: "Team Leadership", desc: "Leading teams and coordinating strategies." },
  { title: "Competitive Mindset", desc: "Focus and determination in high-stakes scenarios." },
];

export function GamingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <section id="gaming" className="py-32 border-t border-border">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-4 block">
              Gaming
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 drop-shadow-[0_0_25px_rgba(147,197,253,0.5)]">
              Competitive<br />Gaming 🎮
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed mb-8">
              Competitive PUBG MOBILE player with a passion for strategy and teamwork. The skills I&apos;ve developed through gaming translate into my approach to building products—fast, decisive, and collaborative.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div>
                <div className="text-4xl font-medium text-white mb-1">Top 100</div>
                <div className="text-xs text-zinc-500 font-mono tracking-wider">REGIONAL RANK</div>
              </div>
              <div>
                <div className="text-4xl font-medium text-white mb-1">2K+</div>
                <div className="text-xs text-zinc-500 font-mono tracking-wider">HOURS PLAYED</div>
              </div>
              <div>
                <div className="text-4xl font-medium text-white mb-1">Conqueror</div>
                <div className="text-xs text-zinc-500 font-mono tracking-wider">HIGHEST TIER</div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            {gamingSkills.map((skill, index) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, x: 15 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 15 }}
                transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
                className="group relative pl-8 border-l border-border hover:border-zinc-600 transition-colors duration-500"
              >
                <div className="absolute left-0 top-0 w-2 h-2 -translate-x-[5px] rounded-full bg-zinc-800 group-hover:bg-white transition-colors duration-500" />
                <h3 className="text-lg font-medium text-white mb-2">{skill.title}</h3>
                <p className="text-sm text-zinc-500">{skill.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
