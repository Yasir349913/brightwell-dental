import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarCheck, Check, Clock, Phone, PoundSterling } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getTreatment, treatments } from "@/data/treatments";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { TreatmentIcon } from "@/components/ui/TreatmentIcon";
import { CtaBanner } from "@/components/home/CtaBanner";

type Params = { slug: string };

export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getTreatment(slug);
  if (!t) return {};
  return { title: t.title, description: t.summary };
}

export default async function TreatmentPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const t = getTreatment(slug);
  if (!t) notFound();

  const isEmergency = t.slug === "emergency-dental-care";
  const others = treatments.filter((o) => o.slug !== t.slug).slice(0, 3);

  return (
    <>
      <PageHeader title={t.title} description={t.summary}>
        <Link
          href="/treatments"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-teal-dark hover:underline"
        >
          <ArrowLeft size={16} aria-hidden /> All treatments
        </Link>
      </PageHeader>

      <section className="py-14">
        <Container className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-semibold">Overview</h2>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink">{t.overview}</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">Why patients choose it</h2>
              <ul className="mt-4 space-y-3">
                {t.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-tint text-teal-dark">
                      <Check size={14} aria-hidden />
                    </span>
                    <span className="text-ink">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">What happens at your visit</h2>
              <ol className="mt-5 space-y-4">
                {t.process.map((p, i) => (
                  <li key={p.title} className="flex gap-4 rounded-2xl border border-line p-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-sans text-base font-semibold">{p.title}</h3>
                      <p className="mt-1 text-muted">{p.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-3xl bg-mist p-6">
              <h2 className="font-sans text-lg font-semibold">{t.faq.q}</h2>
              <p className="mt-2 leading-relaxed text-muted">{t.faq.a}</p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-3xl border border-line bg-white p-6 shadow-xl shadow-navy/5">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white">
                <TreatmentIcon name={t.icon} size={24} />
              </span>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-muted">
                    <PoundSterling size={16} aria-hidden /> Price from
                  </dt>
                  <dd className="font-semibold text-navy">{t.priceFrom}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-muted">
                    <Clock size={16} aria-hidden /> Typical time
                  </dt>
                  <dd className="font-semibold text-navy">{t.duration}</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-col gap-2">
                <Button href={`/book?service=${t.slug}`} size="lg">
                  <CalendarCheck size={18} aria-hidden /> Book this treatment
                </Button>
                <Button
                  href={`tel:${siteConfig.contact.phoneHref}`}
                  variant={isEmergency ? "primary" : "secondary"}
                  size="lg"
                >
                  <Phone size={18} aria-hidden /> {siteConfig.contact.phoneDisplay}
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted">
                Demo pricing. Your dentist confirms costs in writing before treatment.
              </p>
            </div>
          </aside>
        </Container>
      </section>

      <section className="bg-mist py-14">
        <Container>
          <h2 className="text-2xl font-semibold">Other treatments</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/treatments/${o.slug}`}
                  className="flex h-full items-center gap-4 rounded-2xl bg-white p-5 transition-colors hover:bg-teal-tint"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
                    <TreatmentIcon name={o.icon} size={22} />
                  </span>
                  <span className="font-semibold text-navy">{o.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <div className="pt-20">
        <CtaBanner />
      </div>
    </>
  );
}