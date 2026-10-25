import { Container } from "@/components/ui/Container";

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-mist">
      <Container className="py-14 sm:py-20">
        {children}
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{description}</p>
        )}
      </Container>
    </section>
  );
}