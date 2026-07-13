import { InteractiveButton } from "@/components/interactive-button";

interface GlowButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  download?: string | boolean;
}

export function GlowButton({ href, children, variant = "primary", className, download }: GlowButtonProps) {
  return (
    <InteractiveButton
      href={href}
      variant={variant}
      showArrow={variant === "primary"}
      className={className}
      download={download}
    >
      {children}
    </InteractiveButton>
  );
}
