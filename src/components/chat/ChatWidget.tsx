"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, MessageSquare, Send, X } from "lucide-react";
import type { ChatAction } from "@/lib/receptionist";
import { cn } from "@/lib/utils";

type Msg = { id: number; role: "user" | "assistant"; text: string; actions?: ChatAction[] };
type Mode = "demo" | "live";

const chips = ["Opening hours", "Book an appointment", "Do you do Invisalign?", "I have a toothache"];

const greeting: Msg = {
  id: 0,
  role: "assistant",
  text: "Hi, I'm the virtual receptionist. I can help with opening hours, treatments, prices and booking. Please don't share medical or personal details here.",
};

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([greeting]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<Mode>("demo");
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, busy]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;

    const userMsg: Msg = { id: idRef.current++, role: "user", text: content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setError(null);
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(1).map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      setMode(data.mode === "live" ? "live" : "demo");
      setMessages((m) => [
        ...m,
        { id: idRef.current++, role: "assistant", text: data.text, actions: data.actions },
      ]);
    } catch {
      setError("Sorry, I couldn't reply just now. Please try again or call us.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label="Virtual receptionist"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            className="fixed inset-x-3 bottom-24 z-50 flex max-h-[min(36rem,calc(100dvh-8rem))] flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-2xl shadow-navy/20 sm:inset-x-auto sm:right-5 sm:w-[24rem]"
          >
            <header className="flex items-center justify-between gap-3 bg-navy px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                  <Bot size={20} aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight">Virtual receptionist</p>
                  <p className="text-xs text-white/70">
                    {mode === "live" ? "AI assistant · live" : "Demo mode · scripted replies"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto bg-mist px-4 py-4" role="log" aria-live="polite">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex flex-col gap-2", m.role === "user" ? "items-end" : "items-start")}>
                  <p
                    className={cn(
                      "max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      m.role === "user" ? "bg-teal text-white" : "bg-white text-ink"
                    )}
                  >
                    {m.text}
                  </p>
                  {m.actions && (
                    <div className="flex max-w-[90%] flex-wrap gap-2">
                      {m.actions.map((a) =>
                        a.external || a.href.startsWith("tel:") ? (
                          <a
                            key={a.label}
                            href={a.href}
                            {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            className="rounded-full border border-teal px-3.5 py-1.5 text-xs font-semibold text-teal-dark hover:bg-teal-tint"
                          >
                            {a.label}
                          </a>
                        ) : (
                          <Link
                            key={a.label}
                            href={a.href}
                            onClick={() => setOpen(false)}
                            className="rounded-full border border-teal px-3.5 py-1.5 text-xs font-semibold text-teal-dark hover:bg-teal-tint"
                          >
                            {a.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}

              {busy && (
                <p className="flex w-fit items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm text-muted">
                  <Loader2 size={14} className="animate-spin" aria-hidden /> Typing
                </p>
              )}
              {error && (
                <p role="alert" className="rounded-2xl bg-alert/10 px-4 py-2.5 text-sm text-alert">
                  {error}
                </p>
              )}

              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {chips.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => send(c)}
                      className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-navy hover:border-teal"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-line bg-white p-3"
            >
              <div className="flex gap-2">
                <label htmlFor="chat-input" className="sr-only">
                  Your message
                </label>
                <input
                  id="chat-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={500}
                  placeholder="Type your question"
                  autoComplete="off"
                  className="h-11 flex-1 rounded-full border border-line px-4 text-sm focus:border-teal"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="Send message"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white transition-colors hover:bg-navy-soft disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="mt-2 text-center text-[11px] text-muted">
                {mode === "live"
                  ? "AI-generated replies. For urgent problems, call us."
                  : "Demo assistant. Not connected to a live AI service."}
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close virtual receptionist" : "Open virtual receptionist"}
        className="fixed bottom-5 right-5 z-50 flex h-14 items-center gap-2 rounded-full bg-navy px-5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
      >
        {open ? <X size={22} aria-hidden /> : <MessageSquare size={22} aria-hidden />}
        <span className="hidden sm:inline">Ask us</span>
      </button>
    </>
  );
}