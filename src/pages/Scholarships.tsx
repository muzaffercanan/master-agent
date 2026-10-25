import { useMemo, useState, type ReactNode } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { countries, countryByCode, data, fundingById } from "../state/data";
import { useStore } from "../state/store";
import type { FundedProgram, Funding, FundingCall } from "../schema";
import {
  BLOCKED_LABEL, CATEGORY_LABEL, CATEGORY_ORDER, CS_LABEL, DEFAULT_FUNDING_FILTERS, LEVEL_LABEL, PROGRAM_SCHOL_LABEL, TUITION_LABEL, TURKISH_LABEL,
  eurPerMonth, fundingCheck, hostsOf, matchFunding, nextCall, parseFundingFilters, serializeFundingFilters, sortFundings, type FundingFilters,
} from "../lib/scholarships";
import { isProfileEmpty } from "../lib/eligibility";
import { fmt, fmtRange, today } from "../lib/dates";
import { fmtAmount, fmtMoney, perYear, convert } from "../lib/money";
import { countryName } from "../lib/text";
import { Countdown, EligBadge, ExtLinks, Flag, StaleBadge, StatusPill } from "../components/bits";
import { RequirementList } from "../components/details";
import { NotFound } from "./NotFound";

/** Study countries as names, with the SVG flag for the four researched countries. */
function Hosts({ codes, max = 99 }: { codes: string[]; max?: number }) {
  const shown = codes.slice(0, max);
  return (
    <span className="hosts">
      {shown.map((c, i) => {
        const country = countryByCode.get(c);
        return (
          <span key={c}>
            {i > 0 && ", "}
            {country && <><Flag c={country} /> </>}
            {countryName(c)}
          </span>
        );
      })}
      {codes.length > max && <span className="muted"> +{codes.length - max}</span>}
    </span>
  );
}

function Stipend({ f }: { f: { stipend?: Funding["stipend"] } }) {
  if (!f.stipend) return <span className="muted">Aylık tutar yok</span>;
  const eur = f.stipend.currency !== "EUR" ? eurPerMonth(f.stipend, data.fx) : null;
  return (
    <span>
      <b className="num">{fmtMoney(f.stipend)}</b>
      {eur != null && <span className="muted small num"> ≈ {fmtAmount(Math.round(eur), "EUR")}/ay</span>}
    </span>
  );
}

const BA_TONE: Record<Funding["blockedAccount"], string> = { replaces: "ok", partial: "near", no: "bad", unknown: "na", na: "na" };

function NextDate({ f }: { f: Funding }) {
  const n = nextCall(f, today());
  if (!n) return <span className="muted">Yaklaşan tarih yok</span>;
  return (
    <span className="when">
      <span className="num">{n.kind === "deadline" ? "son gün " : "açılış "}{fmt(n.date)}</span>
      {n.program && <span className="muted"> · {n.program.short}</span>}
      {n.call.status === "tahmin" && <> <StatusPill k="tahmin" /></>}
      <Countdown s={n.kind === "open" ? n.date : undefined} e={n.kind === "deadline" ? n.date : undefined} />
    </span>
  );
}

