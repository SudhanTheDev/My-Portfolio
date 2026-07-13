"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { scaleIn, transition } from "@/lib/motion";
import { Crown, Github, Linkedin, Instagram, Mail } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PROFILE_IMAGES = [
  { src: "/profile.jpg", position: "center 18%" },
  { src: "/profile-gallery/photo-7.jpg", position: "center 18%" },
  { src: "/profile-gallery/photo-8.jpg", position: "center 18%" },
];

const CLICK_HOLD_THRESHOLD_MS = 450;

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/Sujan-Nepal",
    icon: Github,
    destination: "GitHub profile",
    accent: "hover:shadow-[0_0_30px_rgba(59,130,246,0.6),0_0_60px_rgba(59,130,246,0.3)]",
    iconClass: "group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,1)]",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/sudhan-bhattarai-662769392/",
    icon: Linkedin,
    destination: "LinkedIn profile",
    accent: "hover:shadow-[0_0_30px_rgba(59,130,246,0.6),0_0_60px_rgba(59,130,246,0.3)]",
    iconClass: "group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,1)]",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/suzzy.3x3",
    icon: Instagram,
    destination: "Instagram profile",
    accent: "hover:shadow-[0_0_30px_rgba(236,72,153,0.6),0_0_60px_rgba(236,72,153,0.3)]",
    iconClass: "group-hover:drop-shadow-[0_0_12px_rgba(236,72,153,1)]",
  },
  {
    name: "Email",
    href: "mailto:sudhan.bhattarainp@gmail.com",
    icon: Mail,
    destination: "email draft",
    accent: "hover:shadow-[0_0_30px_rgba(34,211,238,0.6),0_0_60px_rgba(34,211,238,0.3)]",
    iconClass: "group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,1)]",
  },
] as const;

