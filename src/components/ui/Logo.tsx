import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${siteConfig.name} home`}>
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-2xl font-display text-xl font-semibold ${
          light ? "bg-white text-navy" : "bg-navy text-white"
        }`}
        aria-hidden
      >
        B
      </span>
      <span className="leading-none">
        <span
          className={`block font-display text-xl font-semibold ${light ? "text-white" : "text-navy"}`}
        >
          Brightwell
        </span>
        <span className={`block text-xs ${light ? "text-white/70" : "text-muted"}`}>
          Dental · London
        </span>
      </span>
    </Link>
  );
}