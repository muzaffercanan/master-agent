import { describe, expect, it } from "vitest";
import { mergeNotes, noteTitle, notesDiffer, notesMarkdown, visibleNotes, type Note } from "./notes";
import { bavarian, checkRequirements, EMPTY_PROFILE, isProfileEmpty, minAles } from "./eligibility";
import { nextDeadline, singleTermOnly } from "./programs";
import { yearlyCost } from "./cost";
import { buildIcs } from "./ics";
import { countdown, parseD, urgency, windowProgress } from "./dates";
import { checklistHint, progress, sectionOf } from "./checklist";
import { median, rankingRows, rankTier, rankValue, sortRankingRows } from "./rank";
import { DEFAULT_FILTERS, matchesSchoolTier, parseFilters, serializeFilters } from "./filters";
import { DEFAULT_FUNDING_FILTERS, eurPerMonth, fundingCheck, hostsOf, matchFunding, nextCall, parseFundingFilters, serializeFundingFilters, sortFundings } from "./scholarships";
import { scholarshipEvents } from "./calendar";
import { locative, norm } from "./text";
import { fmtMoney } from "./money";
import type { ChecklistItem, Country, Funding, Fx, Intake, RankingTable } from "../schema";
import type { ProgramView } from "./programs";

const ituTiers = { default: 80, tiers: [{ gpa: 2.75, ales: 80 }, { gpa: 2.6, ales: 85 }] };

describe("minAles", () => {
  it("applies GPA tiers (İTÜ Bilgisayar)", () => {
    expect(minAles(ituTiers, 3.0)).toBe(80);
    expect(minAles(ituTiers, 2.75)).toBe(80);
    expect(minAles(ituTiers, 2.65)).toBe(85);
    expect(minAles(ituTiers, 2.5)).toBeNull();
    expect(minAles(ituTiers, undefined)).toBe(80);
    expect(minAles(70, 1.0)).toBe(70);
  });
});

describe("bavarian", () => {
  it("converts a Turkish 4.0 GPA with Nmax=4, Nmin=1", () => {
    expect(bavarian(2.75, 4, 1)).toBe(2.25);
    expect(bavarian(4, 4, 1)).toBe(1);
    expect(bavarian(1, 4, 1)).toBe(4);
  });
});

describe("checkRequirements", () => {
  const de = { gpaConversion: { method: "bavarian", nMax: 4, nMin: 1, status: "tahmin", note: "" } } as unknown as Country;
  it("ALES near/fail/ok", () => {
    const req = { ales: { min: ituTiers } };
    expect(checkRequirements(req, { ...EMPTY_PROFILE, gpa: 2.65, ales: 82 }).overall).toBe("near");
    expect(checkRequirements(req, { ...EMPTY_PROFILE, gpa: 2.65, ales: 70 }).overall).toBe("fail");
    expect(checkRequirements(req, { ...EMPTY_PROFILE, gpa: 3.2, ales: 81 }).overall).toBe("ok");
    expect(checkRequirements(req, { ...EMPTY_PROFILE, gpa: 3.2 }).overall).toBe("unknown");
  });
  it("English: any accepted test is enough", () => {
    const req = { english: { ielts: 6.5, toefl: 88 } };
    expect(checkRequirements(req, { ...EMPTY_PROFILE, toefl: 90 }).overall).toBe("ok");
    expect(checkRequirements(req, { ...EMPTY_PROFILE, ielts: 6.0 }).overall).toBe("near");
    expect(checkRequirements(req, { ...EMPTY_PROFILE, yds: 90 }).overall).toBe("unknown");
  });
  it("German grade ceiling", () => {
    const req = { gpa: { deMax: 2.5, scale: 4 as const } };
    expect(checkRequirements(req, { ...EMPTY_PROFILE, gpa: 2.75 }, de).overall).toBe("ok");
    expect(checkRequirements(req, { ...EMPTY_PROFILE, gpa: 2.4 }, de).overall).toBe("near");
    expect(checkRequirements(req, { ...EMPTY_PROFILE, gpa: 2.0 }, de).overall).toBe("fail");
  });
  it("not-required ALES does not affect the result", () => {
    expect(checkRequirements({ ales: { notRequired: true } }, EMPTY_PROFILE).overall).toBe("ok");
  });
});