export function HeroProfile() {
  const [crownHovered, setCrownHovered] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PROFILE_IMAGES.map((image, index) => [image.src, index === 0]))
  );
  const [isInteractive, setIsInteractive] = useState(false);
  const [isHoldingImage, setIsHoldingImage] = useState(false);
  const [pendingLink, setPendingLink] = useState<(typeof socialLinks)[number] | null>(null);
  const pressStartedAtRef = useRef(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 18 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), springConfig);
  const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-16, 16]), springConfig);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const allowInteractiveMotion = isFinePointer && !prefersReducedMotion && window.innerWidth >= 1024;

    setIsInteractive(allowInteractiveMotion);
    if (!allowInteractiveMotion) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (!isInteractive) return;

    const intervalId = window.setInterval(() => {
      if (isHoldingImage) return;

      setActiveImage((current) => {
        const nextIndex = (current + 1) % PROFILE_IMAGES.length;
        const nextImage = PROFILE_IMAGES[nextIndex];

        if (!loadedImages[nextImage.src]) {
          return current;
        }

        return nextIndex;
      });
    }, 12000);

    return () => window.clearInterval(intervalId);
  }, [isHoldingImage, isInteractive, loadedImages]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    PROFILE_IMAGES.forEach((image) => {
      if (loadedImages[image.src]) return;

      const preloader = new window.Image();
      preloader.src = image.src;
      preloader.onload = () => {
        setLoadedImages((current) => ({ ...current, [image.src]: true }));
      };
    });
  }, [loadedImages]);

  const handleSocialClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    link: (typeof socialLinks)[number]
  ) => {
    event.preventDefault();
    setPendingLink(link);
  };

  const handleProceedToLink = () => {
    if (!pendingLink || typeof window === "undefined") return;

    if (pendingLink.href.startsWith("mailto:")) {
      window.location.href = pendingLink.href;
    } else {
      window.open(pendingLink.href, "_blank", "noopener,noreferrer");
    }

    setPendingLink(null);
  };

  const showNextImage = () => {
    setActiveImage((current) => {
      for (let offset = 1; offset <= PROFILE_IMAGES.length; offset += 1) {
        const nextIndex = (current + offset) % PROFILE_IMAGES.length;
        const nextImage = PROFILE_IMAGES[nextIndex];

        if (loadedImages[nextImage.src]) {
          return nextIndex;
        }
      }

      return current;
    });
  };

  const handleImagePointerDown = () => {
    pressStartedAtRef.current = Date.now();
    setIsHoldingImage(true);
  };

  const handleImagePointerUp = () => {
    const pressDuration = Date.now() - pressStartedAtRef.current;
    setIsHoldingImage(false);

    if (pressDuration < CLICK_HOLD_THRESHOLD_MS) {
      showNextImage();
    }
  };

  const handleImagePointerCancel = () => {
    setIsHoldingImage(false);
  };

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      transition={transition.slow}
      className="relative w-full max-w-[390px] mx-auto lg:mx-0"
      style={{ perspective: 1200 }}
    >
      {isInteractive ? (
        <motion.div
          className="absolute -inset-6 rounded-[2.5rem] opacity-80"
          style={{
            x: glowX,
            y: glowY,
            background: "radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(168,85,247,0.2) 40%, transparent 70%)",
            filter: "blur(24px)",
          }}
        />
      ) : null}

      <motion.div
        style={isInteractive ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className="relative overflow-visible"
      >
        <div
          onMouseEnter={() => setCrownHovered(true)}
          onMouseLeave={() => setCrownHovered(false)}
          onFocus={() => setCrownHovered(true)}
          onBlur={() => setCrownHovered(false)}
          className="absolute left-1/2 top-0 z-[80] -translate-x-1/2 -translate-y-1/2"
        >
        <motion.div
          animate={isInteractive ? { y: [0, -6, 0], rotate: [-2, 2.5, -2], scale: [1, 1.04, 1] } : undefined}
          transition={isInteractive ? { duration: 4.8, repeat: Infinity, ease: "easeInOut" } : undefined}
          whileHover={{ scale: 1.08, y: -8 }}
          className="group relative profile-crown-wrap"
        >
          <button
            type="button"
            data-cursor-ignore="true"
            className="profile-crown flex items-center justify-center rounded-full border border-amber-300/30 bg-[#120a1f]/75 p-3 backdrop-blur-md"
            aria-label="Show Sujan crown label"
          >
            <Crown className="h-5 w-5 text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.55)]" />
          </button>
          <div
            className={`pointer-events-none absolute bottom-full left-1/2 z-[90] -translate-x-1/2 transition-all duration-200 ${
              crownHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <div className="profile-crown-label relative mb-4 rounded-full border border-white/10 bg-[#120a1f]/92 px-3 py-1 text-[0.65rem] uppercase tracking-[0.24em] text-amber-200 shadow-[0_0_25px_rgba(251,191,36,0.12)] backdrop-blur-md">
              Sujan
              <span className="profile-crown-label-line absolute left-1/2 top-full h-5 w-px -translate-x-1/2 bg-gradient-to-b from-amber-200/85 to-transparent" />
              <span className="profile-crown-label-dot absolute left-1/2 top-[calc(100%+15px)] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-amber-200/85 shadow-[0_0_10px_rgba(251,191,36,0.55)]" />
            </div>
          </div>
        </motion.div>
        </div>

        <motion.div
          role="button"
          tabIndex={0}
          aria-label="Change profile photo"
          onPointerDown={handleImagePointerDown}
          onPointerUp={handleImagePointerUp}
          onPointerCancel={handleImagePointerCancel}
          onPointerLeave={handleImagePointerCancel}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              showNextImage();
            }
          }}
          whileTap={{ scale: 0.985 }}
          data-cursor="Next"
          className="relative cursor-pointer rounded-[2rem] p-[3px] bg-gradient-to-br from-blue-400/60 via-violet-500/50 to-fuchsia-500/40 shadow-[0_0_60px_rgba(99,102,241,0.35)] outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70"
        >
          <div className="relative aspect-[4/5] w-full select-none overflow-hidden rounded-[1.85rem] bg-surface">
            {PROFILE_IMAGES.map((image, index) => {
              const isVisible = index === activeImage;
              const isLoaded = loadedImages[image.src];

              return (
                <motion.div
                  key={image.src}
                  initial={false}
                  animate={
                    isVisible
                      ? {
                          opacity: 1,
                          scale: 1.04,
                          filter: "blur(0px)",
                          zIndex: 2,
                        }
                      : {
                          opacity: 0,
                          scale: 1.08,
                          filter: "blur(6px)",
                          zIndex: 1,
                        }
                  }
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                  style={{ visibility: isLoaded || isVisible ? "visible" : "hidden" }}
                >
                  <Image
                    src={image.src}
                    alt="Sudhan Bhattarai"
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 340px, 390px"
                    className="object-cover scale-105"
                    style={{ objectPosition: image.position }}
                    onLoad={() => {
                      setLoadedImages((current) =>
                        current[image.src] ? current : { ...current, [image.src]: true }
                      );
                    }}
                  />
                </motion.div>
              );
            })}
            <motion.div
              key={`profile-sweep-${activeImage}`}
              initial={{ opacity: 0, x: "-120%" }}
              animate={isInteractive ? { opacity: [0, 0.3, 0], x: ["-120%", "5%", "120%"] } : { opacity: 0.18, x: "0%" }}
              transition={isInteractive ? { duration: 1.15, ease: "easeInOut" } : { duration: 0.2 }}
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent mix-blend-screen"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[1.85rem]" />
          </div>
        </motion.div>

        {isInteractive ? (
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-2 rounded-[2.1rem] border border-violet-400/30 pointer-events-none"
          />
        ) : null}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition.default, delay: 0.45 }}
        className="absolute -bottom-5 left-4 px-5 py-2.5 glass-card rounded-xl text-xs font-bold tracking-[0.2em] uppercase text-foreground"
      >
        <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
          Creative Developer
        </span>
      </motion.div>

      {/* Social Media Links */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition.default, delay: 0.5 }}
        className="absolute -bottom-20 left-0 right-0 flex items-center justify-center gap-3"
      >
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target={link.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            onClick={(event) => handleSocialClick(event, link)}
            className={`w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all duration-300 group ${link.accent}`}
          >
            <link.icon
              className={`w-5 h-5 text-zinc-400 group-hover:text-white transition-colors ${link.iconClass}`}
            />
          </a>
        ))}
      </motion.div>

      <AlertDialog open={pendingLink !== null} onOpenChange={(open) => !open && setPendingLink(null)}>
        <AlertDialogContent className="leave-page-dialog max-w-md border-white/10 bg-[#120a1f]/96 text-white shadow-[0_20px_80px_rgba(3,0,20,0.5)] backdrop-blur-2xl">
          <AlertDialogHeader className="space-y-3 text-left">
            <span className="leave-page-dialog-kicker text-xs font-mono uppercase tracking-[0.28em] text-zinc-500">
              Leave Page
            </span>
            <AlertDialogTitle className="leave-page-dialog-title text-2xl font-semibold text-white">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="leave-page-dialog-description text-sm leading-relaxed text-zinc-300">
              You&apos;re about to leave this page and open the{" "}
              <span className="leave-page-dialog-emphasis font-semibold text-white">{pendingLink?.destination}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-2 flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:space-x-0">
            <AlertDialogCancel className="leave-page-dialog-cancel mt-0 border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">
              Dismiss
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleProceedToLink}
              className="bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 text-white shadow-[0_0_28px_rgba(99,102,241,0.32)] hover:opacity-95"
            >
              Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
