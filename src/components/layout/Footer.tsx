"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const { contact, address, hours } = siteConfig;

  return (
    <footer className="mt-24 bg-navy text-white">
      <Container className="grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            {siteConfig.tagline}. Private general, cosmetic and emergency dental care for the
            whole family.
          </p>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold text-white">Visit us</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li className="flex gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" aria-hidden />
              <span>
                {address.line1}, {address.city} {address.postcode}
              </span>
            </li>
            <li className="flex gap-2">
              <Phone size={16} className="mt-0.5 shrink-0" aria-hidden />
              <a href={`tel:${contact.phoneHref}`} className="hover:text-white">
                {contact.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail size={16} className="mt-0.5 shrink-0" aria-hidden />
              <a href={`mailto:${contact.email}`} className="hover:text-white">
                {contact.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold text-white">Opening hours</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            {hours.map((h) => (
              <li key={h.day}>
                <span className="block text-white">{h.day}</span>
                {h.time}
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>{siteConfig.demoNotice}</p>
          <nav aria-label="Footer" className="flex gap-5">
            <Link href="/treatments" className="hover:text-white">
              Treatments
            </Link>
            <Link href="/book" className="hover:text-white">
              Book
            </Link>
            <Link href="/admin" className="hover:text-white">
              Admin demo
            </Link>
          </nav>
        </Container>
      </div>
    </footer>
  );
}