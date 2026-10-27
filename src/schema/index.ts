// Single source of truth for all research data. JSON files in data/ are parsed with these schemas
// both at build time (scripts/check.ts) and when the app loads (src/data/index.ts).
import { z } from "zod";

export const DateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "tarih YYYY-AA-GG olmalı");
/** kesin = published announcement, tahmin = projected from last year's calendar */
export const Status = z.enum(["kesin", "tahmin"]);
/** fall/spring = Turkish güz/bahar, winter/summer = German-style Wintersemester/Sommersemester */
export const Term = z.enum(["fall", "spring", "winter", "summer"]);
export const Currency = z.enum(["EUR", "TRY", "USD", "CHF", "HUF", "SEK", "DKK", "GBP"]);
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
  /** id of the full record in data/scholarships/, when there is one */
  ref: z.string().optional(),
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
  /** on the user's own shortlist of Turkey's strongest CS faculties (a hand-picked list, not a ranking) */
  topTier: z.boolean().default(false),
  languages: z.array(Lang).min(1),
  rankings: z
    .object({
      yok: z.string().optional(),
      csrankings: z.string().optional(),
      qs: z.number().optional(),
      the: z.number().optional(),
      /** THE subject ranking for computer science, as published (bands like "101–125" are kept as text) */
      theCs: z.object({ year: z.number(), rank: z.string() }).optional(),
      /** THE World University Rankings (overall), as published: "25", "=143", "301–325", "2001+" */
      theWorld: z.object({ year: z.number(), rank: z.string() }).optional(),
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
  /** what a non-EU student must show for the visa / residence permit */
  proofOfFunds: z
    .object({
      /** blocked-account = money locked in a special account; own-funds = an ordinary account in the student's name */
      kind: z.enum(["blocked-account", "own-funds"]),
      amounts: z.array(z.object({ label: z.string(), money: Money })).min(1),
      accepted: z.array(z.string()).min(1),
      note: z.string().optional(),
      status: Status,
      source: Link,
    })
    .optional(),
  regionalFees: z.array(RegionalFee).default([]),
  scholarships: z.array(Scholarship).default([]),
  timeline: z.array(TimelineEvent).default([]),
  sources: z.array(Link).default([]),
  verifiedAt: DateStr,
});

/** Who runs a scholarship scheme; groups the scholarships page. */
export const FundingCategory = z.enum(["eu", "de", "it", "tr", "other"]);
/** Lowercase ISO 3166 code of a study country; may be outside the four researched countries. */
export const CountryCode = z.string().regex(/^[a-z]{2}$/, "ülke kodu iki küçük harf olmalı");

export const FundingCall = z.object({
  /** academic year the funded studies start, e.g. "2027-28" */
  cycle: z.string(),
  /** e.g. "burs turu", "ücret muafiyeti turu"; omit for a single round */
  name: z.string().optional(),
  open: DateStr.optional(),
  deadline: DateStr.optional(),
  status: Status,
  note: z.string().optional(),
});

/** One degree programme inside an umbrella scheme (an Erasmus Mundus joint master, an AI school). */
export const FundedProgram = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  short: z.string(),
  fields: z.array(z.string()).min(1),
  countries: z.array(CountryCode).min(1),
  partners: z.string(),
  /** whether the next intake (2027) awards the scheme's scholarships */
  scholarships: z.enum(["yes", "no", "unknown"]),
  calls: z.array(FundingCall).default([]),
  stipend: Money.optional(),
  /** fee for students admitted without the scholarship */
  selfFundedFee: Money.optional(),
  requirements: z.string().optional(),
  note: z.string().optional(),
  link: z.string().url(),
});

export const Funding = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  provider: z.string(),
  category: FundingCategory,
  hostCountries: z.array(CountryCode).min(1),
  hostNote: z.string().optional(),
  summary: z.string(),
  /** full = tuition and living costs; partial = one of them or a capped share; small = a top-up */
  level: z.enum(["full", "partial", "small"]),
  /** covered = paid by the scholarship; waived = the school drops it; free = the school charges none anyway */
  tuition: z.enum(["covered", "waived", "partial", "free", "not-covered", "varies"]),
  tuitionNote: z.string().optional(),
  stipend: Money.optional(),
  stipendNote: z.string().optional(),
  extras: z.array(z.string()).default([]),
  /** whether the award letter can stand in for the blocked account / proof of funds */
  blockedAccount: z.enum(["replaces", "partial", "no", "unknown", "na"]),
  blockedAccountNote: z.string().optional(),
  /** open to Turkish citizens */
  turkish: z.enum(["yes", "no", "conditional"]),
  /** funds a computer-science master's */
  cs: z.enum(["yes", "limited", "no"]),
  csNote: z.string().optional(),
  requirements: Requirements.optional(),
  ageMax: z.number().optional(),
  /** service, work or repayment duties that come with the money */
  obligation: z.string().optional(),
  calls: z.array(FundingCall).default([]),
  howToApply: z.array(z.string()).default([]),
  notes: z.array(z.string()).default([]),
  programs: z.array(FundedProgram).default([]),
  links: z.array(Link).default([]),
  sources: z.array(Link).min(1),
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

