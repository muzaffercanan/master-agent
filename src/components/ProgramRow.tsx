import { Link } from "react-router-dom";
import type { Derived } from "../lib/filters";
import { alesLabel } from "../lib/filters";
import { fmt } from "../lib/dates";
import { fmtAmount } from "../lib/money";
import { LANG_LABEL, LEVEL_LABEL } from "../lib/text";
import { useStore } from "../state/store";
import { Countdown, EligBadge, StarButton, TermTags, WorldRank } from "./bits";

export function costText(d: Derived): string {
  if (d.cost.free) return "Ücretsiz";
  if (d.cost.eurPerYear != null) return `${fmtAmount(Math.round(d.cost.eurPerYear), "EUR")}/yıl`;
  const k = d.view.costs?.tuition.kind;
  return k === "varies" ? "Değişken / burslu" : k === "covered" ? "Burslu" : "Bilinmiyor";
}

export function ProgramRow({ d }: { d: Derived }) {
  const { shortlist, toggleShortlist, compare, toggleCompare, tracker, setTrack, profile } = useStore();
  const { view: v, next, check } = d;
  const sl = shortlist.includes(v.key);
  const inCmp = compare.includes(v.key);
  const ales = alesLabel(v, profile.gpaScale === 4 ? profile.gpa : undefined);
  const r = v.requirements;
  const reqBits = [
    ales,
    r.gpa?.min != null ? `GNO ${r.gpa.min}` : null,
    r.gpa?.deMax != null ? `Not ≤ ${r.gpa.deMax}` : null,
    r.english?.ielts != null ? `IELTS ${r.english.ielts}` : null,
    r.english?.toefl != null ? `TOEFL ${r.english.toefl}` : null,
    r.english?.yds != null ? `YDS ${r.english.yds}` : null,
    r.gre?.policy === "required" ? "GRE zorunlu" : null,
    r.advisorLetter === "required" ? "Danışman mektubu" : null,
  ].filter(Boolean);

  return (
    <article className={`prow${sl ? " sl" : ""}`}>
      <div className="prow-head">
        <div className="title">
          <Link className="pname" to={`/program/${v.uni.id}/${v.program.id}`}>{v.program.name}</Link>
          <span className="school">
            <span className="flag">{v.country.flag}</span> <Link to={`/okul/${v.uni.id}`}>{v.uni.short}</Link> <WorldRank r={v.uni.rankings.theWorld} /> · {v.uni.city}
            {v.uni.region ? `, ${v.uni.region}` : ""}
          </span>
          <span className="meta">
            <span>{v.program.degree}</span>
            {v.program.languages.map(l => <span key={l}>{LANG_LABEL[l]}</span>)}
            {v.program.levels.length === 1 && v.program.levels[0] !== "master" && <span>{LEVEL_LABEL[v.program.levels[0]]}</span>}
          </span>
        </div>
        <div className="acts">
          <EligBadge s={check.overall} short />
          <StarButton on={sl} onClick={() => toggleShortlist(v.key)} />
          <button type="button" className={`btn sm${inCmp ? " on" : ""}`} onClick={() => toggleCompare(v.key)} disabled={!inCmp && compare.length >= 4} title={!inCmp && compare.length >= 4 ? "En fazla 4 program" : undefined}>
            {inCmp ? "Karşılaştırmada" : "Karşılaştır"}
          </button>
          {!tracker[v.key] && (
            <button type="button" className="btn sm" onClick={() => setTrack(v.key, { status: "araştırılıyor" })}>Takibe al</button>
          )}
        </div>
      </div>
      <div className="prow-facts">
        <div className="fact">
          <span className="k">Dönem</span>
          <TermTags intakes={v.intakes} labels={v.country.terms} />
        </div>
        <div className="fact">
          <span className="k">Sonraki tarih</span>
          {next ? (
            <>
              <span className="when">
                {next.kind === "deadline" ? "Son gün" : "Açılış"} <span className="num">{fmt(next.date)}</span>
                {next.intake.status === "tahmin" && <span className="muted"> (tahmin)</span>}
              </span>
              <Countdown s={next.kind === "open" ? next.date : undefined} e={next.kind === "deadline" ? next.date : undefined} />
            </>
          ) : (
            <span className="muted">Yaklaşan tarih yok</span>
          )}
        </div>
        <div className="fact">
          <span className="k">Şartlar</span>
          <span>{reqBits.length ? reqBits.join(" · ") : <span className="muted">Şart verisi yok</span>}</span>
        </div>
        <div className="fact">
          <span className="k">Yıllık ücret</span>
          <span className="cost">{costText(d)}</span>
          {(d.cost.hasRegionalFee || v.scholarships.length > 0) && (
            <span className="muted small">
              {d.cost.hasRegionalFee && "bölgesel ücret dahil"}
              {d.cost.hasRegionalFee && v.scholarships.length > 0 && " · "}
              {v.scholarships.length > 0 && `${v.scholarships.length} burs`}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
