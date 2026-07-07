"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { InteractiveButton } from "@/components/interactive-button";
import { viewport } from "@/lib/motion";

const projects = [
  {
    title: "Personal AI Assistant",
    emoji: "🤖",
    category: "Flutter App",
    image: "https://picsum.photos/800/600?random=1",
    href: "#",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    title: "Couple Social App",
    emoji: "💑",
    category: "Flutter App",
    image: "https://picsum.photos/800/600?random=2",
    href: "#",
    accent: "from-violet-500 to-purple-500",
  },
  {
    title: "Savings Goal Tracker",
    emoji: "💰",
    category: "Flutter App",
    image: "https://picsum.photos/800/600?random=3",
    href: "#",
    accent: "from-fuchsia-500 to-pink-500",
  },
  {
    title: "Moment Creation Studio",
    emoji: "🎨",
    category: "Website",
    image: "https://picsum.photos/800/600?random=4",
    href: "#",
    accent: "from-indigo-500 to-blue-500",
  },
];

export function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewport);

  return (
    <section id="projects" className="relative py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent" />
      <div ref={ref} className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between"
        >
          <SectionHeader label="Featured Work" title="Selected Projects" className="mb-0" />
          <InteractiveButton href="#" variant="pill" showArrow className="mt-6 md:mt-0">
            View All
          </InteractiveButton>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project, index) => (
            <motion.a
              key={project.title}
              href={project.href}
              data-cursor="Open"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="group glow-card block overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="grayscale-to-color h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${project.accent} mix-blend-overlay opacity-0 transition-opacity duration-500 group-hover:opacity-20`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-60" />
                <div className="glass-effect absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">
                  <ArrowUpRight className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="p-6">
                <p className="mb-2 text-xs font-mono uppercase tracking-widest text-violet-400">
                  {project.category}
                </p>
                <h3 className="font-display text-xl font-bold text-foreground transition-all group-hover:text-shimmer group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                  <span>{project.title}</span>
                  <span className="project-emoji ml-2 inline-block align-middle text-foreground group-hover:text-violet-300">
                    {project.emoji}
                  </span>
                </h3>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