describe("intakes", () => {
  const T = parseD("2026-10-24");
  const intakes: Intake[] = [
    { term: "winter", cycle: "2027-28", offered: "yes", status: "kesin", rounds: [{ name: "AB dışı", deadline: "2027-05-31", audience: "non-eu" }, { name: "eski", deadline: "2026-07-15", audience: "all" }] },
    { term: "summer", cycle: "2027", offered: "no", status: "kesin", rounds: [{ name: "normal", deadline: "2026-11-30", audience: "all" }] },
  ];
  it("next deadline skips past rounds and closed terms", () => {
    expect(nextDeadline(intakes, T)?.date).toBe("2027-05-31");
  });
  it("detects winter-only programs", () => {
    expect(singleTermOnly(intakes)).toBe(true);
    expect(singleTermOnly([intakes[0]])).toBe(false);
  });
});

describe("yearlyCost", () => {
  const fx: Fx = { date: "2026-10-23", source: "", perEUR: { EUR: 1, TRY: 50 } };
  const view = (costs: ProgramView["costs"]) => ({ costs }) as ProgramView;
  it("adds semester and regional fees for non-EU applicants", () => {
    const c = yearlyCost(
      view({
        tuition: { kind: "free" },
        semesterFee: { amount: 150, currency: "EUR", per: "semester" },
        regionalFee: { region: "Baden-Württemberg", fee: { amount: 1500, currency: "EUR", per: "semester" }, appliesTo: "non-eu", status: "kesin" },
      }),
      fx,
      true,
    );
    expect(c.eurPerYear).toBe(3300);
    expect(c.hasRegionalFee).toBe(true);
    const euOnly = view({ tuition: { kind: "free" }, regionalFee: { region: "BW", fee: { amount: 1500, currency: "EUR", per: "semester" }, appliesTo: "non-eu", status: "kesin" } });
    expect(yearlyCost(euOnly, fx, false).eurPerYear).toBe(0);
  });
  it("converts TRY and returns null for unknown tuition", () => {
    expect(yearlyCost(view({ tuition: { kind: "paid", fee: { amount: 100000, currency: "TRY", per: "year" } } }), fx, true).eurPerYear).toBe(2000);
    expect(yearlyCost(view({ tuition: { kind: "varies" } }), fx, true).eurPerYear).toBeNull();
  });
});

describe("countdown & ics", () => {
  const T = parseD("2026-10-24");
  it("countdown", () => {
    expect(countdown("2026-10-01", "2026-10-20", T).past).toBe(true);
    expect(countdown(undefined, "2026-11-27", T).text).toBe("34 gün kaldı");
    expect(countdown("2026-11-10", "2027-01-26", T).text).toBe("17 gün sonra açılıyor");
  });
  it("ics uses exclusive end dates and escapes text", () => {
    const s = buildIcs([{ uid: "a", start: "2026-11-27", title: "Sabancı, bahar" }], new Date("2026-10-24T00:00:00Z"));
    expect(s).toContain("DTSTART;VALUE=DATE:20261127");
    expect(s).toContain("DTEND;VALUE=DATE:20261128");
    expect(s).toContain("SUMMARY:Sabancı\\, bahar");
  });
});

describe("rankTier", () => {
  it("splits at 100 and 200, reading ties and bands by their first number", () => {
    expect(rankTier("25")).toBe("top");
    expect(rankTier("=45")).toBe("top");
    expect(rankTier("=101")).toBe("mid");
    expect(rankTier("176–200")).toBe("mid");
    expect(rankTier("=201")).toBe("low");
    expect(rankTier("2001+")).toBe("low");
    expect(rankTier("Reporter")).toBeUndefined();
  });
});

