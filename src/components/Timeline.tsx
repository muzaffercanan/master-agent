import { Link } from "react-router-dom";
import type { Country, TimelineEvent } from "../schema";
import { AYLAR, countdown, fmtShort, parseD, today } from "../lib/dates";
import { Flag, StatusPill } from "./bits";

export interface TlItem extends TimelineEvent {
  /** absent for events that span several countries */
  country?: Country;
  /** link to a program or school page */
  href?: string;
}

/** Events grouped by month with live countdowns. */
export function Timeline({ events, compact, hidePast }: { events: TlItem[]; compact?: boolean; hidePast?: boolean }) {
  const T = today();
  const sorted = [...events].sort((a, b) => a.s.localeCompare(b.s));
  const groups = new Map<string, TlItem[]>();
  for (const ev of sorted) {
    if (hidePast && countdown(ev.s, ev.e, T).past) continue;
    const k = ev.s.slice(0, 7);
    groups.set(k, [...(groups.get(k) ?? []), ev]);
  }
  if (!groups.size) return <p className="muted small">Gösterilecek tarih yok.</p>;
  return (
    <div className="tl">
      {[...groups.entries()].map(([k, items]) => {
        const [y, m] = k.split("-").map(Number);
        return (
          <div className="tl-month" key={k} style={compact ? { gridTemplateColumns: "1fr", gap: 6 } : undefined}>
            <div className="m" style={compact ? { position: "static", paddingTop: 0 } : undefined}>{AYLAR[m - 1]} {y}</div>
            <div className="tl-items">
              {items.map((ev, i) => {
                const c = countdown(ev.s, ev.e, T);
                const s = parseD(ev.s);
                const when = ev.e ? `${fmtShort(s)} – ${fmtShort(ev.e)}${parseD(ev.e).getFullYear() !== s.getFullYear() ? " " + parseD(ev.e).getFullYear() : ""}` : fmtShort(s);
                return (
                  <div key={i} className={`tl-item${c.past ? " past" : ""}${c.soon && !c.past ? " soon" : ""}`}>
                    <div className="d">{when}</div>
                    <div className="t">
                      {ev.country && <><Flag c={ev.country} /> </>}{ev.href ? <Link to={ev.href}>{ev.t}</Link> : ev.t}
                    </div>
                    <div className="s"><StatusPill k={ev.k} /><span className="left-pill">{c.text}</span></div>
                    {ev.d && <div className="x">{ev.d}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
