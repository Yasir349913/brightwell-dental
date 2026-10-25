import type { BookingValues } from "@/lib/validation";

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type AppointmentRequest = Omit<BookingValues, "website" | "consent"> & {
  id: string;
  reference: string;
  status: AppointmentStatus;
  createdAt: string;
};

// Demo only: lives in server memory and resets on restart.
// Replace with a real database (with encryption at rest) for production.
const g = globalThis as unknown as { __bwAppointments?: AppointmentRequest[] };
export const appointmentsStore: AppointmentRequest[] = (g.__bwAppointments ??= []);

export function addAppointment(values: BookingValues): AppointmentRequest {
  const { website: _website, consent: _consent, ...rest } = values;
  const id = crypto.randomUUID();
  const record: AppointmentRequest = {
    ...rest,
    id,
    reference: `BW-${id.slice(0, 6).toUpperCase()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  appointmentsStore.unshift(record);
  return record;
}