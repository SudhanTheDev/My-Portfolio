"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/app/theme-provider";

const LETTERS = ["S", "U", "Z", "Z", "Y"];
const MINIMUM_LOADER_MS = 1200;
const ASSET_TIMEOUT_MS = 9000;

const preloadAssets = [
  "/profile.jpg",
  "/profile-gallery/photo-1.jpg",
  "/profile-gallery/photo-2.jpg",
  "/profile-gallery/photo-4.jpg",
  "/profile-gallery/photo-5.jpg",
  "/profile-gallery/photo-6.jpg",
  "/profile-gallery/photo-7.jpg",
  "/profile-gallery/photo-8.jpg",
  "/ngl-icon.png",
  "/music/background.mp3",
  "/sudhan-bhattarai-cv.pdf",
  "/digital-competences-report.pdf",
  "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/8438923/pexels-photo-8438923.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/17483868/pexels-photo-17483868.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/18069157/pexels-photo-18069157.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/193003/pexels-photo-193003.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/4386339/pexels-photo-4386339.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/3379942/pexels-photo-3379942.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1366909/pexels-photo-1366909.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/533769/pexels-photo-533769.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/21014/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1634025/pexels-photo-1634025.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3584991/pexels-photo-3584991.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1028225/pexels-photo-1028225.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/214574/pexels-photo-214574.jpeg?auto=compress&cs=tinysrgb&w=800",
] as const;

type LoaderPhase = "intro" | "outro";
type LoaderStatus = "Preparing" | "Loading assets" | "Finalizing" | "Ready";

function IntroLoaderVisual({
  phase = "intro",
  loaded = 0,
  total = preloadAssets.length + 1,
  status = "Preparing",
  onSkip,
}: {
  phase?: LoaderPhase;
  loaded?: number;
  total?: number;
  status?: LoaderStatus;
  onSkip?: () => void;
}) {
  const isExiting = phase === "outro";
  const { theme, setTheme, mounted } = useTheme();
  const progress = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0;
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
      role="dialog"
      aria-label="Loading portfolio"
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
            {status}
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
            initial={{ opacity: 0, y: 16 }}
            animate={
              isExiting
                ? {
                    opacity: 0,
                    y: 14,
                    filter: "blur(8px)",
                    transition: { duration: 0.24 },
                  }
                : {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.72, delay: 0.34, ease: [0.22, 1, 0.36, 1] },
                  }
            }
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {[
              { value: "light" as const, label: "Light" },
              { value: "dark" as const, label: "Dark" },
            ].map((option) => {
              const selected = mounted && theme === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTheme(option.value)}
                  disabled={isExiting}
                  className={`rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.28em] transition-all duration-300 ${
                    selected
                      ? "border-slate-900/70 bg-slate-950 text-white shadow-[0_18px_42px_rgba(15,23,42,0.18)]"
                      : "border-slate-300/80 bg-white/56 text-slate-600 shadow-[0_12px_32px_rgba(148,163,184,0.14)] hover:border-slate-500 hover:text-slate-950"
                  }`}
                  aria-pressed={selected}
                >
                  {option.label}
                </button>
              );
            })}
          </motion.div>

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
            className="w-[16rem] max-w-full"
          >
            <div className="mb-3 flex items-center justify-between text-[0.68rem] font-mono uppercase tracking-[0.24em] text-slate-500">
              <span>Assets</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-300/45">
              <motion.div
                initial={{ width: "0%" }}
                animate={
                  isExiting
                    ? {
                        width: "100%",
                        opacity: 0,
                        transition: { duration: 0.24 },
                      }
                    : {
                        width: `${progress}%`,
                        opacity: 1,
                        transition: { duration: 0.35, ease: "easeOut" },
                      }
                }
                className="h-full rounded-full bg-gradient-to-r from-blue-400 via-violet-400 to-pink-300 shadow-[0_0_18px_rgba(168,85,247,0.38)]"
              />
            </div>
            <div className="mt-3 text-[0.68rem] font-mono uppercase tracking-[0.2em] text-slate-400">
              {loaded} / {total} ready
            </div>
          </motion.div>

          {onSkip ? (
            <motion.button
              type="button"
              onClick={onSkip}
              disabled={isExiting}
              initial={{ opacity: 0, y: 12 }}
              animate={
                isExiting
                  ? { opacity: 0, y: 10, transition: { duration: 0.2 } }
                  : { opacity: 1, y: 0, transition: { duration: 0.55, delay: 0.6 } }
              }
              className="rounded-full border border-slate-300/80 bg-white/58 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-[0_12px_32px_rgba(148,163,184,0.14)] transition-all duration-300 hover:border-slate-700 hover:bg-white/85 hover:text-slate-950 disabled:pointer-events-none"
            >
              Skip
            </motion.button>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

export function IntroLoader() {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<LoaderPhase>("intro");
  const [loaded, setLoaded] = useState(0);
  const [status, setStatus] = useState<LoaderStatus>("Preparing");
  const finishedRef = useRef(false);
  const previousOverflowRef = useRef("");

  const hideLoader = useCallback(() => {
    if (finishedRef.current) return;

    finishedRef.current = true;
    setStatus("Ready");
    setPhase("outro");

    window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = previousOverflowRef.current;
    }, 950);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    previousOverflowRef.current = previousOverflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const startedAt = performance.now();

    const withTimeout = (promise: Promise<unknown>) =>
      new Promise<void>((resolve) => {
        const timeoutId = window.setTimeout(resolve, ASSET_TIMEOUT_MS);

        promise
          .catch(() => undefined)
          .finally(() => {
            window.clearTimeout(timeoutId);
            resolve();
          });
      });

    const loadImage = (src: string) =>
      withTimeout(
        new Promise<void>((resolve, reject) => {
          const image = new window.Image();
          image.decoding = "async";
          image.loading = "eager";
          image.onload = () => {
            if ("decode" in image) {
              image.decode().then(resolve).catch(resolve);
              return;
            }

            resolve();
          };
          image.onerror = reject;
          image.src = src;
        })
      );

    const loadFetchable = (src: string) =>
      withTimeout(
        fetch(src, { cache: "force-cache" }).then((response) => {
          if (!response.ok) {
            throw new Error(`Could not preload ${src}`);
          }
        })
      );

    const loadAsset = (src: string) => {
      if (/\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(src)) {
        return loadImage(src);
      }

      return loadFetchable(src);
    };

    const loadFonts = () =>
      withTimeout(
        document.fonts
          ? document.fonts.ready.then(() => undefined)
          : Promise.resolve()
      );

    const run = async () => {
      setStatus("Loading assets");

      const tasks = [loadFonts(), ...preloadAssets.map((asset) => loadAsset(asset))];

      await Promise.all(
        tasks.map(async (task) => {
          await task;

          if (!cancelled) {
            setLoaded((current) => Math.min(tasks.length, current + 1));
          }
        })
      );

      if (cancelled || finishedRef.current) return;

      setStatus("Finalizing");
      const elapsed = performance.now() - startedAt;
      const remainingDelay = Math.max(0, MINIMUM_LOADER_MS - elapsed);

      window.setTimeout(() => {
        if (!cancelled) {
          hideLoader();
        }
      }, remainingDelay);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [hideLoader]);

  return (
    <AnimatePresence>
      {visible ? (
        <IntroLoaderVisual
          phase={phase}
          loaded={loaded}
          total={preloadAssets.length + 1}
          status={status}
          onSkip={hideLoader}
        />
      ) : null}
    </AnimatePresence>
  );
}

export { IntroLoaderVisual };
