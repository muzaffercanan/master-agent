import { useEffect, useState, type FormEvent } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { dataErrors } from "../data";
import { useStore } from "../state/store";
import { views } from "../state/data";
import { isProfileEmpty } from "../lib/eligibility";

const SUN = "M12 2.6v2M12 19.4v2M2.6 12h2M19.4 12h2M5.4 5.4l1.4 1.4M17.2 17.2l1.4 1.4M18.6 5.4l-1.4 1.4M6.8 17.2l-1.4 1.4";

function useTheme() {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const read = () => {
    const a = document.documentElement.getAttribute("data-theme");
    return a === "dark" || (a !== "light" && media.matches);
  };
  const [dark, setDark] = useState(read);
  useEffect(() => {
    const fn = () => setDark(read());
    media.addEventListener("change", fn);
    return () => media.removeEventListener("change", fn);
  });
  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("mla_theme", next);
    } catch {
      /* ignore */
    }
    setDark(!dark);
  };
  return { dark, toggle };
}

export function Layout() {
  const { shortlist, compare, tracker, profile } = useStore();
  const [bandHidden, setBandHidden] = useState(false);
  const { dark, toggle } = useTheme();
  const nav = useNavigate();
  const loc = useLocation();
  const [q, setQ] = useState("");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc.pathname]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    nav(`/programlar${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
  };
  const n = (x: number) => (x ? <span className="n">{x}</span> : null);

  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <Link to="/" className="brand"><span className="mark">MA</span><span className="full">Master Atlası</span></Link>
          <nav className="mainnav" aria-label="Ana menü">
            <NavLink to="/" end>Bugün</NavLink>
            <NavLink to="/programlar">Programlar</NavLink>
            <NavLink to="/okullar">Okullar</NavLink>
            <NavLink to="/ulkeler">Ülkeler</NavLink>
            {/* a scholarship's own page (/burs/:id) keeps this tab lit */}
            <NavLink to="/burslar" className={({ isActive }) => (isActive || loc.pathname.startsWith("/burs/") ? "active" : "")}>Burslar</NavLink>
            <NavLink to="/takvim">Takvim</NavLink>
            <NavLink to="/rankingler">Rankingler</NavLink>
            <NavLink to="/karsilastir">Karşılaştır{n(compare.length)}</NavLink>
            {/* the to-do list lives under Takip, so it keeps this tab lit */}
            <NavLink to="/takip" className={({ isActive }) => (isActive || loc.pathname === "/yapilacaklar" ? "active" : "")}>Takip{n(Object.keys(tracker).length)}</NavLink>
            <NavLink to="/profil">Profil</NavLink>
          </nav>
          <form className="searchbox" onSubmit={submit} role="search">
            <span className="ico" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg></span>
            <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Program, okul, şehir ara…" aria-label="Program ara" />
          </form>
          <Link className="iconbtn" to="/programlar?sl=1" title="Kısa listem" aria-label={`Kısa listem (${shortlist.length})`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M12 3.6l2.6 5.3 5.9.85-4.25 4.15 1 5.9L12 17l-5.25 2.8 1-5.9L3.5 9.75l5.9-.85z" /></svg>
            <span className="n">{shortlist.length}</span>
          </Link>
          <button className="iconbtn" type="button" onClick={toggle} aria-label={dark ? "Açık temaya geç" : "Koyu temaya geç"} title={dark ? "Açık temaya geç" : "Koyu temaya geç"}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {dark ? <><circle cx="12" cy="12" r="4.2" /><path d={SUN} /></> : <path d="M20 14.2A8.4 8.4 0 019.8 4 8.4 8.4 0 1020 14.2z" />}
            </svg>
          </button>
        </div>
      </div>
      {isProfileEmpty(profile) && !bandHidden && loc.pathname !== "/profil" && (
        <div className="profile-band">
          <div className="wrap">
            <p>Profilin boş, bu yüzden programlarda <b>Eksik bilgi</b> görünüyor. GNO ve dil puanını gir; {views.length} programın hangisine uyduğunu gör.</p>
            <div className="btnrow">
              <Link className="btn sm primary" to="/profil">Profili doldur</Link>
              <button type="button" className="btn sm ghost" onClick={() => setBandHidden(true)}>Şimdilik gizle</button>
            </div>
          </div>
        </div>
      )}
      {dataErrors.length > 0 && (
        <div className="data-errors" role="alert">
          <div className="wrap">
            <b>Veri doğrulama hataları ({dataErrors.length}).</b> Hatalı kayıtlar gösterilmiyor; düzeltmek için <code>npm run check</code> çalıştır.
            <ul>{dataErrors.slice(0, 8).map(e => <li key={e}>{e}</li>)}</ul>
          </div>
        </div>
      )}
      <main className="wrap page">
        <Outlet />
      </main>
    </>
  );
}
