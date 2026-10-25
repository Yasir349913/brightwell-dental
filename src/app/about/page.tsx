import type { Metadata } from "next";
import { Ear, HeartHandshake, Receipt, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Dentists } from "@/components/home/Dentists";
import { CtaBanner } from "@/components/home/CtaBanner";

export const metadata: Metadata = {
  title: "About the clinic",
  description:
    "Meet the team at Brightwell Dental, a modern private dental practice in London focused on calm, clear and unhurried care.",
};

const values = [
  { icon: Ear, title: "We listen first", text: "Longer appointments mean we hear what matters to you before we recommend anything." },
  { icon: Receipt, title: "No surprise costs", text: "You get a written, itemised plan and agree it before treatment begins." },
  { icon: HeartHandshake, title: "Gentle by default", text: "Nervous patients are welcome. We explain each step and pause whenever you ask." },
  { icon: Sparkles, title: "Modern technology", text: "Digital scans and 3D imaging make planning clearer and visits more comfortable." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="A practice built around unhurried care"
        description="Brightwell Dental is a small private practice in central London. We keep our team small so you see familiar faces, and our diary relaxed so nobody is rushed."
      />

      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-semibold">Our approach</h2>
            <p className="mt-3 max-w-sm text-lg text-muted">
              Good dentistry is as much about communication as it is about technique.
            </p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {values.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-3xl border border-line p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-tint text-teal-dark">
                  <Icon size={22} aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-1.5 text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Dentists />

      <section className="py-16">
        <Container>
          <p className="rounded-2xl bg-teal-tint px-5 py-4 text-sm text-teal-dark">
            <strong>Demo notice:</strong> Brightwell Dental is a fictional practice created by
            Mash Labs to show what a modern dental website can do. The people, address and
            reviews are not real.
          </p>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}