function FundingRow({ f }: { f: Funding }) {
  const { profile } = useStore();
  const check = fundingCheck(f, profile);
  const funded = f.programs.filter(p => p.scholarships === "yes").length;
  return (
    <article className="prow">
      <div className="prow-head">
        <div className="title">
          <Link className="pname" to={`/burs/${f.id}`}>{f.name}</Link>
          <span className="school">{f.provider}</span>
          <span className="meta">
            <span>{LEVEL_LABEL[f.level]}</span>
            <span><Hosts codes={hostsOf(f)} max={4} /></span>
            {f.programs.length > 0 && <span>{f.programs.length} program{funded ? `, ${funded} burslu` : ""}</span>}
          </span>
        </div>
        <div className="acts">
          {f.turkish === "no" && <span className="pill bad">Türk vatandaşına kapalı</span>}
          {f.turkish === "conditional" && <span className="pill near">Uygunluk doğrulanmadı</span>}
          {f.cs === "no" && <span className="pill bad">Teknik CS YL'si kapsam dışı</span>}
          {check.overall !== "none" && <EligBadge s={check.overall} short />}
        </div>
      </div>
      <div className="prow-facts">
        <div className="fact"><span className="k">Para</span><Stipend f={f} /></div>
        <div className="fact"><span className="k">Öğrenim ücreti</span><span>{TUITION_LABEL[f.tuition]}</span></div>
        <div className="fact"><span className="k">Bloke hesap</span><span className={`ba ${BA_TONE[f.blockedAccount]}`}>{BLOCKED_LABEL[f.blockedAccount]}</span></div>
        <div className="fact"><span className="k">Sıradaki tarih</span><NextDate f={f} /></div>
      </div>
    </article>
  );
}

export function ScholarshipsPage() {
  const [sp, setSp] = useSearchParams();
  const ff = parseFundingFilters(sp);
  const set = (patch: Partial<FundingFilters>) => setSp(serializeFundingFilters({ ...ff, ...patch }), { replace: true });
  const T = useMemo(today, []);
  const { profile } = useStore();

  const shown = data.fundings.filter(f => matchFunding(f, ff, T));
  const countFor = (cat: FundingFilters["cat"]) => data.fundings.filter(f => matchFunding(f, { ...ff, cat }, T)).length;
  const hostOptions = [...new Set(data.fundings.flatMap(hostsOf))].sort((a, b) => countryName(a).localeCompare(countryName(b), "tr"));
  const groups = CATEGORY_ORDER.map(cat => ({ cat, items: sortFundings(shown.filter(f => f.category === cat), data.fx) })).filter(g => g.items.length);
  const emPrograms = data.fundings.reduce((a, f) => a + f.programs.length, 0);
  const active = JSON.stringify(ff) !== JSON.stringify(DEFAULT_FUNDING_FILTERS);
  const checks: [keyof FundingFilters, string][] = [
    ["full", "Tam burs (ücret ve yaşam gideri)"],
    ["ba", "Bloke hesabın yerine geçer"],
    ["cs", "Bilgisayar YL'si için uygun"],
    ["tr", "Türk vatandaşına açık"],
    ["open", "Yaklaşan başvuru tarihi var"],
  ];

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Burs ve finansman</div>
        <h1>Burslar</h1>
        <p className="lede">
          {data.fundings.length} burs kaydı ve bunların altında {emPrograms} program. Her kayıt resmî kaynaktan kontrol edildi; kaynak ve tarih kayıt sayfasında. Bir tarih ilan edilmemişse <StatusPill k="tahmin" /> etiketi taşır.
        </p>
        <div className="btnrow">
          <Link className="btn primary" to="/burslar/bloke-hesap">Bloke hesap ve geçim kanıtı</Link>
          <Link className="btn" to="/burs/erasmus-mundus">Erasmus Mundus programları</Link>
          <Link className="btn" to="/takvim?kind=scholarship">Burs takvimi</Link>
        </div>
      </div>

      <div className="toolbar fund-toolbar">
        <input type="search" value={ff.q} onChange={e => set({ q: e.target.value })} placeholder="Burs, kurum veya program ara…" aria-label="Burslarda ara" />
        <div className="chips" role="group" aria-label="Kategori">
          <button type="button" className="chipbtn" aria-pressed={!ff.cat} onClick={() => set({ cat: "" })}>Hepsi <span className="n">{countFor("")}</span></button>
          {CATEGORY_ORDER.map(c => (
            <button key={c} type="button" className="chipbtn" aria-pressed={ff.cat === c} onClick={() => set({ cat: c })}>
              {CATEGORY_LABEL[c].name} <span className="n">{countFor(c)}</span>
            </button>
          ))}
        </div>
        <div className="fund-checks">
          {checks.map(([k, label]) => (
            <label key={k} className="check"><input type="checkbox" checked={ff[k] as boolean} onChange={e => set({ [k]: e.target.checked } as Partial<FundingFilters>)} /> {label}</label>
          ))}
        </div>
        <div className="field fund-host">
          <label htmlFor="fund-host">Okuyacağın ülke</label>
          <select id="fund-host" value={ff.host} onChange={e => set({ host: e.target.value })}>
            <option value="">Hepsi</option>
            {hostOptions.map(c => <option key={c} value={c}>{countryName(c)}</option>)}
          </select>
        </div>
        {active && <button type="button" className="btn sm ghost push" onClick={() => setSp(new URLSearchParams(), { replace: true })}>Filtreleri temizle</button>}
      </div>

      {isProfileEmpty(profile) && <p className="hint">GNO ve ALES şartı olan burslarda uygunluk etiketi görmek için <Link to="/profil">profilini</Link> doldur.</p>}

      {groups.length ? (
        groups.map(g => (
          <section key={g.cat} className="fund-group" aria-labelledby={`fg-${g.cat}`}>
            <div className="fund-group-head">
              <h2 id={`fg-${g.cat}`}>{CATEGORY_LABEL[g.cat].name}</h2>
              <p className="small muted">{CATEGORY_LABEL[g.cat].desc}</p>
            </div>
            <div className="plist">{g.items.map(f => <FundingRow key={f.id} f={f} />)}</div>
          </section>
        ))
      ) : (
        <p className="empty">Bu filtrelere uyan burs yok.</p>
      )}

      <p className="hint">
        Avusturya için ayrı bir kayıt yok: Türk vatandaşlarına açık genel bir yüksek lisans bursu bulunamadı ve Avusturya burs veritabanı (grants.at) araştırma sırasında açılmadı. Avusturya'da burslu okumanın görünen yolu Erasmus Mundus (ör. DEAI'nin TU Wien dönemi, CDE'nin Salzburg dönemi).
      </p>
    </>
  );
}

