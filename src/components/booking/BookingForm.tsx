"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { dateFromDayLabel, fromInputDate, toInputDate } from "@/lib/dates";
import {
  bookingSchema,
  serviceOptions,
  timeSlots,
  type BookingValues,
} from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const inputClass =
  "h-12 w-full rounded-2xl border border-line bg-white px-4 text-base text-ink placeholder:text-muted/70 transition-colors hover:border-navy/30 focus:border-teal aria-[invalid=true]:border-alert";

type Status = "idle" | "submitting" | "success" | "error";

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-medium text-alert">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export function BookingForm() {
  const params = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<{ reference: string; values: BookingValues } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const service = params.get("service") ?? "";
  const day = params.get("day") ?? "";
  const time = params.get("time") ?? "";

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      service: serviceOptions.some((s) => s.value === service) ? service : "",
      preferredDate: day ? dateFromDayLabel(day) : "",
      preferredTime: timeSlots.includes(time) ? time : "",
      patientType: "new",
      notes: "",
      consent: false,
      website: "",
    },
  });

  useEffect(() => {
    if (status === "success") headingRef.current?.focus();
  }, [status]);

  async function onSubmit(values: BookingValues) {
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => null);

      if (res.status === 422 && data?.fieldErrors) {
        for (const [key, message] of Object.entries(data.fieldErrors)) {
          setError(key as keyof BookingValues, { message: String(message) });
        }
        setStatus("idle");
        return;
      }
      if (!res.ok) throw new Error("Request failed");

      setResult({ reference: data.reference, values });
      setStatus("success");
    } catch {
      setServerError(
        `We couldn't send your request. Please try again, or call us on ${siteConfig.contact.phoneDisplay}.`
      );
      setStatus("error");
    }
  }

  if (status === "success" && result) {
    const { values, reference } = result;
    const serviceLabel = serviceOptions.find((s) => s.value === values.service)?.label;
    const dateLabel = fromInputDate(values.preferredDate).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    return (
      <div className="rounded-3xl border border-line bg-white p-8 shadow-xl shadow-navy/5">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-tint text-teal-dark">
          <CheckCircle2 size={30} aria-hidden />
        </span>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="mt-5 text-3xl font-semibold outline-none"
        >
          Request received, {values.fullName.split(" ")[0]}
        </h2>
        <p className="mt-3 text-lg text-muted">
          This is a request, not a confirmed appointment yet. A member of the team will
          contact you to confirm.
        </p>
        <dl className="mt-6 divide-y divide-line rounded-2xl bg-mist px-5 text-sm">
          {[
            ["Reference", reference],
            ["Treatment", serviceLabel],
            ["Preferred time", `${dateLabel}, ${values.preferredTime}`],
            ["We'll contact you on", values.phone],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-3">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right font-semibold text-navy">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-sm text-muted">
          Demo only: nothing was sent to a real clinic, and this data is held in memory
          until the server restarts.
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => {
            reset();
            setResult(null);
            setStatus("idle");
          }}
        >
          Make another request
        </Button>
      </div>
    );
  }

  const busy = status === "submitting";
  const today = toInputDate(new Date());

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6 rounded-3xl border border-line bg-white p-6 shadow-xl shadow-navy/5 sm:p-8"
    >
      {status === "error" && serverError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-alert/30 bg-alert/5 p-4 text-sm text-alert"
        >
          <AlertCircle size={20} className="mt-0.5 shrink-0" aria-hidden />
          <p>{serverError}</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="fullName" label="Full name" error={errors.fullName?.message}>
          <input
            id="fullName"
            autoComplete="name"
            className={inputClass}
            aria-invalid={!!errors.fullName}
            aria-describedby={describedBy("fullName", errors.fullName?.message)}
            {...register("fullName")}
          />
        </Field>
        <Field id="phone" label="Phone number" error={errors.phone?.message}>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="07700 900123"
            className={inputClass}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone", errors.phone?.message)}
            {...register("phone")}
          />
        </Field>
      </div>

      <Field id="email" label="Email address" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={inputClass}
          aria-invalid={!!errors.email}
          aria-describedby={describedBy("email", errors.email?.message)}
          {...register("email")}
        />
      </Field>

      <Field id="service" label="Treatment" error={errors.service?.message}>
        <select
          id="service"
          className={inputClass}
          aria-invalid={!!errors.service}
          aria-describedby={describedBy("service", errors.service?.message)}
          {...register("service")}
        >
          <option value="">Choose a treatment</option>
          {serviceOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="preferredDate" label="Preferred date" error={errors.preferredDate?.message}>
          <input
            id="preferredDate"
            type="date"
            min={today}
            className={inputClass}
            aria-invalid={!!errors.preferredDate}
            aria-describedby={describedBy("preferredDate", errors.preferredDate?.message)}
            {...register("preferredDate")}
          />
        </Field>
        <Field id="preferredTime" label="Preferred time" error={errors.preferredTime?.message}>
          <select
            id="preferredTime"
            className={inputClass}
            aria-invalid={!!errors.preferredTime}
            aria-describedby={describedBy("preferredTime", errors.preferredTime?.message)}
            {...register("preferredTime")}
          >
            <option value="">Choose a time</option>
            {timeSlots.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-navy">Are you a new patient?</legend>
        <div className="flex gap-3">
          {[
            { value: "new", label: "New patient" },
            { value: "existing", label: "Existing patient" },
          ].map((o) => (
            <label
              key={o.value}
              className="flex flex-1 cursor-pointer items-center gap-3 rounded-2xl border border-line px-4 py-3 text-sm has-[:checked]:border-teal has-[:checked]:bg-teal-tint"
            >
              <input
                type="radio"
                value={o.value}
                className="h-4 w-4 accent-teal"
                {...register("patientType")}
              />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>

      <Field
        id="notes"
        label="Anything we should know? (optional)"
        error={errors.notes?.message}
        hint="Please don't include medical details here. We'll ask about your health history at your appointment."
      >
        <textarea
          id="notes"
          rows={3}
          className={cn(inputClass, "h-auto py-3")}
          aria-invalid={!!errors.notes}
          aria-describedby={describedBy("notes", errors.notes?.message, "hint")}
          {...register("notes")}
        />
      </Field>

      {/* Honeypot: hidden from people and assistive tech, bots tend to fill it */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            className="mt-0.5 h-5 w-5 shrink-0 accent-teal"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            {...register("consent")}
          />
          <span>
            I agree to {siteConfig.name} using these details to contact me about my
            appointment request.
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" role="alert" className="mt-1.5 text-sm font-medium text-alert">
            {errors.consent.message}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden /> Sending request
          </>
        ) : (
          "Request appointment"
        )}
      </Button>
      <p className="text-center text-xs text-muted">
        Demo form. Details are not sent to a real clinic.
      </p>
    </form>
  );
}