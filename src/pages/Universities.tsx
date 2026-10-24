import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { countries, data } from "../state/data";
import { norm, TYPE_LABEL } from "../lib/text";
import { StaleBadge, TermTags, WorldRank } from "../components/bits";

export function UniversitiesPage() {
  const [sp, setSp] = useSearchParams();
  const c = sp.get("c") ?? "";
  const q = sp.get("q") ?? "";
  const set = (k: string, v: string) => {
    const n = new URLSearchParams(sp);
    if (v) n.set(k, v);
    else n.delete(k);
    setSp(n, { replace: true });
  };
  const list = useMemo(
    () => data.universities.filter(u => (!c || u.country === c) && (!q || norm(`${u.name} ${u.short} ${u.city} ${u.region ?? ""}`).includes(norm(q)))),
    [c, q],
  );

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Okul okul</div>
        <h1>Okullar</h1>
        <p className="lede">Ülke ve şehre göre gruplu. Okula tıkla: bütün programları, genel şartları, takvimi, ücret ve bursları tek sayfada.</p>
      </div>
      <div className="toolbar">
        <div className="chips">
          <button type="button" className="chipbtn" aria-pressed={!c} onClick={() => set("c", "")}>Tümü <span className="n">{data.universities.length}</span></button>
          {countries.map(k => (
            <button key={k.code} type="button" className="chipbtn" aria-pressed={c === k.code} onClick={() => set("c", k.code)}>
              <span className="flag">{k.flag}</span> {k.name} <span className="n">{data.universities.filter(u => u.country === k.code).length}</span>
            </button>
          ))}
        </div>
        <input type="search" placeholder="Okul veya şehir ara…" value={q} onChange={e => set("q", e.target.value)} className="push" aria-label="Okul ara" />
      </div>

      {countries.filter(k => list.some(u => u.country === k.code)).map(k => {
        const inC = list.filter(u => u.country === k.code);
        const cities = [...new Set(inC.map(u => u.city))];
        return (
          <section key={k.code} className="country-group">
            <div className="city-title"><h3><span className="flag">{k.flag}</span> {k.name}</h3><span className="eyebrow">{inC.length} okul</span></div>
            {cities.map(city => (
              <div key={city} className="city-group">
                <span className="eyebrow" style={{ color: "var(--muted)" }}>{city}</span>
                <div className="cards">
                  {inC.filter(u => u.city === city).map(u => (
                    <Link key={u.id} to={`/okul/${u.id}`} className="card">
                      <h3>{u.short}</h3>
                      <span className="small muted">{u.name}</span>
                      <div className="btnrow">
                        <span className="chip">{TYPE_LABEL[u.type]}</span>
                        <span className="chip">{u.programs.length} program</span>
                        <WorldRank r={u.rankings.theWorld} />
                        {u.rankings.yok && <span className="pill kesin">YÖK {u.rankings.yok}</span>}
                        {u.rankings.theCs && <span className="pill na">THE CS {u.rankings.theCs.rank}</span>}
                      </div>
                      <TermTags intakes={u.intakes} labels={k.terms} />
                      <StaleBadge verifiedAt={u.verifiedAt} />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        );
      })}
      {!list.length && <div className="empty">Eşleşen okul yok.</div>}
    </>
  );
}
