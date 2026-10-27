import type { ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { countryByCode, data } from "../state/data";
import type { RankingSource, RankingTable } from "../schema";
import { rankingRows, rankPos, rankTier, sortRankingRows } from "../lib/rank";
import { fmt } from "../lib/dates";
import { Flag } from "../components/bits";

type View = "all" | "overall" | "cs";
const VIEWS: [View, string][] = [["all", "Hepsi"], ["overall", "Genel"], ["cs", "Bilgisayar bilimi"]];
const KIND_LABEL: Record<RankingSource["kind"], string> = { overall: "Genel sıralama", cs: "Bilgisayar bilimi" };

/** "=143" and "301–325" with the tie mark and band dash set back, so the numbers carry the column. */
function RankText({ r }: { r: string }) {
  const m = r.match(/^(=?)(\d+)(?:–(\d+))?(\+?)$/);
  if (!m) return <>{r}</>;
  return <>{m[1] && <span className="eq">=</span>}{m[2]}{m[3] && <><span className="dash">–</span>{m[3]}</>}{m[4]}</>;
}

/** One heat-map tile: 1–100 / 101–200 / 201–500 tinted, beyond 500 outlined, a dash when the list leaves the school out. */
function RankCell({ r, src, split }: { r?: string; src: RankingSource; split: boolean }) {
  const cls = `rk-cell${split ? " split" : ""}`;
  if (!r) {
    const why = src.listedTo ? `${src.short} listesinde yok (yalnızca ilk ${src.listedTo} yayımlanıyor)` : `${src.short} listesinde yok`;
    return <td className={cls}><span className="rk-v none" title={why} aria-label={why}>—</span></td>;
  }
  const tier = (rankPos(r) ?? 0) > 500 ? "beyond" : rankTier(r) ?? "";
  return <td className={cls}><span className={`rk-v ${tier}`} title={`${src.short} ${src.edition}: ${r}`}><RankText r={r} /></span></td>;
}

function RankTable({ table }: { table: RankingTable }) {
  const [sp, setSp] = useSearchParams();
  const view = (VIEWS.some(([v]) => v === sp.get("v")) ? sp.get("v") : "all") as View;
  const q = sp.get("q") ?? "";
  const atlas = sp.get("atlas") === "1";
  const set = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(sp);
    for (const [k, v] of Object.entries(patch)) (v ? next.set(k, v) : next.delete(k));
    setSp(next, { replace: true });
  };

  const sources = table.sources.filter(s => view === "all" || s.kind === view);
  const sortId = sp.get("s");
  const sortIdx = sources.findIndex(s => s.id === sortId);
  const by = sortIdx >= 0 ? sortIdx : "median";
  const needle = q.trim().toLocaleLowerCase("tr");
  const rows = sortRankingRows(
    rankingRows(table, sources.map(s => s.id)).filter(
      r => (!atlas || r.entry.uni) && (!needle || `${r.entry.short} ${r.entry.name} ${r.entry.city}`.toLocaleLowerCase("tr").includes(needle)),
    ),
    by,
  );
  const groups = (["overall", "cs"] as const).map(k => ({ k, n: sources.filter(s => s.kind === k).length })).filter(g => g.n);
  const sortBtn = (id: string | null, label: ReactNode, active: boolean) => (
    <button type="button" className="rk-sort" aria-pressed={active} onClick={() => set({ s: id })} title="Bu sütuna göre sırala">
      {label}
      <span className="arrow" aria-hidden="true">{active ? "↑" : "↕"}</span>
    </button>
  );

  return (
    <>
      <div className="toolbar rk-toolbar">
        <input type="search" value={q} onChange={e => set({ q: e.target.value || null })} placeholder="Okul veya şehir ara…" aria-label="Sıralamalarda ara" />
        <div className="chips" role="group" aria-label="Gösterilen sıralamalar">
          {VIEWS.map(([v, label]) => (
            <button key={v} type="button" className="chipbtn" aria-pressed={view === v} onClick={() => set({ v: v === "all" ? null : v, s: null })}>
              {label} <span className="n">{table.sources.filter(s => v === "all" || s.kind === v).length}</span>
            </button>
          ))}
        </div>
        <label className="check"><input type="checkbox" checked={atlas} onChange={e => set({ atlas: e.target.checked ? "1" : null })} /> Yalnızca atlastaki okullar</label>
        <span className="small muted push"><b className="num">{rows.length}</b> kurum</span>
      </div>

      {rows.length ? (
        <div className="tbl-wrap rk-wrap">
          <table className="rk-table">
            <thead>
              <tr className="rk-groups">
                <th rowSpan={2} scope="col" className="rk-name">Kurum</th>
                {groups.map(g => <th key={g.k} colSpan={g.n} scope="colgroup" className={`rk-group ${g.k}`}>{KIND_LABEL[g.k]}</th>)}
                <th rowSpan={2} scope="col" className="rk-med" aria-sort={by === "median" ? "ascending" : undefined} title="Gösterilen listelerdeki sıraların ortancası; bantlar orta noktasıyla sayılır">{sortBtn(null, "Ortanca", by === "median")}</th>
              </tr>
              <tr>
                {sources.map((s, i) => (
                  <th key={s.id} scope="col" className={`rk-src${i > 0 && sources[i - 1].kind !== s.kind ? " split" : ""}`} aria-sort={by === i ? "ascending" : undefined}>
                    {sortBtn(s.id, <span className="rk-src-label">{s.short}<span className="ed">{s.edition}</span></span>, by === i)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, n) => (
                <tr key={r.entry.id}>
                  <th scope="row" className="rk-name">
                    <div className="rk-row">
                      <span className="rk-i">{n + 1}</span>
                      <div>
                        {r.entry.uni ? <Link to={`/okul/${r.entry.uni}`}>{r.entry.short}</Link> : <b>{r.entry.short}</b>}
                        <span className="sub">{r.entry.city}{r.entry.uni && <span className="rk-atlas" title="Bu okulun programları atlasta var">atlasta</span>}</span>
                        {r.entry.note && <span className="sub rk-note">{r.entry.note}</span>}
                      </div>
                    </div>
                  </th>
                  {sources.map((s, i) => <RankCell key={s.id} r={r.ranks[i]} src={s} split={i > 0 && sources[i - 1].kind !== s.kind} />)}
                  <td className="rk-med">
                    <b>{r.median != null ? Math.round(r.median) : "—"}</b>
                    <span className="rk-cover" title={`${sources.length} listenin ${r.count} tanesinde`} aria-label={`${sources.length} listenin ${r.count} tanesinde`}>
                      {sources.map((s, i) => <i key={s.id} className={r.ranks[i] ? "on" : ""} />)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty">Bu aramaya uyan kurum yok.</p>
      )}

      <div className="rk-legend small muted" aria-label="Renk açıklaması">
        <span className="item"><span className="rk-v top">1–100</span></span>
        <span className="item"><span className="rk-v mid">101–200</span></span>
        <span className="item"><span className="rk-v low">201–500</span></span>
        <span className="item"><span className="rk-v beyond">501+</span></span>
        <span className="item"><span className="rk-v none">—</span> listede yok</span>
        <span className="item"><span className="num">=</span> eşit sıra</span>
        <span className="item"><span className="rk-cover"><i className="on" /><i className="on" /><i /></span> ortancanın dayandığı listeler</span>
      </div>
    </>
  );
}

export function RankingsPage() {
  const tables = data.rankings;
  const [sp, setSp] = useSearchParams();
  const table = tables.find(t => t.country === sp.get("c")) ?? tables.find(t => t.country === "de") ?? tables[0];
  if (!table) return <p className="empty">Henüz sıralama verisi yok.</p>;
  const country = countryByCode.get(table.country);
  const retrieved = [...new Set(table.sources.map(s => s.retrievedAt))].sort().at(-1)!;

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Dünya sıralamaları</div>
        <h1>Rankingler</h1>
        <p className="lede">
          {country && <><Flag c={country} /> </>}{country?.name ?? table.country} üniversitelerinin {table.sources.length} sıralamadaki yeri, yan yana: dört genel, beş bilgisayar bilimi listesi. Tabloda en az bir listede ilk 500'e giren {table.entries.length} kurum var. Sayılar {fmt(retrieved)} tarihinde yayıncıların kendi sitelerinden alındı.
        </p>
        {tables.length > 1 && (
          <div className="chips" role="group" aria-label="Ülke">
            {tables.map(t => {
              const c = countryByCode.get(t.country);
              return (
                <button key={t.country} type="button" className="chipbtn" aria-pressed={t === table} onClick={() => setSp(t.country === "de" ? {} : { c: t.country }, { replace: true })}>
                  {c ? <Flag c={c} /> : null} {c?.name ?? t.country}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <RankTable table={table} />

      <section className="rk-notes" aria-labelledby="rk-how">
        <div className="grid2">
          <div className="box">
            <h3 id="rk-how">Nasıl okunur</h3>
            <ul>
              <li>Genel sıralamalar okulun bütününü ölçer (tıp, fen, sosyal dahil). Bilgisayar bilimi için konu sıralamaları ve CSRankings daha anlamlıdır.</li>
              <li>Bantlı sıralar ("301–325") yayımlandığı gibi duruyor. Sıralama ve ortanca için bandın orta noktası kullanılır; "1401+" gibi açık bantlar alt sınırıyla sayılır.</li>
              <li>Ortanca, yalnızca o an gösterilen listelerden hesaplanır. Listelerin yarısından azında yer alan okullar, ortancaları iyi olsa da sona alınır; altındaki noktalara bak (her nokta bir liste).</li>
              <li>CSRankings itibar anketi kullanmaz; yalnızca seçici konferanslardaki yayınları sayar. Araştırma odaklı bir danışman arıyorsan en doğrudan gösterge odur.</li>
              <li>Sıralama, başvuru şartı veya ücret hakkında bir şey söylemez. Atlasta olan okulların şartları için okul adına tıkla.</li>
            </ul>
          </div>
          <div className="box">
            <h3>Kaynaklar</h3>
            <ul className="rk-sources">
              {table.sources.map(s => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer"><b>{s.short}</b> · {s.name}</a>
                  <span className="sub">{s.publisher} · {KIND_LABEL[s.kind].toLocaleLowerCase("tr")} · alındı {fmt(s.retrievedAt)}</span>
                  {s.note && <span className="sub">{s.note}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
