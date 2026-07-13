"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const timeline = [
  {
    year: "2022 - Present",
    title: "BIT Student",
    description:
      "Studying Bachelor in Information Technology at Kuleshwor Awas Campus with focus on programming, web technologies, databases, hardware, and logical problem solving.",
  },
  {
    year: "2026",
    title: "Advanced Digital Competence",
    description:
      "Self-assessed at Advanced Level 6/6 across information literacy, digital collaboration, content creation, safety, and problem solving.",
  },
  {
    year: "2021 - Present",
    title: "Freelance Creative",
    description:
      "Creating visual content through photography, videography, graphics design, and social media support.",
  },
  {
    year: "Moment Creation",
    title: "Studio & Front Desk Experience",
    description:
      "Handled visitors, calls, emails, schedules, records, office documents, and customer support in a digital studio environment.",
  },
  {
    year: "2023 - Present",
    title: "AI Builder",
    description: "Exploring AI technologies and building AI-powered applications.",
  },
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <section id="about" className="py-32 border-t border-border">
      <div ref={ref} className="mx-auto max-w-[104rem] px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-4 block">
              About
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-8 drop-shadow-[0_0_25px_rgba(147,197,253,0.5)]">
              About Me
            </h2>
            <div className="space-y-6 text-lg text-zinc-400 leading-relaxed">
              <p>
                I&apos;m Sudhan, a BIT student from <span className="text-white">Nepal</span> with a strong interest in business, technology, and creative digital work.
              </p>
              <p>
                My background mixes coding, web technologies, Microsoft Office, social media, photography, videography, and graphics design, so I enjoy projects where technical thinking meets visual storytelling.
              </p>
              <p>
                I&apos;m organized, responsible, and always learning, with advanced digital competence results across data literacy, collaboration, content creation, online safety, and problem solving.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/digital-competences-report.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-blue-300/30 bg-blue-400/10 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/60 hover:bg-blue-400/15 hover:shadow-lg hover:shadow-blue-500/15"
              >
                View Digital Competence Report
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {timeline.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="group relative pl-8 border-l-2 border-border hover:border-purple-500/50 transition-all duration-500"
              >
                <div className="absolute left-0 top-0 w-3 h-3 -translate-x-[6px] rounded-full bg-zinc-800 group-hover:bg-purple-400 group-hover:shadow-[0_0_12px_rgba(192,132,252,0.8)] transition-all duration-500" />
                <div className="glass-card rounded-xl p-5 hover:shadow-lg hover:shadow-purple-500/15 transition-all duration-300 hover:scale-[1.02]">
                  <span className="text-xs font-mono text-zinc-500 tracking-wider mb-2 block group-hover:text-purple-400 transition-colors duration-300">
                    {item.year}
                  </span>
                  <h3 className="text-lg font-medium text-white mb-2 group-hover:text-purple-200 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
