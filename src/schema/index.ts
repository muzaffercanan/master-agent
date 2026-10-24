// Single source of truth for all research data. JSON files in data/ are parsed with these schemas
// both at build time (scripts/check.ts) and when the app loads (src/data/index.ts).
import { z } from "zod";

export const DateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "tarih YYYY-AA-GG olmalı");
/** kesin = published announcement, tahmin = projected from last year's calendar */
export const Status = z.enum(["kesin", "tahmin"]);
/** fall/spring = Turkish güz/bahar, winter/summer = German-style Wintersemester/Sommersemester */
export const Term = z.enum(["fall", "spring", "winter", "summer"]);
export const Currency = z.enum(["EUR", "TRY", "USD", "CHF"]);
export const Per = z.enum(["semester", "year", "month", "total", "once"]);
/** Which applicants a rule or fee applies to */
export const Audience = z.enum(["all", "eu", "non-eu", "tr"]);
export const Lang = z.enum(["tr", "en", "de", "it", "fr"]);

export const Link = z.object({ label: z.string().min(1), url: z.string().url() });

export const Money = z.object({
  amount: z.number().nonnegative(),
  currency: Currency,
  per: Per,
});

export const Round = z.object({
  /** e.g. "erken", "normal", "geç", "ek tur", "AB dışı" */
  name: z.string().default("normal"),
  open: DateStr.optional(),
  deadline: DateStr.optional(),
  audience: Audience.default("all"),
});

export const Intake = z.object({
  term: Term,
  /** academic year the intake belongs to, e.g. "2027-28" */
  cycle: z.string(),
  /** "no" means this term explicitly does not admit (e.g. winter-only programs) */
  offered: z.enum(["yes", "no", "unknown"]),
  rounds: z.array(Round).default([]),
  status: Status,
  note: z.string().optional(),
});

/** ALES minimum: a number, or GPA-dependent tiers (first tier whose gpa <= applicant gpa applies) */
export const AlesMin = z.union([
  z.number().min(0).max(100),
  z.object({
    default: z.number(),
    tiers: z.array(z.object({ gpa: z.number(), ales: z.number() })).min(1),
  }),
]);

export const Requirements = z.object({
  gpa: z
    .object({
      /** minimum on the given scale (4 or 100) */
      min: z.number().optional(),
      scale: z.union([z.literal(4), z.literal(100)]).default(4),
      /** German grade ceiling (1.0 best – 4.0 pass), compared after Bavarian-formula conversion */
      deMax: z.number().min(1).max(4).optional(),
      note: z.string().optional(),
    })
    .optional(),
  english: z
    .object({
      ielts: z.number().optional(),
      toefl: z.number().optional(),
      yds: z.number().optional(),
      cambridge: z.string().optional(),
      /** degree taught in English may replace a test certificate */
      moiAccepted: z.boolean().optional(),
      note: z.string().optional(),
    })
    .optional(),
  otherLanguage: z.string().optional(),
  ales: z.object({ min: AlesMin.optional(), notRequired: z.boolean().optional(), note: z.string().optional() }).optional(),
  gre: z
    .object({
      policy: z.enum(["required", "recommended", "optional", "no"]),
      minQuant: z.number().optional(),
      note: z.string().optional(),
    })
    .optional(),
  /** course match: minimum ECTS per subject area */
  ects: z
    .object({
      total: z.number().optional(),
      areas: z.array(z.object({ area: z.string(), min: z.number() })).default([]),
      note: z.string().optional(),
    })
    .optional(),
  documents: z.array(z.string()).optional(),
  /** where to apply: direct, uni-assist, Universitaly, … */
  portal: z.string().optional(),
  interview: z.string().optional(),
  workExperience: z.string().optional(),
  advisorLetter: z.enum(["required", "recommended"]).optional(),
  note: z.string().optional(),
});

export const Tuition = z.object({
  kind: z.enum(["free", "paid", "covered", "varies", "unknown"]),
  fee: Money.optional(),
  /** separate fee for non-EU applicants (Turkish citizens count as non-EU abroad) */
  feeNonEU: Money.optional(),
  note: z.string().optional(),
});

export const RegionalFee = z.object({
  region: z.string(),
  fee: Money,
  appliesTo: Audience,
  status: Status,
  note: z.string().optional(),
});

export const Costs = z.object({
  tuition: Tuition,
  /** Semesterbeitrag / ÖH / tassa regionale … */
  semesterFee: Money.optional(),
  regionalFee: RegionalFee.optional(),
  applicationFee: Money.optional(),
  livingPerMonth: Money.optional(),
  note: z.string().optional(),
});

