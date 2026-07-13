"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SectionHeader } from "@/components/section-header";
import { viewport } from "@/lib/motion";

const services = [
  {
    icon: "📱",
    title: "Flutter Development",
    items: ["Cross-platform Apps", "Modern UI", "Firebase", "Supabase"],
    tools: ["Flutter", "Dart", "Firebase", "Supabase", "Android UI"],
    tone: "from-cyan-400 to-blue-500",
    images: [
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
    ],
    detail:
      "I can shape app ideas into clean mobile screens, reusable Flutter widgets, and cross-platform interfaces. This service is useful for simple app prototypes, polished mobile UI sections, Firebase-ready app flows, and app concepts that need both structure and visual care.",
  },
  {
    icon: "🌐",
    title: "Website Development",
    items: ["React", "Next.js", "Responsive", "Performance"],
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Responsive Design"],
    tone: "from-blue-400 to-violet-500",
    images: [
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    ],
    detail:
      "I build modern websites that feel interactive, responsive, and readable. I can create portfolio pages, landing pages, service sections, animated cards, contact flows, and layouts that work well on both mobile and desktop.",
  },
  {
    icon: "🎨",
    title: "UI/UX Design",
    items: ["Prototyping", "User Flow", "Visual Polish", "Design Systems"],
    tools: ["Figma", "Wireframes", "User Flow", "Visual Hierarchy", "Design Systems"],
    tone: "from-pink-400 to-fuchsia-500",
    images: [
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
      "https://img.icons8.com/color/96/color-palette.png",
      "https://img.icons8.com/color/96/web-design.png",
      "https://img.icons8.com/color/96/flow-chart.png",
    ],
    detail:
      "I design interfaces by thinking about what users notice first, where they click next, and how the page should feel. I focus on spacing, contrast, readable sections, smooth motion, and layouts that make information easy to understand.",
  },
  {
    icon: "🎬",
    title: "Creative Services",
    items: ["Photography", "Videography", "Branding", "Graphic Design"],
    tools: ["Photography", "Videography", "Branding", "Graphics", "Content Ideas"],
    tone: "from-amber-300 to-rose-500",
    images: [
      "https://img.icons8.com/color/96/camera.png",
      "https://img.icons8.com/color/96/video-editing.png",
      "https://img.icons8.com/color/96/canva.png",
      "https://img.icons8.com/color/96/paint-palette.png",
    ],
    detail:
      "I can support creative work with photos, videos, visuals, social media assets, and brand-friendly layouts. This helps projects feel more personal and memorable instead of looking like plain template work.",
  },
  {
    icon: "🤖",
    title: "AI Experiments",
    items: ["Prompting", "Automation", "Creative AI", "Problem Solving"],
    tools: ["AI Prompting", "Automation", "Chatbot Ideas", "Workflow Design", "Creative AI"],
    tone: "from-sky-300 to-teal-400",
    images: [
      "https://img.icons8.com/color/96/artificial-intelligence.png",
      "https://img.icons8.com/color/96/bot.png",
      "https://img.icons8.com/color/96/automation.png",
      "https://img.icons8.com/color/96/idea.png",
    ],
    detail:
      "I explore AI tools for creative and practical problem solving. I can think through assistant ideas, automation flows, prompt systems, content generation support, and AI-powered app concepts.",
  },
  {
    icon: "⌨️",
    title: "Programming",
    items: ["C Programming", "JavaScript", "Python", "Git/GitHub"],
    tools: ["C", "JavaScript", "Python", "Git", "GitHub"],
    tone: "from-slate-200 to-blue-400",
    images: [
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    ],
    detail:
      "I use programming fundamentals to solve problems, build interactions, understand logic, and keep improving as a BIT student. This includes scripting, debugging, version control, and building structured project features.",
  },
  {
    icon: "🧠",
    title: "IT Foundations",
    items: ["Databases", "Web Tech", "Hardware Basics", "Office Tools"],
    tools: ["Databases", "Hardware", "Software", "Web Basics", "Troubleshooting"],
    tone: "from-violet-300 to-indigo-500",
    images: [
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
      "https://img.icons8.com/color/96/server.png",
      "https://img.icons8.com/color/96/motherboard.png",
      "https://img.icons8.com/color/96/maintenance.png",
    ],
    detail:
      "I understand the basics behind digital systems: software, hardware, databases, web technologies, and troubleshooting. That foundation helps me learn tools faster and support technical work with better judgment.",
  },
  {
    icon: "📊",
    title: "Office Work",
    items: ["Word", "Excel", "PowerPoint", "Records"],
    tools: ["Word", "Excel", "PowerPoint", "PDF", "Records"],
    tone: "from-emerald-300 to-blue-500",
    images: [
      "https://img.icons8.com/color/96/microsoft-word-2019--v2.png",
      "https://img.icons8.com/color/96/microsoft-excel-2019--v1.png",
      "https://img.icons8.com/color/96/microsoft-powerpoint-2019--v1.png",
      "https://img.icons8.com/color/96/adobe-acrobat--v1.png",
    ],
    detail:
      "I can prepare documents, organize records, support reports, create presentations, and handle practical office files. This is useful for admin support, academic work, studio records, and client-facing documents.",
  },
  {
    icon: "💬",
    title: "Communication",
    items: ["Email Handling", "Scheduling", "Customer Support", "Collaboration"],
    tools: ["Email", "Scheduling", "Support", "Teamwork", "Follow-ups"],
    tone: "from-purple-300 to-pink-500",
    images: [
      "https://img.icons8.com/color/96/gmail-new.png",
      "https://img.icons8.com/color/96/calendar--v1.png",
      "https://img.icons8.com/color/96/customer-support.png",
      "https://img.icons8.com/color/96/communication.png",
    ],
    detail:
      "I can communicate clearly with visitors, customers, and collaborators. I can help with replies, schedules, follow-ups, simple research, and support tasks that need patience and organization.",
  },
  {
    icon: "🧾",
    title: "Virtual Assistant",
    items: ["Research", "Online Forms", "Documents", "Follow-ups"],
    tools: ["Research", "Forms", "Documents", "Task Tracking", "Online Support"],
    tone: "from-cyan-300 to-emerald-400",
    images: [
      "https://img.icons8.com/color/96/google-forms-new-logo-1.png",
      "https://img.icons8.com/color/96/search.png",
      "https://img.icons8.com/color/96/google-docs--v1.png",
      "https://img.icons8.com/color/96/task.png",
    ],
    detail:
      "I can support online tasks like research, form filling, document preparation, checking information, organizing lists, and follow-up work. I’m comfortable helping digital work stay tidy and on track.",
  },
  {
    icon: "🛡️",
    title: "Digital Safety",
    items: ["Data Safety", "Reliability Checks", "Digital Identity", "Tool Choice"],
    tools: ["Data Safety", "Privacy", "Reliability", "Tool Choice", "Digital Identity"],
    tone: "from-blue-300 to-cyan-500",
    images: [
      "https://img.icons8.com/color/96/security-checked.png",
      "https://img.icons8.com/color/96/privacy.png",
      "https://img.icons8.com/color/96/fingerprint.png",
      "https://img.icons8.com/color/96/verified-account.png",
    ],
    detail:
      "My digital competence report shows strong understanding of online safety, data handling, digital identity, and choosing reliable tools. I care about using technology carefully, not just quickly.",
  },
  {
    icon: "📣",
    title: "Social Media",
    items: ["Content Support", "Posting", "Visual Ideas", "Online Presence"],
    tools: ["Instagram", "Facebook", "Content Ideas", "Posting", "Visual Support"],
    tone: "from-fuchsia-400 to-orange-400",
    images: [
      "https://img.icons8.com/color/96/instagram-new--v1.png",
      "https://img.icons8.com/color/96/facebook-new.png",
      "https://img.icons8.com/color/96/social-network.png",
      "https://img.icons8.com/color/96/content.png",
    ],
    detail:
      "I can help with visual ideas, posting support, social media content, and online presence. My creative skills make this stronger because I can think about both message and visuals together.",
  },
];

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewport);
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const [activePage, setActivePage] = useState(0);
  const [selectedService, setSelectedService] = useState<(typeof services)[number] | null>(null);

  useEffect(() => {
    const updateCardsPerPage = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerPage(4);
      } else if (window.innerWidth >= 768) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(1);
      }
    };

    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);

    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  useEffect(() => {
    if (!selectedService) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedService(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedService]);

  const pageCount = Math.ceil(services.length / cardsPerPage);
  const servicePages = Array.from({ length: pageCount }, (_, pageIndex) =>
    services.slice(pageIndex * cardsPerPage, pageIndex * cardsPerPage + cardsPerPage)
  );

  useEffect(() => {
    setActivePage((page) => Math.min(page, pageCount - 1));
  }, [pageCount]);

  const changePage = (direction: "left" | "right") => {
    setActivePage((page) => {
      if (direction === "left") return page === 0 ? pageCount - 1 : page - 1;
      return page === pageCount - 1 ? 0 : page + 1;
    });
  };

  return (
    <section id="services" className="relative overflow-hidden py-32">
      <div ref={ref} className="mx-auto max-w-[104rem] px-6 lg:px-10 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between"
        >
          <SectionHeader label="What I Do" title="Services & Expertise" className="mb-0" />
        </motion.div>

        <div className="relative left-1/2 mt-14 flex w-screen -translate-x-1/2 items-center gap-5 overflow-visible px-4 sm:px-8 lg:px-14">
          <button
            type="button"
            onClick={() => changePage("left")}
            className="btn-interactive hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.03] text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10 md:flex"
            aria-label="Show previous services"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1 overflow-visible py-10 [clip-path:inset(-120px_0_-120px_0)]">
            <motion.div
              animate={{ x: `-${activePage * (100 / pageCount)}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 24 }}
              className="flex"
              style={{ width: `${pageCount * 100}%` }}
            >
              {servicePages.map((page, pageIndex) => (
                <div
                  key={page.map((service) => service.title).join("-")}
                  className="grid shrink-0 grid-cols-1 gap-6 px-4 md:grid-cols-2 md:px-5 lg:grid-cols-4 lg:px-6"
                  style={{ width: `${100 / pageCount}%` }}
                  aria-hidden={pageIndex !== activePage}
                >
                  {page.map((service, index) => (
                    <motion.button
                      type="button"
                      key={service.title}
                      onClick={() => setSelectedService(service)}
                      data-cursor="Open"
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      whileHover={{ scale: 1.04, y: -8, transition: { duration: 0.16, ease: "easeOut" } }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.5, delay: 0.05 + index * 0.05 }}
                      className="group glow-card min-h-[254px] min-w-0 p-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70"
                    >
                      <div className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-110">
                        {service.icon}
                      </div>
                      <h3 className="mb-4 font-display text-lg font-bold text-foreground transition-all group-hover:text-shimmer group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                        {service.title}
                      </h3>
                      <ul className="space-y-2">
                        {service.items.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-muted">
                            <span className="h-1 w-1 rounded-full bg-violet-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.button>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          <button
            type="button"
            onClick={() => changePage("right")}
            className="btn-interactive hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.03] text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10 md:flex"
            aria-label="Show next services"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute -bottom-12 left-1/2 flex -translate-x-1/2 items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={() => changePage("left")}
              className="btn-interactive flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.03] text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10"
              aria-label="Show previous services"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => changePage("right")}
              className="btn-interactive flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.03] text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10"
              aria-label="Show next services"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {selectedService ? (
                <motion.div
                  className="fixed inset-0 z-[9999] flex min-h-dvh items-center justify-center overflow-y-auto bg-[#030014]/80 px-4 py-8 backdrop-blur-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  role="dialog"
                  aria-modal="true"
                  aria-label={`${selectedService.title} details`}
                  onClick={() => setSelectedService(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, rotateX: 12, y: 24 }}
                    animate={{ opacity: 1, rotateX: 0, y: 0 }}
                    exit={{ opacity: 0, rotateX: -8, y: 18 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    onClick={(event) => event.stopPropagation()}
                    className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/15 bg-[#090719]/95 p-6 shadow-2xl shadow-violet-950/50 md:p-8"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedService(null)}
                      className="absolute right-5 top-5 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-all hover:border-white/30 hover:bg-white/10"
                      aria-label="Close service details"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${selectedService.tone}`} />
                    <div className={`pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br ${selectedService.tone} opacity-20 blur-3xl`} />

                    <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.2fr]">
                      <div>
                        <div className="text-6xl">{selectedService.icon}</div>
                        <p className="mt-6 text-xs font-mono uppercase tracking-[0.35em] text-blue-300">
                          Service Capability
                        </p>
                        <h3 className="mt-3 pr-12 text-3xl font-bold text-white md:text-5xl">
                          {selectedService.title}
                        </h3>
                        <p className="mt-5 text-sm leading-relaxed text-zinc-300 md:text-base">
                          {selectedService.detail}
                        </p>
                      </div>

                      <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {selectedService.images.map((image) => (
                            <div
                              key={image}
                              className="flex h-24 items-center justify-center rounded-2xl border border-white/10 bg-black/20 p-4"
                            >
                              <img src={image} alt="" className="h-12 w-12 object-contain" loading="lazy" />
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 flex flex-wrap gap-2">
                          {selectedService.tools.map((tool) => (
                            <span
                              key={tool}
                              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-zinc-300"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                        <div className="mt-6 rounded-2xl border border-blue-300/20 bg-blue-400/[0.06] p-4 text-sm leading-relaxed text-zinc-300">
                          I can combine this with my web, creative, office, and digital competence skills to support real projects from idea to polished presentation.
                        </div>
                      </div>
                    </div>
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
