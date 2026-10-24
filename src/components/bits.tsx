// Small presentational pieces shared by every page.
import type { Intake, Money, Status } from "../schema";
import type { CheckStatus } from "../lib/eligibility";
import { countdown, daysBetween, fmt, parseD, today } from "../lib/dates";
import { fmtMoney } from "../lib/money";
import { TERM_LABEL } from "../lib/text";
import { offeredTerms } from "../lib/programs";

export function StatusPill({ k }: { k: Status }) {
  return <span className={`pill ${k}`} title={k === "kesin" ? "Yayımlanmış ilan" : "Geçen yılın takvimine göre tahmin; ilan çıkınca doğrula"}>{k}</span>;
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
