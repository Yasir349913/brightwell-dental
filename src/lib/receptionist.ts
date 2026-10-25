import { siteConfig, whatsappLink } from "@/config/site";
import { treatments } from "@/data/treatments";

export type ChatAction = { label: string; href: string; external?: boolean };
export type BotReply = { text: string; actions?: ChatAction[] };

const { contact, address, hours } = siteConfig;

const bookAction: ChatAction = { label: "Request an appointment", href: "/book" };
const callAction: ChatAction = { label: `Call ${contact.phoneDisplay}`, href: `tel:${contact.phoneHref}` };
const waAction: ChatAction = { label: "WhatsApp us", href: whatsappLink(), external: true };

const has = (text: string, words: string[]) => words.some((w) => text.includes(w));

const treatmentKeywords: Record<string, string[]> = {
  "teeth-whitening": ["whiten", "bleach"],
  "dental-implants": ["implant", "missing tooth", "missing teeth"],
  invisalign: ["invisalign", "aligner", "brace", "straighten", "orthodon"],
  "cosmetic-dentistry": ["cosmetic", "veneer", "bonding", "smile makeover"],
  "emergency-dental-care": [],
  "general-dentistry": ["check-up", "checkup", "check up", "hygien", "filling", "clean", "scale"],
};

export function demoReply(input: string): BotReply {
  const t = input.toLowerCase();

  if (has(t, ["pain", "toothache", "swell", "bleeding", "broken", "chipped", "knocked", "abscess", "emergency", "urgent"])) {
    return {
      text:
        "I'm sorry you're dealing with that. I can't diagnose problems, but we hold same-day emergency slots every day. The fastest way to be seen is to call us.\n\nIf you have swelling affecting your breathing or swallowing, or heavy bleeding that won't stop, call 999 or go to A&E.",
      actions: [callAction, { label: "Emergency care details", href: "/treatments/emergency-dental-care" }],
    };
  }

  if (has(t, ["hour", "open", "close", "closing", "sunday", "saturday", "weekend", "what time"])) {
    return {
      text: `Our opening hours are:\n${hours.map((h) => `${h.day}: ${h.time}`).join("\n")}`,
      actions: [bookAction],
    };
  }

  if (has(t, ["where", "address", "location", "find you", "directions", "parking", "nearest"])) {
    return {
      text: `We're at ${address.line1}, ${address.city} ${address.postcode}. (Fictional demo address.)`,
      actions: [{ label: "Open in maps", href: address.mapUrl, external: true }, callAction],
    };
  }

  if (has(t, ["nhs"])) {
    return {
      text: "This demo practice is private only, so NHS treatment isn't offered. Prices for each treatment are listed on its page, and a written plan is given before any work starts.",
      actions: [{ label: "View treatments", href: "/treatments" }],
    };
  }

  if (has(t, ["finance", "instalment", "installment", "payment plan", "pay monthly"])) {
    return {
      text: "Finance options may be available for larger treatments like implants and Invisalign. In a real practice the team would explain terms and eligibility at your consultation.",
      actions: [bookAction],
    };
  }

  for (const [slug, words] of Object.entries(treatmentKeywords)) {
    if (words.length && has(t, words)) {
      const tr = treatments.find((x) => x.slug === slug);
      if (tr) {
        return {
          text: `${tr.title}: ${tr.summary}\nPrices start from ${tr.priceFrom} and a typical visit takes ${tr.duration}. (Demo pricing.)`,
          actions: [{ label: `About ${tr.title.toLowerCase()}`, href: `/treatments/${tr.slug}` }, { label: "Book this treatment", href: `/book?service=${tr.slug}` }],
        };
      }
    }
  }

  if (has(t, ["price", "cost", "how much", "fee", "£", "cheap"])) {
    return {
      text: `Here's what we offer, with starting prices:\n${treatments.map((x) => `${x.title}: from ${x.priceFrom}`).join("\n")}\n\nThese are demo prices. Your dentist gives a written plan before treatment.`,
      actions: [{ label: "View treatments", href: "/treatments" }],
    };
  }

  if (has(t, ["treatment", "service", "offer", "do you do", "what do you"])) {
    return {
      text: `We offer:\n${treatments.map((x) => x.title).join("\n")}`,
      actions: [{ label: "View treatments", href: "/treatments" }],
    };
  }

  if (has(t, ["book", "appointment", "slot", "available", "availability", "schedule", "see a dentist", "register"])) {
    return {
      text: "You can request an appointment online in under a minute. Choose your treatment, date and time, and the team will contact you to confirm. I can't confirm or change bookings myself.",
      actions: [bookAction, callAction],
    };
  }

  if (has(t, ["phone", "call", "contact", "whatsapp", "email", "number", "speak to", "talk to"])) {
    return {
      text: `You can reach us by phone on ${contact.phoneDisplay}, by email at ${contact.email}, or on WhatsApp.`,
      actions: [callAction, waAction],
    };
  }

  if (has(t, ["nervous", "scared", "anxious", "afraid", "phobia"])) {
    return {
      text: "That's very common, and our team is used to it. Tell us when you book and we'll allow extra time, explain each step and pause whenever you need to.",
      actions: [bookAction],
    };
  }

  if (has(t, ["thank", "thanks", "cheers"])) {
    return { text: "You're welcome! Is there anything else I can help with?" };
  }

  if (has(t, ["hi", "hello", "hey", "good morning", "good afternoon", "salam", "assalam"]) && t.length < 25) {
    return { text: "Hello! I can help with opening hours, treatments, prices, location and booking. What would you like to know?" };
  }

  return {
    text: "I'm not sure I can answer that one. I can help with opening hours, treatments, prices, location and booking. For anything else, our team will be happy to help.",
    actions: [callAction, waAction],
  };
}