describe("ranking table", () => {
  it("reads bands by their midpoint and open bands by their floor", () => {
    expect(rankValue("25")).toBe(25);
    expect(rankValue("=143")).toBe(143);
    expect(rankValue("301–325")).toBe(313);
    expect(rankValue("51–75")).toBe(63);
    expect(rankValue("1401+")).toBe(1401);
    expect(rankValue("Reporter")).toBeUndefined();
  });
  it("takes the median of what is there", () => {
    expect(median([3, 1, 2])).toBe(2);
    expect(median([1, 2, 3, 4])).toBe(2.5);
    expect(median([])).toBeUndefined();
  });
  const table: RankingTable = {
    country: "de",
    sources: ["a", "b", "c"].map(id => ({ id, name: id, short: id, edition: "2026", kind: "overall" as const, publisher: "x", url: "https://x.org", retrievedAt: "2026-10-28" })),
    entries: [
      { id: "x", name: "X", short: "X", city: "", ranks: { a: "90", b: "301–325", c: "=40" } },
      { id: "y", name: "Y", short: "Y", city: "", ranks: { a: "25", c: "1401+" } },
      { id: "z", name: "Z", short: "Z", city: "", ranks: { b: "10" } },
      { id: "w", name: "W", short: "W", city: "", ranks: {} },
    ],
  };
  it("keeps rows ranked in at least one shown list and sorts missing values last", () => {
    const rows = rankingRows(table, ["a", "c"]);
    expect(rows.map(r => r.entry.id)).toEqual(["x", "y"]);
    expect(rows[0].median).toBe(65);
    expect(rows[1].median).toBe(713);
    const all = rankingRows(table, ["a", "b", "c"]);
    // z has the best median but sits in 1 of 3 lists, so it follows x and y
    expect(sortRankingRows(all, "median").map(r => r.entry.id)).toEqual(["x", "y", "z"]);
    expect(sortRankingRows(all, 0).map(r => r.entry.id)).toEqual(["y", "x", "z"]);
    expect(sortRankingRows(all, 1).map(r => r.entry.id)).toEqual(["z", "x", "y"]);
  });
});

describe("school tier filters", () => {
  const odtu = { topTier: true, rankings: { theWorld: { year: 2027, rank: "326–350" } } };
  const tum = { topTier: false, rankings: { theWorld: { year: 2027, rank: "25" } } };
  const fau = { topTier: false, rankings: { theWorld: { year: 2027, rank: "=201" } } };
  const mef = { topTier: false, rankings: {} };
  it("filters by the Turkish pick list or by world rank", () => {
    expect([odtu, tum, fau, mef].map(u => matchesSchoolTier(u, true, null))).toEqual([true, false, false, false]);
    expect([odtu, tum, fau, mef].map(u => matchesSchoolTier(u, false, 250))).toEqual([false, true, true, false]);
    expect([odtu, tum, fau, mef].map(u => matchesSchoolTier(u, false, 100))).toEqual([false, true, false, false]);
  });
  it("with both on, either one is enough", () => {
    expect([odtu, tum, fau, mef].map(u => matchesSchoolTier(u, true, 250))).toEqual([true, true, true, false]);
    expect(matchesSchoolTier(mef, false, null)).toBe(true);
  });
  it("round-trips through the URL", () => {
    const f = { ...DEFAULT_FILTERS, top: true, rank: 250 };
    expect(serializeFilters(f).toString()).toBe("top=1&rank=250");
    expect(parseFilters(serializeFilters(f))).toEqual(f);
  });
});

describe("deadline progress", () => {
  const T = parseD("2026-10-25");
  it("measures the elapsed share of an application window", () => {
    expect(windowProgress("2026-10-01", "2026-11-30", T)).toBeCloseTo(24 / 60);
    expect(windowProgress("2026-11-01", "2026-11-30", T)).toBe(0);
    expect(windowProgress("2026-09-01", "2026-10-01", T)).toBe(1);
    expect(windowProgress(undefined, "2026-11-30", T)).toBeNull();
    expect(windowProgress("2026-11-30", "2026-11-30", T)).toBeNull();
  });
  it("bands days left", () => {
    expect(urgency(-1)).toBe("past");
    expect(urgency(0)).toBe("urgent");
    expect(urgency(21)).toBe("urgent");
    expect(urgency(45)).toBe("near");
    expect(urgency(46)).toBe("calm");
  });
});

