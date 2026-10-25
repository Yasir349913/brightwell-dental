import { toInputDate } from "@/lib/dates";
import type { AppointmentStatus } from "@/lib/appointments-store";

export type AdminAppointment = {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  date: string; // yyyy-mm-dd
  time: string;
  patientType: "new" | "existing";
  status: AppointmentStatus;
};

// Fictional patients. Emails use example.com and phones use Ofcom drama numbers.
const seed: {
  offset: number;
  time: string;
  name: string;
  service: string;
  type: "new" | "existing";
  status: AppointmentStatus;
}[] = [
  { offset: -3, time: "10:15am", name: "Olivia Bennett", service: "general-dentistry", type: "existing", status: "completed" },
  { offset: -2, time: "9:00am", name: "Daniel Okafor", service: "teeth-whitening", type: "new", status: "completed" },
  { offset: -1, time: "2:30pm", name: "Priya Shah", service: "emergency-dental-care", type: "new", status: "completed" },
  { offset: -1, time: "4:00pm", name: "Thomas Wright", service: "cosmetic-dentistry", type: "existing", status: "cancelled" },
  { offset: 0, time: "9:30am", name: "Emma Collins", service: "general-dentistry", type: "existing", status: "confirmed" },
  { offset: 0, time: "11:45am", name: "Hassan Malik", service: "invisalign", type: "new", status: "confirmed" },
  { offset: 0, time: "3:15pm", name: "Grace Turner", service: "emergency-dental-care", type: "new", status: "pending" },
  { offset: 1, time: "8:30am", name: "Liam Foster", service: "dental-implants", type: "new", status: "pending" },
  { offset: 1, time: "1:00pm", name: "Sofia Rossi", service: "teeth-whitening", type: "existing", status: "confirmed" },
  { offset: 2, time: "10:00am", name: "Ben Hughes", service: "general-dentistry", type: "new", status: "pending" },
  { offset: 3, time: "11:15am", name: "Aisha Rahman", service: "cosmetic-dentistry", type: "new", status: "pending" },
  { offset: 4, time: "4:45pm", name: "Callum Reid", service: "invisalign", type: "existing", status: "confirmed" },
];

export function buildMockAppointments(base: Date): AdminAppointment[] {
  return seed.map((s, i) => {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + s.offset);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1); // practice is closed on Sundays
    return {
      id: `mock-${i}`,
      reference: `BW-${(100 + i * 7).toString(16).toUpperCase().padStart(6, "A")}`,
      fullName: s.name,
      email: `${s.name.toLowerCase().replace(" ", ".")}@example.com`,
      phone: `07700 900${String(100 + i * 13).slice(-3)}`,
      service: s.service,
      date: toInputDate(d),
      time: s.time,
      patientType: s.type,
      status: s.status,
    };
  });
}