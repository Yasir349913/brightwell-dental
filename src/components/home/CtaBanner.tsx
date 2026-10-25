import { MessageCircle, Phone } from "lucide-react";
import { siteConfig, whatsappLink } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function CtaBanner() {
  return (
    <section className="pb-4">
      <Container>
        <div className="rounded-[2rem] bg-navy px-6 py-12 text-center sm:px-12">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold text-white sm:text-4xl">
            Ready for a check-up that doesn't feel like one?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">
            Book online, call us, or message us on WhatsApp. We usually reply within
            the hour during opening times.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/book" variant="light" size="lg">
              Book an appointment
            </Button>
            <Button
              href={whatsappLink()}
              external
              size="lg"
              className="bg-[#1fa855] hover:bg-[#188a45]"
            >
              <MessageCircle size={18} aria-hidden /> WhatsApp us
            </Button>
            <Button
              href={`tel:${siteConfig.contact.phoneHref}`}
              size="lg"
              className="border border-white/30 bg-transparent hover:bg-white/10"
            >
              <Phone size={18} aria-hidden /> Call us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}