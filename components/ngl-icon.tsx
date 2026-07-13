import Image from "next/image";

export function NglIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-block overflow-hidden rounded-[0.3rem] ${className ?? ""}`}
    >
      <Image
        src="/ngl-icon.png"
        alt=""
        fill
        sizes="24px"
        className="object-cover"
      />
    </span>
  );
}
