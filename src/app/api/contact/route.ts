import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend success for bots
  if (typeof body === "object" && (body as { website?: unknown }).website) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { message: "Please check the highlighted fields.", fieldErrors },
      { status: 422 }
    );
  }

  await new Promise((r) => setTimeout(r, 800));

  // Demo only: the message is validated but not stored or emailed.
  // For production: send via an email service or save to an encrypted database,
  // and never log personal data.
  return NextResponse.json({ ok: true }, { status: 201 });
}