function CallList({ calls }: { calls: { call: FundingCall; program?: FundedProgram }[] }) {
  if (!calls.length) return <p className="muted small">Bu kayıt için ilan edilmiş başvuru tarihi yok.</p>;
  return (
    <ul className="reqlist datelist">
      {calls.map(({ call, program }, i) => (
        <li key={i}>
          <span className="rk">{call.open || call.deadline ? fmtRange(call.open, call.deadline) : "tarih yok"}</span>
          <span>
            {program && <b>{program.short} · </b>}
            {call.cycle}{call.name ? ` · ${call.name}` : ""} <StatusPill k={call.status} />
            {call.note && <span className="small muted" style={{ display: "block" }}>{call.note}</span>}
          </span>
          {(call.open || call.deadline) ? <Countdown s={call.open} e={call.deadline} /> : <span />}
        </li>
      ))}
    </ul>
  );
}

const fieldShort = (k: string) => data.fields[k]?.n.split(" / ")[0] ?? k;

function ProgramTable({ f }: { f: Funding }) {
  const [field, setField] = useState("");
  const [onlyFunded, setOnlyFunded] = useState(false);
  const T = today();
  const fieldKeys = [...new Set(f.programs.flatMap(p => p.fields))];
  const rows = f.programs.filter(p => (!field || p.fields.includes(field)) && (!onlyFunded || p.scholarships === "yes"));
  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Programlar ({f.programs.length})</h3>
        <span className="hint">Bilgisayar bilimiyle ilgili olanlar; ortak okullar ve 2027 alımı</span>
      </div>
      <div className="btnrow">
        <div className="chips" role="group" aria-label="Alan">
          <button type="button" className="chipbtn" aria-pressed={!field} onClick={() => setField("")}>Tüm alanlar</button>
          {fieldKeys.map(k => <button key={k} type="button" className="chipbtn" aria-pressed={field === k} onClick={() => setField(k)}>{fieldShort(k)}</button>)}
        </div>
        <label className="check"><input type="checkbox" checked={onlyFunded} onChange={e => setOnlyFunded(e.target.checked)} /> Yalnızca 2027'de burslu olanlar</label>
      </div>
      <div className="tbl-wrap">
        <table className="ptable">
          <thead>
            <tr><th>Program</th><th>Nerede</th><th>2027 bursu</th><th>Başvuru</th><th>Bursuz ücret</th></tr>
          </thead>
          <tbody>
            {rows.map(p => {
              const n = nextCall({ ...f, calls: [], programs: [p] }, T);
              return (
                <tr key={p.id}>
                  <td>
                    <a href={p.link} target="_blank" rel="noopener noreferrer"><b>{p.short}</b></a>
                    <span className="sub">{p.name}</span>
                    <span className="sub">{p.fields.map(fieldShort).join(", ")}</span>
                  </td>
                  <td>
                    <Hosts codes={p.countries} />
                    <span className="sub">{p.partners}</span>
                  </td>
                  <td className="nowrap"><span className={`pill ${p.scholarships === "yes" ? "ok" : p.scholarships === "no" ? "bad" : "na"}`}>{PROGRAM_SCHOL_LABEL[p.scholarships]}</span></td>
                  <td>
                    {p.calls.length ? (
                      p.calls.map((c, i) => (
                        <span key={i} className="sub num" style={{ marginTop: i ? 4 : 0, color: "var(--ink-2)" }}>
                          {c.name ? `${c.name}: ` : ""}{fmtRange(c.open, c.deadline)} {c.status === "tahmin" && <StatusPill k="tahmin" />}
                        </span>
                      ))
                    ) : (
                      <span className="muted small">Tarih yok</span>
                    )}
                    {n && <Countdown s={n.kind === "open" ? n.date : undefined} e={n.kind === "deadline" ? n.date : undefined} />}
                    {p.note && <span className="sub">{p.note}</span>}
                  </td>
                  <td className="nowrap num">{p.selfFundedFee ? fmtMoney(p.selfFundedFee) : <span className="muted">—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!rows.length && <p className="muted small">Bu seçime uyan program yok.</p>}
    </div>
  );
}

export function ScholarshipPage() {
  const { id } = useParams();
  const f = id ? fundingById.get(id) : undefined;
  const { profile } = useStore();
  if (!f) return <NotFound what="Burs" />;
  const check = fundingCheck(f, profile);
  const ownCalls = f.calls.map(call => ({ call }));
  const rows: [string, ReactNode][] = [
    ["Kim veriyor", f.provider],
    ["Nerede okursun", <><Hosts codes={hostsOf(f)} />{f.hostNote && <span className="small muted" style={{ display: "block" }}>{f.hostNote}</span>}</>],
    ["Burs türü", LEVEL_LABEL[f.level]],
    ["Öğrenim ücreti", <>{TUITION_LABEL[f.tuition]}{f.tuitionNote && <span className="small muted" style={{ display: "block" }}>{f.tuitionNote}</span>}</>],
    ["Para", <><Stipend f={f} />{f.stipendNote && <span className="small muted" style={{ display: "block" }}>{f.stipendNote}</span>}</>],
  ];
  if (f.extras.length) rows.push(["Ek destekler", f.extras.join(" · ")]);
  if (f.ageMax) rows.push(["Yaş sınırı", `en fazla ${f.ageMax}`]);
  if (f.obligation) rows.push(["Yükümlülük", f.obligation]);

  return (
    <>
      <div className="page-head">
        <nav className="crumbs" aria-label="Konum"><Link to="/burslar">Burslar</Link>›<Link to={`/burslar?cat=${f.category}`}>{CATEGORY_LABEL[f.category].name}</Link></nav>
        <h1>{f.name}</h1>
        <p className="lede">{f.summary}</p>
        <div className="btnrow">
          <span className="chip">{LEVEL_LABEL[f.level]}</span>
          <span className={`pill ${f.turkish === "yes" ? "ok" : f.turkish === "no" ? "bad" : "near"}`}>{TURKISH_LABEL[f.turkish]}</span>
          <span className={`pill ${f.cs === "yes" ? "ok" : f.cs === "no" ? "bad" : "near"}`}>{CS_LABEL[f.cs]}</span>
          <StaleBadge verifiedAt={f.verifiedAt} />
        </div>
      </div>

      <div className="detail">
        <div className="stack">
          <div className="panel">
            <h3>Ne veriyor</h3>
            <dl className="kvgrid">
              {rows.map(([k, v]) => (
                <div key={k} style={{ display: "contents" }}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          {(ownCalls.length > 0 || !f.programs.length) && (
            <div className="panel">
              <h3>Başvuru takvimi</h3>
              <CallList calls={ownCalls} />
            </div>
          )}
          {f.howToApply.length > 0 && (
            <div className="panel">
              <h3>Nasıl başvurulur</h3>
              <ol className="steps">{f.howToApply.map((s, i) => <li key={i}>{s}</li>)}</ol>
            </div>
          )}
          {f.notes.length > 0 && (
            <div className="panel">
              <h3>Dikkat</h3>
              <ul className="steps">{f.notes.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
          )}
        </div>

        <div className="stack">
          <div className="panel">
            <div className="panel-head">
              <h3>Senin için</h3>
              {check.overall !== "none" && <EligBadge s={check.overall} />}
            </div>
            {f.requirements ? <RequirementList req={f.requirements} check={check} /> : <p className="muted small">Bu burs için ayrıca not veya sınav şartı kaydedilmedi; programın kendi şartlarına bak.</p>}
            {f.csNote && <p className="small"><b>Alan:</b> {f.csNote}</p>}
            {isProfileEmpty(profile) && f.requirements && <p className="hint">Uygunluk için <Link to="/profil">profilini</Link> doldur.</p>}
          </div>
          <div className="panel">
            <h3>Bloke hesap / geçim kanıtı</h3>
            <p><span className={`ba ${BA_TONE[f.blockedAccount]}`}>{BLOCKED_LABEL[f.blockedAccount]}</span></p>
            {f.blockedAccountNote && <p className="small">{f.blockedAccountNote}</p>}
            <Link className="small" to="/burslar/bloke-hesap">Ülkelere göre geçim kanıtı kuralları →</Link>
          </div>
          <div className="panel">
            <h3>Bağlantılar ve kaynaklar</h3>
            <ExtLinks links={f.links} />
            <span className="eyebrow" style={{ color: "var(--muted)" }}>Kaynaklar</span>
            <ExtLinks links={f.sources} />
            <p className="hint">Son doğrulama: {fmt(f.verifiedAt)}</p>
          </div>
        </div>
      </div>
      {f.programs.length > 0 && <ProgramTable f={f} />}
    </>
  );
}

export function BlockedAccountPage() {
  const withRule = countries.filter(c => c.proofOfFunds);
  const T = today();
  const by = (k: Funding["blockedAccount"]) => sortFundings(data.fundings.filter(f => f.blockedAccount === k && f.turkish !== "no"), data.fx);
  const full = sortFundings(data.fundings.filter(f => f.level === "full" && f.turkish !== "no" && f.cs !== "no"), data.fx);

  return (
    <>
      <div className="page-head">
        <nav className="crumbs" aria-label="Konum"><Link to="/burslar">Burslar</Link></nav>
        <h1>Bloke hesap ve geçim kanıtı</h1>
        <p className="lede">
          Öğrenci vizesi veya oturum izni için her ülke bir yıllık yaşam parasını göstermeni istiyor. Bu paranın bloke bir hesapta kilitli durması yalnızca Almanya'da kural. İtalya ve Avusturya'da para kendi adına açık, serbest bir hesapta durabilir. Yeterli bir burs her üç ülkede de bu kanıtın yerine geçebilir.
        </p>
      </div>

      <div className="fundgrid">
        {withRule.map(c => {
          const p = c.proofOfFunds!;
          return (
            <div key={c.code} className="panel">
              <h3><Flag c={c} /> {c.name} <span className={`pill ${p.kind === "blocked-account" ? "bad" : "ok"}`}>{p.kind === "blocked-account" ? "Bloke hesap zorunlu" : "Bloke hesap yok"}</span> <StatusPill k={p.status} /></h3>
              <dl className="kvgrid">
                {p.amounts.map(a => {
                  const y = perYear(a.money);
                  const eur = y == null ? null : convert(y, a.money.currency, "EUR", data.fx);
                  return (
                    <div key={a.label} style={{ display: "contents" }}>
                      <dt>{a.label}</dt>
                      <dd><b className="num">{fmtMoney(a.money)}</b>{a.money.per !== "year" && eur != null && <span className="muted small num"> · yılda {fmtAmount(Math.round(eur), "EUR")}</span>}</dd>
                    </div>
                  );
                })}
              </dl>
              <span className="eyebrow" style={{ color: "var(--muted)" }}>Kabul edilen kanıtlar</span>
              <ul className="steps">{p.accepted.map(a => <li key={a}>{a}</li>)}</ul>
              {p.note && <p className="small muted">{p.note}</p>}
              <ExtLinks links={[p.source]} />
            </div>
          );
        })}
        <div className="panel">
          <h3><Flag c={countryByCode.get("tr")!} /> Türkiye</h3>
          <p className="small">Türkiye'de okurken geçim kanıtı istenmez. Devlet üniversitelerinde tezli yüksek lisans normal sürede harçsızdır; TÜBİTAK 2210 aylık burs verir.</p>
          <Link className="small" to="/burs/tubitak-2210">TÜBİTAK 2210 →</Link>
        </div>
      </div>

      <div className="detail">
        <div className="panel">
          <div className="panel-head">
            <h3>Bloke hesabın yerine geçen burslar</h3>
            <span className="hint">Türk vatandaşına açık olanlar</span>
          </div>
          <FundList items={by("replaces")} T={T} />
          <span className="eyebrow" style={{ color: "var(--muted)" }}>Kısmen karşılayanlar (farkı kendin gösterirsin)</span>
          <FundList items={by("partial")} T={T} />
        </div>
        <div className="panel">
          <div className="panel-head">
            <h3>Okul ücreti ve yaşam gideri birlikte</h3>
            <span className="hint">Tam burs, Türk vatandaşına açık, bilgisayar YL'si mümkün</span>
          </div>
          <FundList items={full} T={T} />
          <p className="hint">Almanya'da devlet üniversitelerinin çoğu zaten ücretsiz olduğu için orada yalnızca yaşam gideri bursu (TEV-DAAD, KAS, yapay zekâ okulları) yeterli olabilir; bu burslar 'kısmi' sayılıyor.</p>
        </div>
      </div>
    </>
  );
}

function FundList({ items, T }: { items: Funding[]; T: Date }) {
  if (!items.length) return <p className="muted small">Kayıt yok.</p>;
  return (
    <ul className="reqlist">
      {items.map(f => {
        const n = nextCall(f, T);
        return (
          <li key={f.id}>
            <span className="rk"><Hosts codes={hostsOf(f)} max={2} /></span>
            <span><Link to={`/burs/${f.id}`}>{f.name}</Link> <span className="small muted">· <Stipend f={f} /></span></span>
            {n ? <Countdown s={n.kind === "open" ? n.date : undefined} e={n.kind === "deadline" ? n.date : undefined} /> : <span className="muted small">tarih yok</span>}
          </li>
        );
      })}
    </ul>
  );
}
