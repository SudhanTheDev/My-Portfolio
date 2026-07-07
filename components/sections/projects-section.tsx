"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { InteractiveButton } from "@/components/interactive-button";
import { viewport } from "@/lib/motion";

const projects = [
  {
    title: "Personal AI Assistant",
    emoji: "🤖",
    category: "Flutter App",
    images: [
      "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/8438923/pexels-photo-8438923.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/17483868/pexels-photo-17483868.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/18069157/pexels-photo-18069157.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    href: "#",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    title: "Couple Social App",
    emoji: "💑",
    category: "Flutter App",
    images: [
      "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/193003/pexels-photo-193003.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    href: "#",
    accent: "from-violet-500 to-purple-500",
  },
  {
    title: "Savings Goal Tracker",
    emoji: "💰",
    category: "Flutter App",
    images: [
      "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/4386339/pexels-photo-4386339.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    href: "#",
    accent: "from-fuchsia-500 to-pink-500",
  },
  {
    title: "Moment Creation Studio",
    emoji: "🎨",
    category: "Website",
    images: [
      "https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/3379942/pexels-photo-3379942.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    href: "#",
    accent: "from-indigo-500 to-blue-500",
  },
];

export function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewport);
  const [activeSlides, setActiveSlides] = useState<Record<string, number>>(() =>
    Object.fromEntries(projects.map((project) => [project.title, 0]))
  );

  useEffect(() => {
    const timeoutIds: number[] = [];

    const scheduleNextSwap = (title: string, imageCount: number, delay: number) => {
      const timeoutId = window.setTimeout(() => {
        setActiveSlides((current) => ({
          ...current,
          [title]: ((current[title] ?? 0) + 1) % imageCount,
        }));

        const nextDelay = 3500 + Math.floor(Math.random() * 8000);
        scheduleNextSwap(title, imageCount, nextDelay);
      }, delay);

      timeoutIds.push(timeoutId);
    };

    projects.forEach((project, index) => {
      const initialDelay = 4500 + index * 1400 + Math.floor(Math.random() * 3500);
      scheduleNextSwap(project.title, project.images.length, initialDelay);
    });

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

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
          {projects.map((project, index) => {
            const activeSlide = activeSlides[project.title] ?? 0;
            const currentImage = project.images[activeSlide];

            return (
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
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImage}
                      initial={{ opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      src={currentImage}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="grayscale-to-color absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </AnimatePresence>
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
