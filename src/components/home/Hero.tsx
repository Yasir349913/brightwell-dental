"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, Phone, Star } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const days = [
  { label: "Today", slots: ["2:30pm", "4:15pm"] },
  { label: "Tomorrow", slots: ["9:00am", "11:45am", "3:00pm"] },
  { label: "Wednesday", slots: ["8:30am", "1:15pm", "5:00pm"] },
];

export function Hero() {
  const [selected, setSelected] = useState<{ day: string; time: string } | null>(null);

  const bookHref = selected
    ? `/book?day=${encodeURIComponent(selected.day)}&time=${encodeURIComponent(selected.time)}`
    : "/book";

  return (
    <section className="relative overflow-hidden bg-mist">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-teal-tint"
        aria-hidden
      />
      <Container className="relative grid items-center gap-12 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm text-navy shadow-sm">
            <Star size={14} className="fill-teal text-teal" aria-hidden />
            Welcoming new private patients
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
            A dentist you will actually look forward to seeing
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Calm, modern dental care in central London. Clear pricing, no rushed
            appointments, and online booking that takes under a minute.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/book" size="lg">
              <CalendarCheck size={18} aria-hidden /> Book an appointment
            </Button>
            <Button
              href={`tel:${siteConfig.contact.phoneHref}`}
              variant="secondary"
              size="lg"
            >
              <Phone size={18} aria-hidden /> {siteConfig.contact.phoneDisplay}
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-white p-6 shadow-xl shadow-navy/5 sm:p-7">
          <h2 className="font-sans text-lg font-semibold">Next available appointments</h2>
          <p className="mt-1 text-sm text-muted">Pick a time to start your booking.</p>

          <div className="mt-5 space-y-4">
            {days.map((d) => (
              <div key={d.label}>
                <p className="mb-2 text-sm font-medium text-navy">{d.label}</p>
                <div className="flex flex-wrap gap-2">
                  {d.slots.map((time) => {
                    const active = selected?.day === d.label && selected.time === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setSelected({ day: d.label, time })}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                          active
                            ? "border-teal bg-teal text-white"
                            : "border-line text-ink hover:border-teal hover:bg-teal-tint"
                        )}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <Link
            href={bookHref}
            className={cn(
              "mt-6 flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold transition-colors",
              selected
                ? "bg-navy text-white hover:bg-navy-soft"
                : "bg-mist text-muted hover:bg-teal-tint"
            )}
          >
            {selected ? `Continue with ${selected.day}, ${selected.time}` : "See all availability"}
          </Link>
          <p className="mt-3 text-center text-xs text-muted">
            Demo slots only. Not connected to a live diary.
          </p>
        </div>
      </Container>
    </section>
  );
}