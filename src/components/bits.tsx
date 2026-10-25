// Small presentational pieces shared by every page.
import type { Intake, Money, Status } from "../schema";
import type { CheckStatus } from "../lib/eligibility";
import { countdown, daysBetween, fmt, parseD, today, urgency, windowProgress } from "../lib/dates";
import { fmtMoney } from "../lib/money";
import { TERM_LABEL } from "../lib/text";
import { offeredTerms } from "../lib/programs";
import { rankTier } from "../lib/rank";

export function StatusPill({ k }: { k: Status }) {
  return <span className={`pill ${k}`} title={k === "kesin" ? "Yayımlanmış ilan" : "Geçen yılın takvimine göre tahmin; ilan çıkınca doğrula"}>{k}</span>;
}

/** THE world rank, tinted by tier: 1–100, 101–200, beyond 200. */
export function WorldRank({ r }: { r?: { year: number; rank: string } }) {
  if (!r) return null;
  const tier = rankTier(r.rank);
  if (!tier) return null;
  return (
    <span className={`wrank ${tier}`} title={`Times Higher Education Dünya Üniversite Sıralaması ${r.year}`}>
      THE {r.rank}
    </span>
  );
}

const ELIG_TEXT: Record<CheckStatus | "none", string> = {
  ok: "Şartları karşılıyor",
  near: "Sınırda",
  fail: "Yetmiyor",
  unknown: "Eksik bilgi",
  na: "Şart yok",
  none: "Şart verisi yok",
};
export function EligBadge({ s, short }: { s: CheckStatus | "none"; short?: boolean }) {
  const t = short && s === "ok" ? "Uygun" : ELIG_TEXT[s];
  return <span className={`elig ${s}`}>{t}</span>;
}

export function TermTags({ intakes, labels }: { intakes: Intake[]; labels?: Record<string, { name: string }> }) {
  const t = offeredTerms(intakes);
  const name = (x: string) => labels?.[x]?.name ?? TERM_LABEL[x] ?? x;
  if (!intakes.length) return <span className="muted small">Dönem bilgisi yok</span>;
  return (
    <span className="term-tags">
      {t.yes.map(x => <span key={"y" + x} className="term yes" title="Bu dönemde alım var">{name(x)}</span>)}
      {t.unknown.map(x => <span key={"u" + x} className="term unknown" title="Bu dönemde alım olup olmadığı belirsiz">{name(x)}?</span>)}
      {t.no.map(x => <span key={"n" + x} className="term no" title="Bu dönemde alım yok">{name(x)}</span>)}
    </span>
  );
}

export function Countdown({ s, e }: { s?: string; e?: string }) {
  const c = countdown(s, e, today());
  return <span className={`deadline${c.soon && !c.past ? " soon" : ""}`}>{c.text}</span>;
}

export function MoneyText({ m }: { m: Money }) {
  return <span className="num">{fmtMoney(m)}</span>;
}

export function StaleBadge({ verifiedAt, days = 90 }: { verifiedAt: string; days?: number }) {
  const age = daysBetween(parseD(verifiedAt), today());
  if (age <= days) return null;
  return <span className="stale" title={`Son doğrulama ${fmt(verifiedAt)}`}>{age} gündür doğrulanmadı</span>;
}

export function StarButton({ on, onClick, label }: { on: boolean; onClick: () => void; label?: string }) {
  return (
    <button type="button" className="iconstar" aria-pressed={on} onClick={onClick} title={on ? "Kısa listeden çıkar" : "Kısa listeye ekle"} aria-label={label ?? (on ? "Kısa listeden çıkar" : "Kısa listeye ekle")}>
      <svg viewBox="0 0 24 24" strokeLinejoin="round"><path d="M12 3.6l2.6 5.3 5.9.85-4.25 4.15 1 5.9L12 17l-5.25 2.8 1-5.9L3.5 9.75l5.9-.85z" /></svg>
    </button>
  );
}

export function ExtLinks({ links }: { links: { label: string; url: string }[] }) {
  if (!links.length) return null;
  return (
    <div className="links">
      {links.map(l => (
        <a key={l.url + l.label} href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a>
      ))}
    </div>
  );
}

// Five-point star for the Turkish flag, one point towards the hoist.
const TR_STAR = Array.from({ length: 10 }, (_, k) => {
  const a = Math.PI + (k * Math.PI) / 5;
  const r = k % 2 ? 0.95 : 2.5;
  return `${(16.9 + r * Math.cos(a)).toFixed(2)},${(10 + r * Math.sin(a)).toFixed(2)}`;
}).join(" ");

const FLAGS: Record<string, JSX.Element> = {
  tr: <><rect width="30" height="20" fill="#E30A17" /><circle cx="10" cy="10" r="5" fill="#fff" /><circle cx="11.25" cy="10" r="4" fill="#E30A17" /><polygon points={TR_STAR} fill="#fff" /></>,
  de: <><rect width="30" height="20" fill="#FFCE00" /><rect width="30" height="13.33" fill="#DD0000" /><rect width="30" height="6.67" fill="#000" /></>,
  at: <><rect width="30" height="20" fill="#C8102E" /><rect y="6.67" width="30" height="6.67" fill="#fff" /></>,
  it: <><rect width="30" height="20" fill="#fff" /><rect width="10" height="20" fill="#009246" /><rect x="20" width="10" height="20" fill="#CE2B37" /></>,
};

/** Country flag as inline SVG (Windows has no flag emoji); falls back to the country's text flag. */
export function Flag({ c }: { c: { code: string; flag: string; name: string } }) {
  const f = FLAGS[c.code];
  if (!f) return <span className="flag">{c.flag}</span>;
  return (
    <svg className="flagsvg" viewBox="0 0 30 20" role="img" aria-label={c.name}>
      {f}
      <rect width="30" height="20" fill="none" className="flagedge" />
    </svg>
  );
}

/** Thin bar showing how much of the application window has passed, coloured by days left. */
export function DeadlineBar({ open, deadline }: { open?: string; deadline: string }) {
  const T = today();
  const p = windowProgress(open, deadline, T);
  if (p == null) return null;
  const u = urgency(daysBetween(T, parseD(deadline)));
  return (
    <span className={`dbar ${u}`} title={`Başvuru penceresinin geçen kısmı: %${Math.round(p * 100)}`} aria-hidden="true">
      <i style={{ width: `${Math.max(4, p * 100)}%` }} />
    </span>
  );
}
