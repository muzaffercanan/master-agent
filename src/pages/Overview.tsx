import { useMemo } from "react";
import { Link } from "react-router-dom";
import { countries, data, views, viewByKey } from "../state/data";
import { useStore } from "../state/store";
import { buildCalendar } from "../lib/calendar";
import { countdown, fmt, fmtRange, today } from "../lib/dates";
import { nextDeadline } from "../lib/programs";
import { checkRequirements } from "../lib/eligibility";
import { EligBadge, StatusPill } from "../components/bits";

const calendar = buildCalendar(views, countries);

export function OverviewPage() {
  const { shortlist, profile, tracker } = useStore();
  const T = useMemo(today, []);
  const upcoming = calendar.filter(e => {
    const c = countdown(e.s, e.e, T);
    return !c.past && c.days <= 60;
  });
  const slRows = shortlist
    .map(k => viewByKey.get(k))
    .filter((v): v is NonNullable<typeof v> => !!v)
    .map(v => ({ v, next: nextDeadline(v.intakes, T), check: checkRequirements(v.requirements, profile, v.country) }))
    .sort((a, b) => (a.next?.date ?? "9999").localeCompare(b.next?.date ?? "9999"));
  const profileEmpty = profile.gpa == null && profile.ales == null && profile.ielts == null && profile.toefl == null;
  const tr = data.universities.filter(u => u.country === "tr");
  const abroad = data.universities.filter(u => u.country !== "tr");
  const progs = (us: typeof tr) => us.reduce((a, u) => a + u.programs.length, 0);

  return (
    <>
      <header className="page-head" style={{ gap: 14 }}>
        <div className="eyebrow">Yüksek lisans araştırma merkezi · bilgisayar bilimleri</div>
        <h1>Master Atlası</h1>
        <p className="lede">Türkiye ve yurt dışındaki programları tek yerde karşılaştır: dönem dönem başvuru tarihleri, şartlar, ücretler, bölgesel ücretler ve burslar. <span className="pill kesin">kesin</span> yayımlanmış ilan, <span className="pill tahmin">tahmin</span> geçen yılın takvimi.</p>
        <div className="statrail" style={{ maxWidth: 760 }}>
          <div><span className="n">{views.length}</span><span className="l">program</span></div>
          <div><span className="n">{data.universities.length}</span><span className="l">okul</span></div>
          <div><span className="n">{countries.length}</span><span className="l">ülke</span></div>
          <div><span className="n">{shortlist.length}</span><span className="l">kısa listem</span></div>
          <div><span className="n date">{fmt(T)}</span><span className="l">bugün</span></div>
        </div>
      </header>

      <div className="cards">
        <Link className="card" to="/programlar?scope=tr">
          <span className="eyebrow">Türkiye</span>
          <h3>Türkiye programları</h3>
          <span className="small muted">{progs(tr)} program · {tr.length} okul</span>
        </Link>
        <Link className="card" to="/programlar?scope=abroad">
          <span className="eyebrow">Yurt dışı</span>
          <h3>Yurt dışı programları</h3>
          <span className="small muted">{abroad.length ? `${progs(abroad)} program · ${abroad.length} okul` : "Veri ekleniyor: Almanya, İtalya, Avusturya"}</span>
        </Link>
        <Link className="card" to="/programlar?elig=ok">
          <span className="eyebrow">Profil</span>
          <h3>Profilime uyanlar</h3>
          <span className="small muted">{profileEmpty ? "Önce profilini doldur" : `${views.filter(v => checkRequirements(v.requirements, profile, v.country).overall === "ok").length} program şartlarını karşılıyor`}</span>
        </Link>
        <Link className="card" to="/takip">
          <span className="eyebrow">Başvurular</span>
          <h3>Takip</h3>
          <span className="small muted">{Object.keys(tracker).length} program takipte</span>
        </Link>
      </div>

      {profileEmpty && (
        <div className="callout">Uygunluk etiketlerinin çalışması için <Link to="/profil">profilini</Link> doldur: GNO, ALES, IELTS/TOEFL/YDS, GRE ve ders kredilerin.</div>
      )}

      <div className="detail">
        <div className="panel">
          <h3>Önümüzdeki 60 gün</h3>
          {upcoming.length ? (
            <ul className="reqlist datelist">
              {upcoming.slice(0, 14).map(e => {
                const c = countdown(e.s, e.e, T);
                return (
                  <li key={e.uid}>
                    <span className="rk num">{e.e ? fmtRange(e.s, e.e) : fmt(e.s)}</span>
                    <span><span className="flag">{e.country.flag}</span> {e.href ? <Link to={e.href}>{e.t}</Link> : e.t} <StatusPill k={e.k} /></span>
                    <span className={`deadline${c.soon ? " soon" : ""}`}>{c.text}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="muted small">60 gün içinde kayıtlı tarih yok.</p>
          )}
          <Link to="/takvim">Bütün takvim →</Link>
        </div>
        <div className="panel">
          <h3>Kısa listem</h3>
          {slRows.length ? (
            <ul className="reqlist">
              {slRows.map(({ v, next, check }) => (
                <li key={v.key}>
                  <span className="rk"><span className="flag">{v.country.flag}</span> {v.uni.short}</span>
                  <span>
                    <Link to={`/program/${v.key}`}>{v.program.name}</Link>
                    <span className="small muted"> · {next ? `${next.kind === "deadline" ? "son gün" : "açılış"} ${fmt(next.date)}` : "yaklaşan tarih yok"}</span>
                  </span>
                  <EligBadge s={check.overall} short />
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted small">Programlar listesinde yıldıza basarak kısa liste oluştur.</p>
          )}
        </div>
      </div>
    </>
  );
}
