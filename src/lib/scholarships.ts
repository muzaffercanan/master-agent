// Scholarship records: labels, the next application date, URL filters and eligibility, kept out
// of the pages so the list, the detail page and the calendar agree.
import type { FundedProgram, Funding, FundingCall, FundingCategory, Fx, Money } from "../schema";
import { checkRequirements, type CheckResult, type Profile } from "./eligibility";
import { parseD } from "./dates";
import { convert } from "./money";
import { norm } from "./text";

export const CATEGORY_ORDER: FundingCategory[] = ["eu", "de", "it", "tr", "other"];
export const CATEGORY_LABEL: Record<FundingCategory, { name: string; desc: string }> = {
  eu: { name: "AB programları", desc: "Avrupa Birliği fonlu burslar; birden fazla ülkede geçerli." },
  de: { name: "Almanya", desc: "DAAD, Alman devleti ve Alman vakıflarının bursları." },
  it: { name: "İtalya", desc: "İtalyan devleti, bölgeler ve üniversitelerin bursları." },
  tr: { name: "Türkiye kaynaklı", desc: "Türk devleti ve vakıflarının yurt içi ve yurt dışı bursları." },
  other: { name: "Diğer ülkeler", desc: "Kapsamdaki dört ülke dışında, Türk öğrencilere açık (ya da kapalı) bilinen burslar." },
};

export const LEVEL_LABEL: Record<Funding["level"], string> = { full: "Tam burs", partial: "Kısmi burs", small: "Destek" };
export const TUITION_LABEL: Record<Funding["tuition"], string> = {
  covered: "Burs öder",
  waived: "Okul muaf tutar",
  partial: "Bir tavana kadar",
  free: "Okul zaten ücretsiz",
  "not-covered": "Karşılanmaz",
  varies: "Duruma göre",
};
export const BLOCKED_LABEL: Record<Funding["blockedAccount"], string> = {
  replaces: "Bloke hesabın yerine geçer",
  partial: "Kısmen karşılar",
  no: "Yerine geçmez",
  unknown: "Belirsiz",
  na: "Gerekmez",
};
export const TURKISH_LABEL: Record<Funding["turkish"], string> = { yes: "Türk vatandaşına açık", no: "Türk vatandaşına kapalı", conditional: "Koşullu / doğrulanmadı" };
export const CS_LABEL: Record<Funding["cs"], string> = { yes: "Bilgisayar YL'si için uygun", limited: "Bilgisayar YL'si için sınırlı", no: "Bilgisayar YL'sini desteklemez" };
export const PROGRAM_SCHOL_LABEL: Record<FundedProgram["scholarships"], string> = { yes: "2027'de burslu", no: "2027'de bursu yok", unknown: "Belirsiz" };

/** Every call of a scheme, including those of its programs that still award scholarships. */
export function allCalls(f: Funding): { call: FundingCall; program?: FundedProgram }[] {
  return [...f.calls.map(call => ({ call })), ...f.programs.filter(p => p.scholarships !== "no").flatMap(program => program.calls.map(call => ({ call, program })))];
}

export interface NextCall {
  date: string;
  kind: "deadline" | "open";
  call: FundingCall;
  program?: FundedProgram;
}

/** The soonest deadline still ahead (or an opening date when the call has no deadline yet). */
export function nextCall(f: Funding, T: Date): NextCall | null {
  let best: NextCall | null = null;
  for (const { call, program } of allCalls(f)) {
    const cand: NextCall | null = call.deadline ? { date: call.deadline, kind: "deadline", call, program } : call.open ? { date: call.open, kind: "open", call, program } : null;
    if (!cand || parseD(cand.date) < T) continue;
    if (!best || cand.date < best.date) best = cand;
  }
  return best;
}

/** Study countries of the scheme and of all its programs. */
export function hostsOf(f: Funding): string[] {
  return [...new Set([...f.hostCountries, ...f.programs.flatMap(p => p.countries)])];
}

/** Monthly amount in euros, for comparing stipends paid in other currencies; null for one-off or total sums. */
export function eurPerMonth(m: Money, fx: Fx): number | null {
  const months = { month: 1, semester: 6, year: 12 }[m.per as "month" | "semester" | "year"];
  if (!months) return null;
  const eur = convert(m.amount, m.currency, "EUR", fx);
  return eur == null ? null : eur / months;
}

export function fundingCheck(f: Funding, p: Profile): CheckResult {
  return checkRequirements(f.requirements ?? {}, p);
}

export interface FundingFilters {
  q: string;
  cat: FundingCategory | "";
  host: string;
  /** tuition and living costs both covered */
  full: boolean;
  /** award letter can replace the blocked account */
  ba: boolean;
  /** funds a computer-science master's */
  cs: boolean;
  /** open to Turkish citizens */
  tr: boolean;
  /** has a future application date */
  open: boolean;
}

export const DEFAULT_FUNDING_FILTERS: FundingFilters = { q: "", cat: "", host: "", full: false, ba: false, cs: false, tr: false, open: false };

export function parseFundingFilters(sp: URLSearchParams): FundingFilters {
  const cat = sp.get("cat") ?? "";
  return {
    q: sp.get("q") ?? "",
    cat: (CATEGORY_ORDER as string[]).includes(cat) ? (cat as FundingCategory) : "",
    host: /^[a-z]{2}$/.test(sp.get("host") ?? "") ? sp.get("host")! : "",
    full: sp.get("full") === "1",
    ba: sp.get("ba") === "1",
    cs: sp.get("cs") === "1",
    tr: sp.get("tr") === "1",
    open: sp.get("open") === "1",
  };
}

export function serializeFundingFilters(f: FundingFilters): URLSearchParams {
  const sp = new URLSearchParams();
  if (f.q) sp.set("q", f.q);
  if (f.cat) sp.set("cat", f.cat);
  if (f.host) sp.set("host", f.host);
  for (const k of ["full", "ba", "cs", "tr", "open"] as const) if (f[k]) sp.set(k, "1");
  return sp;
}

export function matchFunding(f: Funding, ff: FundingFilters, T: Date): boolean {
  if (ff.cat && f.category !== ff.cat) return false;
  if (ff.host && !hostsOf(f).includes(ff.host)) return false;
  if (ff.full && f.level !== "full") return false;
  if (ff.ba && f.blockedAccount !== "replaces") return false;
  if (ff.cs && f.cs === "no") return false;
  if (ff.tr && f.turkish === "no") return false;
  if (ff.open && !nextCall(f, T)) return false;
  if (ff.q) {
    const hay = norm([f.name, f.provider, f.summary, ...f.programs.flatMap(p => [p.name, p.short, p.partners])].join(" "));
    if (!norm(ff.q).split(/\s+/).every(w => hay.includes(w))) return false;
  }
  return true;
}

/** Within a category: open to Turkish citizens first, then full scholarships, then the larger monthly stipend, then by name. */
export function sortFundings(list: Funding[], fx?: Fx): Funding[] {
  const lv = { full: 0, partial: 1, small: 2 };
  const tr = { yes: 0, conditional: 1, no: 2 };
  const pay = (f: Funding) => (fx && f.stipend ? eurPerMonth(f.stipend, fx) ?? -1 : -1);
  return [...list].sort((a, b) => tr[a.turkish] - tr[b.turkish] || lv[a.level] - lv[b.level] || pay(b) - pay(a) || a.name.localeCompare(b.name, "tr"));
}