describe("scholarships", () => {
  const T = parseD("2026-10-26");
  const base: Funding = {
    id: "x", name: "X", provider: "P", category: "de", hostCountries: ["de"], summary: "", level: "partial", tuition: "not-covered",
    extras: [], blockedAccount: "replaces", turkish: "yes", cs: "yes", calls: [], howToApply: [], notes: [], programs: [], links: [], sources: [{ label: "s", url: "https://a.b" }], verifiedAt: "2026-10-26",
  };
  const em: Funding = {
    ...base, id: "em", name: "Erasmus Mundus", category: "eu", hostCountries: ["fi"], level: "full", blockedAccount: "replaces",
    calls: [{ cycle: "2026-27", deadline: "2026-01-12", status: "kesin" }],
    programs: [
      { id: "a", name: "A", short: "A", fields: ["ai"], countries: ["fi", "se"], partners: "Åbo Akademi", scholarships: "yes", calls: [{ cycle: "2027-28", open: "2026-11-16", deadline: "2027-01-12", status: "kesin" }], link: "https://a.b" },
      { id: "b", name: "B", short: "B", fields: ["data"], countries: ["it"], partners: "", scholarships: "no", calls: [{ cycle: "2027-28", deadline: "2026-12-01", status: "kesin" }], link: "https://a.b" },
      { id: "c", name: "C", short: "C", fields: ["sec"], countries: ["no"], partners: "", scholarships: "unknown", calls: [{ cycle: "2027-28", open: "2026-11-01", status: "tahmin" }], link: "https://a.b" },
    ],
  };
  it("next call skips past calls and programs without scholarships, and uses an opening date when no deadline is known", () => {
    const n = nextCall(em, T);
    expect(n?.date).toBe("2026-11-01");
    expect(n?.kind).toBe("open");
    expect(n?.program?.id).toBe("c");
    expect(nextCall({ ...em, programs: em.programs.slice(0, 2) }, T)?.date).toBe("2027-01-12");
    expect(nextCall(base, T)).toBeNull();
  });
  it("collects the study countries of all programs", () => {
    expect(hostsOf(em).sort()).toEqual(["fi", "it", "no", "se"]);
  });
  it("filters by blocked account, full funding, country, search and open calls", () => {
    const tev = { ...base, id: "tev", blockedAccount: "replaces" as const };
    const ds = { ...base, id: "ds", name: "Deutschlandstipendium", blockedAccount: "partial" as const, level: "small" as const };
    const se = { ...base, id: "se", name: "SI", turkish: "no" as const, hostCountries: ["se"], level: "full" as const };
    const f = (p: Partial<typeof DEFAULT_FUNDING_FILTERS>) => [tev, ds, se, em].filter(x => matchFunding(x, { ...DEFAULT_FUNDING_FILTERS, ...p }, T)).map(x => x.id);
    expect(f({ ba: true })).toEqual(["tev", "se", "em"]);
    expect(f({ full: true, tr: true })).toEqual(["em"]);
    expect(f({ host: "se" })).toEqual(["se", "em"]);
    expect(f({ q: "åbo" })).toEqual(["em"]);
    expect(f({ q: "DEUTSCHLAND" })).toEqual(["ds"]);
    expect(f({ open: true })).toEqual(["em"]);
    expect(f({ cat: "eu" })).toEqual(["em"]);
  });
  it("round-trips filters through the URL and drops unknown values", () => {
    const ff = { ...DEFAULT_FUNDING_FILTERS, cat: "it" as const, host: "it", ba: true, open: true };
    expect(serializeFundingFilters(ff).toString()).toBe("cat=it&host=it&ba=1&open=1");
    expect(parseFundingFilters(serializeFundingFilters(ff))).toEqual(ff);
    expect(parseFundingFilters(new URLSearchParams("cat=xx&host=Germany"))).toEqual(DEFAULT_FUNDING_FILTERS);
  });
  it("sorts schemes open to Turkish citizens and full scholarships first", () => {
    const a = { ...base, id: "a", name: "A", turkish: "no" as const, level: "full" as const };
    const b = { ...base, id: "b", name: "B", level: "small" as const };
    const c = { ...base, id: "c", name: "C", level: "full" as const };
    expect(sortFundings([a, b, c]).map(x => x.id)).toEqual(["c", "b", "a"]);
    const fx: Fx = { date: "2026-10-23", source: "", perEUR: { EUR: 1 } };
    const low = { ...base, id: "low", name: "Avicenna", stipend: { amount: 844, currency: "EUR" as const, per: "month" as const } };
    const high = { ...base, id: "high", name: "TEV-DAAD", stipend: { amount: 992, currency: "EUR" as const, per: "month" as const } };
    const none = { ...base, id: "none", name: "Böll" };
    expect(sortFundings([none, low, high], fx).map(x => x.id)).toEqual(["high", "low", "none"]);
  });
  it("converts stipends to euros per month", () => {
    const fx: Fx = { date: "2026-10-23", source: "", perEUR: { EUR: 1, HUF: 366.73 } };
    expect(eurPerMonth({ amount: 43700, currency: "HUF", per: "month" }, fx)).toBeCloseTo(119.16, 1);
    expect(eurPerMonth({ amount: 16800, currency: "EUR", per: "year" }, fx)).toBe(1400);
    expect(eurPerMonth({ amount: 3500, currency: "EUR", per: "once" }, fx)).toBeNull();
  });
  it("checks the GPA floor against the profile", () => {
    const tevGpa = { ...base, requirements: { gpa: { min: 3.0, scale: 4 as const } } };
    expect(fundingCheck(tevGpa, { ...EMPTY_PROFILE, gpa: 2.75 }).overall).toBe("fail");
    expect(fundingCheck(tevGpa, { ...EMPTY_PROFILE, gpa: 3.1 }).overall).toBe("ok");
    expect(fundingCheck(base, EMPTY_PROFILE).overall).toBe("none");
  });
  it("turns calls into calendar events with a flag only for single-country schemes", () => {
    const de = { code: "de", name: "Almanya", flag: "" } as Country;
    const tev = { ...base, id: "tev", name: "TEV-DAAD", calls: [{ cycle: "2027-28", open: "2026-10-12", deadline: "2027-02-08", status: "kesin" as const }] };
    const evs = scholarshipEvents([tev, em], [de]);
    expect(evs.map(e => e.uid)).toEqual(["fund-tev-0", "fund-em-0", "fund-em-1", "fund-em-2"]);
    expect(evs[0]).toMatchObject({ s: "2026-10-12", e: "2027-02-08", country: de, href: "/burs/tev", kind: "scholarship" });
    expect(evs[2]).toMatchObject({ t: "Erasmus Mundus (A): 2027-28", country: undefined, hosts: ["fi", "se"] });
    expect(evs[3].d).toBe("Açılış tarihi; son gün henüz bilinmiyor.");
  });
});

