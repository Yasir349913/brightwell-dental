"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Menu, Phone, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/treatments", label: "Treatments" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Admin prototype has its own layout, so hide the public navbar there
  if (pathname.startsWith("/admin")) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-line">
      <div className="hidden bg-navy text-white sm:block">
        <Container className="flex h-9 items-center justify-between text-xs">
          <span className="flex items-center gap-2 text-white/80">
            <Clock size={14} aria-hidden /> Mon–Fri 8:30am–6pm · Sat 9am–2pm
          </span>
          <a
            href={`tel:${siteConfig.contact.phoneHref}`}
            className="flex items-center gap-2 font-semibold hover:text-teal-tint"
          >
            <Phone size={14} aria-hidden /> {siteConfig.contact.phoneDisplay}
          </a>
        </Container>
      </div>

      <Container className="flex h-18 items-center justify-between">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive(l.href)
                  ? "bg-teal-tint text-teal-dark"
                  : "text-ink hover:bg-mist"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href="/book">Book appointment</Button>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-line bg-white md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-xl px-4 py-3 text-base font-medium",
                    isActive(l.href) ? "bg-teal-tint text-teal-dark" : "hover:bg-mist"
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                <Button href="/book" size="lg">
                  Book appointment
                </Button>
                <Button
                  href={`tel:${siteConfig.contact.phoneHref}`}
                  variant="secondary"
                  size="lg"
                >
                  <Phone size={18} /> Call {siteConfig.contact.phoneDisplay}
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}