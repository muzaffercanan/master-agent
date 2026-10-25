import { describe, expect, it } from "vitest";
import { bavarian, checkRequirements, EMPTY_PROFILE, isProfileEmpty, minAles } from "./eligibility";
import { nextDeadline, singleTermOnly } from "./programs";
import { yearlyCost } from "./cost";
import { buildIcs } from "./ics";
import { countdown, parseD, urgency, windowProgress } from "./dates";
import { rankTier } from "./rank";
import { DEFAULT_FILTERS, matchesSchoolTier, parseFilters, serializeFilters } from "./filters";
import type { Country, Fx, Intake } from "../schema";
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

describe("isProfileEmpty", () => {
  it("is true until a grade or score is entered", () => {
    expect(isProfileEmpty(EMPTY_PROFILE)).toBe(true);
    expect(isProfileEmpty({ ...EMPTY_PROFILE, ects: { Matematik: 30 } })).toBe(true);
    expect(isProfileEmpty({ ...EMPTY_PROFILE, yds: 70 })).toBe(false);
  });
});
