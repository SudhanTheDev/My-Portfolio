import { InteractiveButton } from "@/components/interactive-button";

interface GlowButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export function GlowButton({ href, children, variant = "primary", className }: GlowButtonProps) {
  return (
    <InteractiveButton
      href={href}
      variant={variant}
      showArrow={variant === "primary"}
      className={className}
    >
      {children}
    </InteractiveButton>
  );
}
