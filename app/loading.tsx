import { BrandLogo } from "@/components/brand-logo";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background">
      <BrandLogo size="lg" />
      <div className="w-8 h-8 rounded-full border-2 border-border border-t-accent-blue animate-spin" />
    </div>
  );
}
