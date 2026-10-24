import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { countryByCode, data, uniById, views } from "../state/data";
import { useStore } from "../state/store";
import { derive } from "../lib/filters";
import { today, fmt } from "../lib/dates";
import { TYPE_LABEL, LANG_LABEL } from "../lib/text";
import { IntakeList, RequirementList, ScholarshipList } from "../components/details";
import { ExtLinks, StaleBadge } from "../components/bits";
import { ProgramRow } from "../components/ProgramRow";
import { NotFound } from "./NotFound";

export function UniversityPage() {
  const { id } = useParams();
  const uni = id ? uniById.get(id) : undefined;
  const { profile } = useStore();
  const T = useMemo(today, []);
  const rows = useMemo(() => derive(views.filter(v => v.uni.id === id), { profile, fx: data.fx, T }), [id, profile, T]);
  if (!uni) return <NotFound what="Okul" />;
  const country = countryByCode.get(uni.country)!;

  return (
    <>
      <div className="page-head">
        <nav className="crumbs" aria-label="Konum">
          <Link to="/okullar">Okullar</Link>›<Link to={`/ulke/${country.code}`}><span className="flag">{country.flag}</span> {country.name}</Link>›<span>{uni.city}</span>
        </nav>
        <h1>{uni.name}</h1>
        <div className="btnrow">
          <span className="chip">{uni.city}{uni.region ? `, ${uni.region}` : ""}</span>
          <span className="chip">{TYPE_LABEL[uni.type]}</span>
          {uni.languages.map(l => <span key={l} className="chip">{LANG_LABEL[l]}</span>)}
          {uni.rankings.yok && <span className="pill kesin">YÖK {uni.rankings.yok}</span>}
          {uni.rankings.csrankings && <span className="pill na">{uni.rankings.csrankings}</span>}
          {uni.rankings.qs && <span className="pill na">QS {uni.rankings.qs}</span>}
          <StaleBadge verifiedAt={uni.verifiedAt} />
        </div>
      </div>

      <div className="detail">
        <div style={{ display: "grid", gap: 16 }}>
          <div className="panel">
            <h3>Programlar ({uni.programs.length})</h3>
            <div className="plist">{rows.map(d => <ProgramRow key={d.view.key} d={d} />)}</div>
          </div>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <div className="panel">
            <h3>Okul geneli takvim</h3>
            <IntakeList intakes={uni.intakes} country={country} />
          </div>
          {(uni.admissionsSummary || uni.requirements) && (
            <div className="panel">
              <h3>Genel şartlar</h3>
              {uni.requirements && <RequirementList req={uni.requirements} />}
              {uni.admissionsSummary && <p className="small">{uni.admissionsSummary}</p>}
            </div>
          )}
          <div className="panel">
            <h3>Ücret ve burs</h3>
            {uni.fundingSummary && <p className="small">{uni.fundingSummary}</p>}
            <ScholarshipList items={uni.scholarships} />
          </div>
          {uni.people.length > 0 && (
            <div className="panel">
              <h3>Öne çıkan araştırmacılar</h3>
              <ul className="people">{uni.people.map(p => <li key={p}>{p}</li>)}</ul>
              <p className="hint">CSRankings verisi ve bölüm sayfalarından. Başvurmadan önce hâlâ bölümde olduklarını kontrol et.</p>
            </div>
          )}
          <div className="panel">
            <h3>Resmi sayfalar</h3>
            <ExtLinks links={[...uni.links, ...uni.sources]} />
            <p className="hint">Son doğrulama: {fmt(uni.verifiedAt)}</p>
          </div>
        </div>
      </div>
    </>
  );
}
