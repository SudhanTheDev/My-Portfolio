import { InteractiveButton } from "@/components/interactive-button";

interface GlowButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  download?: string | boolean;
  target?: string;
  rel?: string;
}

export function GlowButton({ href, children, variant = "primary", className, download, target, rel }: GlowButtonProps) {
  return (
    <InteractiveButton
      href={href}
      variant={variant}
      showArrow={variant === "primary"}
      className={className}
      download={download}
      target={target}
      rel={rel}
    >
      {children}
    </InteractiveButton>
  );
}
