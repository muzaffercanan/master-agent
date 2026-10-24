// Program explorer filters. State lives in the URL (shareable links); this module is pure.
import type { Fx } from "../schema";
import { checkRequirements, minAles, type CheckResult, type Profile } from "./eligibility";
import { yearlyCost, type CostSummary } from "./cost";
import { nextDeadline, offeredTerms, singleTermOnly, type NextDate, type ProgramView } from "./programs";
import { daysBetween, parseD } from "./dates";
import { norm } from "./text";

export interface Filters {
  scope: "" | "tr" | "abroad";
  country: string[];
  city: string[];
  uni: string[];
  field: string[];
  level: string[];
  lang: string[];
  term: string[];
  single: boolean;
  due: number | null;
  elig: "" | "ok" | "okNear";
  free: boolean;
  maxEur: number | null;
  regional: "" | "yes" | "no";
  schol: boolean;
  noAles: boolean;
  noGre: boolean;
  maxIelts: number | null;
  maxGpa: number | null;
  sl: boolean;
  q: string;
  sort: "deadline" | "cost" | "name" | "uni";
}

export const DEFAULT_FILTERS: Filters = {
  scope: "", country: [], city: [], uni: [], field: [], level: [], lang: [], term: [], single: false, due: null, elig: "",
  free: false, maxEur: null, regional: "", schol: false, noAles: false, noGre: false, maxIelts: null, maxGpa: null, sl: false, q: "", sort: "deadline",
};

const LISTS = ["country", "city", "uni", "field", "level", "lang", "term"] as const;
const BOOLS = ["single", "free", "schol", "noAles", "noGre", "sl"] as const;
const NUMS = ["due", "maxEur", "maxIelts", "maxGpa"] as const;

export function parseFilters(sp: URLSearchParams): Filters {
  const f: Filters = { ...DEFAULT_FILTERS };
  for (const k of LISTS) f[k] = (sp.get(k) ?? "").split(",").filter(Boolean);
  for (const k of BOOLS) f[k] = sp.get(k) === "1";
  for (const k of NUMS) {
    const v = parseFloat(sp.get(k) ?? "");
    f[k] = isNaN(v) ? null : v;
  }
  const scope = sp.get("scope");
  f.scope = scope === "tr" || scope === "abroad" ? scope : "";
  const elig = sp.get("elig");
  f.elig = elig === "ok" || elig === "okNear" ? elig : "";
  const reg = sp.get("regional");
  f.regional = reg === "yes" || reg === "no" ? reg : "";
  f.q = sp.get("q") ?? "";
  const sort = sp.get("sort");
  f.sort = sort === "cost" || sort === "name" || sort === "uni" ? sort : "deadline";
  return f;
}

export function serializeFilters(f: Filters): URLSearchParams {
  const sp = new URLSearchParams();
  for (const k of LISTS) if (f[k].length) sp.set(k, f[k].join(","));
  for (const k of BOOLS) if (f[k]) sp.set(k, "1");
  for (const k of NUMS) if (f[k] != null) sp.set(k, String(f[k]));
  if (f.scope) sp.set("scope", f.scope);
  if (f.elig) sp.set("elig", f.elig);
  if (f.regional) sp.set("regional", f.regional);
  if (f.q) sp.set("q", f.q);
  if (f.sort !== "deadline") sp.set("sort", f.sort);
  return sp;
}

export interface Derived {
  view: ProgramView;
  next: NextDate | null;
  cost: CostSummary;
  check: CheckResult;
}

export function derive(views: ProgramView[], ctx: { profile: Profile; fx: Fx; T: Date }): Derived[] {
  return views.map(view => ({
    view,
    next: nextDeadline(view.intakes, ctx.T),
    cost: yearlyCost(view, ctx.fx, ctx.profile.nonEU),
    check: checkRequirements(view.requirements, ctx.profile, view.country),
  }));
}

export function matchesQuery(v: ProgramView, q: string): boolean {
  if (!q) return true;
  const n = norm(q);
  const hay = [v.program.name, v.program.degree, v.program.notes ?? "", v.uni.name, v.uni.short, v.uni.city, v.uni.region ?? "", v.country.name, ...v.uni.people].map(norm).join(" | ");
  return n.split(/\s+/).every(t => hay.includes(t));
}

export function applyFilters(items: Derived[], f: Filters, ctx: { shortlist: string[]; T: Date }): Derived[] {
  const out = items.filter(({ view: v, next, cost, check }) => {
    if (f.scope === "tr" && v.uni.country !== "tr") return false;
    if (f.scope === "abroad" && v.uni.country === "tr") return false;
    if (f.country.length && !f.country.includes(v.uni.country)) return false;
    if (f.city.length && !f.city.includes(v.uni.city)) return false;
    if (f.uni.length && !f.uni.includes(v.uni.id)) return false;
    if (f.field.length && !v.program.fields.some(x => f.field.includes(x))) return false;
    if (f.level.length && !v.program.levels.some(x => f.level.includes(x))) return false;
    if (f.lang.length && !v.program.languages.some(x => f.lang.includes(x))) return false;
    if (f.term.length) {
      const t = offeredTerms(v.intakes);
      if (!f.term.some(x => t.yes.includes(x as never))) return false;
    }
    if (f.single && !singleTermOnly(v.intakes)) return false;
    if (f.due != null) {
      if (!next || next.kind !== "deadline" || daysBetween(ctx.T, parseD(next.date)) > f.due) return false;
    }
    if (f.elig === "ok" && check.overall !== "ok") return false;
    if (f.elig === "okNear" && check.overall !== "ok" && check.overall !== "near") return false;
    if (f.free && !cost.free) return false;
    if (f.maxEur != null && (cost.eurPerYear == null || cost.eurPerYear > f.maxEur)) return false;
    if (f.regional === "yes" && !cost.hasRegionalFee) return false;
    if (f.regional === "no" && cost.hasRegionalFee) return false;
    if (f.schol && !v.scholarships.length) return false;
    const r = v.requirements;
    if (f.noAles && r.ales?.min != null && !r.ales.notRequired) return false;
    if (f.noGre && r.gre?.policy === "required") return false;
    if (f.maxIelts != null && r.english?.ielts != null && r.english.ielts > f.maxIelts) return false;
    if (f.maxGpa != null && r.gpa?.min != null && (r.gpa.scale ?? 4) === 4 && r.gpa.min > f.maxGpa) return false;
    if (f.sl && !ctx.shortlist.includes(v.key)) return false;
    return matchesQuery(v, f.q);
  });
  const byName = (a: Derived, b: Derived) => a.view.program.name.localeCompare(b.view.program.name, "tr");
  const sorters: Record<Filters["sort"], (a: Derived, b: Derived) => number> = {
    deadline: (a, b) => (a.next?.date ?? "9999").localeCompare(b.next?.date ?? "9999") || byName(a, b),
    cost: (a, b) => (a.cost.eurPerYear ?? Infinity) - (b.cost.eurPerYear ?? Infinity) || byName(a, b),
    name: byName,
    uni: (a, b) => a.view.uni.short.localeCompare(b.view.uni.short, "tr") || byName(a, b),
  };
  return out.sort(sorters[f.sort]);
}

/** ALES threshold shown in lists (uses the applicant's GPA for tiered rules). */
export function alesLabel(v: ProgramView, gpa: number | undefined): string | null {
  const a = v.requirements.ales;
  if (!a) return null;
  if (a.notRequired) return "ALES yok";
  if (a.min == null) return null;
  const m = minAles(a.min, gpa);
  return m == null ? "ALES: GNO yetmiyor" : `ALES ${m}`;
}
