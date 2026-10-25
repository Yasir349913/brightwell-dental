"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Inbox,
  List,
  Mail,
  Phone,
  RotateCcw,
  Search,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";
import type { AppointmentStatus } from "@/lib/appointments-store";
import { buildMockAppointments, type AdminAppointment } from "@/data/mock-appointments";
import { getTreatment } from "@/data/treatments";
import { fromInputDate, toInputDate } from "@/lib/dates";
import { StatusBadge, statusLabels } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";

type Filter = "all" | AppointmentStatus;
type View = "list" | "calendar";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function minutes(slot: string) {
  const m = slot.match(/^(\d+):(\d{2})(am|pm)$/);
  if (!m) return 0;
  return ((Number(m[1]) % 12) + (m[3] === "pm" ? 12 : 0)) * 60 + Number(m[2]);
}

function sortByDateTime(a: AdminAppointment, b: AdminAppointment) {
  return a.date.localeCompare(b.date) || minutes(a.time) - minutes(b.time);
}

function serviceName(slug: string) {
  return getTreatment(slug)?.title ?? "Not sure yet";
}

function shortDate(date: string) {
  return fromInputDate(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function AdminDashboard() {
  const [items, setItems] = useState<AdminAppointment[] | null>(null);
  const [today, setToday] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("list");
  const [weekOffset, setWeekOffset] = useState(0);
  const [announce, setAnnounce] = useState("");

  // Build mock data after mount so dates are relative to the real "today"
  useEffect(() => {
    const now = new Date();
    setToday(toInputDate(now));
    setItems(buildMockAppointments(now));
  }, []);

  function updateStatus(id: string, status: AppointmentStatus) {
    setItems((prev) => prev?.map((a) => (a.id === id ? { ...a, status } : a)) ?? prev);
    const a = items?.find((x) => x.id === id);
    if (a) setAnnounce(`${a.fullName} marked as ${statusLabels[status].toLowerCase()}.`);
  }

  function resetDemo() {
    setItems(buildMockAppointments(new Date()));
    setFilter("all");
    setQuery("");
    setAnnounce("Demo data reset.");
  }

  const stats = useMemo(() => {
    const list = items ?? [];
    return {
      pending: list.filter((a) => a.status === "pending").length,
      today: list.filter((a) => a.date === today && a.status !== "cancelled").length,
      upcoming: list.filter((a) => a.status === "confirmed" && a.date >= today).length,
      cancelled: list.filter((a) => a.status === "cancelled").length,
    };
  }, [items, today]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (items ?? [])
      .filter((a) => filter === "all" || a.status === filter)
      .filter(
        (a) =>
          !q ||
          a.fullName.toLowerCase().includes(q) ||
          a.reference.toLowerCase().includes(q) ||
          serviceName(a.service).toLowerCase().includes(q)
      )
      .sort(sortByDateTime);
  }, [items, filter, query]);

  if (!items) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading dashboard">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-3xl bg-mist" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-3xl bg-mist" />
      </div>
    );
  }

  const cards = [
    { label: "Awaiting confirmation", value: stats.pending, icon: Inbox, tone: "bg-amber-100 text-amber-900" },
    { label: "Appointments today", value: stats.today, icon: CalendarDays, tone: "bg-navy text-white" },
    { label: "Confirmed upcoming", value: stats.upcoming, icon: UserRoundCheck, tone: "bg-teal-tint text-teal-dark" },
    { label: "Cancelled", value: stats.cancelled, icon: UserRoundX, tone: "bg-alert/10 text-alert" },
  ];

  // Calendar: Monday to Saturday of the selected week
  const base = fromInputDate(today);
  const monday = new Date(base);
  monday.setDate(base.getDate() - ((base.getDay() + 6) % 7) + weekOffset * 7);
  const weekDays = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return toInputDate(d);
  });
  const weekLabel = `${fromInputDate(weekDays[0]).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  })} to ${fromInputDate(weekDays[5]).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;

  return (
    <div className="space-y-6">
      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>

      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <li key={label} className="rounded-3xl border border-line bg-white p-5">
            <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", tone)}>
              <Icon size={20} aria-hidden />
            </span>
            <p className="mt-4 font-display text-4xl font-semibold text-navy">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </li>
        ))}
      </ul>

      <section className="rounded-3xl border border-line bg-white">
        <div className="flex flex-col gap-4 border-b border-line p-5 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="font-sans text-lg font-semibold">Appointment requests</h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <label htmlFor="admin-search" className="sr-only">
                Search appointments
              </label>
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
              <input
                id="admin-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, reference or treatment"
                className="h-10 w-full rounded-full border border-line pl-10 pr-4 text-sm focus:border-teal sm:w-72"
              />
            </div>

            <div className="flex rounded-full bg-mist p-1" role="group" aria-label="View">
              {(
                [
                  { v: "list", label: "List", icon: List },
                  { v: "calendar", label: "Calendar", icon: CalendarDays },
                ] as const
              ).map(({ v, label, icon: Icon }) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={cn(
                    "flex h-8 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-colors",
                    view === v ? "bg-white text-navy shadow-sm" : "text-muted hover:text-navy"
                  )}
                >
                  <Icon size={15} aria-hidden /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-line px-5 py-3" role="group" aria-label="Filter by status">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                filter === f.value
                  ? "border-navy bg-navy text-white"
                  : "border-line text-ink hover:border-navy/40"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {view === "list" ? (
          visible.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-semibold text-navy">No appointments match</p>
              <p className="mt-1 text-sm text-muted">Clear the search or choose a different status.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
                className="mt-4 rounded-full border border-line px-4 py-2 text-sm font-semibold text-navy hover:bg-mist"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {visible.map((a) => (
                <li
                  key={a.id}
                  className="grid gap-4 p-5 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-center"
                >
                  <div>
                    <p className="font-semibold text-navy">{a.fullName}</p>
                    <p className="text-sm text-muted">
                      {a.reference} · {a.patientType === "new" ? "New patient" : "Existing patient"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{serviceName(a.service)}</p>
                    <p className="text-sm text-muted">
                      {shortDate(a.date)}, {a.time}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    <a href={`tel:${a.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-ink hover:text-teal-dark">
                      <Phone size={14} aria-hidden /> {a.phone}
                    </a>
                    <a href={`mailto:${a.email}`} className="flex items-center gap-2 break-all text-ink hover:text-teal-dark">
                      <Mail size={14} aria-hidden /> {a.email}
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                    <StatusBadge status={a.status} short />
                    <label className="sr-only" htmlFor={`status-${a.id}`}>
                      Change status for {a.fullName}
                    </label>
                    <select
                      id={`status-${a.id}`}
                      value={a.status}
                      onChange={(e) => updateStatus(a.id, e.target.value as AppointmentStatus)}
                      className="h-9 rounded-full border border-line bg-white px-3 text-sm focus:border-teal"
                    >
                      {(Object.keys(statusLabels) as AppointmentStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {statusLabels[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : (
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="font-semibold text-navy" aria-live="polite">
                {weekOffset === 0 ? "This week" : weekLabel}
                {weekOffset === 0 && <span className="ml-2 text-sm font-normal text-muted">{weekLabel}</span>}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setWeekOffset((w) => w - 1)}
                  aria-label="Previous week"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:bg-mist"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setWeekOffset(0)}
                  className="rounded-full border border-line px-3.5 text-sm font-medium hover:bg-mist"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setWeekOffset((w) => w + 1)}
                  aria-label="Next week"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:bg-mist"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
              {weekDays.map((day) => {
                const dayItems = visible.filter((a) => a.date === day);
                const isToday = day === today;
                return (
                  <section
                    key={day}
                    aria-label={shortDate(day)}
                    className={cn(
                      "min-h-32 rounded-2xl border p-3",
                      isToday ? "border-teal bg-teal-tint/40" : "border-line"
                    )}
                  >
                    <h3 className="font-sans text-sm font-semibold text-navy">
                      {shortDate(day)}
                      {isToday && <span className="ml-1.5 text-xs font-medium text-teal-dark">Today</span>}
                    </h3>
                    {dayItems.length === 0 ? (
                      <p className="mt-3 text-xs text-muted">No appointments</p>
                    ) : (
                      <ul className="mt-2 space-y-2">
                        {dayItems.map((a) => (
                          <li key={a.id} className="rounded-xl bg-white p-2.5 text-xs shadow-sm">
                            <p className="font-semibold text-navy">
                              {a.time} · {a.fullName}
                            </p>
                            <p className="mt-0.5 text-muted">{serviceName(a.service)}</p>
                            <div className="mt-1.5">
                              <StatusBadge status={a.status} short />
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <div className="flex flex-col gap-3 rounded-3xl bg-mist p-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          Prototype using fictional mock data. Changes live in this browser tab only and are
          lost on refresh.
        </p>
        <button
          type="button"
          onClick={resetDemo}
          className="flex w-fit items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-semibold text-navy hover:bg-teal-tint"
        >
          <RotateCcw size={15} aria-hidden /> Reset demo data
        </button>
      </div>
    </div>
  );
}