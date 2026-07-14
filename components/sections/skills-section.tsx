"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Code2,
  ExternalLink,
  FileSpreadsheet,
  type LucideIcon,
  MessagesSquare,
  Palette,
  Smartphone,
  TerminalSquare,
  X,
} from "lucide-react";
import { type CSSProperties, type MouseEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { expandableCardLayoutId, expandableCardTransition } from "@/lib/expandable-motion";

const skillCategories = [
  {
    title: "Web Development",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS", "JavaScript", "Basic Databases", "Responsive UI"],
    imageSet: [
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", alt: "React logo" },
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", alt: "Next.js logo" },
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", alt: "TypeScript logo" },
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", alt: "Tailwind CSS logo" },
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", alt: "HTML5 logo" },
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", alt: "CSS3 logo" },
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", alt: "JavaScript logo" },
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg", alt: "Supabase logo" },
    ],
    summary:
      "I build clean, responsive websites and portfolio experiences using modern frontend tools. My web work focuses on speed, readable layouts, smooth interactions, and practical structure.",
    details: [
      "With React and Next.js, I can create component-based pages that feel interactive while still staying organized and maintainable. I understand how to split a page into reusable parts, manage client-side interactions, and keep the visual experience consistent across sections.",
      "TypeScript helps me write safer code, while Tailwind CSS lets me move quickly with responsive design, spacing, colors, glass effects, hover states, and polished UI details. I can also work with HTML, CSS, and basic database ideas when a project needs structured data.",
      "This means I can create personal websites, landing pages, portfolio pages, service sections, contact areas, and interactive interfaces that are not just static, but feel alive and professional.",
      "I also pay attention to small details like loading states, button feedback, mobile spacing, section flow, and accessible links, because those tiny touches are what make a website feel finished instead of basic.",
    ],
    proofPoints: ["Responsive layouts", "Animated UI sections", "Reusable components", "Performance-aware pages", "Portfolio and landing pages", "Clean navigation flow"],
  },
  {
    title: "Mobile Development",
    skills: ["Flutter", "Dart", "Firebase", "Cross-Platform Apps", "Mobile UI", "App Logic", "Reusable Widgets"],
    imageSet: [
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg", alt: "Flutter logo" },
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg", alt: "Dart logo" },
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg", alt: "Firebase logo" },
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg", alt: "Android logo" },
      { src: "https://img.icons8.com/color/96/google-play.png", alt: "Google Play icon" },
      { src: "https://img.icons8.com/color/96/smartphone-tablet.png", alt: "Mobile devices icon" },
    ],
    summary:
      "I can create mobile app interfaces and cross-platform app ideas using Flutter and Dart, with Firebase support for backend features.",
    details: [
      "Flutter allows me to design mobile interfaces that can work across Android and iOS from one codebase. I can build screens, organize widgets, style layouts, and create smooth UI flows that feel modern and easy to use.",
      "Using Dart, I can handle app logic, data flow, user interaction, and reusable UI patterns. Firebase adds useful features like authentication, database storage, hosting ideas, and real-time app behavior when a project needs more than just a front-end screen.",
      "My strength here is combining practical app structure with a good visual eye, so mobile products can feel both functional and polished.",
      "I can plan app screens, create reusable widget sections, think through navigation between pages, and shape app ideas into something that can be tested and improved step by step.",
    ],
    proofPoints: ["Cross-platform app UI", "Reusable Flutter widgets", "Firebase-ready features", "Clean mobile layouts", "Screen planning", "Interactive app flows"],
  },
  {
    title: "Programming & IT",
    skills: ["C Programming", "JavaScript", "Python", "Git/GitHub", "Hardware & Software Basics", "Debugging", "Databases", "Command Line"],
    imageSet: [
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg", alt: "C programming logo" },
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", alt: "JavaScript logo" },
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", alt: "Python logo" },
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", alt: "GitHub logo" },
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", alt: "Git logo" },
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", alt: "MySQL logo" },
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg", alt: "Visual Studio Code logo" },
      { src: "https://img.icons8.com/color/96/console.png", alt: "Command line icon" },
    ],
    summary:
      "I have a growing technical foundation in programming, logic, version control, and general IT concepts from my BIT studies and self-learning.",
    details: [
      "C programming gives me a strong base in logic, syntax, problem solving, loops, functions, and structured thinking. JavaScript helps me make websites interactive, while Python gives me a flexible way to explore automation, scripting, and problem-solving tasks.",
      "Git and GitHub help me track code changes, organize project history, and work in a more professional development workflow. I also understand hardware and software basics, which helps me think about technology beyond only the code editor.",
      "This foundation makes me comfortable learning new tools quickly, debugging issues, understanding how systems connect, and building projects with a more complete technical mindset.",
      "Because I study BIT, I am building a wider understanding of how software, databases, hardware, networks, and user needs connect together in real digital systems.",
    ],
    proofPoints: ["Problem-solving logic", "JavaScript interaction", "Python scripting basics", "Git/GitHub workflow", "Database fundamentals", "Technical troubleshooting"],
  },
  {
    title: "Design & Creative",
    skills: ["Graphics Design", "UI/UX Design", "Photography", "Videography", "Branding", "Visual Editing", "Content Ideas"],
    imageSet: [
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", alt: "Figma logo" },
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg", alt: "Photoshop logo" },
      { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg", alt: "Illustrator logo" },
      { src: "https://img.icons8.com/color/96/camera.png", alt: "Camera icon" },
      { src: "https://img.icons8.com/color/96/video-editing.png", alt: "Video editing icon" },
      { src: "https://img.icons8.com/color/96/canva.png", alt: "Canva icon" },
      { src: "https://img.icons8.com/color/96/color-palette.png", alt: "Color palette icon" },
    ],
    summary:
      "I mix visual creativity with digital design, using photography, video, graphics, and UI thinking to create content that feels memorable.",
    details: [
      "My creative side helps me understand composition, color, spacing, visual hierarchy, and the emotional feel of a design. That matters in websites and apps because users notice when a page feels balanced, easy to read, and visually confident.",
      "In UI/UX design, I think about how a person moves through a screen: what they see first, what they should click, and how the layout can feel simple instead of confusing. Photography and videography also help me create stronger visual material for brands, portfolios, and social content.",
      "This gives me a useful mix: I can think like a developer while still caring about how the final product looks, feels, and communicates.",
      "I can support projects with visuals, edits, layouts, thumbnails, brand-style choices, and content direction so the work has a stronger identity instead of looking random.",
    ],
    proofPoints: ["Visual storytelling", "Interface polish", "Content creation", "Brand-friendly layouts", "Photo/video support", "Social media visuals"],
  },
  {
    title: "Professional Tools",
    skills: ["Microsoft Office", "Word", "Excel", "PowerPoint", "Office Documents", "Reports", "Records", "PDF Handling"],
    imageSet: [
      { src: "https://img.icons8.com/color/96/microsoft-word-2019--v2.png", alt: "Microsoft Word icon" },
      { src: "https://img.icons8.com/color/96/microsoft-excel-2019--v1.png", alt: "Microsoft Excel icon" },
      { src: "https://img.icons8.com/color/96/microsoft-powerpoint-2019--v1.png", alt: "Microsoft PowerPoint icon" },
      { src: "https://img.icons8.com/color/96/microsoft-office-2019.png", alt: "Microsoft Office icon" },
      { src: "https://img.icons8.com/color/96/adobe-acrobat--v1.png", alt: "PDF icon" },
      { src: "https://img.icons8.com/color/96/google-docs--v1.png", alt: "Google Docs icon" },
      { src: "https://img.icons8.com/color/96/google-sheets.png", alt: "Google Sheets icon" },
    ],
    summary:
      "I can handle everyday professional documents, records, presentations, and office workflows using Microsoft Office tools.",
    details: [
      "With Word, I can prepare clean documents, formatted reports, letters, CV-related files, and written materials. Excel helps with organizing information, records, simple tables, lists, and structured data for practical office tasks.",
      "PowerPoint lets me turn information into clearer presentations, using layout, hierarchy, and visual flow so the message is easier to understand. These skills are useful for both business work and academic projects.",
      "Because I also have front desk and studio experience, I understand how these tools are used in real work: keeping information organized, supporting customers, preparing files, and making communication smoother.",
      "I can also help turn messy information into cleaner documents, simple reports, organized lists, printable files, and presentation materials that are easier for other people to use.",
    ],
    proofPoints: ["Formatted documents", "Organized records", "Presentation design", "Office workflow support", "PDF/report handling", "Clear file organization"],
  },
  {
    title: "Work & Communication",
    skills: ["Social Media", "Virtual Assistant", "Email Handling", "Scheduling", "Customer Support", "Research", "Follow-ups", "Online Forms"],
    imageSet: [
      { src: "https://img.icons8.com/color/96/gmail-new.png", alt: "Email icon" },
      { src: "https://img.icons8.com/color/96/calendar--v1.png", alt: "Calendar icon" },
      { src: "https://img.icons8.com/color/96/instagram-new--v1.png", alt: "Instagram icon" },
      { src: "https://img.icons8.com/color/96/facebook-new.png", alt: "Facebook icon" },
      { src: "https://img.icons8.com/color/96/whatsapp--v1.png", alt: "WhatsApp icon" },
      { src: "https://img.icons8.com/color/96/google-forms-new-logo-1.png", alt: "Google Forms icon" },
      { src: "https://img.icons8.com/color/96/customer-support.png", alt: "Customer support icon" },
    ],
    summary:
      "I can support digital communication, customer-facing work, online content, scheduling, and virtual assistant-style tasks.",
    details: [
      "I can help with email handling, scheduling, follow-ups, online forms, basic research, document support, and customer communication. These tasks need patience, clarity, and responsibility, especially when information has to stay organized.",
      "For social media, I understand posting support, visual ideas, basic content planning, and how online presence affects a person or brand. My photography, videography, and design background also helps me think visually when supporting content.",
      "This area shows that I am not only technical; I can also communicate, organize work, support people, and help digital projects run smoothly.",
      "I can work carefully with messages, schedules, simple online tasks, client questions, and follow-up work, which makes me useful in both creative and office-style environments.",
    ],
    proofPoints: ["Email and scheduling", "Customer support", "Social media support", "Virtual assistant tasks", "Online research", "Follow-up organization"],
  },
];

const digitalCompetencies = [
  "Information and data literacy",
  "Communication and collaboration",
  "Digital content creation",
  "Safety",
  "Problem solving",
];

type SkillCategory = (typeof skillCategories)[number];

const skillIcons: Record<string, LucideIcon> = {
  "Web Development": Code2,
  "Mobile Development": Smartphone,
  "Programming & IT": TerminalSquare,
  "Design & Creative": Palette,
  "Professional Tools": FileSpreadsheet,
  "Work & Communication": MessagesSquare,
};

type SpotlightStyle = CSSProperties & {
  "--spotlight-x": string;
  "--spotlight-y": string;
};

function ExpertiseSpotlightCard({
  category,
  index,
  isInView,
  onOpen,
}: {
  category: SkillCategory;
  index: number;
  isInView: boolean;
  onOpen: () => void;
}) {
  const Icon = skillIcons[category.title];

  const moveSpotlight = (event: MouseEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`);
  };

  return (
    <motion.button
      type="button"
      layoutId={expandableCardLayoutId("skill", category.title)}
      onClick={onOpen}
      onMouseMove={moveSpotlight}
      initial={{ opacity: 0, y: 22 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.5, delay: 0.08 + index * 0.07, layout: expandableCardTransition }}
      style={
        {
          "--spotlight-x": "50%",
          "--spotlight-y": "50%",
        } as SpotlightStyle
      }
      className="group relative isolate min-h-[292px] overflow-hidden rounded-[1.65rem] border border-border bg-background p-3 text-left outline-none transition-[border-color,box-shadow] duration-300 hover:border-blue-300/25 hover:shadow-[0_22px_70px_rgba(2,6,23,0.38)] focus-visible:ring-2 focus-visible:ring-blue-300/70"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          background:
            "radial-gradient(260px circle at var(--spotlight-x) var(--spotlight-y), rgba(96,165,250,0.9) 0%, rgba(167,139,250,0.52) 28%, rgba(244,114,182,0.16) 48%, transparent 72%)",
        }}
      />

      <div className="relative z-10 flex h-full min-h-[266px] flex-col overflow-hidden rounded-[1.05rem] border border-border bg-card p-6 md:p-7">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{
            background:
              "radial-gradient(440px circle at var(--spotlight-x) var(--spotlight-y), rgba(59,130,246,0.12), rgba(139,92,246,0.07) 34%, transparent 70%)",
          }}
        />
        <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative flex items-start justify-between gap-4">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white/[0.04] text-zinc-300 transition-all duration-300 group-hover:border-blue-300/30 group-hover:text-blue-200 group-hover:shadow-[0_0_24px_rgba(96,165,250,0.18)]">
            <Icon className="h-[18px] w-[18px]" />
          </span>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white/[0.025] text-zinc-500 transition-all duration-300 group-hover:border-blue-300/30 group-hover:text-blue-200">
            <ExternalLink className="h-4 w-4" />
          </span>
        </div>

        <div className="relative mt-8 flex flex-wrap gap-2">
          {category.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-border bg-white/[0.025] px-2.5 py-1 text-[11px] text-muted transition-colors duration-300 group-hover:border-blue-300/20 group-hover:text-zinc-300"
            >
              {skill}
            </span>
          ))}
          {category.skills.length > 3 ? (
            <span className="rounded-full border border-border bg-white/[0.025] px-2.5 py-1 text-[11px] text-muted">
              +{category.skills.length - 3}
            </span>
          ) : null}
        </div>

        <div className="relative mt-auto pt-8">
          <h3 className="text-xl font-semibold tracking-tight text-foreground transition-all duration-300 group-hover:text-shimmer">
            {category.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
            {category.summary}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

export function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const [selectedCategory, setSelectedCategory] = useState<(typeof skillCategories)[number] | null>(null);

  useEffect(() => {
    if (!selectedCategory) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedCategory(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCategory]);

  return (
    <section id="skills" className="py-32 border-t border-border">
      <div ref={ref} className="mx-auto max-w-[104rem] px-6 lg:px-10 xl:px-12">
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

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {skillCategories.map((category, index) => (
            <ExpertiseSpotlightCard
              key={category.title}
              category={category}
              index={index}
              isInView={isInView}
              onOpen={() => setSelectedCategory(category)}
            />
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
              View Full PDF Report
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

      {typeof document !== "undefined"
        ? createPortal(
      <AnimatePresence>
        {selectedCategory ? (
          <motion.div
            className="fixed inset-0 z-[9999] flex min-h-dvh items-start justify-center overflow-x-hidden overflow-y-auto bg-black/75 px-4 py-6 backdrop-blur-xl sm:py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedCategory.title} details`}
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div
              layoutId={expandableCardLayoutId("skill", selectedCategory.title)}
              transition={expandableCardTransition}
              onClick={(event) => event.stopPropagation()}
              className="relative my-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-[#080719]/95 p-6 shadow-2xl shadow-blue-950/40 md:p-8"
            >
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-all duration-300 hover:border-blue-300/50 hover:bg-blue-400/10"
                aria-label="Close skill details"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/70 to-transparent" />
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 left-8 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />

              <div className="relative">
                <span className="text-xs font-mono uppercase tracking-[0.35em] text-blue-300">
                  Skill Detail
                </span>
                <h3 className="mt-3 pr-12 text-3xl font-semibold text-white md:text-5xl">
                  {selectedCategory.title}
                </h3>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-zinc-300 md:text-lg">
                  {selectedCategory.summary}
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {selectedCategory.imageSet.map((image) => (
                    <div
                      key={image.alt}
                      className="flex min-h-24 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/30 hover:bg-blue-400/[0.08]"
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="h-14 w-14 object-contain drop-shadow-[0_0_20px_rgba(96,165,250,0.25)]"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
                  <div className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
                    <h4 className="text-lg font-semibold text-white">How I use these skills</h4>
                    {selectedCategory.details.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-relaxed text-zinc-400 md:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-blue-300/20 bg-blue-400/[0.06] p-5 md:p-6">
                    <h4 className="text-lg font-semibold text-white">What this means for projects</h4>
                    <ul className="mt-5 space-y-3">
                      {selectedCategory.proofPoints.map((point) => (
                        <li key={point} className="flex gap-3 text-sm text-zinc-300">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300 shadow-[0_0_12px_rgba(147,197,253,0.9)]" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
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
