export const siteConfig = {
  name: "Brightwell Dental",
  tagline: "Gentle dentistry in the heart of London",
  description:
    "Brightwell Dental is a modern private dental practice offering general, cosmetic and emergency dental care. Book your appointment online.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  // Fictional details for demo purposes only
  contact: {
    phoneDisplay: "020 7946 0123",
    phoneHref: "+442079460123",
    email: "hello@brightwelldental.example",
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "447700900123",
    whatsappMessage: "Hi Brightwell Dental, I'd like to book an appointment.",
  },

  address: {
    line1: "24 Harley Court",
    city: "London",
    postcode: "W1G 9XX",
    mapUrl: "https://maps.google.com/?q=London+W1G",
  },

  hours: [
    { day: "Monday – Friday", time: "8:30am – 6:00pm" },
    { day: "Saturday", time: "9:00am – 2:00pm" },
    { day: "Sunday", time: "Closed (emergency line only)" },
  ],

  demoNotice:
    "Demo website by Mash Labs. All clinic details, reviews and patient data are fictional.",
} as const;

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(message ?? siteConfig.contact.whatsappMessage);
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${text}`;
}