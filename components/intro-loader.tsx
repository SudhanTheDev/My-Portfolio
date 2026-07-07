"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const LETTERS = ["S", "U", "Z", "Z", "Y"];

type LoaderPhase = "intro" | "outro";

function IntroLoaderVisual({ phase = "intro" }: { phase?: LoaderPhase }) {
  const isExiting = phase === "outro";
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => ({
        id: index,
        left: 8 + ((index * 11) % 84),
        top: 12 + ((index * 17) % 72),
        size: 4 + (index % 3) * 2,
        duration: 3.8 + (index % 4) * 0.45,
        delay: index * 0.08,
      })),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={
        isExiting
          ? {
              opacity: 0,
              scale: 1.02,
              filter: "blur(16px)",
              transition: {
                duration: 0.9,
                delay: 0.34,
                ease: [0.22, 1, 0.36, 1],
              },
            }
          : {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              transition: { duration: 0.3 },
            }
      }
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="fixed inset-0 z-[120] overflow-hidden bg-[#f7f8ff] text-slate-900"
      aria-hidden
    >
      <motion.div
        animate={
          isExiting
            ? { opacity: 0.6, scale: 1.08, filter: "blur(2px)" }
            : { opacity: 1, scale: 1, filter: "blur(0px)" }
        }
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(96,165,250,0.22),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(244,114,182,0.18),transparent_24%),radial-gradient(circle_at_72%_72%,rgba(250,204,21,0.16),transparent_22%),radial-gradient(circle_at_28%_76%,rgba(52,211,153,0.16),transparent_20%),linear-gradient(180deg,#fbfcff_0%,#eef4ff_46%,#fff7fb_100%)]"
      />

      <motion.div
        initial={{ opacity: 0.3, scale: 0.9 }}
        animate={
          isExiting
            ? {
                opacity: 0.2,
                scale: 1.24,
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              }
            : {
                opacity: 0.9,
                scale: 1.12,
                transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] },
              }
        }
        className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.96)_0%,rgba(191,219,254,0.62)_26%,rgba(196,181,253,0.34)_44%,rgba(244,114,182,0.22)_60%,transparent_78%)] blur-3xl"
      />

      <motion.div
        animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.28 }}
        className="absolute inset-0"
      >
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            initial={{ opacity: 0, scale: 0.4, y: 18 }}
            animate={{
              opacity: [0, 0.9, 0],
              scale: [0.4, 1, 0.6],
              y: [18, -10, -34],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-white/90 shadow-[0_0_18px_rgba(96,165,250,0.35)]"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
          />
        ))}
      </motion.div>

      <div className="relative flex h-full w-full items-center justify-center">
        <div className="relative flex flex-col items-center gap-8 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={
              isExiting
                ? {
                    opacity: 0,
                    y: -14,
                    filter: "blur(8px)",
                    transition: { duration: 0.24 },
                  }
                : {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                  }
            }
            className="text-[1.02rem] font-mono uppercase tracking-[0.78em] text-slate-500 sm:text-[1.16rem]"
          >
            Loading Portfolio
          </motion.div>

          <div className="relative flex flex-col items-center gap-11">
            <motion.div
              animate={
                isExiting
                  ? {
                      opacity: 0,
                      scaleX: 0.7,
                      filter: "blur(10px)",
                      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                    }
                  : {
                      opacity: [0.42, 0.85, 0.42],
                      scaleX: [0.92, 1, 0.92],
                      transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
                    }
              }
              className="h-px w-[15rem] max-w-full bg-gradient-to-r from-transparent via-sky-400/55 to-transparent shadow-[0_0_24px_rgba(96,165,250,0.22)]"
            />

            <div className="relative flex items-center justify-center gap-2 sm:gap-4">
              {LETTERS.map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  initial={{ opacity: 0, y: 48, rotateX: -80, filter: "blur(12px)" }}
                  animate={
                    isExiting
                      ? {
                          opacity: 0,
                          y: index % 2 === 0 ? -28 : 26,
                          x: (index - 2) * 10,
                          rotate: index % 2 === 0 ? -6 : 6,
                          scale: 0.95,
                          filter: "blur(10px)",
                          transition: {
                            duration: 0.34,
                            delay: index * 0.025,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        }
                      : {
                          opacity: 1,
                          y: 0,
                          x: 0,
                          rotateX: 0,
                          rotate: 0,
                          scale: 1,
                          filter: "blur(0px)",
                          transition: {
                            duration: 0.78,
                            delay: 0.12 + index * 0.08,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        }
                  }
                  className="relative font-brand text-[3.7rem] font-extrabold uppercase leading-none tracking-[0.22em] text-transparent sm:text-[5.8rem] lg:text-[7.4rem]"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(37,99,235,0.9) 22%, rgba(124,58,237,0.88) 52%, rgba(236,72,153,0.84) 78%, rgba(20,184,166,0.84) 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    textShadow: "0 10px 28px rgba(148,163,184,0.22)",
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            <motion.div
              animate={
                isExiting
                  ? {
                      opacity: 0,
                      scaleX: 0.7,
                      filter: "blur(10px)",
                      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                    }
                  : {
                      opacity: [0.42, 0.85, 0.42],
                      scaleX: [0.92, 1, 0.92],
                      transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
                    }
              }
              className="h-px w-[15rem] max-w-full bg-gradient-to-r from-transparent via-fuchsia-300/55 to-transparent shadow-[0_0_24px_rgba(244,114,182,0.2)]"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={
              isExiting
                ? {
                    opacity: 0,
                    y: 18,
                    filter: "blur(8px)",
                    transition: { duration: 0.24 },
                  }
                : {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.75, delay: 0.45, ease: [0.22, 1, 0.36, 1] },
                  }
            }
            className="w-[14rem] max-w-full"
          >
            <div className="h-px w-full overflow-hidden rounded-full bg-slate-300/45">
              <motion.div
                initial={{ x: "-100%" }}
                animate={
                  isExiting
                    ? {
                        x: "140%",
                        opacity: 0,
                        transition: { duration: 0.24 },
                      }
                    : {
                        x: "100%",
                        opacity: 1,
                        transition: { duration: 1.35, ease: "easeInOut", repeat: Infinity },
                      }
                }
                className="h-full w-1/2 bg-gradient-to-r from-transparent via-violet-400 to-pink-300 shadow-[0_0_18px_rgba(168,85,247,0.38)]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function IntroLoader() {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<LoaderPhase>("intro");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const outroTimer = window.setTimeout(() => {
      setPhase("outro");
    }, 1500);

    const hideTimer = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = previousOverflow;
    }, 2800);

    return () => {
      window.clearTimeout(outroTimer);
      window.clearTimeout(hideTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return <AnimatePresence>{visible ? <IntroLoaderVisual phase={phase} /> : null}</AnimatePresence>;
}

export { IntroLoaderVisual };