describe("fmtMoney", () => {
  it("keeps cents only when the source has them", () => {
    expect(fmtMoney({ amount: 722.58, currency: "EUR", per: "month" })).toBe("€722,58/ay");
    expect(fmtMoney({ amount: 11904, currency: "EUR", per: "year" })).toBe("€11.904/yıl");
    expect(fmtMoney({ amount: 26.2, currency: "EUR", per: "semester" })).toBe("€26,20/dönem");
    expect(fmtMoney({ amount: 16500, currency: "TRY", per: "month" })).toBe("16.500 ₺/ay");
    expect(fmtMoney({ amount: 43700, currency: "HUF", per: "month" })).toBe("43.700 HUF/ay");
  });
});

describe("locative", () => {
  it("follows vowel harmony and hardening", () => {
    expect(["Türkiye", "Almanya", "İtalya", "Avusturya", "Macaristan", "Irak", "Mısır"].map(locative)).toEqual(["Türkiye'de", "Almanya'da", "İtalya'da", "Avusturya'da", "Macaristan'da", "Irak'ta", "Mısır'da"]);
  });
});

describe("isProfileEmpty", () => {
  it("is true until a grade or score is entered", () => {
    expect(isProfileEmpty(EMPTY_PROFILE)).toBe(true);
    expect(isProfileEmpty({ ...EMPTY_PROFILE, ects: { Matematik: 30 } })).toBe(true);
    expect(isProfileEmpty({ ...EMPTY_PROFILE, yds: 70 })).toBe(false);
  });
});

