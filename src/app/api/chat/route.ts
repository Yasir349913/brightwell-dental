import { NextResponse } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { treatments } from "@/data/treatments";
import { demoReply } from "@/lib/receptionist";

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(500),
      })
    )
    .min(1)
    .max(20),
});

function systemPrompt() {
  const { address, hours, contact } = siteConfig;
  return `You are the virtual receptionist for ${siteConfig.name}, a FICTIONAL private dental practice used for a software demo. Be warm, brief (under 90 words) and use plain UK English.

Facts you may use:
- Address: ${address.line1}, ${address.city} ${address.postcode}
- Hours: ${hours.map((h) => `${h.day} ${h.time}`).join("; ")}
- Phone: ${contact.phoneDisplay}. Email: ${contact.email}. WhatsApp is available.
- Private practice only (no NHS).
- Treatments and demo starting prices: ${treatments.map((t) => `${t.title} from ${t.priceFrom} (${t.duration})`).join("; ")}.

Rules:
- Never give medical advice or diagnose. For pain, swelling or injury, tell the person to call the practice for a same-day emergency slot. For breathing or swallowing difficulty or uncontrolled bleeding, tell them to call 999 or go to A&E.
- You cannot confirm, change or cancel bookings. Direct people to the online booking form at /book or to the phone number.
- Do not invent prices, availability, dentist names or policies that are not listed above. If unsure, say so and suggest calling.
- Do not ask for or repeat personal or medical details.`;
}

async function liveReply(messages: { role: "user" | "assistant"; content: string }[]) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;

  // The API needs the conversation to start with a user message
  const firstUser = messages.findIndex((m) => m.role === "user");
  if (firstUser === -1) return null;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5",
        max_tokens: 400,
        system: systemPrompt(),
        messages: messages.slice(firstUser),
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = (data.content ?? [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("\n")
      .trim();
    return text || null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const { messages } = parsed.data;
  const recent = messages.slice(-10);

  const live = await liveReply(recent);
  if (live) {
    return NextResponse.json({ mode: "live", text: live });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const reply = demoReply(lastUser?.content ?? "");
  return NextResponse.json({ mode: "demo", ...reply });
}