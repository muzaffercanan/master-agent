// Application to-do list: which section an item belongs to, progress, and live hints drawn from
// the user's shortlist, profile and country data.
import type { Checklist, ChecklistItem, Country, HintKind } from "../schema";
import type { Profile } from "./eligibility";
import { bavarian, minAles } from "./eligibility";
import { nextDeadline, type ProgramView } from "./programs";
import { fmt, parseD } from "./dates";
import { fmtAmount, fmtMoney } from "./money";

/** "common" holds steps for every country and steps shared by several (passport, military service). */
export type SectionId = "common" | string;

export function sectionOf(item: ChecklistItem): SectionId {
  return item.scope === "all" || item.scope.length > 1 ? "common" : item.scope[0];
}

/** Countries an item's hint should look at: its own, or every country for common steps. */
export function hintCountries(item: ChecklistItem, all: string[]): string[] {
  return item.scope === "all" ? all : item.scope;
}

export function itemsIn(list: Checklist, section: SectionId): ChecklistItem[] {
  return list.items.filter(i => sectionOf(i) === section);
}

/** Ticked tasks / all tasks; info items are not counted. */
export function progress(items: ChecklistItem[], done: Record<string, boolean>): { done: number; total: number } {
  const tasks = items.filter(i => i.kind === "task");
  return { done: tasks.filter(i => done[i.id]).length, total: tasks.length };
}

export type HintTone = "ok" | "near" | "bad" | "na";
export interface HintLine {
  text: string;
  tone: HintTone;
}

export interface HintCtx {
  /** shortlisted programs */
  shortlist: ProgramView[];
  profile: Profile;
  countries: Country[];
  T: Date;
}

const name = (v: ProgramView) => `${v.uni.short} ${v.program.name}`;
const list = (vs: ProgramView[], max = 3) => vs.slice(0, max).map(name).join(", ") + (vs.length > max ? ` ve ${vs.length - max} program daha` : "");
const COUNTRY_NAME: Record<string, string> = { tr: "Türkiye", de: "Almanya", it: "İtalya", at: "Avusturya" };
const where = (codes: string[]) => (codes.length === 1 ? `${COUNTRY_NAME[codes[0]] ?? codes[0]} ` : "");

/** Best-known score vs. the highest bar among the programs; tone says whether the profile clears it. */
function scoreLine(label: string, need: number, have: number | undefined, unit = ""): HintLine {
  if (have == null) return { text: `En yüksek ${label} şartı: ${need}${unit}. Profilinde ${label} yok.`, tone: "na" };
  return have >= need
    ? { text: `En yüksek ${label} şartı ${need}${unit}; seninki ${have}, yetiyor.`, tone: "ok" }
    : { text: `En yüksek ${label} şartı ${need}${unit}; seninki ${have}, ${Math.round((need - have) * 10) / 10} eksik.`, tone: "bad" };
}

