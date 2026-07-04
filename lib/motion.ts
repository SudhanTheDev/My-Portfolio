export const ease = [0.25, 0.1, 0.25, 1] as const;
export const easeOut = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const transition = {
  default: { duration: 0.55, ease: easeOut },
  fast: { duration: 0.35, ease: ease },
  slow: { duration: 0.75, ease: easeOut },
};

export const viewport = { once: true, margin: "-80px" as const };
