import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { treatments } from "@/data/treatments";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { TreatmentIcon } from "@/components/ui/TreatmentIcon";
import { CtaBanner } from "@/components/home/CtaBanner";

export const metadata: Metadata = {
  title: "Treatments",
  description:
    "General, cosmetic and emergency dentistry, teeth whitening, dental implants and Invisalign at Brightwell Dental, London.",
};

export default function TreatmentsPage() {
  return (
    <>
      <PageHeader
        title="Dental treatments, explained clearly"
        description="Every treatment page shows what to expect, how long it takes and what it costs, before you book."
      />

      <section className="py-16">
        <Container>
          <ul className="grid gap-5 md:grid-cols-2">
            {treatments.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/treatments/${t.slug}`}
                  className="group flex h-full gap-5 rounded-3xl border border-line bg-white p-6 transition-colors hover:border-teal"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-navy text-white">
                    <TreatmentIcon name={t.icon} size={26} />
                  </span>
                  <div className="flex flex-1 flex-col">
                    <h2 className="text-xl font-semibold">{t.title}</h2>
                    <p className="mt-1.5 flex-1 text-muted">{t.summary}</p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="flex items-center gap-3 text-muted">
                        <span>
                          From <strong className="text-navy">{t.priceFrom}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} aria-hidden /> {t.duration}
                        </span>
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-teal-dark">
                        View details
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                          aria-hidden
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            Prices are illustrative for this demo. A written plan is always given before
            treatment in a real practice.
          </p>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}