import { Info, Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { Container } from "@/components/ui/Container";

export function Testimonials() {
  return (
    <section className="py-20">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold sm:text-4xl">What patients say</h2>
        </div>

        <p className="mt-4 inline-flex items-start gap-2 rounded-2xl bg-teal-tint px-4 py-3 text-sm text-teal-dark">
          <Info size={18} className="mt-0.5 shrink-0" aria-hidden />
          <span>
            <strong>Demo content.</strong> These reviews were written for this demo and
            are not from real patients.
          </span>
        </p>

        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.name} className="flex flex-col rounded-3xl border border-line p-6">
              <div className="flex gap-1" role="img" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="fill-teal text-teal" aria-hidden />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 leading-relaxed text-ink">
                “{t.quote}”
              </blockquote>
              <p className="mt-5 text-sm font-semibold text-navy">{t.name}</p>
              <p className="text-sm text-muted">{t.treatment}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}