"use client";

import { motion, useInView } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { viewport } from "@/lib/motion";

const services = [
  { icon: "📱", title: "Flutter Development", items: ["Cross-platform Apps", "Modern UI", "Firebase", "Supabase"] },
  { icon: "🌐", title: "Website Development", items: ["React", "Next.js", "Responsive", "Performance"] },
  { icon: "🎨", title: "UI/UX Design", items: ["Prototyping", "User Flow", "Visual Polish", "Design Systems"] },
  { icon: "🎬", title: "Creative Services", items: ["Photography", "Videography", "Branding", "Graphic Design"] },
  { icon: "🤖", title: "AI Experiments", items: ["Prompting", "Automation", "Creative AI", "Problem Solving"] },
  { icon: "⌨️", title: "Programming", items: ["C Programming", "JavaScript", "Python", "Git/GitHub"] },
  { icon: "🧠", title: "IT Foundations", items: ["Databases", "Web Tech", "Hardware Basics", "Office Tools"] },
  { icon: "📊", title: "Office Work", items: ["Word", "Excel", "PowerPoint", "Records"] },
  { icon: "💬", title: "Communication", items: ["Email Handling", "Scheduling", "Customer Support", "Collaboration"] },
  { icon: "🧾", title: "Virtual Assistant", items: ["Research", "Online Forms", "Documents", "Follow-ups"] },
  { icon: "🛡️", title: "Digital Safety", items: ["Data Safety", "Reliability Checks", "Digital Identity", "Tool Choice"] },
  { icon: "📣", title: "Social Media", items: ["Content Support", "Posting", "Visual Ideas", "Online Presence"] },
];

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewport);
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const [activePage, setActivePage] = useState(0);

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

  const pageCount = Math.ceil(services.length / cardsPerPage);
  const servicePages = Array.from({ length: pageCount }, (_, pageIndex) =>
    services.slice(
      pageIndex * cardsPerPage,
      pageIndex * cardsPerPage + cardsPerPage
    )
  );

  useEffect(() => {
    setActivePage((page) => Math.min(page, pageCount - 1));
  }, [pageCount]);

  const changePage = (direction: "left" | "right") => {
    setActivePage((page) => {
      if (direction === "left") {
        return page === 0 ? pageCount - 1 : page - 1;
      }

      return page === pageCount - 1 ? 0 : page + 1;
    });
  };

  return (
    <section id="services" className="relative overflow-hidden py-32">
      <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
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

          <div
            className="min-w-0 flex-1 overflow-visible py-10 [clip-path:inset(-120px_0_-120px_0)]"
          >
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
                    <motion.article
                      key={service.title}
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      whileHover={{
                        scale: 1.04,
                        y: -8,
                        transition: { duration: 0.16, delay: 0, ease: "easeOut" },
                      }}
                      transition={{ duration: 0.5, delay: 0.05 + index * 0.05 }}
                      className="group glow-card min-h-[254px] min-w-0 p-6"
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
                    </motion.article>
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
    </section>
  );
}
