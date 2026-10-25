"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/config/site";

export function WhatsAppFloat() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 left-5 z-40 flex h-14 items-center gap-2 rounded-full bg-[#1fa855] px-5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle size={22} aria-hidden />
      <span className="hidden sm:inline">WhatsApp us</span>
    </a>
  );
}