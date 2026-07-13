export type GalleryCategory = "Nature" | "Urban" | "Travel" | "Photography" | "Motion";

export type GalleryMediaItem = {
  id: string;
  category: GalleryCategory;
  title: string;
  type: "image" | "video";
  src: string;
  poster?: string;
};

export const galleryMedia: GalleryMediaItem[] = [
  {
    id: "wild-focus",
    category: "Nature",
    title: "Wild Focus",
    type: "image",
    src: "https://images.pexels.com/photos/56733/pexels-photo-56733.jpeg?auto=compress&cs=tinysrgb&w=1100",
  },
  {
    id: "neon-geometry",
    category: "Motion",
    title: "Neon Geometry",
    type: "video",
    src: "https://videos.pexels.com/video-files/3129595/3129595-hd_1920_1080_30fps.mp4",
    poster: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1500",
  },
  {
    id: "forest-light",
    category: "Nature",
    title: "Forest Light",
    type: "image",
    src: "https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg?auto=compress&cs=tinysrgb&w=1100",
  },
  {
    id: "quiet-companions",
    category: "Photography",
    title: "Quiet Companions",
    type: "image",
    src: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1100",
  },
  {
    id: "mountain-air",
    category: "Travel",
    title: "Mountain Air",
    type: "image",
    src: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    id: "midnight-motion",
    category: "Urban",
    title: "Midnight Motion",
    type: "video",
    src: "https://videos.pexels.com/video-files/5057439/5057439-hd_1920_1080_25fps.mp4",
    poster: "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1500",
  },
  {
    id: "sacred-scale",
    category: "Travel",
    title: "Sacred Scale",
    type: "image",
    src: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=1100",
  },
  {
    id: "ocean-canvas",
    category: "Travel",
    title: "Ocean Canvas",
    type: "image",
    src: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    id: "golden-silence",
    category: "Photography",
    title: "Golden Silence",
    type: "image",
    src: "https://images.pexels.com/photos/3584991/pexels-photo-3584991.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];

export const galleryPreloadAssets = galleryMedia.map((item) => item.poster ?? item.src);
