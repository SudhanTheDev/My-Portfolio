"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { createPortal } from "react-dom";
import { SectionHeader } from "@/components/section-header";
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
  const [activeProject, setActiveProject] = useState(0);

  const handleNext = () => {
    setActiveProject((current) => (current + 1) % projects.length);
  };

  const handlePrevious = () => {
    setActiveProject((current) => (current - 1 + projects.length) % projects.length);
  };

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
          className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between"
        >
          <SectionHeader label="Featured Work" title="Selected Projects" className="mb-0" />
          <div className="mt-6 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 font-mono text-xs uppercase tracking-[0.24em] text-violet-300 md:mt-0">
            {String(activeProject + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.3)] md:p-8 lg:p-12"
        >
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div className="relative h-[24rem] sm:h-[30rem]">
              <AnimatePresence initial={false}>
                {projects.map((project, index) => {
                  const isActive = index === activeProject;
                  const offset = (index - activeProject + projects.length) % projects.length;
                  const signedOffset = offset > projects.length / 2 ? offset - projects.length : offset;
                  const rotation = signedOffset * 6;

                  return (
                    <motion.button
                      type="button"
                      key={project.title}
                      onClick={() => {
                        if (isActive) {
                          setSelectedProject(project);
                          return;
                        }

                        setActiveProject(index);
                      }}
                      data-cursor={isActive ? "Open" : "Tap"}
                      aria-label={isActive ? `Open ${project.title} details` : `Select ${project.title}`}
                      initial={{ opacity: 0, scale: 0.88, z: -100, rotate: rotation }}
                      animate={{
                        opacity: isActive ? 1 : 0.48,
                        scale: isActive ? 1 : 0.92,
                        z: isActive ? 0 : -100,
                        rotate: isActive ? 0 : rotation,
                        x: signedOffset * 14,
                        y: isActive ? [0, -34, 0] : Math.abs(signedOffset) * 8,
                        zIndex: isActive ? 30 : projects.length - Math.abs(signedOffset),
                      }}
                      exit={{ opacity: 0, scale: 0.88, z: 100, rotate: -rotation }}
                      transition={{ duration: 0.48, ease: "easeInOut" }}
                      className="group absolute inset-0 origin-bottom overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#090818] text-left shadow-[0_28px_80px_rgba(0,0,0,0.5)] outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70"
                    >
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        loading={index === 0 ? "eager" : "lazy"}
                        draggable={false}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-20 mix-blend-overlay`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050411] via-transparent to-black/10" />
                      {isActive ? (
                        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
                          <div>
                            <p className="text-xs font-mono uppercase tracking-[0.28em] text-violet-200">
                              {project.category}
                            </p>
                            <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
                              {project.title}
                            </p>
                          </div>
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md">
                            <ArrowUpRight className="h-5 w-5" />
                          </span>
                        </div>
                      ) : null}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="flex min-h-[25rem] flex-col justify-between py-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject}
                  initial={{ y: 22, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -22, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                >
                  <p className="text-xs font-mono uppercase tracking-[0.3em] text-violet-300">
                    {projects[activeProject].category}
                  </p>
                  <h3 className="mt-4 font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                    {projects[activeProject].title}{" "}
                    <span className="project-emoji align-middle">{projects[activeProject].emoji}</span>
                  </h3>

                  <p className="mt-7 text-base leading-relaxed text-zinc-400 md:text-lg">
                    {projectDetails[projects[activeProject].title as keyof typeof projectDetails].summary
                      .split(" ")
                      .map((word, index) => (
                        <motion.span
                          key={`${activeProject}-${index}`}
                          initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut", delay: 0.018 * index }}
                          className="inline-block"
                        >
                          {word}&nbsp;
                        </motion.span>
                      ))}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {projectDetails[projects[activeProject].title as keyof typeof projectDetails].stack.map((item) => (
                      <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-zinc-300">
                        {item}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(projects[activeProject])}
                    className="mt-8 inline-flex items-center gap-2 rounded-xl border border-violet-300/25 bg-violet-400/10 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-violet-300/50 hover:bg-violet-400/15 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]"
                  >
                    Open case study
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </motion.div>
              </AnimatePresence>

              <div className="mt-10 flex items-center gap-4">
                <button
                  type="button"
                  onClick={handlePrevious}
                  aria-label="Show previous project"
                  className="group/button flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white transition-all hover:border-blue-300/40 hover:bg-blue-400/10"
                >
                  <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover/button:-translate-x-0.5 group-hover/button:-rotate-12" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Show next project"
                  className="group/button flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white transition-all hover:border-violet-300/40 hover:bg-violet-400/10"
                >
                  <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:rotate-12" />
                </button>
                <span className="ml-2 text-xs font-mono uppercase tracking-[0.22em] text-zinc-500">
                  Browse projects
                </span>
              </div>
            </div>
          </div>
        </motion.div>
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
