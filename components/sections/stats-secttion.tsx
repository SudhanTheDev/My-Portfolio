"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
  { value: 25, suffix: "+", label: "Projects Built" },
  { value: 100, suffix: "+", label: "Designs Created" },
  { value: 1000, suffix: "+", label: "Hours Learning" },
  { value: 20, suffix: "+", label: "Technologies" },
];

function AnimatedCounter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let animationFrame = 0;
    let startedAt = 0;
    const duration = 1800;

    const tick = (time: number) => {
      if (!startedAt) startedAt = time;
      const progress = Math.min(1, (time - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(value * eased));

      if (progress < 1) animationFrame = requestAnimationFrame(tick);
      else setCount(value);
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [inView, value]);

  return (
    <span className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <section ref={ref} className="py-20 border-t border-border">
      <div className="mx-auto max-w-[104rem] px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.4, delay: 0.05 + index * 0.05 }}
              whileHover={{ y: -7 }}
              className="stat-prism group relative px-5 py-8 text-center"
            >
              <div className="stat-prism-value mb-3 text-4xl font-semibold md:text-5xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={isInView} />
              </div>
              <p className="text-xs text-zinc-500 font-mono tracking-wider uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
