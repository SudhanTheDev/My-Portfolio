"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const interests = [
  "Anime", "Technology", "AI", "Photography",
  "Travel", "Nature", "Remote Places", "Cinematic Stories",
  "Creative Design", "Innovation",
];

export function PersonalitySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <section id="personality" className="py-32 border-t border-border">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-4 block">
            /Beyond Coding
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight drop-shadow-[0_0_25px_rgba(147,197,253,0.5)]">
            Interests 🌟
          </h2>
        </motion.div>

        {/* Interest Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap gap-4 mb-20"
        >
          {interests.map((interest, index) => (
            <motion.span
              key={interest}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.3, delay: 0.05 + index * 0.03 }}
              className="px-6 py-3 border border-border text-sm text-zinc-400 hover:border-zinc-600 hover:text-white transition-all duration-300 cursor-default"
            >
              {interest}
            </motion.span>
          ))}
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-3xl"
        >
          <p className="text-2xl md:text-3xl lg:text-4xl font-light text-zinc-300 leading-relaxed italic">
            &ldquo;I believe in the power of creativity and technology to transform ideas into
            experiences that inspire and connect people.&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  );
}
