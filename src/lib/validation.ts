import { z } from "zod";
import { treatments } from "@/data/treatments";
import { fromInputDate } from "@/lib/dates";

export const serviceOptions = [
  ...treatments.map((t) => ({ value: t.slug, label: t.title })),
  { value: "not-sure", label: "Not sure yet" },
];
const serviceValues = serviceOptions.map((s) => s.value);

// 8:30am to 5:45pm, every 15 minutes
export const timeSlots = (() => {
  const out: string[] = [];
  for (let m = 8 * 60 + 30; m <= 17 * 60 + 45; m += 15) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    const h12 = h % 12 === 0 ? 12 : h % 12;
    out.push(`${h12}:${String(min).padStart(2, "0")}${h >= 12 ? "pm" : "am"}`);
  }
  return out;
})();

function toMinutes(slot: string) {
  const match = slot.match(/^(\d+):(\d{2})(am|pm)$/);
  if (!match) return 0;
  let h = Number(match[1]) % 12;
  if (match[3] === "pm") h += 12;
  return h * 60 + Number(match[2]);
}

export const bookingSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name").max(80, "Name is too long"),
    email: z.string().trim().email("Enter a valid email address").max(120),
    phone: z
      .string()
      .trim()
      .refine(
        (v) => /^\+?\d{10,14}$/.test(v.replace(/[\s()-]/g, "")),
        "Enter a valid phone number, e.g. 07700 900123"
      ),
    service: z
      .string()
      .min(1, "Choose a treatment")
      .refine((v) => serviceValues.includes(v), "Choose a treatment"),
    preferredDate: z
      .string()
      .min(1, "Choose a preferred date")
      .refine((v) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return fromInputDate(v) >= today;
      }, "Choose today or a future date")
      .refine(
        (v) => fromInputDate(v).getDay() !== 0,
        "We're closed on Sundays. Choose Monday to Saturday."
      ),
    preferredTime: z
      .string()
      .min(1, "Choose a preferred time")
      .refine((v) => timeSlots.includes(v), "Choose a preferred time"),
    patientType: z.enum(["new", "existing"]),
    notes: z.string().max(500, "Please keep notes under 500 characters").optional(),
    consent: z.boolean().refine((v) => v === true, "Please tick the box to continue"),
    website: z.string().optional(), // honeypot, must stay empty
  })
  .superRefine((v, ctx) => {
    if (!v.preferredDate || !v.preferredTime) return;
    const isSaturday = fromInputDate(v.preferredDate).getDay() === 6;
    if (isSaturday && toMinutes(v.preferredTime) > 13 * 60 + 30) {
      ctx.addIssue({
        code: "custom",
        path: ["preferredTime"],
        message: "On Saturdays we close at 2pm. Choose 1:30pm or earlier.",
      });
    }
  });

export type BookingValues = z.infer<typeof bookingSchema>;