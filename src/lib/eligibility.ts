// Compares an applicant profile with a program's requirements, criterion by criterion.
import type { AlesMin, Country, Requirements } from "../schema";

export interface Profile {
  gpa?: number;
  gpaScale: 4 | 100;
  ales?: number;
  ielts?: number;
  toefl?: number;
  yds?: number;
  greQ?: number;
  /** Turkish citizens are non-EU applicants abroad */
  nonEU: boolean;
  /** completed ECTS per subject area, e.g. { "Matematik": 30, "Programlama": 24 } */
  ects: Record<string, number>;
}

export const EMPTY_PROFILE: Profile = { gpaScale: 4, nonEU: true, ects: {} };

export type CheckStatus = "ok" | "near" | "fail" | "unknown" | "na";
export interface CheckItem {
  key: "gpa" | "ales" | "english" | "gre" | "ects";
  label: string;
  status: CheckStatus;
  need: string;
  detail?: string;
}
export interface CheckResult {
  overall: CheckStatus | "none";
  items: CheckItem[];
}

/** ALES minimum for a given GPA; null means the GPA is below every tier. */
export function minAles(m: AlesMin, gpa: number | undefined): number | null {
  if (typeof m === "number") return m;
  if (gpa == null) return m.default;
  const tier = m.tiers.find(t => gpa >= t.gpa);
  return tier ? tier.ales : null;
}

/**
 * Bavarian formula: German grade = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin), clamped to 1.0–4.0.
 * Nmax/Nmin are the best/minimum passing grades of the home scale (country data decides them).
 */
export function bavarian(gpa: number, nMax: number, nMin: number): number {
  const g = 1 + (3 * (nMax - gpa)) / (nMax - nMin);
  return Math.min(4, Math.max(1, Math.round(g * 100) / 100));
}

const worst = (a: CheckStatus, b: CheckStatus): CheckStatus => {
  const rank: Record<CheckStatus, number> = { fail: 4, near: 3, unknown: 2, ok: 1, na: 0 };
  return rank[a] >= rank[b] ? a : b;
};

export function checkRequirements(req: Requirements, p: Profile, country?: Country): CheckResult {
  const items: CheckItem[] = [];
  const gpa4 = p.gpa != null && p.gpaScale === 4 ? p.gpa : undefined;

  // GPA on the program's own scale
  if (req.gpa?.min != null) {
    const scale = req.gpa.scale ?? 4;
    const mine = p.gpa != null && p.gpaScale === scale ? p.gpa : undefined;
    const need = `GNO ≥ ${req.gpa.min.toFixed(2)}/${scale}`;
    if (mine == null) items.push({ key: "gpa", label: "GNO", status: "unknown", need, detail: p.gpa == null ? "Profilde GNO yok" : "Ölçek farklı" });
    else items.push({ key: "gpa", label: "GNO", status: mine >= req.gpa.min ? "ok" : mine >= req.gpa.min - 0.1 ? "near" : "fail", need, detail: `Senin: ${mine.toFixed(2)}` });
  }
  // GPA converted to the German scale (lower is better)
  if (req.gpa?.deMax != null) {
    const need = `Alman notu ≤ ${req.gpa.deMax.toFixed(1)}`;
    const conv = country?.gpaConversion;
    if (gpa4 == null || !conv) items.push({ key: "gpa", label: "GNO (Alman notu)", status: "unknown", need, detail: !conv ? "Ülke dönüşüm kuralı yok" : "Profilde 4'lük GNO yok" });
    else {
      const de = bavarian(gpa4, conv.nMax, conv.nMin);
      items.push({ key: "gpa", label: "GNO (Alman notu)", status: de <= req.gpa.deMax ? "ok" : de <= req.gpa.deMax + 0.2 ? "near" : "fail", need, detail: `Senin: ${de.toFixed(2)} (Bavyera formülü)` });
    }
  }

  if (req.ales?.notRequired) items.push({ key: "ales", label: "ALES", status: "na", need: "ALES aranmıyor" });
  else if (req.ales?.min != null) {
    const m = minAles(req.ales.min, gpa4);
    if (m == null) items.push({ key: "ales", label: "ALES", status: "fail", need: "GNO kademesinin altında", detail: `Senin GNO: ${gpa4?.toFixed(2)}` });
    else if (p.ales == null) items.push({ key: "ales", label: "ALES", status: "unknown", need: `ALES ≥ ${m}`, detail: "Profilde ALES yok" });
    else items.push({ key: "ales", label: "ALES", status: p.ales >= m ? "ok" : m - p.ales <= 5 ? "near" : "fail", need: `ALES ≥ ${m}`, detail: p.ales >= m ? `Senin: ${p.ales}` : `${round1(m - p.ales)} puan eksik` });
  }

  const e = req.english;
  if (e && (e.ielts != null || e.toefl != null || e.yds != null)) {
    const needs: string[] = [];
    if (e.ielts != null) needs.push(`IELTS ${e.ielts}`);
    if (e.toefl != null) needs.push(`TOEFL ${e.toefl}`);
    if (e.yds != null) needs.push(`YDS ${e.yds}`);
    const tests: [number | undefined, number | undefined, number][] = [
      [p.ielts, e.ielts, 0.5],
      [p.toefl, e.toefl, 5],
      [p.yds, e.yds, 5],
    ];
    const comparable = tests.filter(([mine, need]) => mine != null && need != null) as [number, number, number][];
    let status: CheckStatus = "unknown";
    if (comparable.some(([m, n]) => m >= n)) status = "ok";
    else if (comparable.some(([m, n, tol]) => m >= n - tol)) status = "near";
    else if (comparable.length) status = "fail";
    items.push({
      key: "english",
      label: "İngilizce",
      status,
      need: needs.join(" / "),
      detail: status === "unknown" ? (e.moiAccepted ? "Profilde uygun sınav yok; İngilizce eğitim belgesi kabul edilebilir" : "Profilde bu sınavlardan biri yok") : undefined,
    });
  }

  const g = req.gre;
  if (g && g.policy === "required") {
    const need = g.minQuant ? `GRE Quant ≥ ${g.minQuant}` : "GRE zorunlu";
    if (p.greQ == null) items.push({ key: "gre", label: "GRE", status: "unknown", need, detail: "Profilde GRE yok" });
    else items.push({ key: "gre", label: "GRE", status: !g.minQuant || p.greQ >= g.minQuant ? "ok" : p.greQ >= g.minQuant - 3 ? "near" : "fail", need });
  }

  for (const a of req.ects?.areas ?? []) {
    const mine = p.ects[a.area];
    const need = `${a.area}: ${a.min} ECTS`;
    if (mine == null) items.push({ key: "ects", label: "Ders uyumu", status: "unknown", need, detail: "Profilde bu alan yok" });
    else items.push({ key: "ects", label: "Ders uyumu", status: mine >= a.min ? "ok" : mine >= a.min * 0.8 ? "near" : "fail", need, detail: `Senin: ${mine}` });
  }

  const relevant = items.filter(i => i.status !== "na");
  const overall = relevant.length ? relevant.map(i => i.status).reduce(worst) : items.length ? "ok" : "none";
  return { overall, items };
}

const round1 = (x: number) => Math.round(x * 10) / 10;
