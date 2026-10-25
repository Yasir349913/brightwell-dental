import type { AppointmentStatus } from "@/lib/appointments-store";
import { cn } from "@/lib/utils";

export const statusLabels: Record<AppointmentStatus, string> = {
  pending: "Awaiting confirmation",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const styles: Record<AppointmentStatus, string> = {
  pending: "bg-amber-100 text-amber-900",
  confirmed: "bg-teal-tint text-teal-dark",
  completed: "bg-navy/10 text-navy",
  cancelled: "bg-alert/10 text-alert",
};

export function StatusBadge({ status, short = false }: { status: AppointmentStatus; short?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        styles[status]
      )}
    >
      {short && status === "pending" ? "Pending" : statusLabels[status]}
    </span>
  );
}