export type IconKey =
  | "general"
  | "cosmetic"
  | "whitening"
  | "implants"
  | "invisalign"
  | "emergency";

export type Treatment = {
  slug: string;
  title: string;
  icon: IconKey;
  summary: string;
  priceFrom: string;
  duration: string;
  overview: string;
  benefits: string[];
  process: { title: string; text: string }[];
  faq: { q: string; a: string };
};

export const treatments: Treatment[] = [
  {
    slug: "general-dentistry",
    title: "General dentistry",
    icon: "general",
    summary: "Check-ups, hygiene visits, fillings and preventive care for the whole family.",
    priceFrom: "£65",
    duration: "30–45 min",
    overview:
      "Regular check-ups catch small problems before they become painful or expensive. Every visit includes a full oral health assessment and a clear plan, with no surprise costs.",
    benefits: [
      "Early detection of decay and gum disease",
      "Professional scale and polish",
      "Clear, itemised treatment plans",
    ],
    process: [
      { title: "Examination", text: "A thorough check of teeth, gums and soft tissue." },
      { title: "Plan", text: "We explain what we found and your options in plain English." },
      { title: "Treatment", text: "Most fillings and hygiene work can be done the same visit." },
    ],
    faq: {
      q: "How often should I have a check-up?",
      a: "Most adults benefit from a check-up every six months, though your dentist may suggest a different interval based on your oral health.",
    },
  },
  {
    slug: "cosmetic-dentistry",
    title: "Cosmetic dentistry",
    icon: "cosmetic",
    summary: "Bonding, veneers and smile makeovers designed around your face.",
    priceFrom: "£250",
    duration: "45–90 min",
    overview:
      "Small changes can make a big difference. We design natural-looking results, and show you a preview before any treatment begins.",
    benefits: [
      "Natural shape, shade and proportion",
      "Minimally invasive options first",
      "Digital smile preview",
    ],
    process: [
      { title: "Consultation", text: "We listen to what you want to change." },
      { title: "Design", text: "You see a preview and agree the plan and cost." },
      { title: "Treatment", text: "Placed over one or two visits, with aftercare advice." },
    ],
    faq: {
      q: "Are veneers reversible?",
      a: "Some veneer types need a small amount of enamel removal, so they are not fully reversible. Your dentist will explain the options at your consultation.",
    },
  },
  {
    slug: "teeth-whitening",
    title: "Teeth whitening",
    icon: "whitening",
    summary: "Dentist-supervised whitening, in the chair or at home.",
    priceFrom: "£350",
    duration: "60 min",
    overview:
      "Professional whitening is carried out under dental supervision, so your gums and enamel stay protected while your teeth get noticeably brighter.",
    benefits: [
      "Safe, clinically supervised",
      "In-chair or custom home trays",
      "Visible results from the first session",
    ],
    process: [
      { title: "Health check", text: "We make sure your teeth and gums are ready." },
      { title: "Whitening", text: "Applied in the chair, or trays are made for home use." },
      { title: "Maintenance", text: "Simple top-up advice to keep results longer." },
    ],
    faq: {
      q: "Will whitening make my teeth sensitive?",
      a: "Some people notice temporary sensitivity. We use desensitising products and adjust the treatment to keep you comfortable.",
    },
  },
  {
    slug: "dental-implants",
    title: "Dental implants",
    icon: "implants",
    summary: "A permanent, natural-feeling replacement for missing teeth.",
    priceFrom: "£2,200",
    duration: "Staged treatment",
    overview:
      "Implants replace the tooth root as well as the crown, so they feel and function like a natural tooth. We plan every case with 3D imaging.",
    benefits: [
      "Long-lasting replacement",
      "Looks and feels natural",
      "Protects the surrounding bone",
    ],
    process: [
      { title: "Assessment", text: "Scans and a full review to confirm suitability." },
      { title: "Placement", text: "The implant is placed under local anaesthetic." },
      { title: "Restoration", text: "Once healed, the final crown is fitted." },
    ],
    faq: {
      q: "How long do implants last?",
      a: "With good oral hygiene and regular check-ups, implants can last many years. Your dentist will discuss what to expect for your case.",
    },
  },
  {
    slug: "invisalign",
    title: "Invisalign",
    icon: "invisalign",
    summary: "Clear aligners to straighten your teeth discreetly.",
    priceFrom: "£2,800",
    duration: "6–18 months",
    overview:
      "Clear, removable aligners move your teeth gradually. You see the planned outcome before you start, and check in with us every few weeks.",
    benefits: [
      "Nearly invisible",
      "Removable for eating and cleaning",
      "Preview of your final result",
    ],
    process: [
      { title: "Scan", text: "A quick digital scan, with no messy impressions." },
      { title: "Plan", text: "You preview the movement and agree the timeline." },
      { title: "Aligners", text: "Swap sets every one to two weeks, with regular reviews." },
    ],
    faq: {
      q: "How many hours a day must I wear them?",
      a: "Aligners work best when worn around 22 hours a day, removing them only to eat, drink and clean your teeth.",
    },
  },
  {
    slug: "emergency-dental-care",
    title: "Emergency dental care",
    icon: "emergency",
    summary: "Same-day appointments for pain, swelling, broken or knocked-out teeth.",
    priceFrom: "£95",
    duration: "30 min",
    overview:
      "Dental pain doesn't wait. We keep emergency slots free every day so you can be seen quickly, and get out of pain.",
    benefits: [
      "Same-day appointments where possible",
      "Pain relief first, full plan after",
      "Clear advice for out-of-hours",
    ],
    process: [
      { title: "Call us", text: "Tell us your symptoms and we'll find the earliest slot." },
      { title: "Assessment", text: "Quick exam and X-ray if needed." },
      { title: "Treatment", text: "We relieve the problem and agree any follow-up." },
    ],
    faq: {
      q: "What should I do if a tooth is knocked out?",
      a: "Hold it by the crown, not the root, and call us straight away. Do not scrub it. Time matters, so contact us immediately.",
    },
  },
];

export function getTreatment(slug: string) {
  return treatments.find((t) => t.slug === slug);
}