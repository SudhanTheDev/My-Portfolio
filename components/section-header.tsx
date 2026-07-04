import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  label,
  title,
  description,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-16",
        align === "center" && "text-center mx-auto max-w-3xl",
        className
      )}
    >
      <span className="inline-flex items-center gap-2 text-xs font-mono text-accent-blue tracking-[0.25em] uppercase mb-5 font-semibold">
        <span className="w-8 h-px bg-gradient-to-r from-accent-blue to-transparent" />
        {label}
      </span>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-display">
        <span className="text-shimmer">{title}</span>
      </h2>
      {description && (
        <p className="mt-5 text-lg text-muted leading-relaxed max-w-2xl">{description}</p>
      )}
    </div>
  );
}
