// Yearly cost of a program for a given applicant, normalised to EUR.
import type { Fx } from "../schema";
import type { ProgramView } from "./programs";
import { convert, perYear } from "./money";

export interface CostLine {
  label: string;
  eurPerYear: number | null;
  note?: string;
}
export interface CostSummary {
  /** null when tuition is unknown/varies and nothing else is known */
  eurPerYear: number | null;
  free: boolean;
  lines: CostLine[];
  hasRegionalFee: boolean;
}

export function yearlyCost(v: ProgramView, fx: Fx, nonEU: boolean): CostSummary {
  const c = v.costs;
  const lines: CostLine[] = [];
  if (!c) return { eurPerYear: null, free: false, lines, hasRegionalFee: false };
  const eur = (m: Parameters<typeof perYear>[0]) => {
    const y = perYear(m);
    return y == null ? null : convert(y, m.currency, "EUR", fx);
  };

  const fee = nonEU && c.tuition.feeNonEU ? c.tuition.feeNonEU : c.tuition.fee;
  if (c.tuition.kind === "free") lines.push({ label: "Öğrenim ücreti", eurPerYear: 0, note: c.tuition.note });
  else if (fee) lines.push({ label: nonEU && c.tuition.feeNonEU ? "Öğrenim ücreti (AB dışı)" : "Öğrenim ücreti", eurPerYear: eur(fee), note: c.tuition.note });
  else lines.push({ label: "Öğrenim ücreti", eurPerYear: null, note: c.tuition.note ?? "Bilinmiyor" });

  if (c.semesterFee) lines.push({ label: "Dönem katkı payı", eurPerYear: eur(c.semesterFee) });
  const rf = c.regionalFee;
  const regionalApplies = !!rf && (rf.appliesTo === "all" || (nonEU && rf.appliesTo === "non-eu"));
  if (rf && regionalApplies) lines.push({ label: `Bölgesel ücret (${rf.region})`, eurPerYear: eur(rf.fee), note: rf.note });

  const known = lines.filter(l => l.eurPerYear != null);
  const tuitionUnknown = lines[0].eurPerYear == null;
  const total = tuitionUnknown ? null : known.reduce((a, l) => a + (l.eurPerYear ?? 0), 0);
  return { eurPerYear: total, free: c.tuition.kind === "free" && (total ?? 0) === 0, lines, hasRegionalFee: regionalApplies };
}
