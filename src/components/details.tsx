import type { Country, Intake, Requirements, Scholarship } from "../schema";
import type { CheckResult } from "../lib/eligibility";
import type { CostSummary } from "../lib/cost";
import { fmt, fmtRange } from "../lib/dates";
import { fmtAmount, fmtMoney } from "../lib/money";
import { TERM_LABEL } from "../lib/text";
import { Countdown, EligBadge, StatusPill } from "./bits";

const AUD: Record<string, string> = { all: "", eu: "AB vatandaşları", "non-eu": "AB dışı (Türk vatandaşları)", tr: "T.C. vatandaşları" };

export function IntakeList({ intakes, country }: { intakes: Intake[]; country: Country }) {
  if (!intakes.length) return <p className="muted small">Dönem ve tarih bilgisi henüz girilmedi.</p>;
  return (
    <div className="intakes">
      {intakes.map((i, n) => (
        <div key={n} className={`intake${i.offered === "no" ? " no" : ""}`}>
          <div className="ih">
            {country.terms[i.term]?.name ?? TERM_LABEL[i.term]} {i.cycle}
            <StatusPill k={i.status} />
            {i.offered === "no" && <span className="pill bad">bu dönemde alım yok</span>}
            {i.offered === "unknown" && <span className="pill na">alım belirsiz</span>}
          </div>
          {i.rounds.length > 0 && (
            <div className="rounds">
              {i.rounds.map((r, k) => (
                <div key={k}>
                  <span className="rn">{r.name}{AUD[r.audience] && !/ab dışı|ab vatandaş/i.test(r.name) ? ` · ${AUD[r.audience]}` : ""}</span>
                  <span className="num">{fmtRange(r.open, r.deadline)}</span>
                  {i.offered !== "no" && <Countdown s={r.open} e={r.deadline} />}
                </div>
              ))}
            </div>
          )}
          {i.note && <p className="small muted">{i.note}</p>}
        </div>
      ))}
    </div>
  );
}

/** Requirements as a list; when a check result is passed, each row shows the applicant's status. */
export function RequirementList({ req, check }: { req: Requirements; check?: CheckResult }) {
  const status = (key: string) => check?.items.find(i => i.key === key);
  const rows: [string, string, string?][] = [];
  if (req.gpa) {
    const parts = [req.gpa.min != null ? `en az ${req.gpa.min}/${req.gpa.scale ?? 4}` : null, req.gpa.deMax != null ? `Alman notu en kötü ${req.gpa.deMax}` : null, req.gpa.note].filter(Boolean);
    rows.push(["GNO", parts.join(" · "), "gpa"]);
  }
  if (req.ales) {
    const m = req.ales.min;
    const t = req.ales.notRequired ? "Aranmıyor" : m == null ? "" : typeof m === "number" ? `en az ${m}` : `GNO'ya göre: ${m.tiers.map(x => `GNO ≥ ${x.gpa} → ${x.ales}`).join(", ")}`;
    rows.push(["ALES", [t, req.ales.note].filter(Boolean).join(" · "), "ales"]);
  }
  if (req.english) {
    const e = req.english;
    const parts = [e.ielts != null ? `IELTS ${e.ielts}` : null, e.toefl != null ? `TOEFL iBT ${e.toefl}` : null, e.yds != null ? `YDS/YÖKDİL ${e.yds}` : null, e.cambridge ? `Cambridge ${e.cambridge}` : null, e.moiAccepted ? "İngilizce eğitim belgesi kabul" : null].filter(Boolean);
    rows.push(["İngilizce", [parts.join(" / "), e.note && !parts.length ? e.note : null].filter(Boolean).join(" · "), "english"]);
  }
  if (req.otherLanguage) rows.push(["Diğer dil", req.otherLanguage]);
  if (req.gre) rows.push(["GRE", { required: "Zorunlu", recommended: "Önerilir", optional: "İsteğe bağlı", no: "İstenmiyor" }[req.gre.policy] + (req.gre.minQuant ? ` · Quant ≥ ${req.gre.minQuant}` : "") + (req.gre.note ? ` · ${req.gre.note}` : ""), "gre"]);
  if (req.ects) rows.push(["Ders uyumu", [req.ects.total ? `toplam ${req.ects.total} ECTS` : null, ...req.ects.areas.map(a => `${a.area} ${a.min} ECTS`), req.ects.note].filter(Boolean).join(" · "), "ects"]);
  if (req.advisorLetter) rows.push(["Danışman", req.advisorLetter === "required" ? "Öğretim üyesinden kabul mektubu zorunlu" : "Destek mektubu öneriliyor"]);
  if (req.interview) rows.push(["Mülakat / sınav", req.interview]);
  if (req.workExperience) rows.push(["İş deneyimi", req.workExperience]);
  if (req.portal) rows.push(["Başvuru yolu", req.portal]);
  if (req.documents?.length) rows.push(["Belgeler", req.documents.join(" · ")]);
  if (req.note) rows.push(["Not", req.note]);
  if (!rows.length) return <p className="muted small">Bu program için şart verisi henüz girilmedi. Okul genel şartlarına bak.</p>;
  return (
    <ul className="reqlist">
      {rows.map(([k, v, key]) => {
        const s = key ? status(key) : undefined;
        return (
          <li key={k}>
            <span className="rk">{k}</span>
            <span>{v}{s?.detail && <span className="muted small"> — {s.detail}</span>}</span>
            <span>{s && <EligBadge s={s.status} short />}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function CostBox({ cost, note }: { cost: CostSummary; note?: string }) {
  if (!cost.lines.length) return <p className="muted small">Ücret bilgisi yok.</p>;
  return (
    <div className="costlines">
      {cost.lines.map(l => (
        <div className="cl" key={l.label}>
          <span>{l.label}{l.note && <span className="muted small"> — {l.note}</span>}</span>
          <span className="num">{l.eurPerYear == null ? "?" : l.eurPerYear === 0 ? "0" : `${fmtAmount(Math.round(l.eurPerYear), "EUR")}/yıl`}</span>
        </div>
      ))}
      <div className="cl total">
        <span>Yıllık toplam (yaşam gideri hariç)</span>
        <span className="num">{cost.eurPerYear == null ? "bilinmiyor" : cost.eurPerYear === 0 ? "Ücretsiz" : `${fmtAmount(Math.round(cost.eurPerYear), "EUR")}`}</span>
      </div>
      {note && <p className="small muted">{note}</p>}
    </div>
  );
}

export function ScholarshipList({ items }: { items: Scholarship[] }) {
  if (!items.length) return <p className="muted small">Kayıtlı burs yok.</p>;
  return (
    <div className="schol">
      {items.map(s => (
        <div className="s" key={s.provider + s.name}>
          <b>
            {s.link ? <a href={s.link} target="_blank" rel="noopener noreferrer">{s.name}</a> : s.name} <span className="muted small">· {s.provider}</span>
          </b>
          {s.amount && <span className="num">{fmtMoney(s.amount)} · </span>}
          {s.coverage}
          {s.deadline && <span className="muted"> · son başvuru {fmt(s.deadline)}</span>}
          {AUD[s.audience] && <span className="muted"> · {AUD[s.audience]}</span>}
          {s.status === "tahmin" && <> <StatusPill k="tahmin" /></>}
        </div>
      ))}
    </div>
  );
}
