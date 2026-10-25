export const AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const DAY = 86_400_000;

export function parseD(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
export function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function today(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}
export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / DAY);
}
export function fmt(d: Date | string): string {
  const x = typeof d === "string" ? parseD(d) : d;
  return `${x.getDate()} ${AYLAR[x.getMonth()]} ${x.getFullYear()}`;
}
export function fmtShort(d: Date | string): string {
  const x = typeof d === "string" ? parseD(d) : d;
  return `${x.getDate()} ${AYLAR[x.getMonth()]}`;
}
export function fmtRange(s?: string, e?: string): string {
  if (s && e) {
    const a = parseD(s), b = parseD(e);
    return a.getFullYear() === b.getFullYear() ? `${fmtShort(a)} – ${fmt(b)}` : `${fmt(a)} – ${fmt(b)}`;
  }
  if (e) return `son gün ${fmt(e)}`;
  if (s) return `açılış ${fmt(s)}`;
  return "tarih yok";
}

export interface Countdown {
  text: string;
  past: boolean;
  soon: boolean;
  /** days until the relevant end (deadline or single date); negative when past */
  days: number;
}
/** Countdown text for a window [s, e] or a single date s. */
export function countdown(s: string | undefined, e: string | undefined, T: Date, soonDays = 21): Countdown {
  const start = s ? parseD(s) : undefined;
  const end = e ? parseD(e) : start;
  if (!end) return { text: "tarih yok", past: false, soon: false, days: Infinity };
  const toE = daysBetween(T, end);
  if (toE < 0) return { text: "geçti", past: true, soon: false, days: toE };
  // "opens in N days" only makes sense for a window with both ends
  const toS = start && e ? daysBetween(T, start) : -1;
  if (toS > 0) return { text: `${toS} gün sonra açılıyor`, past: false, soon: toS <= soonDays, days: toE };
  if (e) return { text: toE === 0 ? "bugün bitiyor" : `${toE} gün kaldı`, past: false, soon: toE <= soonDays, days: toE };
  return { text: toE === 0 ? "bugün" : `${toE} gün sonra`, past: false, soon: toE <= soonDays, days: toE };
}

/** Share of an application window [open, deadline] already elapsed on T, 0–1; null without both ends. */
export function windowProgress(open: string | undefined, deadline: string | undefined, T: Date): number | null {
  if (!open || !deadline) return null;
  const total = daysBetween(parseD(open), parseD(deadline));
  if (total <= 0) return null;
  return Math.min(1, Math.max(0, daysBetween(parseD(open), T) / total));
}

export type Urgency = "calm" | "near" | "urgent" | "past";
/** Colour band for days left until a deadline: ≤21 urgent, ≤45 near. */
export function urgency(daysLeft: number): Urgency {
  if (daysLeft < 0) return "past";
  if (daysLeft <= 21) return "urgent";
  if (daysLeft <= 45) return "near";
  return "calm";
}
