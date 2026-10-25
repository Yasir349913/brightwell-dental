import { Clock, CreditCard, ShieldCheck, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";

const items = [
  { icon: Users, title: "Family friendly", text: "Patients from age 3 upwards" },
  { icon: CreditCard, title: "Clear pricing", text: "Itemised plans, 0% finance options" },
  { icon: Clock, title: "Same-day emergencies", text: "Slots held free every day" },
  { icon: ShieldCheck, title: "GDC registered team", text: "Fictional demo practice" },
];

export function TrustStrip() {
  return (
    <section aria-label="Why choose us" className="border-b border-line">
      <Container className="grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-tint text-teal-dark">
              <Icon size={20} aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-navy">{title}</p>
              <p className="text-sm text-muted">{text}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}