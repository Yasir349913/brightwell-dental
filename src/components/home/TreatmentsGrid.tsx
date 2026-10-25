import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { treatments } from "@/data/treatments";
import { Container } from "@/components/ui/Container";
import { TreatmentIcon } from "@/components/ui/TreatmentIcon";

export function TreatmentsGrid() {
  return (
    <section className="py-20">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Treatments for every stage of your smile
          </h2>
          <p className="mt-3 text-lg text-muted">
            From routine check-ups to complete smile makeovers, all under one roof.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/treatments/${t.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-line bg-white p-6 transition-colors hover:border-teal"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white">
                  <TreatmentIcon name={t.icon} size={24} />
                </span>
                <h3 className="mt-5 text-xl font-semibold">{t.title}</h3>
                <p className="mt-2 flex-1 text-muted">{t.summary}</p>
                <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
                  <span className="text-muted">
                    From <strong className="text-navy">{t.priceFrom}</strong>
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-teal-dark">
                    Learn more
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}