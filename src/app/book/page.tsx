import type { Metadata } from "next";
import { Suspense } from "react";
import { Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { BookingForm } from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: "Book an appointment",
  description:
    "Request a dental appointment at Brightwell Dental, London. Choose your treatment, date and time in under a minute.",
};

const steps = [
  { title: "Send your request", text: "Tell us what you need and when suits you." },
  { title: "We confirm", text: "The team calls or messages to agree a time." },
  { title: "Visit us", text: "Arrive a few minutes early for your appointment." },
];

export default function BookPage() {
  return (
    <>
      <PageHeader
        title="Book an appointment"
        description="Takes under a minute. We'll contact you to confirm your time."
      />
      <section className="py-14">
        <Container className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <Suspense fallback={<div className="h-96 rounded-3xl bg-mist" aria-hidden />}>
            <BookingForm />
          </Suspense>

          <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-3xl bg-mist p-6">
              <h2 className="font-sans text-lg font-semibold">What happens next</h2>
              <ol className="mt-4 space-y-4">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-navy">{s.title}</p>
                      <p className="text-sm text-muted">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-3xl border border-line p-6">
              <h2 className="font-sans text-lg font-semibold">In pain right now?</h2>
              <p className="mt-2 text-sm text-muted">
                Call us and we'll find the earliest emergency slot.
              </p>
              <Button
                href={`tel:${siteConfig.contact.phoneHref}`}
                className="mt-4 w-full"
                size="lg"
              >
                <Phone size={18} aria-hidden /> {siteConfig.contact.phoneDisplay}
              </Button>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}