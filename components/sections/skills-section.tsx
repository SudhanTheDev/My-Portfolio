"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const skillCategories = [
  {
    title: "Web Development",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS"],
  },
  {
    title: "Mobile Development",
    skills: ["Flutter", "Dart", "Firebase", "Cross-Platform Apps"],
  },
  {
    title: "Programming",
    skills: ["C Programming", "JavaScript", "Python", "Git/GitHub"],
  },
  {
    title: "Design & Creative",
    skills: ["Graphics Design", "UI/UX Design", "Photography", "Videography"],
  },
];

export function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-32 border-t border-zinc-900">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-4 block">
            /Skills
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight">
            Expertise
          </h2>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="group"
            >
              <div className="h-full pt-8 border-t border-zinc-800 group-hover:border-zinc-600 transition-colors duration-500">
                <h3 className="text-xl font-medium mb-6 text-white">
                  {category.title}
                </h3>
                <ul className="space-y-3">
                  {category.skills.map((skill) => (
                    <li
                      key={skill}
                      className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-300"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