describe("application checklist", () => {
  const item = (id: string, scope: ChecklistItem["scope"], kind: ChecklistItem["kind"] = "task") =>
    ({ id, scope, phase: "hazirlik", title: id, detail: "", kind, links: [], pages: [] }) as ChecklistItem;
  const pv = (code: string, req: ProgramView["requirements"], extra: Partial<ProgramView> = {}) =>
    ({ key: `${code}/p`, uni: { short: code.toUpperCase() }, program: { name: "CS", languages: ["en"] }, country: { code }, intakes: [], requirements: req, costs: undefined, ...extra }) as unknown as ProgramView;
  const ctx = (shortlist: ProgramView[], profile = EMPTY_PROFILE) => ({ shortlist, profile, countries: [] as Country[], fundings: [] as Funding[], T: new Date("2026-10-28") });

  it("puts all-country and multi-country steps in the common section", () => {
    expect(sectionOf(item("a", "all"))).toBe("common");
    expect(sectionOf(item("b", ["de", "it"]))).toBe("common");
    expect(sectionOf(item("c", ["de"]))).toBe("de");
  });
  it("counts only tasks toward progress", () => {
    const items = [item("a", "all"), item("b", "all"), item("i", "all", "info")];
    expect(progress(items, { a: true, i: true })).toEqual({ done: 1, total: 2 });
  });
  it("compares the highest English bar in the shortlist with the profile", () => {
    const sl = [pv("de", { english: { ielts: 6.5 } }), pv("de", { english: { ielts: 7 } }), pv("tr", { english: { ielts: 7.5 } })];
    expect(checklistHint("english", ["de"], ctx(sl, { ...EMPTY_PROFILE, ielts: 7 }))[0]).toEqual({ text: "En yüksek IELTS şartı 7; seninki 7, yetiyor.", tone: "ok" });
    expect(checklistHint("english", ["de", "tr"], ctx(sl, { ...EMPTY_PROFILE, ielts: 7 }))[0].tone).toBe("bad");
    expect(checklistHint("english", ["de"], ctx(sl))[0].tone).toBe("na");
  });
  it("applies GPA tiers to the ALES bar", () => {
    const sl = [pv("tr", { ales: { min: { default: 80, tiers: [{ gpa: 2.75, ales: 80 }, { gpa: 2.6, ales: 85 }] } } })];
    expect(checklistHint("ales", ["tr"], ctx(sl, { ...EMPTY_PROFILE, gpa: 2.65, ales: 82 }))[0]).toEqual({ text: "En yüksek ALES şartı 85; seninki 82, 3 eksik.", tone: "bad" });
  });
  it("tells a VPD-then-portal route apart from a plain uni-assist one", () => {
    const sl = [pv("de", { portal: "TUMonline (+ uni-assist VPD)" }), pv("de", { portal: "uni-assist" }), pv("de", { portal: "KIT başvuru portalı" })];
    expect(checklistHint("portal", ["de"], ctx(sl)).map(h => h.text.split(":")[0])).toEqual(["Önce uni-assist VPD, sonra okulun portalı", "uni-assist üzerinden", "Okulun kendi portalı"]);
  });
  it("lists program-specific extra documents, MOI acceptance and interviews", () => {
    const sl = [
      pv("de", { documents: ["Transkript", "CV", "İngilizce deneme (essay)"], english: { moiAccepted: true }, interview: "Online sınav." }),
      pv("it", { documents: ["Bitirme tezi veya eşdeğer araştırma yazısı"], english: { moiAccepted: false } }),
    ];
    expect(checklistHint("extraDocs", ["de", "it"], ctx(sl)).map(h => h.text)).toEqual(["DE CS: İngilizce deneme (essay)", "IT CS: Bitirme tezi veya eşdeğer araştırma yazısı"]);
    expect(checklistHint("moi", ["de", "it"], ctx(sl)).map(h => h.tone)).toEqual(["ok", "bad"]);
    expect(checklistHint("interview", ["de", "it"], ctx(sl))[0].text).toBe("DE CS: Online sınav.");
  });
  it("lists upcoming Erasmus Mundus scholarship deadlines, soonest first", () => {
    const call = (deadline?: string, status: "kesin" | "tahmin" = "kesin") => ({ cycle: "2027-28", deadline, status });
    const em = {
      id: "erasmus-mundus",
      programs: [
        { short: "A", scholarships: "yes", calls: [call("2027-01-12"), call("2027-03-11")] },
        { short: "B", scholarships: "yes", calls: [call("2026-12-01", "tahmin")] },
        { short: "C", scholarships: "yes", calls: [call("2026-10-01")] },
        { short: "D", scholarships: "no", calls: [call("2027-01-05")] },
        { short: "E", scholarships: "unknown", calls: [] },
      ],
    } as unknown as Funding;
    const lines = checklistHint("emCalls", ["em"], { ...ctx([]), fundings: [em] });
    expect(lines.map(l => l.text)).toEqual([
      "B: son başvuru 1 Aralık 2026 (tahmin)",
      "A: son başvuru 12 Ocak 2027",
      "2 programın 2027 burs tarihi henüz kayıtlı değil veya bursu belirsiz.",
    ]);
  });
  it("says so when the shortlist has nothing for the country", () => {
    expect(checklistHint("gre", ["it"], ctx([pv("de", {})]))[0].tone).toBe("na");
    expect(checklistHint("gre", ["de"], ctx([pv("de", { gre: { policy: "required" } })]))[0].text).toBe("Zorunlu: DE CS.");
  });
});

