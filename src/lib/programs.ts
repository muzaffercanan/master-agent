// Flattens universities into program "views" with inherited intakes, requirements, costs and
// scholarships resolved, so pages and filters work on one uniform shape.
import type { Dataset } from "../data/dataset";
import type { Costs, Country, Intake, Program, Requirements, Round, Scholarship, Term, University } from "../schema";
import { parseD } from "./dates";

export interface ProgramView {
  key: string; // "<uniId>/<programId>"
  uni: University;
  program: Program;
  country: Country;
  intakes: Intake[];
  requirements: Requirements;
  costs: Costs | undefined;
  /** program + university scholarships */
  scholarships: Scholarship[];
  /** country-wide schemes (e.g. TÜBİTAK, DAAD) that apply to every program in the country */
  nationalScholarships: Scholarship[];
}

/** Program requirements on top of university defaults (one level deep per criterion). */
export function mergeRequirements(base: Requirements | undefined, own: Requirements | undefined): Requirements {
  return { ...(base ?? {}), ...(own ?? {}) };
}

export function buildViews(ds: Dataset): ProgramView[] {
  const countries = new Map(ds.countries.map(c => [c.code, c]));
  return ds.universities.flatMap(uni => {
    const country = countries.get(uni.country)!;
    return uni.programs.map(program => ({
      key: `${uni.id}/${program.id}`,
      uni,
      program,
      country,
      intakes: program.intakes ?? uni.intakes,
      requirements: mergeRequirements(uni.requirements, program.requirements),
      costs: program.costs ?? uni.costs,
      scholarships: [...program.scholarships, ...uni.scholarships],
      nationalScholarships: country.scholarships,
    }));
  });
}

export function offeredTerms(intakes: Intake[]): { yes: Term[]; no: Term[]; unknown: Term[] } {
  const by = (o: Intake["offered"]) => [...new Set(intakes.filter(i => i.offered === o).map(i => i.term))];
  return { yes: by("yes"), no: by("no"), unknown: by("unknown") };
}

/** True when the program admits in exactly one term and the other term is explicitly closed. */
export function singleTermOnly(intakes: Intake[]): boolean {
  const t = offeredTerms(intakes);
  return t.yes.length === 1 && t.no.length >= 1;
}

export interface NextDate {
  date: string;
  kind: "deadline" | "open";
  intake: Intake;
  round: Round;
}

/** The next relevant date: the soonest deadline that has not passed (or an opening date when no deadline is known). */
export function nextDeadline(intakes: Intake[], T: Date): NextDate | null {
  let best: NextDate | null = null;
  for (const intake of intakes) {
    if (intake.offered === "no") continue;
    for (const round of intake.rounds) {
      const cand: NextDate | null = round.deadline
        ? { date: round.deadline, kind: "deadline", intake, round }
        : round.open
          ? { date: round.open, kind: "open", intake, round }
          : null;
      if (!cand || parseD(cand.date) < T) continue;
      if (!best || cand.date < best.date) best = cand;
    }
  }
  return best;
}
