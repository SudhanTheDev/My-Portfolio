"use client";

import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { interestCards } from "@/lib/interests";

function getCircularOffset(index: number, activeIndex: number) {
  const total = interestCards.length;
  let offset = (index - activeIndex + total) % total;

  if (offset > total / 2) {
    offset -= total;
  }

  return offset;
}

export function PersonalitySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + interestCards.length) % interestCards.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % interestCards.length);
  };

  return (
    <section id="personality" className="relative overflow-hidden border-t border-border py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.07] blur-[120px]" />

      <div ref={ref} className="relative mx-auto max-w-[104rem] px-6 lg:px-10 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span className="mb-4 block text-xs font-mono uppercase tracking-widest text-zinc-500">
              /Beyond Coding
            </span>
            <h2 className="text-4xl font-medium tracking-tight drop-shadow-[0_0_25px_rgba(147,197,253,0.5)] md:text-5xl lg:text-6xl">
              Interests <span className="align-middle text-3xl md:text-4xl">✦</span>
            </h2>
          </div>
          <div className="max-w-md md:text-right">
            <p className="text-sm leading-relaxed text-zinc-400">
              A visual stack of the worlds, ideas, and places that keep me curious beyond code.
            </p>
            <p className="mt-3 font-mono text-xs tracking-[0.24em] text-blue-300">
              {String(activeIndex + 1).padStart(2, "0")} / {String(interestCards.length).padStart(2, "0")}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.65, delay: 0.12 }}
          className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:gap-5 lg:gap-10"
        >
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Show previous interest"
            className="relative z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-zinc-300 backdrop-blur-xl transition-all duration-300 hover:-translate-x-1 hover:border-blue-300/50 hover:bg-blue-400/10 hover:text-white hover:shadow-[0_0_30px_rgba(96,165,250,0.24)] sm:h-14 sm:w-14"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="relative h-[28rem] min-w-0 overflow-hidden sm:h-[31rem] lg:overflow-visible">
            {interestCards.map((interest, index) => {
              const offset = getCircularOffset(index, activeIndex);
              const distance = Math.abs(offset);
              const isVisible = distance <= 2;
              const isActive = offset === 0;
              const x = isVisible ? `${offset * 72}%` : `${offset < 0 ? -190 : 190}%`;

              return (
                <div
                  key={interest.title}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  aria-hidden={!isVisible}
                >
                  <motion.button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show ${interest.title}`}
                    aria-current={isActive ? "true" : undefined}
                    tabIndex={isVisible ? 0 : -1}
                    initial={false}
                    animate={{
                      x,
                      y: distance * 24,
                      rotate: offset * 8,
                      scale: isActive ? 1 : distance === 1 ? 0.91 : 0.82,
                      opacity: isVisible ? (isActive ? 1 : distance === 1 ? 0.78 : 0.46) : 0,
                    }}
                    transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={isVisible ? { y: distance * 24 - 8, scale: isActive ? 1.02 : distance === 1 ? 0.93 : 0.84 } : undefined}
                    className="pointer-events-auto relative h-[23rem] w-[14.5rem] overflow-hidden rounded-[1.7rem] border border-white/15 bg-[#0a0918] text-left shadow-[0_28px_80px_rgba(0,0,0,0.46)] outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70 sm:h-[26rem] sm:w-[17rem]"
                    style={{
                      zIndex: 20 - distance,
                      pointerEvents: isVisible ? "auto" : "none",
                      transformOrigin: "50% 115%",
                      boxShadow: isActive
                        ? `0 30px 90px rgba(0,0,0,0.55), 0 0 42px ${interest.accent}33`
                        : "0 24px 70px rgba(0,0,0,0.45)",
                    }}
                  >
                    <img
                      src={interest.image}
                      alt={`${interest.title} interest`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#070611] via-[#070611]/20 to-black/5" />
                    <span
                      className="absolute inset-x-0 top-0 h-28 opacity-50"
                      style={{ background: `linear-gradient(180deg, ${interest.accent}55, transparent)` }}
                    />

                    <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur-md">
                      {interest.category}
                    </span>

                    <span className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <span className="mb-2 block text-2xl font-semibold text-white drop-shadow-lg">
                        {interest.title}
                      </span>
                      <span className="block text-xs leading-relaxed text-zinc-300/90">
                        {interest.description}
                      </span>
                      <span
                        className="mt-4 block h-0.5 w-12 rounded-full"
                        style={{ backgroundColor: interest.accent, boxShadow: `0 0 16px ${interest.accent}` }}
                      />
                    </span>
                  </motion.button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={showNext}
            aria-label="Show next interest"
            className="relative z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-zinc-300 backdrop-blur-xl transition-all duration-300 hover:translate-x-1 hover:border-violet-300/50 hover:bg-violet-400/10 hover:text-white hover:shadow-[0_0_30px_rgba(167,139,250,0.24)] sm:h-14 sm:w-14"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto mt-16 max-w-4xl border-t border-white/10 pt-10 text-center"
        >
          <p className="text-xl font-light italic leading-relaxed text-zinc-300 md:text-2xl lg:text-3xl">
            &ldquo;I believe in the power of creativity and technology to transform ideas into experiences that inspire and connect people.&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  );
}
