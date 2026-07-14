"use client";

import * as React from "react";
import { motion, type Transition } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { expandableCardTransition } from "@/lib/expandable-motion";
import { cn } from "@/lib/utils";

export interface DiagonalCarouselItem {
  src: string;
  title: string;
  alt?: string;
  category?: string;
  icon?: string;
  meta?: string;
  layoutId?: string;
}

export interface DiagonalCarouselProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: DiagonalCarouselItem[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  onItemClick?: (item: DiagonalCarouselItem, index: number) => void;
  loop?: boolean;
  slideSize?: number;
  rotationStep?: number;
  verticalStep?: number;
  inactiveScale?: number;
  transition?: Transition;
  showControls?: boolean;
  showDots?: boolean;
  viewportClassName?: string;
  controlsClassName?: string;
}

const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  bounce: 0.16,
  duration: 0.85,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function DiagonalCarousel({
  items,
  activeIndex,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  onItemClick,
  loop = false,
  slideSize = 330,
  rotationStep = 24,
  verticalStep = 132,
  inactiveScale = 0.58,
  transition = DEFAULT_TRANSITION,
  showControls = true,
  showDots = true,
  viewportClassName,
  controlsClassName,
  className,
  onKeyDown,
  tabIndex,
  ...props
}: DiagonalCarouselProps) {
  const maxIndex = Math.max(0, items.length - 1);
  const [uncontrolledIndex, setUncontrolledIndex] = React.useState(() =>
    clamp(defaultActiveIndex, 0, maxIndex)
  );
  const currentIndex = clamp(activeIndex ?? uncontrolledIndex, 0, maxIndex);
  const safeSlideSize = Math.max(180, slideSize);
  const safeInactiveScale = clamp(inactiveScale, 0.35, 1);

  const selectSlide = React.useCallback(
    (nextIndex: number) => {
      if (!items.length) return;

      const resolvedIndex = loop
        ? (nextIndex + items.length) % items.length
        : clamp(nextIndex, 0, maxIndex);

      if (activeIndex === undefined) setUncontrolledIndex(resolvedIndex);
      onActiveIndexChange?.(resolvedIndex);
    },
    [activeIndex, items.length, loop, maxIndex, onActiveIndexChange]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectSlide(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectSlide(currentIndex + 1);
    }
  };

  if (!items.length) return null;

  const isPreviousDisabled = !loop && currentIndex === 0;
  const isNextDisabled = !loop && currentIndex === maxIndex;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Services and expertise carousel"
      tabIndex={tabIndex ?? 0}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative isolate h-full w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60",
        className
      )}
      {...props}
    >
      <div className={cn("absolute inset-0 overflow-hidden", viewportClassName)}>
        <motion.div
          className="absolute left-1/2 top-[12%] flex w-fit"
          animate={{ x: -(currentIndex * safeSlideSize + safeSlideSize / 2) }}
          transition={transition}
        >
          {items.map((item, index) => {
            const isActive = currentIndex === index;
            const distance = index - currentIndex;

            return (
              <motion.div
                key={`${item.src}-${index}`}
                className="flex shrink-0 flex-col items-center gap-3 will-change-transform"
                style={{ width: safeSlideSize }}
                animate={{
                  rotate: distance * rotationStep,
                  scale: isActive ? 1 : safeInactiveScale,
                  y: distance * verticalStep,
                  opacity: Math.abs(distance) > 4 ? 0 : 1,
                }}
                transition={transition}
              >
                <motion.div
                  className="flex h-10 items-center justify-center"
                  animate={{
                    opacity: isActive ? 1 : 0,
                    y: isActive ? 0 : 8,
                    scale: isActive ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="whitespace-nowrap font-display text-sm font-semibold text-white sm:text-base">
                    {item.title}
                  </p>
                </motion.div>

                <motion.button
                  type="button"
                  layoutId={item.layoutId}
                  transition={expandableCardTransition}
                  aria-label={
                    isActive
                      ? `Open ${item.title} details`
                      : `Focus ${item.title}`
                  }
                  aria-current={isActive ? "true" : undefined}
                  className="group relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-[1.7rem] border border-white/15 bg-[#090719] text-left shadow-[0_28px_80px_rgba(0,0,0,0.55)] outline-none transition-colors hover:border-white/35 focus-visible:ring-2 focus-visible:ring-blue-300/70"
                  onClick={() => {
                    if (isActive) onItemClick?.(item, index);
                    else selectSlide(index);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.alt ?? item.title}
                    draggable={false}
                    loading={Math.abs(distance) <= 2 ? "eager" : "lazy"}
                    className="h-full w-full select-none object-cover transition-transform duration-700 group-hover:scale-[1.045]"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/5 to-black/90" />
                  <span className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
                    <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
                      {item.category}
                    </span>
                    <span className="text-3xl drop-shadow-lg">{item.icon}</span>
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-6">
                    <span className="block font-display text-2xl font-bold leading-tight text-white drop-shadow-lg">
                      {item.title}
                    </span>
                    <span className="mt-2 block text-xs font-medium leading-relaxed text-white/70">
                      {item.meta}
                    </span>
                    {isActive ? (
                      <span className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                        Open details
                      </span>
                    ) : null}
                  </span>
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {showControls ? (
        <div
          className={cn(
            "absolute inset-x-4 bottom-5 z-20 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-full border border-white/15 bg-[#0b0914]/80 px-2 text-white shadow-2xl backdrop-blur-xl",
            controlsClassName
          )}
        >
          <button
            type="button"
            aria-label="Show previous service"
            disabled={isPreviousDisabled}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            onClick={() => selectSlide(currentIndex - 1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {showDots ? (
            <div className="flex items-center justify-center gap-1.5">
              {items.map((item, index) => (
                <button
                  key={`${item.title}-${index}`}
                  type="button"
                  aria-label={`Show service ${index + 1}: ${item.title}`}
                  aria-current={currentIndex === index ? "true" : undefined}
                  className={cn(
                    "h-2 rounded-full bg-white transition-[width,opacity] duration-300",
                    currentIndex === index ? "w-7 opacity-100" : "w-2 opacity-30"
                  )}
                  onClick={() => selectSlide(index)}
                />
              ))}
            </div>
          ) : null}

          <button
            type="button"
            aria-label="Show next service"
            disabled={isNextDisabled}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            onClick={() => selectSlide(currentIndex + 1)}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
