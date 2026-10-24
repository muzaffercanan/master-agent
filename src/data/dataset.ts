// Parses raw JSON into a typed, cross-checked dataset. Pure (no fs / no Vite) so it runs in the
// browser, in scripts/check.ts and in tests.
import { z } from "zod";
import { Country, CsrRow, Fields, Fx, University } from "../schema";
import type { Country as TCountry, CsrRow as TCsrRow, Field, Fx as TFx, University as TUniversity } from "../schema";

export interface RawDataset {
  countries: { file: string; json: unknown }[];
  universities: { file: string; json: unknown }[];
  fields: unknown;
  fx: unknown;
  csr: unknown;
}

export interface Dataset {
  countries: TCountry[];
  universities: TUniversity[];
  fields: Record<string, Field>;
  fx: TFx;
  csr: TCsrRow[];
}

function fmtIssues(file: string, e: z.ZodError) {
  return e.issues.map(i => `${file} → ${i.path.join(".") || "(kök)"}: ${i.message}`);
}

export function parseDataset(raw: RawDataset): { dataset: Dataset; errors: string[] } {
  const errors: string[] = [];
  const take = <T>(file: string, schema: z.ZodType<T, z.ZodTypeDef, unknown>, json: unknown): T | null => {
    const r = schema.safeParse(json);
    if (!r.success) {
      errors.push(...fmtIssues(file, r.error));
      return null;
    }
    return r.data;
  };

  const countries = raw.countries.map(c => take(c.file, Country, c.json)).filter((x): x is TCountry => !!x);
  const universities = raw.universities.map(u => take(u.file, University, u.json)).filter((x): x is TUniversity => !!x);
  const fields = take("fields.json", Fields, raw.fields) ?? {};
  const fx = take("fx.json", Fx, raw.fx) ?? { date: "1970-01-01", source: "", perEUR: { EUR: 1 } };
  const csr = take("tr/csrankings.json", z.array(CsrRow), raw.csr) ?? [];

  // ---- cross references ----
  const countryCodes = new Set(countries.map(c => c.code));
  const uniIds = new Set<string>();
  for (const [i, c] of raw.countries.entries()) {
    const code = countries[i]?.code;
    if (code && !c.file.endsWith(`${code}.json`)) errors.push(`${c.file}: dosya adı ülke koduyla (${code}) aynı olmalı`);
  }
  for (const u of universities) {
    const where = `universities/${u.country}/${u.id}.json`;
    if (uniIds.has(u.id)) errors.push(`${where}: id "${u.id}" tekrar ediyor`);
    uniIds.add(u.id);
    if (!countryCodes.has(u.country)) errors.push(`${where}: ülke "${u.country}" için countries/${u.country}.json yok`);
    const progIds = new Set<string>();
    for (const p of u.programs) {
      if (progIds.has(p.id)) errors.push(`${where}: program id "${p.id}" tekrar ediyor`);
      progIds.add(p.id);
      for (const f of p.fields) if (!(f in fields)) errors.push(`${where} → ${p.id}: bilinmeyen alan "${f}"`);
      for (const i of p.intakes ?? []) checkIntake(`${where} → ${p.id}`, i, errors);
      checkMoney(`${where} → ${p.id}`, p.costs, fx, errors);
      checkAles(`${where} → ${p.id}`, p.requirements?.ales?.min, errors);
    }
    for (const i of u.intakes) checkIntake(where, i, errors);
    checkMoney(where, u.costs, fx, errors);
    checkAles(where, u.requirements?.ales?.min, errors);
  }
  for (const c of countries)
    for (const ev of c.timeline) {
      if (ev.e && ev.e < ev.s) errors.push(`countries/${c.code}.json → takvim "${ev.t}": bitiş başlangıçtan önce`);
      if (ev.uni && !uniIds.has(ev.uni)) errors.push(`countries/${c.code}.json → takvim "${ev.t}": bilinmeyen üniversite "${ev.uni}"`);
    }

  universities.sort((a, b) => a.country.localeCompare(b.country) || a.city.localeCompare(b.city, "tr") || a.short.localeCompare(b.short, "tr"));
  return { dataset: { countries, universities, fields, fx, csr }, errors };
}

function checkIntake(where: string, i: { term: string; rounds: { open?: string; deadline?: string }[] }, errors: string[]) {
  for (const r of i.rounds) if (r.open && r.deadline && r.deadline < r.open) errors.push(`${where}: ${i.term} turunda bitiş başlangıçtan önce`);
}

function checkMoney(where: string, costs: { tuition: { fee?: { currency: string }; feeNonEU?: { currency: string } }; semesterFee?: { currency: string } } | undefined, fx: TFx, errors: string[]) {
  if (!costs) return;
  for (const m of [costs.tuition.fee, costs.tuition.feeNonEU, costs.semesterFee])
    if (m && !(m.currency in fx.perEUR)) errors.push(`${where}: fx.json'da ${m.currency} kuru yok`);
}

function checkAles(where: string, m: number | { tiers: { gpa: number }[] } | undefined, errors: string[]) {
  if (!m || typeof m === "number") return;
  const g = m.tiers.map(t => t.gpa);
  if (g.some((x, k) => k > 0 && x > g[k - 1])) errors.push(`${where}: ALES kademeleri büyükten küçüğe GNO sıralı olmalı`);
}
