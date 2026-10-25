// Turns country timelines, program/university intake rounds and scholarship calls into one list of calendar events.
import type { Country, Funding } from "../schema";
import type { ProgramView } from "./programs";
import { allCalls, hostsOf } from "./scholarships";
import { TERM_LABEL } from "./text";

export interface CalEvent {
  uid: string;
  s: string;
  e?: string;
  t: string;
  d?: string;
  k: "kesin" | "tahmin";
  /** absent for scholarships that span several countries */
  country?: Country;
  /** study countries of a scholarship event (for the country filter) */
  hosts?: string[];
  href?: string;
  /** program keys this event applies to (for shortlist filtering) */
  keys: string[];
  kind: "general" | "application" | "scholarship";
}

/** One event per scholarship call; single-country schemes carry that country's flag. */
export function scholarshipEvents(fundings: Funding[], countries: Country[]): CalEvent[] {
  const byCode = new Map(countries.map(c => [c.code, c]));
  return fundings.flatMap(f =>
    allCalls(f).flatMap(({ call, program }, i) => {
      if (!call.open && !call.deadline) return [];
      const hosts = program ? program.countries : hostsOf(f);
      const what = [program?.short, call.name].filter(Boolean).join(" · ");
      return [{
        uid: `fund-${f.id}-${i}`,
        s: call.open ?? call.deadline!,
        e: call.open && call.deadline ? call.deadline : undefined,
        t: `${f.name}${what ? ` (${what})` : ""}: ${call.cycle}`,
        d: call.open && !call.deadline ? "Açılış tarihi; son gün henüz bilinmiyor." : !call.open && call.deadline ? "Son başvuru günü." : undefined,
        k: call.status,
        country: hosts.length === 1 ? byCode.get(hosts[0]) : undefined,
        hosts,
        href: `/burs/${f.id}`,
        keys: [],
        kind: "scholarship" as const,
      }];
    }),
  );
}

export function buildCalendar(views: ProgramView[], countries: Country[], fundings: Funding[] = []): CalEvent[] {
  const out: CalEvent[] = [];
  for (const c of countries)
    c.timeline.forEach((ev, i) =>
      out.push({ uid: `tl-${c.code}-${i}`, s: ev.s, e: ev.e, t: ev.t, d: ev.d, k: ev.k, country: c, kind: "general", keys: ev.uni ? views.filter(v => v.uni.id === ev.uni).map(v => v.key) : [], href: ev.uni ? `/okul/${ev.uni}` : undefined }),
    );

  // university-wide rounds become one event per school; program overrides one event per program
  const seen = new Set<string>();
  for (const v of views) {
    const own = !!v.program.intakes;
    for (const intake of v.intakes) {
      if (intake.offered === "no") continue;
      intake.rounds.forEach((r, i) => {
        if (!r.open && !r.deadline) return;
        const scope = own ? v.key : v.uni.id;
        const uid = `app-${scope}-${intake.term}-${intake.cycle}-${i}`.replace(/\//g, "_");
        const term = v.country.terms[intake.term]?.name ?? TERM_LABEL[intake.term];
        const existing = out.find(e => e.uid === uid);
        if (seen.has(uid)) {
          existing?.keys.push(v.key);
          return;
        }
        seen.add(uid);
        out.push({
          uid,
          s: r.open ?? r.deadline!,
          e: r.open && r.deadline ? r.deadline : undefined,
          t: `${v.uni.short}${own ? ` · ${v.program.name}` : ""}: ${term} ${intake.cycle} başvurusu${r.name !== "normal" ? ` (${r.name})` : ""}`,
          d: r.open && !r.deadline ? "Açılış tarihi; son gün henüz bilinmiyor." : !r.open && r.deadline ? "Son başvuru günü." : undefined,
          k: intake.status,
          country: v.country,
          href: own ? `/program/${v.key}` : `/okul/${v.uni.id}`,
          keys: [v.key],
          kind: "application",
        });
      });
    }
  }
  out.push(...scholarshipEvents(fundings, countries));
  return out.sort((a, b) => a.s.localeCompare(b.s));
}
