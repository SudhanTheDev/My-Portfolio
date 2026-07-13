"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { createPortal } from "react-dom";
import { SectionHeader } from "@/components/section-header";
import { InteractiveButton } from "@/components/interactive-button";
import { viewport } from "@/lib/motion";

const projects = [
  {
    title: "Personal AI Assistant",
    emoji: "🤖",
    category: "Flutter App",
    images: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
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

const projectDetails = {
  "Personal AI Assistant": {
    summary: "A mobile assistant concept focused on helping users ask questions, organize tasks, and use AI as a practical everyday helper.",
    stack: ["Flutter", "Dart", "AI UX", "Prompt Flow", "Firebase-ready"],
    notes: [
      "The idea is to make AI feel useful inside a clean mobile experience, not just like a chat box. I would focus on quick actions, simple prompts, readable answers, and saved context so the assistant feels personal.",
      "This project connects my Flutter skills with my interest in AI experiments, automation, and practical problem solving.",
    ],
    highlights: ["Assistant-style mobile UI", "Prompt and response flow", "Task support ideas", "Friendly AI experience"],
  },
  "Couple Social App": {
    summary: "A relationship-focused social app concept with shared memories, private interactions, and a playful mobile experience.",
    stack: ["Flutter", "Firebase", "Mobile UI", "Social Features", "Realtime Ideas"],
    notes: [
      "This project is about designing emotional digital spaces with shared posts, reminders, private notes, couple goals, and memories.",
      "It shows how I can think about mobile UX, user flow, and visual tone instead of only listing features.",
    ],
    highlights: ["Private social flow", "Memory-based features", "Soft visual direction", "Firebase-ready structure"],
  },
  "Savings Goal Tracker": {
    summary: "A simple finance tracker concept that helps users set goals, follow progress, and stay motivated while saving money.",
    stack: ["Flutter", "Charts", "Local Data", "Goal UI", "Progress Tracking"],
    notes: [
      "This project focuses on clarity: users should instantly see their target, progress, remaining amount, and next action.",
      "It connects programming logic with practical design through forms, calculations, progress visuals, and dashboard thinking.",
    ],
    highlights: ["Goal dashboard", "Progress visuals", "Simple finance logic", "Motivational UI"],
  },
  "Moment Creation Studio": {
    summary: "A creative studio website concept for showing services, visual work, contact details, and a polished digital identity.",
    stack: ["Next.js", "UI Design", "Photography", "Branding", "Responsive Web"],
    notes: [
      "This kind of site needs to look professional while still feeling creative, with a strong hero, service cards, gallery previews, and contact paths.",
      "It reflects my mix of creative and technical skills: photography, videography, graphics, web development, and studio experience.",
    ],
    highlights: ["Studio landing page", "Gallery/service sections", "Brand presentation", "Responsive portfolio UI"],
  },
} as const;

export function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewport);
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[number] | null>(null);
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

  useEffect(() => {
    if (!selectedProject) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProject(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  return (
    <section id="projects" className="relative py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent" />
      <div ref={ref} className="relative mx-auto max-w-[104rem] px-6 lg:px-10 xl:px-12">
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
              <motion.button
                type="button"
                key={project.title}
                onClick={() => setSelectedProject(project)}
                data-cursor="Open"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="group glow-card block overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70"
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
              </motion.button>
            );
          })}
        </div>
      </div>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {selectedProject ? (
                <motion.div
                  className="fixed inset-0 z-[9999] flex min-h-dvh items-start justify-center overflow-y-auto bg-black/75 px-4 py-8 backdrop-blur-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  role="dialog"
                  aria-modal="true"
                  aria-label={`${selectedProject.title} project details`}
                  onClick={() => setSelectedProject(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 36, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 24, scale: 0.96 }}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                    onClick={(event) => event.stopPropagation()}
                    className="my-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/15 bg-[#070617]/95 shadow-2xl shadow-blue-950/50"
                  >
                    {(() => {
                      const details = projectDetails[selectedProject.title as keyof typeof projectDetails];

                      return (
                        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                          <div className="relative min-h-[360px] overflow-hidden">
                            <img
                              src={selectedProject.images[0]}
                              alt={selectedProject.title}
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-br ${selectedProject.accent} opacity-35 mix-blend-overlay`} />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#070617] via-[#070617]/30 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                              <p className="text-xs font-mono uppercase tracking-[0.35em] text-blue-200">
                                Project Case Study
                              </p>
                              <h3 className="mt-3 text-4xl font-bold text-white md:text-6xl">
                                {selectedProject.title} <span className="project-emoji">{selectedProject.emoji}</span>
                              </h3>
                            </div>
                          </div>

                          <div className="relative p-6 md:p-8">
                            <button
                              type="button"
                              onClick={() => setSelectedProject(null)}
                              className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-all hover:border-white/30 hover:bg-white/10"
                              aria-label="Close project details"
                            >
                              <X className="h-5 w-5" />
                            </button>

                            <p className="pr-12 text-sm font-mono uppercase tracking-widest text-violet-300">
                              {selectedProject.category}
                            </p>
                            <p className="mt-5 text-base leading-relaxed text-zinc-300">
                              {details.summary}
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2">
                              {details.stack.map((item) => (
                                <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-zinc-300">
                                  {item}
                                </span>
                              ))}
                            </div>

                            <div className="mt-7 space-y-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                              {details.notes.map((paragraph) => (
                                <p key={paragraph} className="text-sm leading-relaxed text-zinc-400">
                                  {paragraph}
                                </p>
                              ))}
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                              {details.highlights.map((highlight) => (
                                <div key={highlight} className="rounded-2xl border border-blue-300/20 bg-blue-400/[0.06] p-4 text-sm font-medium text-zinc-200">
                                  {highlight}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </section>
  );
}
