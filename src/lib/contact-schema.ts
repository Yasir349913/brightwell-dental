import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80, "Name is too long"),
  email: z.string().trim().email("Enter a valid email address").max(120),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || /^\+?\d{10,14}$/.test(v.replace(/[\s()-]/g, "")),
      "Enter a valid phone number, e.g. 07700 900123"
    ),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least a short sentence")
    .max(1000, "Please keep your message under 1000 characters"),
  consent: z.boolean().refine((v) => v === true, "Please tick the box to continue"),
  website: z.string().optional(), // honeypot
});

export type ContactValues = z.infer<typeof contactSchema>;