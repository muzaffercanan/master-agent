import { useMemo } from "react";
import { Link } from "react-router-dom";
import { countries, data, views } from "../state/data";
import { useStore } from "../state/store";
import { buildCalendar } from "../lib/calendar";
import { AYLAR, countdown, daysBetween, fmt, fmtRange, parseD, today, urgency } from "../lib/dates";
import { derive, type Derived } from "../lib/filters";
import { isProfileEmpty } from "../lib/eligibility";
import { Countdown, DeadlineBar, EligBadge, Flag, StatusPill } from "../components/bits";

const calendar = buildCalendar(views, countries);
const HORIZON = 45;

/** Deadlines of one school on one day, shown as a single row. */
interface DueGroup {
  date: string;
  items: Derived[];
}

function groupDue(items: Derived[]): DueGroup[] {
  const by = new Map<string, DueGroup>();
  for (const d of items) {
    const k = `${d.view.uni.id}|${d.next!.date}`;
    const g = by.get(k) ?? { date: d.next!.date, items: [] };
    g.items.push(d);
    by.set(k, g);
  }
  return [...by.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function DueRow({ g, mine }: { g: DueGroup; mine: Set<string> }) {
  const d = g.items.find(x => mine.has(x.view.key)) ?? g.items[0];
  const { view: v, next, check } = d;
  const date = parseD(g.date);
  const u = urgency(daysBetween(today(), date));
  const more = g.items.length - 1;
  return (
    <li className={`due ${u}`}>
      <span className="dbox"><b className="num">{date.getDate()}</b><span>{AYLAR[date.getMonth()].slice(0, 3)}</span></span>
      <span className="dmain">
        <Link className="dname" to={`/program/${v.key}`}>{v.program.name}</Link>
        {mine.has(v.key) && <span className="mine" title="Kısa listende veya takibinde">listemde</span>}
        <span className="dschool">
          <Flag c={v.country} /> <Link to={`/okul/${v.uni.id}`}>{v.uni.short}</Link>
          {more > 0 && <> · <Link to={`/okul/${v.uni.id}`}>{more} program daha</Link></>}
          {next!.intake.status === "tahmin" && <> · <StatusPill k="tahmin" /></>}
        </span>
      </span>
      <span className="dside">
        <EligBadge s={check.overall} short />
        <Countdown e={g.date} />
        <DeadlineBar open={next!.round.open} deadline={g.date} />
      </span>
    </li>
  );
}

export function OverviewPage() {
  const { shortlist, profile, tracker } = useStore();
  const T = useMemo(today, []);
  const all = useMemo(() => derive(views, { profile, fx: data.fx, T }), [profile, T]);
  const mine = useMemo(() => new Set([...shortlist, ...Object.keys(tracker)]), [shortlist, tracker]);

  const due = all.filter(d => d.next?.kind === "deadline" && daysBetween(T, parseD(d.next.date)) <= HORIZON);
  const dueGroups = groupDue(due);
  const urgentCount = due.filter(d => daysBetween(T, parseD(d.next!.date)) <= 21).length;
  const empty = isProfileEmpty(profile);
  const okCount = all.filter(d => d.check.overall === "ok").length;

  const general = calendar.filter(e => {
    if (e.kind !== "general") return false;
    const c = countdown(e.s, e.e, T);
    return !c.past && c.days <= 90;
  });
  const tracked = Object.entries(tracker)
    .map(([k, e]) => ({ k, e, d: all.find(x => x.view.key === k) }))
    .filter((x): x is typeof x & { d: Derived } => !!x.d)
    .sort((a, b) => (a.d.next?.date ?? "9999").localeCompare(b.d.next?.date ?? "9999"));
  const slRows = shortlist
    .filter(k => !tracker[k])
    .map(k => all.find(x => x.view.key === k))
    .filter((d): d is Derived => !!d)
    .sort((a, b) => (a.next?.date ?? "9999").localeCompare(b.next?.date ?? "9999"));

  const tr = data.universities.filter(u => u.country === "tr");
  const abroad = data.universities.filter(u => u.country !== "tr");
  const progs = (us: typeof tr) => us.reduce((a, u) => a + u.programs.length, 0);

  return (
    <>
      <header className="page-head">
        <div className="eyebrow">Bugün · {fmt(T)}</div>
        <h1>Bugün</h1>
        <p className="lede">
          {urgentCount ? <>Önümüzdeki 21 günde <b>{urgentCount} programın</b> başvurusu kapanıyor. </> : <>Önümüzdeki 21 günde kapanan başvuru yok. </>}
          {tracked.length ? `${tracked.length} program takibinde.` : "Henüz takibe aldığın program yok."}
        </p>
        <div className="statrail">
          <div><span className="n hot">{urgentCount}</span><span className="l">21 günde kapanan</span></div>
          <div><span className="n">{due.length}</span><span className="l">{HORIZON} günde kapanan</span></div>
          <div><span className="n">{empty ? "—" : okCount}</span><span className="l">{empty ? "profil boş" : "profiline uyan"}</span></div>
          <div><span className="n">{Object.keys(tracker).length}</span><span className="l">takipte</span></div>
          <div><span className="n">{shortlist.length}</span><span className="l">kısa listem</span></div>
        </div>
      </header>

      <div className="detail">
        <div className="panel">
          <div className="panel-head"><h3>Kapanmak üzere</h3><span className="hint">{HORIZON} gün içinde, okula göre gruplu</span></div>
          {dueGroups.length ? (
            <ul className="duelist">{dueGroups.slice(0, 12).map(g => <DueRow key={g.items[0].view.uni.id + g.date} g={g} mine={mine} />)}</ul>
          ) : (
            <p className="muted small">{HORIZON} gün içinde kapanan başvuru yok.</p>
          )}
          <Link to="/programlar?due=45">Bütün yaklaşan son günler →</Link>
        </div>

        <div className="stack">
          <div className="panel">
            <div className="panel-head"><h3>Takibim</h3><Link className="small" to="/takip">Takip panosu →</Link></div>
            {tracked.length ? (
              <ul className="reqlist">
                {tracked.map(({ k, e, d }) => (
                  <li key={k}>
                    <span className="rk"><span className="tstatus">{e.status}</span></span>
                    <span><Link to={`/program/${k}`}>{d.view.program.name}</Link><span className="small muted"> · <Flag c={d.view.country} /> {d.view.uni.short}</span></span>
                    {d.next ? <Countdown s={d.next.kind === "open" ? d.next.date : undefined} e={d.next.kind === "deadline" ? d.next.date : undefined} /> : <span className="muted small">tarih yok</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted small">Programlar listesinde "Takibe al" ile başvurularını buradan izle.</p>
            )}
          </div>

          <div className="panel">
            <div className="panel-head"><h3>Kısa listem</h3><Link className="small" to="/programlar?sl=1">Listede aç →</Link></div>
            {slRows.length ? (
              <ul className="reqlist">
                {slRows.map(d => (
                  <li key={d.view.key}>
                    <span className="rk"><Flag c={d.view.country} /> {d.view.uni.short}</span>
                    <span>
                      <Link to={`/program/${d.view.key}`}>{d.view.program.name}</Link>
                      <span className="small muted"> · {d.next ? `${d.next.kind === "deadline" ? "son gün" : "açılış"} ${fmt(d.next.date)}` : "yaklaşan tarih yok"}</span>
                    </span>
                    <EligBadge s={d.check.overall} short />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted small">{shortlist.length ? "Kısa listendeki programların hepsi takipte." : "Programlar listesinde yıldıza basarak kısa liste oluştur."}</p>
            )}
          </div>

          <div className="panel">
            <div className="panel-head"><h3>Sınavlar ve burslar</h3><span className="hint">90 gün</span></div>
            {general.length ? (
              <ul className="reqlist datelist">
                {general.slice(0, 8).map(e => {
                  const c = countdown(e.s, e.e, T);
                  return (
                    <li key={e.uid}>
                      <span className="rk num">{e.e ? fmtRange(e.s, e.e) : fmt(e.s)}</span>
                      <span><Flag c={e.country} /> {e.href ? <Link to={e.href}>{e.t}</Link> : e.t} <StatusPill k={e.k} /></span>
                      <span className={`deadline${c.soon ? " soon" : ""}`}>{c.text}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="muted small">90 gün içinde kayıtlı sınav veya burs tarihi yok.</p>
            )}
            <Link to="/takvim">Bütün takvim →</Link>
          </div>
        </div>
      </div>

      <div className="cards">
        <Link className="card" to="/programlar?scope=tr">
          <span className="eyebrow">Türkiye</span>
          <h3>Türkiye programları</h3>
          <span className="small muted">{progs(tr)} program · {tr.length} okul</span>
        </Link>
        <Link className="card" to="/programlar?scope=abroad">
          <span className="eyebrow">Yurt dışı</span>
          <h3>Yurt dışı programları</h3>
          <span className="small muted">{progs(abroad)} program · {abroad.length} okul</span>
        </Link>
        <Link className="card" to={empty ? "/profil" : "/programlar?elig=ok"}>
          <span className="eyebrow">Profil</span>
          <h3>Profilime uyanlar</h3>
          <span className="small muted">{empty ? "Önce profilini doldur" : `${okCount} program şartlarını karşılıyor`}</span>
        </Link>
        <Link className="card" to="/takvim">
          <span className="eyebrow">Takvim</span>
          <h3>Bütün tarihler</h3>
          <span className="small muted">{calendar.length} olay · takvime aktarılabilir</span>
        </Link>
      </div>
    </>
  );
}
