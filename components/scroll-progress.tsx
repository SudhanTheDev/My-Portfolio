"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const sparkleOpacity = useTransform(scrollYProgress, [0, 0.03, 1], [0, 1, 1]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const lastProgressRef = useRef(0);
  const stopTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const previous = lastProgressRef.current;
      const delta = latest - previous;

      lastProgressRef.current = latest;

      if (Math.abs(delta) < 0.00015) {
        return;
      }

      setScrollDirection(delta > 0 ? "down" : "up");
      setIsScrolling(true);

      if (stopTimerRef.current) {
        window.clearTimeout(stopTimerRef.current);
      }

      stopTimerRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 340);
    });

    return () => {
      unsubscribe();
      if (stopTimerRef.current) {
        window.clearTimeout(stopTimerRef.current);
      }
    };
  }, [scrollYProgress]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
      <motion.div
        style={{ scaleX }}
        className="scroll-progress-bar relative h-[2px] origin-left"
      >
        <motion.div
          style={{ opacity: sparkleOpacity }}
          className="scroll-progress-sparkle absolute right-0 top-1/2 h-[2px] w-5 -translate-y-1/2"
        >
          <span className="scroll-progress-sparkle-streak absolute inset-0" />
          <span className="scroll-progress-sparkle-flare horizontal absolute right-0 top-1/2 h-[1px] w-5 -translate-y-1/2" />
          <span
            className={`scroll-progress-burst scroll-progress-burst-${scrollDirection} ${
              isScrolling ? "is-active" : ""
            }`}
          >
            <span className="scroll-progress-particle particle-1" />
            <span className="scroll-progress-particle particle-2" />
            <span className="scroll-progress-particle particle-3" />
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