/** Live facts a checklist item can show, computed from the user's shortlist, profile and country data. */
export const HintKind = z.enum(["shortlist", "english", "ales", "gre", "gpa", "ects", "pof", "advisor", "portal", "fees", "german", "extraDocs", "moi", "interview", "emCalls"]);

/** One step of the application to-do list (data/checklist.json). */
export const ChecklistItem = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "id yalnızca a-z 0-9 - içermeli"),
  /** "all" = every country; otherwise country codes or track ids (e.g. "em") the step belongs to */
  scope: z.union([z.literal("all"), z.array(z.string().regex(/^[a-z]{2,12}$/)).min(1)]),
  phase: z.string(),
  title: z.string(),
  detail: z.string(),
  /** rough timing, e.g. "son başvurudan 2 ay önce" */
  when: z.string().optional(),
  /** only applies to some applicants, e.g. "Erkek adaylar" */
  condition: z.string().optional(),
  /** "info" = a fact to know, not a box to tick */
  kind: z.enum(["task", "info"]).default("task"),
  hint: HintKind.optional(),
  /** official pages */
  links: z.array(Link).default([]),
  /** pages inside the atlas, e.g. { label: "Burslar", path: "/burslar" } */
  pages: z.array(z.object({ label: z.string(), path: z.string().startsWith("/") })).default([]),
});

export const Checklist = z.object({
  verifiedAt: DateStr,
  phases: z.array(z.object({ id: z.string(), name: z.string(), desc: z.string() })).min(1),
  /** sections that are not a country, e.g. Erasmus Mundus; shown after the country sections */
  tracks: z.array(z.object({ id: z.string().regex(/^[a-z]{2,12}$/), name: z.string(), desc: z.string() })).default([]),
  items: z.array(ChecklistItem).min(1),
});

/** One published league table (THE, QS, ARWU…), overall or for computer science. */
export const RankingSource = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "id yalnızca a-z 0-9 - içermeli"),
  /** official title of the edition, e.g. "THE World University Rankings 2027" */
  name: z.string(),
  /** column header, e.g. "THE" */
  short: z.string(),
  /** edition as the publisher labels it: "2027", "2026-2027", "2016–2026" */
  edition: z.string(),
  kind: z.enum(["overall", "cs"]),
  publisher: z.string(),
  url: z.string().url(),
  retrievedAt: DateStr,
  /** deepest position the list publishes; a school missing from it ranks below this */
  listedTo: z.number().int().positive().optional(),
  note: z.string().optional(),
});

export const RankingEntry = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "id yalnızca a-z 0-9 - içermeli"),
  name: z.string(),
  short: z.string(),
  city: z.string(),
  /** id of the school in data/universities, when the atlas covers it */
  uni: z.string().optional(),
  note: z.string().optional(),
  /** source id → rank text as published: "25", "=143", "301–325", "1401+" */
  ranks: z.record(z.string(), z.string()),
});

/** data/rankings/<country>.json: that country's schools across several rankings */
export const RankingTable = z.object({
  country: z.string(),
  sources: z.array(RankingSource).min(1),
  entries: z.array(RankingEntry),
});

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
export type FundingCategory = z.infer<typeof FundingCategory>;
export type FundingCall = z.infer<typeof FundingCall>;
export type FundedProgram = z.infer<typeof FundedProgram>;
export type Funding = z.infer<typeof Funding>;
export type Field = z.infer<typeof Field>;
export type Fx = z.infer<typeof Fx>;
export type CsrRow = z.infer<typeof CsrRow>;
export type ChecklistItem = z.infer<typeof ChecklistItem>;
export type Checklist = z.infer<typeof Checklist>;
export type HintKind = z.infer<typeof HintKind>;
export type RankingSource = z.infer<typeof RankingSource>;
export type RankingEntry = z.infer<typeof RankingEntry>;
export type RankingTable = z.infer<typeof RankingTable>;
