export type Testimonial = {
  quote: string;
  name: string;
  treatment: string;
};

// Written for the demo. Not real patient reviews.
export const testimonials: Testimonial[] = [
  {
    quote:
      "I've avoided dentists for years. The team explained everything before they started and I never felt rushed.",
    name: "Sample patient A.",
    treatment: "General check-up",
  },
  {
    quote:
      "Booked online in the evening and had a confirmation call the next morning. Really straightforward.",
    name: "Sample patient B.",
    treatment: "Emergency appointment",
  },
  {
    quote:
      "I saw a preview of my aligner plan before committing, which made the decision much easier.",
    name: "Sample patient C.",
    treatment: "Invisalign",
  },
];