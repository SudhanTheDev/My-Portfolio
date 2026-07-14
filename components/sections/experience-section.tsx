"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    quote:
      "Sudhan delivered an exceptional Flutter app that exceeded our expectations. His attention to detail and modern design sense made all the difference.",
    author: "Client",
    role: "Startup Founder",
    image:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
    accent: "#60a5fa",
  },
  {
    quote:
      "Working with Sudhan was a great experience. He understood our vision and translated it into a clean, thoughtful digital product.",
    author: "John M.",
    role: "Product Manager",
    image:
      "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400",
    accent: "#a78bfa",
  },
  {
    quote:
      "The website Sudhan built is visually strong and easy to use. The final result feels polished, responsive, and full of personality.",
    author: "Sarah K.",
    role: "Creative Director",
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    accent: "#f472b6",
  },
  {
    quote:
      "He brings a rare mix of technical thinking and visual creativity. Ideas become clearer once Sudhan starts shaping the interface.",
    author: "Aarav P.",
    role: "Project Collaborator",
    initials: "AP",
    accent: "#22d3ee",
  },
  {
    quote:
      "Sudhan listened carefully, organized the work well, and made each revision feel purposeful rather than simply decorative.",
    author: "Maya R.",
    role: "Small Business Owner",
    initials: "MR",
    accent: "#fbbf24",
  },
  {
    quote:
      "His communication was clear from start to finish. He explained technical choices simply and kept the project moving forward.",
    author: "Niraj T.",
    role: "Creative Collaborator",
    initials: "NT",
    accent: "#34d399",
  },
  {
    quote:
      "The layouts feel modern without becoming confusing. Sudhan has a good eye for hierarchy, spacing, motion, and small details.",
    author: "Riya S.",
    role: "UI Feedback Partner",
    initials: "RS",
    accent: "#818cf8",
  },
  {
    quote:
      "Reliable, patient, and willing to experiment. He consistently found practical ways to improve both the design and experience.",
    author: "Kiran B.",
    role: "Studio Client",
    initials: "KB",
    accent: "#fb7185",
  },
  {
    quote:
      "Sudhan learns quickly and approaches problems with curiosity. His strongest work appears when technology and storytelling meet.",
    author: "Samir A.",
    role: "Technical Project Peer",
    initials: "SA",
    accent: "#2dd4bf",
  },
] as const;

const reviewsPerPage = 3;
const pageCount = Math.ceil(testimonials.length / reviewsPerPage);

const pageVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 70 : -70,
    filter: "blur(10px)",
  }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -70 : 70,
    filter: "blur(10px)",
  }),
};

export function ExperienceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const [activePage, setActivePage] = useState(0);
  const [direction, setDirection] = useState(1);

  const showPage = (nextPage: number) => {
    const resolved = (nextPage + pageCount) % pageCount;
    setDirection(resolved === activePage ? direction : nextPage > activePage ? 1 : -1);
    setActivePage(resolved);
  };

  useEffect(() => {
    if (!isInView) return;

    const intervalId = window.setInterval(() => {
      setDirection(1);
      setActivePage((current) => (current + 1) % pageCount);
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, [activePage, isInView]);

  const visibleTestimonials = testimonials.slice(
    activePage * reviewsPerPage,
    activePage * reviewsPerPage + reviewsPerPage
  );

  return (
    <section id="testimonials" className="relative overflow-hidden border-t border-border py-32">
      <div className="pointer-events-none absolute right-[8%] top-20 h-32 w-32 rotate-12 border border-violet-300/10 [clip-path:polygon(50%_0,100%_38%,82%_100%,18%_100%,0_38%)]" />

      <div ref={ref} className="relative mx-auto max-w-[104rem] px-6 lg:px-10 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-4 block">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight drop-shadow-[0_0_25px_rgba(147,197,253,0.5)]">
              What People Say{" "}
              <span className="text-foreground">{"\u{1F4AC}"}</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => showPage(activePage - 1)}
              aria-label="Show previous reviews"
              className="flex h-11 w-11 items-center justify-center border border-white/15 bg-white/[0.04] text-zinc-300 [clip-path:polygon(22%_0,100%_0,100%_78%,78%_100%,0_100%,0_22%)] transition-all hover:border-blue-300/50 hover:bg-blue-400/10 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => showPage(activePage + 1)}
              aria-label="Show next reviews"
              className="flex h-11 w-11 items-center justify-center border border-white/15 bg-white/[0.04] text-zinc-300 [clip-path:polygon(22%_0,100%_0,100%_78%,78%_100%,0_100%,0_22%)] transition-all hover:border-violet-300/50 hover:bg-violet-400/10 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        <div className="relative min-h-[23rem]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activePage}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-7"
            >
              {visibleTestimonials.map((testimonial, index) => (
                <motion.article
                  key={testimonial.author}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.09 }}
                  className="testimonial-panel group relative flex min-h-[22rem] flex-col overflow-hidden p-7 md:p-8"
                  style={{ "--testimonial-accent": testimonial.accent } as React.CSSProperties}
                >
                  <div className="absolute right-5 top-5 text-white/10 transition-all duration-500 group-hover:rotate-6 group-hover:text-white/20">
                    <Quote className="h-12 w-12" />
                  </div>
                  <span className="mb-10 block h-1 w-14 bg-[var(--testimonial-accent)] shadow-[0_0_22px_var(--testimonial-accent)]" />
                  <p className="relative text-base leading-7 text-zinc-300 md:text-lg">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-auto flex items-center gap-4 pt-8">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden text-xs font-bold text-white [clip-path:polygon(50%_0,100%_28%,86%_100%,14%_100%,0_28%)]"
                      style={{ backgroundColor: testimonial.accent }}
                    >
                      {"image" in testimonial ? (
                        <img
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                        />
                      ) : (
                        testimonial.initials
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{testimonial.author}</p>
                      <p className="mt-1 text-xs text-zinc-500">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-9 flex items-center justify-center gap-2" aria-label="Review pages">
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => showPage(index)}
              aria-label={`Show review page ${index + 1}`}
              aria-current={activePage === index ? "true" : undefined}
              className={`h-1.5 transition-all duration-500 [clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)] ${
                activePage === index
                  ? "w-14 bg-gradient-to-r from-blue-400 to-violet-400"
                  : "w-7 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
