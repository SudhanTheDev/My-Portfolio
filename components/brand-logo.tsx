import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "text-lg tracking-[0.35em]",
  md: "text-xl tracking-[0.45em]",
  lg: "text-5xl tracking-[0.5em]",
};

export function BrandLogo({ className, size = "md" }: BrandLogoProps) {
  return (
    <span className={cn("relative inline-block font-brand font-extrabold uppercase", sizes[size], className)}>
      <span
        className="brand-logo-aura absolute inset-0 blur-lg opacity-70 bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent select-none"
        aria-hidden
      >
        SUZZY
      </span>
      <span className="brand-logo-text relative bg-gradient-to-r from-white via-blue-200 to-violet-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">
        SUZZY
      </span>
    </span>
  );
}
