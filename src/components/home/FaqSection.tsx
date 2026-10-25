import { homeFaqs } from "@/data/faqs";
import { Container } from "@/components/ui/Container";
import { FaqList } from "@/components/ui/FaqList";

export function FaqSection() {
  return (
    <section className="bg-mist py-20">
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-3xl font-semibold sm:text-4xl">Common questions</h2>
          <p className="mt-3 max-w-sm text-lg text-muted">
            Can't see your question? Our AI receptionist or team can help.
          </p>
        </div>
        <FaqList items={homeFaqs} />
      </Container>
    </section>
  );
}