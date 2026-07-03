"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Personal AI Assistant",
    category: "Flutter App",
    image: "https://picsum.photos/800/600?random=1",
    href: "#",
  },
  {
    title: "Couple Social App",
    category: "Flutter App",
    image: "https://picsum.photos/800/600?random=2",
    href: "#",
  },
  {
    title: "Savings Goal Tracker",
    category: "Flutter App",
    image: "https://picsum.photos/800/600?random=3",
    href: "#",
  },
  {
    title: "Moment Creation Studio",
    category: "Website",
    image: "https://picsum.photos/800/600?random=4",
    href: "#",
  },
];

export function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-32 border-t border-zinc-900">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <div>
            <span className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-4 block font-bold">
              ✨ /Featured Work
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-display">
              Featured Projects
            </h2>
          </div>
          <a
            href="#"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors duration-300 group"
          >
            View All Work
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </a>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project, index) => (
            <motion.a
              key={project.title}
              href={project.href}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + index * 0.15 }}
              className="group block"
            >
              {/* Project Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900 mb-6 rounded-2xl border border-zinc-800 group-hover:border-purple-500/50 transition-all duration-500">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 grayscale-to-color"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    className="w-12 h-12 rounded-full border-2 border-white group-hover:scale-110 transition-transform duration-500 flex items-center justify-center"
                  >
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </motion.div>
                </div>
              </div>

              {/* Project Info */}
              <div className="flex items-start justify-between group">
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300 font-display">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-400 mt-2 font-semibold">{project.category}</p>
                </div>
                <div className="p-3 border border-zinc-700 group-hover:border-purple-500 group-hover:bg-purple-500/10 transition-all duration-300 rounded-lg">
                  <ArrowUpRight className="w-5 h-5 text-zinc-400 group-hover:text-purple-400 transition-colors duration-300" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
