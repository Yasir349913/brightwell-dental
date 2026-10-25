export type Dentist = {
  name: string;
  initials: string;
  role: string;
  focus: string;
  bio: string;
  tone: string; // tailwind bg class for avatar
};

// Fictional people, for demo purposes only
export const dentists: Dentist[] = [
  {
    name: "Dr Amelia Hart",
    initials: "AH",
    role: "Principal dentist",
    focus: "General and cosmetic dentistry",
    bio: "Amelia leads the practice and is known for unhurried appointments and careful explanations. She enjoys smile design and helping nervous patients feel at ease.",
    tone: "bg-navy",
  },
  {
    name: "Dr Raj Mehta",
    initials: "RM",
    role: "Implant and restorative dentist",
    focus: "Dental implants and complex restorations",
    bio: "Raj plans every implant case with 3D imaging and works closely with patients through each stage of treatment.",
    tone: "bg-teal-dark",
  },
  {
    name: "Dr Sophie Clarke",
    initials: "SC",
    role: "Orthodontic dentist",
    focus: "Invisalign and tooth alignment",
    bio: "Sophie has treated hundreds of aligner patients and focuses on comfortable, predictable results for teens and adults.",
    tone: "bg-navy-soft",
  },
];