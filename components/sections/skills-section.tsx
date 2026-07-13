"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const skillCategories = [
  {
    title: "Web Development",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS", "Basic Databases"],
  },
  {
    title: "Mobile Development",
    skills: ["Flutter", "Dart", "Firebase", "Cross-Platform Apps"],
  },
  {
    title: "Programming & IT",
    skills: ["C Programming", "JavaScript", "Python", "Git/GitHub", "Hardware & Software Basics"],
  },
  {
    title: "Design & Creative",
    skills: ["Graphics Design", "UI/UX Design", "Photography", "Videography"],
  },
  {
    title: "Professional Tools",
    skills: ["Microsoft Office", "Word", "Excel", "PowerPoint", "Office Documents"],
  },
  {
    title: "Work & Communication",
    skills: ["Social Media", "Virtual Assistant", "Email Handling", "Scheduling", "Customer Support"],
  },
];

const digitalCompetencies = [
  "Information and data literacy",
  "Communication and collaboration",
  "Digital content creation",
  "Safety",
  "Problem solving",
];

export function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <section id="skills" className="py-32 border-t border-border">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-4 block">
            Skills
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight drop-shadow-[0_0_25px_rgba(147,197,253,0.5)]">
            Expertise
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
              className="group"
            >
              <h3 className="text-xl font-medium mb-6 text-white group-hover:text-shimmer transition-all">
                {category.title}
              </h3>
              <motion.div
                whileHover={{ y: -4 }}
                className="h-full pt-8 border-t border-border group-hover:border-zinc-600 transition-colors duration-500"
              >
                <ul className="space-y-3">
                  {category.skills.map((skill) => (
                    <motion.li
                      key={skill}
                      whileHover={{ x: 4 }}
                      className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-300 cursor-default"
                    >
                      {skill}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, delay: 0.38 }}
          className="mt-16 glass-card rounded-2xl p-6 md:p-8"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="text-xs font-mono text-blue-300 tracking-widest uppercase">
                Digital Competence Framework
              </span>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Advanced Level 6 / 6 across all tested areas
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
                Based on the self-assessment report, I can search, evaluate, organize, collaborate, create content, stay safe online, and solve technical problems in complex digital situations.
              </p>
            </div>
            <a
              href="/digital-competences-report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-blue-300/50 hover:bg-blue-400/10"
            >
              View Report
            </a>
          </div>
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {digitalCompetencies.map((competency) => (
              <div
                key={competency}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-zinc-300"
              >
                <span className="mb-2 block text-lg font-bold text-blue-300">6/6</span>
                {competency}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}