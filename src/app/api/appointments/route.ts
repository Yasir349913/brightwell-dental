import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation";
import { addAppointment } from "@/lib/appointments-store";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field. Pretend success.
  if (typeof body === "object" && body !== null && (body as { website?: unknown }).website) {
    return NextResponse.json({ reference: "BW-000000" }, { status: 201 });
  }

  // Always validate again on the server. Never trust the browser.
  const parsed = bookingSchema.safeParse(body);
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

  // Simulate network and processing time so loading states are visible in the demo
  await new Promise((r) => setTimeout(r, 900));

  // Note: personal data is deliberately not logged.
  const record = addAppointment(parsed.data);
  return NextResponse.json({ reference: record.reference }, { status: 201 });
}