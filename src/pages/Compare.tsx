import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { data, viewByKey } from "../state/data";
import { useStore } from "../state/store";
import { checkRequirements, minAles } from "../lib/eligibility";
import { yearlyCost } from "../lib/cost";
import { nextDeadline, offeredTerms } from "../lib/programs";
import { fmt, today } from "../lib/dates";
import { fmtAmount, fmtMoney } from "../lib/money";
import { LANG_LABEL, TERM_LABEL } from "../lib/text";
import { EligBadge } from "../components/bits";

export function ComparePage() {
  const { compare, toggleCompare, clearCompare, profile } = useStore();
  const T = today();
  const cols = compare
    .map(k => viewByKey.get(k))
    .filter((v): v is NonNullable<typeof v> => !!v)
    .map(v => ({ v, check: checkRequirements(v.requirements, profile, v.country), cost: yearlyCost(v, data.fx, profile.nonEU), next: nextDeadline(v.intakes, T) }));

  if (!cols.length)
    return (
      <>
        <div className="page-head"><h1>Karşılaştır</h1></div>
        <div className="empty">Henüz program seçmedin. <Link to="/programlar">Programlar</Link> listesinde "Karşılaştır" düğmesiyle en fazla 4 program ekle.</div>
      </>
    );

  const row = (label: string, cell: (c: (typeof cols)[number]) => ReactNode) => (
    <tr>
      <th scope="row">{label}</th>
      {cols.map(c => <td key={c.v.key}>{cell(c) ?? <span className="muted">—</span>}</td>)}
    </tr>
  );
  const terms = (c: (typeof cols)[number]) => {
    const t = offeredTerms(c.v.intakes);
    const name = (x: string) => c.v.country.terms[x as keyof typeof c.v.country.terms]?.name ?? TERM_LABEL[x];
    return [t.yes.map(name).join(", "), t.no.length ? `alım yok: ${t.no.map(name).join(", ")}` : ""].filter(Boolean).join(" · ") || null;
  };

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Yan yana</div>
        <h1>Karşılaştır</h1>
        <div className="btnrow"><button type="button" className="btn" onClick={clearCompare}>Listeyi temizle</button></div>
      </div>
      <div className="cmp">
        <table>
          <thead>
            <tr>
              <th />
              {cols.map(c => (
                <th key={c.v.key} className="cmp-col">
                  <Link to={`/program/${c.v.key}`}>{c.v.program.name}</Link>
                  <div className="small muted"><span className="flag">{c.v.country.flag}</span> {c.v.uni.short} · {c.v.uni.city}</div>
                  <button type="button" className="btn sm" style={{ marginTop: 6 }} onClick={() => toggleCompare(c.v.key)}>Çıkar</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {row("Uygunluk", c => <EligBadge s={c.check.overall} />)}
            {row("Derece", c => c.v.program.degree)}
            {row("Dil", c => c.v.program.languages.map(l => LANG_LABEL[l]).join(", "))}
            {row("Dönemler", terms)}
            {row("Sonraki tarih", c => (c.next ? `${c.next.kind === "deadline" ? "Son gün" : "Açılış"} ${fmt(c.next.date)}${c.next.intake.status === "tahmin" ? " (tahmin)" : ""}` : null))}
            {row("GNO", c => (c.v.requirements.gpa?.min != null ? `≥ ${c.v.requirements.gpa.min}` : c.v.requirements.gpa?.deMax != null ? `Alman notu ≤ ${c.v.requirements.gpa.deMax}` : null))}
            {row("ALES", c => {
              const a = c.v.requirements.ales;
              if (!a) return null;
              if (a.notRequired) return "Aranmıyor";
              return a.min != null ? `≥ ${minAles(a.min, profile.gpaScale === 4 ? profile.gpa : undefined) ?? "GNO yetmiyor"}` : null;
            })}
            {row("İngilizce", c => {
              const e = c.v.requirements.english;
              if (!e) return null;
              return [e.ielts != null && `IELTS ${e.ielts}`, e.toefl != null && `TOEFL ${e.toefl}`, e.yds != null && `YDS ${e.yds}`].filter(Boolean).join(" / ") || e.note || null;
            })}
            {row("GRE", c => (c.v.requirements.gre ? `${c.v.requirements.gre.policy}${c.v.requirements.gre.minQuant ? ` ≥ ${c.v.requirements.gre.minQuant}` : ""}` : null))}
            {row("Ders uyumu", c => c.v.requirements.ects?.areas.map(a => `${a.area} ${a.min}`).join(", ") || null)}
            {row("Danışman mektubu", c => (c.v.requirements.advisorLetter === "required" ? "Zorunlu" : c.v.requirements.advisorLetter === "recommended" ? "Önerilir" : null))}
            {row("Yıllık maliyet", c => (c.cost.free ? "Ücretsiz" : c.cost.eurPerYear != null ? `${fmtAmount(Math.round(c.cost.eurPerYear), "EUR")}/yıl` : c.v.costs?.tuition.note ?? null))}
            {row("Bölgesel ücret", c => (c.v.costs?.regionalFee ? `${c.v.costs.regionalFee.region}: ${fmtMoney(c.v.costs.regionalFee.fee)}` : null))}
            {row("Burslar", c => (c.v.scholarships.length ? c.v.scholarships.map(s => s.name).join(", ") : null))}
          </tbody>
        </table>
      </div>
    </>
  );
}
