"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { contactSchema, type ContactValues } from "@/lib/contact-schema";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const inputClass =
  "h-12 w-full rounded-2xl border border-line bg-white px-4 text-base text-ink placeholder:text-muted/70 transition-colors hover:border-navy/30 focus:border-teal aria-[invalid=true]:border-alert";

function Err({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-alert">
      {message}
    </p>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { fullName: "", email: "", phone: "", message: "", consent: false, website: "" },
  });

  async function onSubmit(values: ContactValues) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => null);
      if (res.status === 422 && data?.fieldErrors) {
        for (const [k, m] of Object.entries(data.fieldErrors)) {
          setError(k as keyof ContactValues, { message: String(m) });
        }
        setStatus("idle");
        return;
      }
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-line bg-white p-8 shadow-xl shadow-navy/5" role="status">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-tint text-teal-dark">
          <CheckCircle2 size={30} aria-hidden />
        </span>
        <h2 className="mt-5 text-2xl font-semibold">Message sent</h2>
        <p className="mt-2 text-muted">
          Thanks for getting in touch. We usually reply within one working day.
        </p>
        <p className="mt-4 text-sm text-muted">
          Demo only: your message was validated but not sent to a real inbox.
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => {
            reset();
            setStatus("idle");
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  const busy = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-3xl border border-line bg-white p-6 shadow-xl shadow-navy/5 sm:p-8"
    >
      <h2 className="text-2xl font-semibold">Send us a message</h2>

      {status === "error" && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-alert/30 bg-alert/5 p-4 text-sm text-alert">
          <AlertCircle size={20} className="mt-0.5 shrink-0" aria-hidden />
          <p>
            We couldn&apos;t send your message. Please try again, or call us on{" "}
            {siteConfig.contact.phoneDisplay}.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="c-name" className="mb-1.5 block text-sm font-semibold text-navy">Full name</label>
        <input id="c-name" autoComplete="name" className={inputClass} aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "c-name-err" : undefined} {...register("fullName")} />
        <Err id="c-name-err" message={errors.fullName?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-email" className="mb-1.5 block text-sm font-semibold text-navy">Email address</label>
          <input id="c-email" type="email" autoComplete="email" className={inputClass} aria-invalid={!!errors.email} aria-describedby={errors.email ? "c-email-err" : undefined} {...register("email")} />
          <Err id="c-email-err" message={errors.email?.message} />
        </div>
        <div>
          <label htmlFor="c-phone" className="mb-1.5 block text-sm font-semibold text-navy">Phone (optional)</label>
          <input id="c-phone" type="tel" autoComplete="tel" className={inputClass} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "c-phone-err" : undefined} {...register("phone")} />
          <Err id="c-phone-err" message={errors.phone?.message} />
        </div>
      </div>

      <div>
        <label htmlFor="c-message" className="mb-1.5 block text-sm font-semibold text-navy">Your message</label>
        <textarea id="c-message" rows={5} className={cn(inputClass, "h-auto py-3")} aria-invalid={!!errors.message} aria-describedby="c-message-hint" {...register("message")} />
        {errors.message ? (
          <Err id="c-message-err" message={errors.message.message} />
        ) : (
          <p id="c-message-hint" className="mt-1.5 text-sm text-muted">
            Please don&apos;t include medical details. We&apos;ll discuss those at your appointment.
          </p>
        )}
      </div>

      <div className="absolute -left-[9999px]" aria-hidden>
        <label htmlFor="c-website">Leave this field empty</label>
        <input id="c-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
          <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-teal" aria-invalid={!!errors.consent} {...register("consent")} />
          <span>I agree to {siteConfig.name} using these details to reply to my message.</span>
        </label>
        <Err id="c-consent-err" message={errors.consent?.message} />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden /> Sending message
          </>
        ) : (
          "Send message"
        )}
      </Button>
      <p className="text-center text-xs text-muted">Demo form. Messages are not sent to a real inbox.</p>
    </form>
  );
}