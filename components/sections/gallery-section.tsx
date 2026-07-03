"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { X } from "lucide-react";

const galleryImages = [
  {
    src: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Nature",
    title: "Mountain Serenity",
  },
  {
    src: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Urban",
    title: "Urban Nights",
  },
  {
    src: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Travel",
    title: "Wanderlust",
  },
  {
    src: "https://images.pexels.com/photos/1634025/pexels-photo-1634025.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Nature",
    title: "Forest Dreams",
  },
  {
    src: "https://images.pexels.com/photos/3584991/pexels-photo-3584991.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Photography",
    title: "Golden Hour",
  },
  {
    src: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Creative",
    title: "Neon Dreams",
  },
];

const categories = ["All", "Nature", "Urban", "Travel", "Photography", "Creative"];

export function GallerySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages =
    selectedCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <section id="gallery" className="py-32 border-t border-zinc-900">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-4 block">
            /Gallery
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight">
            Visual Stories
          </h2>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredImages.map((image, index) => (
            <motion.button
              key={image.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
              layout
              onClick={() => setSelectedImage(index)}
              className="group relative text-left"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900 mb-4">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <span className="text-xs text-zinc-500 font-mono tracking-wider mb-1 block">
                {image.category}
              </span>
              <h3 className="text-lg font-medium text-white group-hover:text-zinc-300 transition-colors duration-300">
                {image.title}
              </h3>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <motion.img
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={filteredImages[selectedImage]?.src}
            alt={filteredImages[selectedImage]?.title}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </motion.div>
      )}
    </section>
  );
}
