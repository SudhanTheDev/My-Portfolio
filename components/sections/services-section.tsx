"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const services = [
  {
    icon: "📱",
    title: "Flutter Development",
    items: ["Cross-platform Apps", "Modern UI", "Firebase", "Supabase"],
  },
  {
    icon: "🌐",
    title: "Website Development",
    items: ["React", "Next.js", "Responsive", "Performance"],
  },
  {
    icon: "🎨",
    title: "UI/UX Design",
    items: ["Figma", "Prototyping", "User Research", "Design Systems"],
  },
  {
    icon: "🎬",
    title: "Creative Services",
    items: ["Photography", "Videography", "Branding", "Graphic Design"],
  },
];

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-32 border-t border-zinc-900">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-4 block font-bold">
            ⚡ /What I Do
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-display">
            Services & Expertise
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ translateY: -8 }}
              className="group cursor-pointer"
            >
              <div className="h-full pt-8 px-6 py-8 border-t-2 border-zinc-800 group-hover:border-blue-500 group-hover:bg-blue-500/5 transition-all duration-500 rounded-xl glass-effect hover-glow">
                <motion.div
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-5xl mb-4 inline-block"
                >
                  {service.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-6 text-white group-hover:text-blue-300 transition-colors duration-300 font-display">
                  {service.title}
                </h3>
                <ul className="space-y-3">
                  {service.items.map((item, itemIndex) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + itemIndex * 0.1 }}
                      className="text-sm text-zinc-400 hover:text-blue-300 transition-colors duration-300 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:bg-purple-400 transition-colors duration-300" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