export const Scholarship = z.object({
  name: z.string(),
  provider: z.string(),
  coverage: z.string(),
  amount: Money.optional(),
  deadline: DateStr.optional(),
  audience: Audience.default("all"),
  link: z.string().url().optional(),
  status: Status.default("kesin"),
});

export const Program = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  /** human-readable degree/type text, e.g. "Tezli YL · Doktora", "MSc" */
  degree: z.string(),
  levels: z.array(z.enum(["master-thesis", "master-nonthesis", "master", "phd"])).min(1),
  fields: z.array(z.string()).min(1),
  languages: z.array(Lang).min(1),
  durationSemesters: z.number().optional(),
  ects: z.number().optional(),
  /** overrides the university intakes when present */
  intakes: z.array(Intake).optional(),
  requirements: Requirements.optional(),
  costs: Costs.optional(),
  scholarships: z.array(Scholarship).default([]),
  quota: z.string().optional(),
  notes: z.string().optional(),
  links: z.array(Link).default([]),
});

export const University = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  country: z.string().length(2),
  name: z.string(),
  short: z.string(),
  city: z.string(),
  region: z.string().optional(),
  type: z.enum(["state", "foundation", "private"]),
  languages: z.array(Lang).min(1),
  rankings: z
    .object({
      yok: z.string().optional(),
      csrankings: z.string().optional(),
      qs: z.number().optional(),
      the: z.number().optional(),
      /** THE subject ranking for computer science, as published (bands like "101–125" are kept as text) */
      theCs: z.object({ year: z.number(), rank: z.string() }).optional(),
    })
    .default({}),
  /** institute-wide calendar, inherited by programs without their own intakes */
  intakes: z.array(Intake).default([]),
  /** default requirements, merged under program requirements */
  requirements: Requirements.optional(),
  costs: Costs.optional(),
  scholarships: z.array(Scholarship).default([]),
  admissionsSummary: z.string().optional(),
  fundingSummary: z.string().optional(),
  people: z.array(z.string()).default([]),
  links: z.array(Link).default([]),
  sources: z.array(Link).default([]),
  verifiedAt: DateStr,
  programs: z.array(Program).min(1),
});

export const TimelineEvent = z.object({
  s: DateStr,
  e: DateStr.optional(),
  t: z.string(),
  d: z.string().optional(),
  k: Status,
  uni: z.string().optional(),
});

export const Country = z.object({
  code: z.string().length(2),
  name: z.string(),
  flag: z.string(),
  currency: Currency,
  /** labels for the terms used in this country */
  terms: z.record(Term, z.object({ name: z.string(), starts: z.string() })),
  summary: z.string(),
  /** conversion of a Turkish 4.0 GPA to the local scale */
  gpaConversion: z
    .object({ method: z.literal("bavarian"), nMax: z.number(), nMin: z.number(), status: Status, note: z.string() })
    .optional(),
  facts: z.array(z.object({ label: z.string(), value: z.string(), status: Status.default("kesin") })).default([]),
  regionalFees: z.array(RegionalFee).default([]),
  scholarships: z.array(Scholarship).default([]),
  timeline: z.array(TimelineEvent).default([]),
  sources: z.array(Link).default([]),
  verifiedAt: DateStr,
});

export const Field = z.object({ n: z.string(), d: z.string(), note: z.string() });
export const Fields = z.record(z.string(), Field);

export const Fx = z.object({
  date: DateStr,
  source: z.string(),
  /** how many units of the currency equal 1 EUR */
  perEUR: z.record(Currency, z.number().positive()),
});

export const CsrRow = z.object({ i: z.string(), a: z.number(), b: z.number(), p: z.number(), people: z.string() });

export type Status = z.infer<typeof Status>;
export type Term = z.infer<typeof Term>;
export type Currency = z.infer<typeof Currency>;
export type Lang = z.infer<typeof Lang>;
export type Link = z.infer<typeof Link>;
export type Money = z.infer<typeof Money>;
export type Round = z.infer<typeof Round>;
export type Intake = z.infer<typeof Intake>;
export type AlesMin = z.infer<typeof AlesMin>;
export type Requirements = z.infer<typeof Requirements>;
export type Costs = z.infer<typeof Costs>;
export type Scholarship = z.infer<typeof Scholarship>;
export type Program = z.infer<typeof Program>;
export type University = z.infer<typeof University>;
export type TimelineEvent = z.infer<typeof TimelineEvent>;
export type Country = z.infer<typeof Country>;
export type Field = z.infer<typeof Field>;
export type Fx = z.infer<typeof Fx>;
export type CsrRow = z.infer<typeof CsrRow>;
