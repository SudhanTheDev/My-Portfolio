"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { Film, VolumeX, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { InteractiveButton } from "@/components/interactive-button";
import { expandableCardLayoutId, expandableCardTransition } from "@/lib/expandable-motion";
import { galleryMedia, type GalleryMediaItem } from "@/lib/gallery-media";
import { cn } from "@/lib/utils";

const categories = ["All", "Nature", "Urban", "Travel", "Photography", "Motion"] as const;

function GalleryCard({
  item,
  index,
  isInView,
  className,
  onOpen,
}: {
  item: GalleryMediaItem;
  index: number;
  isInView: boolean;
  className?: string;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      layoutId={expandableCardLayoutId("gallery", item.id)}
      data-cursor="Open"
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.97 }}
      transition={{ duration: 0.55, delay: 0.08 + index * 0.06, layout: expandableCardTransition }}
      whileHover={{ y: -4 }}
      onClick={onOpen}
      className={cn(
        "group relative block min-h-52 w-full overflow-hidden rounded-[1.35rem] border border-white/10 bg-zinc-950 text-left shadow-[0_18px_45px_rgba(0,0,0,0.22)]",
        className
      )}
      aria-label={`Open ${item.title}`}
    >
      {item.type === "video" ? (
        <video
          src={isInView ? item.src : undefined}
          poster={item.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`${item.title}, muted video clip`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
        />
      ) : (
        <img
          src={item.src}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/5 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

      {item.type === "video" ? (
        <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-white/85 backdrop-blur-md">
          <VolumeX className="h-3 w-3" />
          Muted clip
        </span>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <span className="mb-1 block text-[10px] font-mono uppercase tracking-[0.2em] text-blue-200">
          {item.category}
        </span>
        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
      </div>
    </motion.button>
  );
}

export function GallerySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "180px 0px" });
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("All");
  const [selectedItem, setSelectedItem] = useState<GalleryMediaItem | null>(null);

  const filteredMedia = useMemo(
    () =>
      selectedCategory === "All"
        ? galleryMedia
        : galleryMedia.filter((item) => item.category === selectedCategory),
    [selectedCategory]
  );

  useEffect(() => {
    if (!selectedItem) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedItem(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedItem]);

  const renderCard = (item: GalleryMediaItem, index: number, className?: string) => (
    <GalleryCard
      key={item.id}
      item={item}
      index={index}
      isInView={isInView}
      className={className}
      onOpen={() => setSelectedItem(item)}
    />
  );

  return (
    <section id="gallery" className="border-t border-border py-32">
      <div ref={ref} className="mx-auto max-w-[104rem] px-6 lg:px-10 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="mb-4 block text-xs font-mono uppercase tracking-widest text-zinc-500">
            Gallery
          </span>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="text-4xl font-medium tracking-tight drop-shadow-[0_0_25px_rgba(147,197,253,0.5)] md:text-5xl lg:text-6xl">
              Visual Stories{" "}
              <span className="project-emoji align-middle text-foreground">📸</span>
            </h2>
            <p className="max-w-md text-sm leading-6 text-zinc-400 lg:text-right">
              A mix of still frames and silent moving moments from the things that catch my eye.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 flex flex-wrap gap-3"
        >
          {categories.map((category) => (
            <InteractiveButton
              key={category}
              variant="pill"
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-4 py-2",
                selectedCategory === category
                  ? "!border-transparent !bg-gradient-to-r !from-blue-500 !to-violet-500 !text-white !shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                  : "text-muted"
              )}
            >
              {category}
            </InteractiveButton>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedCategory === "All" ? (
            <motion.div
              key="all-stories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[0.92fr_1.9fr_0.92fr]">
                <div className="grid gap-3">
                  {renderCard(galleryMedia[0], 0, "aspect-square")}
                  {renderCard(galleryMedia[3], 3, "aspect-square")}
                </div>
                <div className="grid gap-3 sm:col-span-2 lg:col-span-1">
                  {renderCard(galleryMedia[1], 1, "aspect-[3.15/1]")}
                  {renderCard(galleryMedia[4], 4, "aspect-[3.15/1]")}
                  {renderCard(galleryMedia[5], 5, "aspect-[3.15/1]")}
                </div>
                <div className="grid gap-3">
                  {renderCard(galleryMedia[2], 2, "aspect-square")}
                  {renderCard(galleryMedia[6], 6, "aspect-square")}
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {renderCard(galleryMedia[7], 7, "aspect-[2.2/1]")}
                {renderCard(galleryMedia[8], 8, "aspect-[2.2/1]")}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredMedia.map((item, index) => renderCard(item, index, "aspect-[4/3]"))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedItem ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selectedItem.title}
          >
            <InteractiveButton
              variant="icon"
              onClick={() => setSelectedItem(null)}
              className="absolute right-5 top-5 z-10"
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </InteractiveButton>

            <motion.div
              layoutId={expandableCardLayoutId("gallery", selectedItem.id)}
              transition={expandableCardTransition}
              onClick={(event) => event.stopPropagation()}
              className="relative flex max-h-[90vh] w-full max-w-6xl items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black"
            >
              {selectedItem.type === "video" ? (
                <video
                  src={selectedItem.src}
                  poster={selectedItem.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="max-h-[90vh] w-full object-contain"
                />
              ) : (
                <img
                  src={selectedItem.src}
                  alt={selectedItem.title}
                  decoding="async"
                  className="max-h-[90vh] w-full object-contain"
                />
              )}

              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 pt-20">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-blue-200">
                    {selectedItem.category}
                  </span>
                  <h3 className="mt-1 text-xl font-semibold text-white md:text-2xl">{selectedItem.title}</h3>
                </div>
                {selectedItem.type === "video" ? (
                  <span className="flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-xs text-white/80 backdrop-blur-md">
                    <Film className="h-3.5 w-3.5" />
                    Silent loop
                  </span>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
