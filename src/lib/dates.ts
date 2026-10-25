export function toInputDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromInputDate(v: string) {
  const [y, m, d] = v.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

/** Turns a hero label ("Today", "Tomorrow", "Wednesday") into a date input value. Returns "" if closed (Sunday) or unknown. */
export function dateFromDayLabel(label: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(today);
  const l = label.toLowerCase();

  if (l === "tomorrow") {
    target.setDate(target.getDate() + 1);
  } else if (l !== "today") {
    const idx = dayNames.indexOf(l);
    if (idx === -1) return "";
    const diff = (idx - today.getDay() + 7) % 7 || 7;
    target.setDate(today.getDate() + diff);
  }
  return target.getDay() === 0 ? "" : toInputDate(target);
}