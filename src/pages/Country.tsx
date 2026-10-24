import { Link, useParams } from "react-router-dom";
import { countries, countryByCode, data } from "../state/data";
import { useStore } from "../state/store";
import { bavarian } from "../lib/eligibility";
import { fmt } from "../lib/dates";
import { ExtLinks, MoneyText, StaleBadge, StatusPill } from "../components/bits";
import { ScholarshipList } from "../components/details";
import { Timeline } from "../components/Timeline";
import { TurkeyGuide } from "../content/TurkeyGuide";
import { NotFound } from "./NotFound";

export function CountriesPage() {
  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Ülke rehberleri</div>
        <h1>Ülkeler</h1>
        <p className="lede">Her ülkenin dönem sistemi, ücret kuralları, bölgesel ücretler, ulusal burslar ve not dönüşümü.</p>
      </div>
      <div className="cards">
        {countries.map(c => {
          const unis = data.universities.filter(u => u.country === c.code);
          return (
            <Link key={c.code} to={`/ulke/${c.code}`} className="card">
              <h3>{c.flag} {c.name}</h3>
              <span className="big">{unis.reduce((a, u) => a + u.programs.length, 0)}</span>
              <span className="small muted">program · {unis.length} okul</span>
              <p className="small">{c.summary}</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export function CountryPage() {
  const { code } = useParams();
  const c = code ? countryByCode.get(code) : undefined;
  const { profile } = useStore();
  if (!c) return <NotFound what="Ülke" />;
  const unis = data.universities.filter(u => u.country === c.code);
  const gc = c.gpaConversion;

  return (
    <>
      <div className="page-head">
        <nav className="crumbs"><Link to="/ulkeler">Ülkeler</Link></nav>
        <h1>{c.flag} {c.name}</h1>
        <p className="lede">{c.summary}</p>
        <div className="btnrow">
          <Link className="btn primary" to={`/programlar?country=${c.code}`}>{unis.reduce((a, u) => a + u.programs.length, 0)} programı listele</Link>
          <Link className="btn" to={`/okullar?c=${c.code}`}>{unis.length} okul</Link>
          <StaleBadge verifiedAt={c.verifiedAt} />
        </div>
      </div>

      <div className="detail">
        <div style={{ display: "grid", gap: 16 }}>
          {c.facts.length > 0 && (
            <div className="panel">
              <h3>Temel bilgiler</h3>
              <dl className="kvgrid">
                {c.facts.map(f => (
                  <div key={f.label} style={{ display: "contents" }}>
                    <dt>{f.label}</dt>
                    <dd>{f.value} {f.status === "tahmin" && <StatusPill k="tahmin" />}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          {c.timeline.length > 0 && (
            <div className="panel">
              <h3>Takvim</h3>
              <Timeline events={c.timeline.map(e => ({ ...e, country: c }))} compact />
            </div>
          )}
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <div className="panel">
            <h3>Dönemler</h3>
            <dl className="kvgrid">
              {Object.entries(c.terms).map(([k, t]) => (
                <div key={k} style={{ display: "contents" }}>
                  <dt>{t.name}</dt>
                  <dd>{t.starts}'de başlar</dd>
                </div>
              ))}
            </dl>
          </div>
          {gc && (
            <div className="panel">
              <h3>Not dönüşümü <StatusPill k={gc.status} /></h3>
              <p className="small">Bavyera formülü: not = 1 + 3 × ({gc.nMax} − GNO) / ({gc.nMax} − {gc.nMin})</p>
              {profile.gpa != null && profile.gpaScale === 4 ? (
                <p>Senin GNO'n <b className="num">{profile.gpa.toFixed(2)}</b> → <b className="num">{bavarian(profile.gpa, gc.nMax, gc.nMin).toFixed(2)}</b> (1.0 en iyi, 4.0 geçer)</p>
              ) : (
                <p className="hint">Kendi notunu görmek için <Link to="/profil">profiline</Link> GNO gir.</p>
              )}
              <p className="small muted">{gc.note}</p>
            </div>
          )}
          {c.regionalFees.length > 0 && (
            <div className="panel">
              <h3>Bölgesel / eyalet ücretleri</h3>
              {c.regionalFees.map(r => (
                <div key={r.region} className="small">
                  <b>{r.region}</b>: <MoneyText m={r.fee} /> {r.appliesTo === "non-eu" ? "(AB dışı öğrenciler)" : ""} <StatusPill k={r.status} />
                  {r.note && <div className="muted">{r.note}</div>}
                </div>
              ))}
            </div>
          )}
          <div className="panel">
            <h3>Ulusal burslar</h3>
            <ScholarshipList items={c.scholarships} />
          </div>
          {c.sources.length > 0 && (
            <div className="panel">
              <h3>Kaynaklar</h3>
              <ExtLinks links={c.sources} />
              <p className="hint">Son doğrulama: {fmt(c.verifiedAt)}</p>
            </div>
          )}
        </div>
      </div>
      {c.code === "tr" && <TurkeyGuide />}
    </>
  );
}
