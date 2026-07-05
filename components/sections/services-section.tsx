"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionHeader } from "@/components/section-header";
import { fadeUp, transition, viewport } from "@/lib/motion";

const services = [
  { icon: "📱", title: "Flutter Development", items: ["Cross-platform Apps", "Modern UI", "Firebase", "Supabase"] },
  { icon: "🌐", title: "Website Development", items: ["React", "Next.js", "Responsive", "Performance"] },
  { icon: "🎨", title: "UI/UX Design", items: ["Figma", "Prototyping", "User Research", "Design Systems"] },
  { icon: "🎬", title: "Creative Services", items: ["Photography", "Videography", "Branding", "Graphic Design"] },
];

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewport);

  return (
    <section id="services" className="py-32 relative">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader label="What I Do" title="Services & Expertise" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.05 + index * 0.05 }}
              className="group glow-card p-6"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
              <h3 className="text-lg font-bold mb-4 text-foreground font-display group-hover:text-shimmer group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all">
                {service.title}
              </h3>
              <ul className="space-y-2">
                {service.items.map((item) => (
                  <li key={item} className="text-sm text-muted flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-violet-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