export function checklistHint(kind: HintKind, codes: string[], ctx: HintCtx): HintLine[] {
  const vs = ctx.shortlist.filter(v => codes.includes(v.country.code));
  const none: HintLine[] = [{ text: `Kısa listende ${where(codes)}programı yok; programları kısa listeye ekleyince burada sana özel bilgi çıkar.`, tone: "na" }];
  const country = (c: string) => ctx.countries.find(x => x.code === c);

  switch (kind) {
    case "shortlist": {
      if (!vs.length) return none;
      const next = vs
        .map(v => ({ v, n: nextDeadline(v.intakes, ctx.T) }))
        .filter((x): x is { v: ProgramView; n: NonNullable<typeof x.n> } => !!x.n)
        .sort((a, b) => a.n.date.localeCompare(b.n.date))[0];
      const lines: HintLine[] = [{ text: `Kısa listende ${where(codes)}${vs.length} program var.`, tone: "ok" }];
      if (next) lines.push({ text: `Sıradaki tarih: ${name(next.v)}, ${next.n.kind === "deadline" ? "son başvuru" : "açılış"} ${fmt(next.n.date)}.`, tone: "near" });
      return lines;
    }
    case "english": {
      if (!vs.length) return none;
      const lines: HintLine[] = [];
      const max = (k: "ielts" | "toefl" | "yds") => Math.max(0, ...vs.map(v => v.requirements.english?.[k] ?? 0)) || null;
      const ielts = max("ielts"), toefl = max("toefl"), yds = max("yds");
      if (ielts) lines.push(scoreLine("IELTS", ielts, ctx.profile.ielts));
      if (toefl) lines.push(scoreLine("TOEFL", toefl, ctx.profile.toefl));
      if (yds && codes.includes("tr")) lines.push(scoreLine("YDS", yds, ctx.profile.yds));
      return lines.length ? lines : [{ text: "Kısa listendeki programlar için sayısal bir dil şartı kayıtlı değil; program sayfasına bak.", tone: "na" }];
    }
    case "ales": {
      const lines: HintLine[] = [];
      const tr = country("tr");
      const upcoming = (tr?.timeline ?? []).filter(e => /ALES/.test(e.t) && parseD(e.e ?? e.s) >= ctx.T).slice(0, 3);
      for (const e of upcoming) lines.push({ text: `${e.t}: ${e.e ? `${fmt(e.s)} – ${fmt(e.e)}` : fmt(e.s)}${e.k === "tahmin" ? " (tahmin)" : ""}`, tone: "near" });
      const needs = vs
        .filter(v => v.requirements.ales?.min != null && !v.requirements.ales.notRequired)
        .map(v => minAles(v.requirements.ales!.min!, ctx.profile.gpa))
        .filter((x): x is number => x != null);
      if (needs.length) lines.push(scoreLine("ALES", Math.max(...needs), ctx.profile.ales));
      else if (!vs.length) lines.push(...none);
      return lines;
    }
    case "gre": {
      if (!vs.length) return none;
      const req = vs.filter(v => v.requirements.gre?.policy === "required");
      const rec = vs.filter(v => v.requirements.gre?.policy === "recommended");
      const lines: HintLine[] = [];
      if (req.length) lines.push({ text: `Zorunlu: ${list(req)}.`, tone: ctx.profile.greQ ? "ok" : "bad" });
      if (rec.length) lines.push({ text: `Önerilen: ${list(rec)}.`, tone: "near" });
      return lines.length ? lines : [{ text: "Kısa listendeki programların hiçbiri GRE istemiyor.", tone: "ok" }];
    }
    case "gpa": {
      const de = country("de")?.gpaConversion;
      if (!de) return [];
      if (ctx.profile.gpa == null || ctx.profile.gpaScale !== 4) return [{ text: "Profiline 4'lük GNO'nu girince Alman not karşılığı burada görünür.", tone: "na" }];
      const g = bavarian(ctx.profile.gpa, de.nMax, de.nMin);
      const lines: HintLine[] = [{ text: `GNO ${ctx.profile.gpa.toFixed(2)} → Alman notu yaklaşık ${g.toFixed(2)} (Bavyera formülü).`, tone: "ok" }];
      const capped = vs.filter(v => v.requirements.gpa?.deMax != null);
      const over = capped.filter(v => g > v.requirements.gpa!.deMax!);
      if (capped.length) lines.push(over.length ? { text: `Not tavanını aşıyorsun: ${list(over)}.`, tone: "bad" } : { text: `Kısa listendeki ${capped.length} programın not tavanının içindesin.`, tone: "ok" });
      return lines;
    }
    case "ects": {
      const areas = Object.entries(ctx.profile.ects);
      const withAreas = vs.filter(v => (v.requirements.ects?.areas.length ?? 0) > 0);
      const lines: HintLine[] = [];
      lines.push(areas.length
        ? { text: `Profilinde ${areas.length} alan için AKTS girili (toplam ${areas.reduce((a, [, n]) => a + n, 0)}).`, tone: "ok" }
        : { text: "Profilinde alan bazlı AKTS yok; ders uyumu kontrolü için gir.", tone: "na" });
      if (withAreas.length) lines.push({ text: `Alan bazlı AKTS şartı olanlar: ${list(withAreas)}.`, tone: "near" });
      return lines;
    }
    case "pof":
      return codes
        .map(country)
        .filter((c): c is Country => !!c?.proofOfFunds)
        .flatMap(c => c.proofOfFunds!.amounts.map(a => ({ text: `${codes.length > 1 ? `${c.name}: ` : ""}${a.label}: ${fmtMoney(a.money)}${c.proofOfFunds!.status === "tahmin" ? " (tahmin)" : ""}`, tone: "near" as const })));
    case "advisor": {
      if (!vs.length) return none;
      const req = vs.filter(v => v.requirements.advisorLetter === "required");
      const rec = vs.filter(v => v.requirements.advisorLetter === "recommended");
      const lines: HintLine[] = [];
      if (req.length) lines.push({ text: `Kabul mektubu zorunlu: ${list(req)}.`, tone: "bad" });
      if (rec.length) lines.push({ text: `Önerilen: ${list(rec)}.`, tone: "near" });
      return lines.length ? lines : [{ text: "Kısa listendeki programların hiçbiri danışman mektubunu zorunlu tutmuyor.", tone: "ok" }];
    }
    case "portal": {
      if (!vs.length) return none;
      const portal = (v: ProgramView) => v.requirements.portal ?? "";
      const vpd = vs.filter(v => /VPD/.test(portal(v)));
      const ua = vs.filter(v => /uni-assist/i.test(portal(v)) && !vpd.includes(v));
      const own = vs.filter(v => portal(v) && !ua.includes(v) && !vpd.includes(v));
      const unknown = vs.filter(v => !portal(v));
      const lines: HintLine[] = [];
      if (vpd.length) lines.push({ text: `Önce uni-assist VPD, sonra okulun portalı: ${list(vpd)}.`, tone: "near" });
      if (ua.length) lines.push({ text: `uni-assist üzerinden: ${list(ua)}.`, tone: "near" });
      if (own.length) lines.push({ text: `Okulun kendi portalı: ${list(own)}.`, tone: "ok" });
      if (unknown.length) lines.push({ text: `Başvuru yolu kayıtlı değil, program sayfasına bak: ${list(unknown)}.`, tone: "na" });
      return lines;
    }
    case "fees": {
      if (!vs.length) return none;
      const paid = vs.filter(v => v.costs?.applicationFee);
      if (!paid.length) return [{ text: "Kısa listendeki programlar için kayıtlı başvuru ücreti yok (bu, ücret olmadığı anlamına gelmeyebilir).", tone: "na" }];
      const byCur = new Map<string, number>();
      for (const v of paid) {
        const m = v.costs!.applicationFee!;
        byCur.set(m.currency, (byCur.get(m.currency) ?? 0) + m.amount);
      }
      const sum = [...byCur.entries()].map(([c, a]) => fmtAmount(a, c as Parameters<typeof fmtAmount>[1])).join(" + ");
      return [{ text: `${paid.length} programda kayıtlı başvuru ücreti toplamı: ${sum}. Diğer ${vs.length - paid.length} programda kayıt yok.`, tone: "near" }];
    }
    case "german": {
      if (!vs.length) return none;
      const de = vs.filter(v => v.program.languages.includes("de") || v.requirements.otherLanguage);
      return de.length
        ? [{ text: `Almanca şartı veya Almanca ders olanlar: ${list(de)}.`, tone: "bad" }]
        : [{ text: "Kısa listendeki programlarda Almanca şartı kayıtlı değil.", tone: "ok" }];
    }
  }
}
