import { dentists } from "@/data/team";
import { Container } from "@/components/ui/Container";

export function Dentists() {
  return (
    <section className="bg-mist py-20">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold sm:text-4xl">Meet your dentists</h2>
          <p className="mt-3 text-lg text-muted">
            A small, consistent team, so you see familiar faces every visit.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {dentists.map((d) => (
            <li key={d.name} className="rounded-3xl bg-white p-6">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full font-display text-2xl font-semibold text-white ${d.tone}`}
                aria-hidden
              >
                {d.initials}
              </div>
              <h3 className="mt-5 text-xl font-semibold">{d.name}</h3>
              <p className="text-sm font-medium text-teal-dark">{d.role}</p>
              <p className="mt-1 text-sm text-muted">{d.focus}</p>
              <p className="mt-4 leading-relaxed text-ink">{d.bio}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">
          Demo profiles. Names and biographies are fictional.
        </p>
      </Container>
    </section>
  );
}