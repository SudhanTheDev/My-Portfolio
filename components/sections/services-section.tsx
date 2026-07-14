"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SectionHeader } from "@/components/section-header";
import { DiagonalCarousel } from "@/components/ui/diagonal-carousel";
import { expandableCardLayoutId, expandableCardTransition } from "@/lib/expandable-motion";
import { viewport } from "@/lib/motion";

const services = [
  {
    icon: "📱",
    category: "Mobile",
    title: "Flutter Development",
    cover: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    category: "Web",
    title: "Website Development",
    cover: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    category: "Design",
    title: "UI/UX Design",
    cover: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    category: "Creative",
    title: "Creative Services",
    cover: "https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    category: "Artificial Intelligence",
    title: "AI Experiments",
    cover: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    category: "Development",
    title: "Programming",
    cover: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    category: "Technology",
    title: "IT Foundations",
    cover: "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    category: "Productivity",
    title: "Office Work",
    cover: "https://images.pexels.com/photos/193003/pexels-photo-193003.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    category: "Client Support",
    title: "Communication",
    cover: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    category: "Remote Support",
    title: "Virtual Assistant",
    cover: "https://images.pexels.com/photos/4386339/pexels-photo-4386339.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    category: "Security",
    title: "Digital Safety",
    cover: "https://images.pexels.com/photos/17483868/pexels-photo-17483868.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    category: "Content",
    title: "Social Media",
    cover: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
  const [activeServiceIndex, setActiveServiceIndex] = useState(3);
  const [selectedService, setSelectedService] = useState<(typeof services)[number] | null>(null);

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

        <div className="relative left-1/2 mt-12 w-screen -translate-x-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.985 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="relative h-[620px] w-full overflow-hidden border-y border-white/[0.07] bg-black/10 sm:h-[690px]"
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/10 blur-[110px]" />
            <DiagonalCarousel
              items={services.map((service) => ({
                src: service.cover,
                title: service.title,
                alt: `${service.title} service`,
                category: service.category,
                icon: service.icon,
                meta: service.items.slice(0, 3).join("  /  "),
                layoutId: expandableCardLayoutId("service", service.title),
              }))}
              activeIndex={activeServiceIndex}
              onActiveIndexChange={setActiveServiceIndex}
              onItemClick={(_, index) => setSelectedService(services[index])}
              slideSize={330}
              rotationStep={24}
              verticalStep={132}
              inactiveScale={0.58}
            />
          </motion.div>
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
                    layoutId={expandableCardLayoutId("service", selectedService.title)}
                    transition={expandableCardTransition}
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
