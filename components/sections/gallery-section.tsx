"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { InteractiveButton } from "@/components/interactive-button";
import { cn } from "@/lib/utils";

const galleryCollections = [
  {
    category: "Nature",
    title: "Mountain Serenity",
    images: [
      "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1366909/pexels-photo-1366909.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/533769/pexels-photo-533769.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    category: "Urban",
    title: "Urban Nights",
    images: [
      "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    category: "Travel",
    title: "Wanderlust",
    images: [
      "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/21014/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    category: "Nature",
    title: "Forest Dreams",
    images: [
      "https://images.pexels.com/photos/1634025/pexels-photo-1634025.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
  {
    category: "Photography",
    title: "Golden Hour",
    images: [
      "https://images.pexels.com/photos/3584991/pexels-photo-3584991.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1028225/pexels-photo-1028225.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/214574/pexels-photo-214574.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  },
];

const categories = ["All", "Nature", "Urban", "Travel", "Photography"];

function getGalleryItemClass(index: number, total: number) {
  const baseClass = "group relative text-left lg:col-span-2";

  if (total === 1) {
    return `${baseClass} lg:col-start-3`;
  }

  if (total % 3 === 2) {
    if (index === total - 2) return `${baseClass} lg:col-start-2`;
    if (index === total - 1) return `${baseClass} lg:col-start-4`;
  }

  if (total % 3 === 1 && index === total - 1) {
    return `${baseClass} lg:col-start-3`;
  }

  return baseClass;
}

export function GallerySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeSlides, setActiveSlides] = useState<Record<string, number>>(() =>
    Object.fromEntries(galleryCollections.map((item) => [item.title, 0]))
  );

  const filteredImages = useMemo(
    () =>
      selectedCategory === "All"
        ? galleryCollections
        : galleryCollections.filter((img) => img.category === selectedCategory),
    [selectedCategory]
  );

  useEffect(() => {
    const timeoutIds: number[] = [];

    const scheduleNextSwap = (title: string, imageCount: number, delay: number) => {
      const timeoutId = window.setTimeout(() => {
        setActiveSlides((current) => ({
          ...current,
          [title]: ((current[title] ?? 0) + 1) % imageCount,
        }));

        const nextDelay = 3000 + Math.floor(Math.random() * 9000);
        scheduleNextSwap(title, imageCount, nextDelay);
      }, delay);

      timeoutIds.push(timeoutId);
    };

    galleryCollections.forEach((item, index) => {
      const initialDelay = 4000 + index * 1400 + Math.floor(Math.random() * 4000);
      scheduleNextSwap(item.title, item.images.length, initialDelay);
    });

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  return (
    <section id="gallery" className="border-t border-border py-32">
      <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="mb-4 block text-xs font-mono uppercase tracking-widest text-zinc-500">
            Gallery
          </span>
          <h2 className="text-4xl font-medium tracking-tight drop-shadow-[0_0_25px_rgba(147,197,253,0.5)] md:text-5xl lg:text-6xl">
            Visual Stories <span className="project-emoji align-middle text-foreground">📸</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-12 flex flex-wrap gap-4"
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          {filteredImages.map((image, index) => {
            const activeSlide = activeSlides[image.title] ?? 0;
            const currentImage = image.images[activeSlide];

            return (
              <motion.button
                key={image.title}
                data-cursor="Open"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
                layout
                onClick={() => setSelectedImage(index)}
                className={getGalleryItemClass(index, filteredImages.length)}
              >
                <motion.div
                  className="relative mb-4 aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-zinc-900 shadow-[0_16px_50px_rgba(15,23,42,0.12)]"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImage}
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      src={currentImage}
                      alt={image.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full rounded-[1.6rem] object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                    />
                  </AnimatePresence>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.08 }}
                  className="mb-1 block text-xs font-mono tracking-wider text-zinc-500"
                >
                  {image.category}
                </motion.span>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 + index * 0.08 }}
                  className="text-lg font-medium text-white transition-colors duration-300 group-hover:text-zinc-300"
                >
                  {image.title}
                </motion.h3>
              </motion.button>
            );
          })}
        </div>
      </div>

      {selectedImage !== null ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <InteractiveButton
            variant="icon"
            onClick={() => setSelectedImage(null)}
            className="absolute right-6 top-6"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </InteractiveButton>
          <motion.img
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={
              filteredImages[selectedImage]?.images[
                activeSlides[filteredImages[selectedImage]?.title] ?? 0
              ]
            }
            alt={filteredImages[selectedImage]?.title}
            decoding="async"
            className="max-h-[90vh] max-w-full rounded-2xl object-contain"
          />
        </motion.div>
      ) : null}
    </section>
  );
}
