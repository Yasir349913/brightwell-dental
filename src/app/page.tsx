import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { TreatmentsGrid } from "@/components/home/TreatmentsGrid";
import { Dentists } from "@/components/home/Dentists";
import { Testimonials } from "@/components/home/Testimonials";
import { FaqSection } from "@/components/home/FaqSection";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <TreatmentsGrid />
      <Dentists />
      <Testimonials />
      <FaqSection />
      <div className="pt-20">
        <CtaBanner />
      </div>
    </>
  );
}