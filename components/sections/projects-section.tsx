"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { InteractiveButton } from "@/components/interactive-button";
import { fadeUp, transition, viewport } from "@/lib/motion";

const projects = [
  {
    title: "Personal AI Assistant",
    category: "Flutter App",
    image: "https://picsum.photos/800/600?random=1",
    href: "#",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    title: "Couple Social App",
    category: "Flutter App",
    image: "https://picsum.photos/800/600?random=2",
    href: "#",
    accent: "from-violet-500 to-purple-500",
  },
  {
    title: "Savings Goal Tracker",
    category: "Flutter App",
    image: "https://picsum.photos/800/600?random=3",
    href: "#",
    accent: "from-fuchsia-500 to-pink-500",
  },
  {
    title: "Moment Creation Studio",
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
    <section id="projects" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent pointer-events-none" />
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={transition.default}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <SectionHeader label="Featured Work" title="Selected Projects" className="mb-0" />
          <InteractiveButton href="#" variant="pill" showArrow className="mt-6 md:mt-0">
            View All
          </InteractiveButton>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.a
              key={project.title}
              href={project.href}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ ...transition.default, delay: 0.1 * index }}
              className="group glow-card overflow-hidden block"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale-to-color group-hover:scale-105 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${project.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-500 mix-blend-overlay`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass-effect flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-2">{project.category}</p>
                <h3 className="text-xl font-bold text-foreground group-hover:text-shimmer transition-all font-display">
                  {project.title}
                </h3>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
