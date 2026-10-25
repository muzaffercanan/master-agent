import { Link, useParams } from "react-router-dom";
import { data, viewByKey } from "../state/data";
import { useStore } from "../state/store";
import { checkRequirements } from "../lib/eligibility";
import { yearlyCost } from "../lib/cost";
import { LANG_LABEL, LEVEL_LABEL, locative } from "../lib/text";
import { fmt } from "../lib/dates";
import { CostBox, IntakeList, RequirementList, ScholarshipList } from "../components/details";
import { EligBadge, ExtLinks, Flag, StaleBadge, StarButton } from "../components/bits";
import { NotFound } from "./NotFound";

export function ProgramPage() {
  const { uni, prog } = useParams();
  const v = viewByKey.get(`${uni}/${prog}`);
  const { profile, shortlist, toggleShortlist, compare, toggleCompare, tracker, setTrack } = useStore();
  if (!v) return <NotFound what="Program" />;
  const check = checkRequirements(v.requirements, profile, v.country);
  const cost = yearlyCost(v, data.fx, profile.nonEU);
  const p = v.program;

  return (
    <>
      <div className="page-head">
        <nav className="crumbs" aria-label="Konum">
          <Link to="/programlar">Programlar</Link>›<Link to={`/ulke/${v.country.code}`}><Flag c={v.country} /> {v.country.name}</Link>›<Link to={`/okul/${v.uni.id}`}>{v.uni.short}</Link>
        </nav>
        <h1>{p.name}</h1>
        <p className="lede">{v.uni.name} · {v.uni.city}{v.uni.region ? `, ${v.uni.region}` : ""}</p>
        <div className="btnrow">
          <span className="chip">{p.degree}</span>
          {p.levels.map(l => <span key={l} className="chip">{LEVEL_LABEL[l]}</span>)}
          {p.languages.map(l => <span key={l} className="chip">{LANG_LABEL[l]}</span>)}
          {p.ects && <span className="chip">{p.ects} ECTS</span>}
          {p.durationSemesters && <span className="chip">{p.durationSemesters} dönem</span>}
          <StaleBadge verifiedAt={v.uni.verifiedAt} />
        </div>
        <div className="btnrow" style={{ marginTop: 6 }}>
          <StarButton on={shortlist.includes(v.key)} onClick={() => toggleShortlist(v.key)} />
          <button type="button" className={`btn${compare.includes(v.key) ? " on" : ""}`} onClick={() => toggleCompare(v.key)} disabled={!compare.includes(v.key) && compare.length >= 4}>
            {compare.includes(v.key) ? "Karşılaştırmadan çıkar" : "Karşılaştırmaya ekle"}
          </button>
          {tracker[v.key] ? <Link className="btn on" to="/takip">Takipte: {tracker[v.key].status}</Link> : <button type="button" className="btn" onClick={() => setTrack(v.key, { status: "araştırılıyor" })}>Takibe al</button>}
        </div>
      </div>

      <div className="detail">
        <div style={{ display: "grid", gap: 16 }}>
          <div className="panel">
            <div className="panel-head">
              <h3>Başvuru şartları</h3>
              <EligBadge s={check.overall} />
            </div>
            <RequirementList req={v.requirements} check={check} />
            {!profile.gpa && !profile.ales && !profile.ielts && !profile.toefl && <p className="hint">Uygunluk için <Link to="/profil">profilini</Link> doldur.</p>}
          </div>
          <div className="panel">
            <h3>Dönemler ve tarihler</h3>
            <IntakeList intakes={v.intakes} country={v.country} />
            {!p.intakes && v.uni.intakes.length > 0 && <p className="hint">Tarihler okulun enstitü genelindeki takviminden.</p>}
          </div>
          {(p.notes || p.quota) && (
            <div className="panel">
              <h3>Notlar</h3>
              {p.quota && <p><b>Kontenjan:</b> {p.quota}</p>}
              {p.notes && <p>{p.notes}</p>}
            </div>
          )}
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <div className="panel">
            <h3>Ücret {profile.nonEU ? "(AB dışı başvuran)" : "(AB vatandaşı)"}</h3>
            <CostBox cost={cost} note={v.costs?.note} />
          </div>
          <div className="panel">
            <h3>Burslar</h3>
            <ScholarshipList items={v.scholarships} />
            {v.nationalScholarships.length > 0 && (
              <>
                <span className="eyebrow" style={{ color: "var(--muted)" }}>Ulusal burslar ({v.country.name})</span>
                <ScholarshipList items={v.nationalScholarships} />
              </>
            )}
            <Link className="small" to={`/burslar?host=${v.country.code}&tr=1`}>{locative(v.country.name)} geçerli bütün burslar →</Link>
          </div>
          <div className="panel">
            <h3>Bağlantılar</h3>
            <ExtLinks links={[...p.links, ...v.uni.links]} />
            <p className="hint">Son doğrulama: {fmt(v.uni.verifiedAt)}</p>
          </div>
        </div>
      </div>
    </>
  );
}