describe("notes", () => {
  const n = (id: string, updated: string, extra: Partial<Note> = {}): Note => ({ id, title: id, body: "", created: "2026-10-01T10:00:00Z", updated, ...extra });
  it("merges two copies note by note, later edit wins", () => {
    const local = [n("a", "2026-10-28T10:00:00Z", { body: "yeni" }), n("b", "2026-10-20T10:00:00Z")];
    const disk = [n("a", "2026-10-27T10:00:00Z", { body: "eski" }), n("c", "2026-10-21T10:00:00Z")];
    const m = mergeNotes(local, disk);
    expect(m.map(x => x.id).sort()).toEqual(["a", "b", "c"]);
    expect(m.find(x => x.id === "a")!.body).toBe("yeni");
  });
  it("keeps deletions as tombstones so they do not come back", () => {
    const m = mergeNotes([n("a", "2026-10-28T10:00:00Z", { deleted: true })], [n("a", "2026-10-27T10:00:00Z")]);
    expect(m[0].deleted).toBe(true);
    expect(visibleNotes(m, "", norm)).toEqual([]);
    expect(mergeNotes([n("a", "t", { deleted: true })], [n("a", "t")])[0].deleted).toBe(true);
  });
  it("detects whether a merge changes anything", () => {
    const base = [n("a", "2026-10-28T10:00:00Z")];
    expect(notesDiffer(base, [n("a", "2026-10-27T10:00:00Z")])).toBe(false);
    expect(notesDiffer(base, [n("a", "2026-10-29T10:00:00Z")])).toBe(true);
    expect(notesDiffer(base, [n("b", "2026-10-01T10:00:00Z")])).toBe(true);
  });
  it("searches and sorts pinned first", () => {
    const list = [n("a", "2026-10-28T10:00:00Z", { body: "Münih bloke hesap" }), n("b", "2026-10-20T10:00:00Z", { pinned: true }), n("c", "2026-10-27T10:00:00Z")];
    expect(visibleNotes(list, "", norm).map(x => x.id)).toEqual(["b", "a", "c"]);
    expect(visibleNotes(list, "munih", norm).map(x => x.id)).toEqual(["a"]);
  });
  it("names untitled notes from their first line", () => {
    expect(noteTitle(n("a", "t", { title: " ", body: "İlk satır\nikinci" }))).toBe("İlk satır");
    expect(noteTitle(n("a", "t", { title: "", body: "" }))).toBe("Başlıksız not");
    expect(notesMarkdown([n("a", "2026-10-28T10:00:00Z", { body: "x" }), n("b", "t", { deleted: true })])).toContain("## a");
  });
});
