"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const timeline = [
  {
    year: "2022 - Present",
    title: "BIT Student",
    description: "Pursuing Bachelor of Information Technology, expanding knowledge in software development.",
  },
  {
    year: "2021 - Present",
    title: "Freelance Creative",
    description: "Providing photography, videography, and graphic design services.",
  },
  {
    year: "2022 - Present",
    title: "Flutter Developer",
    description: "Building cross-platform mobile applications with Flutter and Dart.",
  },
  {
    year: "2023 - Present",
    title: "AI Builder",
    description: "Exploring AI technologies and building AI-powered applications.",
  },
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-32 border-t border-border">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Side - Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-4 block">
              /About
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-8">
              About Me
            </h2>
            <div className="space-y-6 text-lg text-zinc-400 leading-relaxed">
              <p>
                I&apos;m Sudhan, a BIT student from <span className="text-white">Nepal</span> passionate about building beautiful digital experiences.
              </p>
              <p>
                I develop modern Flutter applications, AI-powered software, websites, and creative digital products while continuously learning new technologies.
              </p>
              <p>
                I believe software should not only work perfectly but also <span className="text-white">feel beautiful.</span>
              </p>
            </div>
          </motion.div>

          {/* Right Side - Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {timeline.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="group relative pl-8 border-l-2 border-border hover:border-purple-500/50 transition-all duration-500"
              >
                <div className="absolute left-0 top-0 w-3 h-3 -translate-x-[6px] rounded-full bg-zinc-800 group-hover:bg-purple-400 group-hover:shadow-[0_0_12px_rgba(192,132,252,0.8)] transition-all duration-500" />
                <div className="glass-card rounded-xl p-5 hover:shadow-lg hover:shadow-purple-500/15 transition-all duration-300 hover:scale-[1.02]">
                  <span className="text-xs font-mono text-zinc-500 tracking-wider mb-2 block group-hover:text-purple-400 transition-colors duration-300">
                    {item.year}
                  </span>
                  <h3 className="text-lg font-medium text-white mb-2 group-hover:text-purple-200 transition-colors duration-300">{item.title}</h3>
                  <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
