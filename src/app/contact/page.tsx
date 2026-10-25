import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { siteConfig, whatsappLink } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call, WhatsApp or message Brightwell Dental in London. Opening hours, address and contact form.",
};

export default function ContactPage() {
  const { contact, address, hours } = siteConfig;

  const methods = [
    { icon: Phone, label: "Call us", value: contact.phoneDisplay, href: `tel:${contact.phoneHref}` },
    { icon: MessageCircle, label: "WhatsApp", value: "Message us on WhatsApp", href: whatsappLink(), external: true },
    { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
  ];

  return (
    <>
      <PageHeader
        title="Get in touch"
        description="Call, message or visit. Whichever is easiest for you."
      />
      <section className="py-14">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <ul className="space-y-3">
              {methods.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-4 rounded-2xl border border-line p-4 transition-colors hover:border-teal hover:bg-teal-tint/40"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
                      <Icon size={22} aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm text-muted">{label}</span>
                      <span className="block font-semibold text-navy">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="rounded-3xl bg-mist p-6">
              <h2 className="flex items-center gap-2 font-sans text-lg font-semibold">
                <MapPin size={20} className="text-teal" aria-hidden /> Visit us
              </h2>
              <p className="mt-2 text-ink">
                {address.line1}
                <br />
                {address.city} {address.postcode}
              </p>
              <a
                href={address.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-semibold text-teal-dark hover:underline"
              >
                Open in maps
              </a>
              <p className="mt-2 text-xs text-muted">Fictional demo address.</p>
            </div>

            <div className="rounded-3xl bg-mist p-6">
              <h2 className="flex items-center gap-2 font-sans text-lg font-semibold">
                <Clock size={20} className="text-teal" aria-hidden /> Opening hours
              </h2>
              <dl className="mt-3 space-y-2 text-sm">
                {hours.map((h) => (
                  <div key={h.day} className="flex justify-between gap-4">
                    <dt className="text-muted">{h.day}</dt>
                    <dd className="text-right font-semibold text-navy">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <p className="rounded-2xl border border-alert/30 bg-alert/5 p-4 text-sm text-ink">
              <strong className="text-alert">Dental emergency?</strong> Call us straight away
              rather than sending a message. If you have swelling affecting breathing or
              swallowing, call 999.
            </p>
          </div>

          <ContactForm />
        </Container>
      </section>
    </>
  );
}