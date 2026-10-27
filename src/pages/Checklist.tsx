import { useMemo } from "react";
import { Link, NavLink, useSearchParams } from "react-router-dom";
import { countries, data, viewByKey } from "../state/data";
import { useStore } from "../state/store";
import type { ChecklistItem, Country } from "../schema";
import { checklistHint, hintCountries, itemsIn, progress, sectionOf, type HintCtx, type SectionId } from "../lib/checklist";
import { isProfileEmpty } from "../lib/eligibility";
import type { ProgramView } from "../lib/programs";
import { fmt, today } from "../lib/dates";
import { Flag } from "../components/bits";

/** Switches between the per-program tracker and the general to-do list. */
export function TrackTabs() {
  const { tracker, checklist } = useStore();
  const list = data.checklist;
  const p = list ? progress(list.items, checklist) : null;
  return (
    <nav className="subtabs" aria-label="Takip bölümleri">
      <NavLink to="/takip" end>Başvurularım <span className="n">{Object.keys(tracker).length}</span></NavLink>
      {p && <NavLink to="/yapilacaklar">Yapılacaklar <span className="n">{p.done}/{p.total}</span></NavLink>}
    </nav>
  );
}

function Bar({ done, total }: { done: number; total: number }) {
  return (
    <span className="todo-meter" title={`${done}/${total} tamamlandı`}>
      <span className="progress" aria-hidden="true"><i style={{ width: `${total ? (done / total) * 100 : 0}%` }} /></span>
      <span className="num">{done}/{total}</span>
    </span>
  );
}

function Item({ item, codes, ctx }: { item: ChecklistItem; codes: string[]; ctx: HintCtx }) {
  const { checklist, setChecked } = useStore();
  const done = !!checklist[item.id];
  const hints = item.hint ? checklistHint(item.hint, hintCountries(item, codes), ctx) : [];
  const scopeTag = item.scope !== "all" && item.scope.length > 1 ? item.scope.map(c => countries.find(x => x.code === c)?.name ?? c).join(", ") : null;
  const id = `todo-${item.id}`;
  return (
    <li className={`todo${done ? " done" : ""}${item.kind === "info" ? " info" : ""}`}>
      {item.kind === "task" ? (
        <input id={id} type="checkbox" className="todo-box" checked={done} onChange={e => setChecked(item.id, e.target.checked)} />
      ) : (
        <span className="todo-i" aria-hidden="true">i</span>
      )}
      <div className="todo-body">
        <div className="todo-title">
          {item.kind === "task" ? <label htmlFor={id}>{item.title}</label> : <b>{item.title}</b>}
          {item.when && <span className="todo-tag when">{item.when}</span>}
          {item.condition && <span className="todo-tag cond">{item.condition}</span>}
          {scopeTag && <span className="todo-tag">{scopeTag}</span>}
          {item.kind === "info" && <span className="todo-tag">bilgi</span>}
        </div>
        <p className="todo-detail">{item.detail}</p>
        {hints.length > 0 && (
          <ul className="todo-hints" aria-label="Sana özel">
            {hints.map((h, i) => <li key={i} className={h.tone}>{h.text}</li>)}
          </ul>
        )}
        {(item.links.length > 0 || item.pages.length > 0) && (
          <div className="todo-links">
            {item.pages.map(p => <Link key={p.path} to={p.path}>{p.label} →</Link>)}
            {item.links.map(l => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">{l.label} ↗</a>)}
          </div>
        )}
      </div>
    </li>
  );
}

export function ChecklistPage() {
  const list = data.checklist;
  const { checklist, shortlist, profile } = useStore();
  const [sp, setSp] = useSearchParams();
  const T = useMemo(today, []);
  if (!list) return <p className="empty">Yapılacaklar listesi yüklenemedi.</p>;

  const codes = countries.map(c => c.code);
  const sections: { id: SectionId; name: string; country?: Country; desc?: string }[] = [
    { id: "common", name: "Ortak adımlar" },
    ...countries.filter(c => list.items.some(i => sectionOf(i) === c.code)).map(c => ({ id: c.code, name: c.name, country: c })),
    // non-country tracks (Erasmus Mundus) come after the countries
    ...list.tracks.map(t => ({ id: t.id, name: t.name, desc: t.desc })),
  ];
  const sel = sections.some(s => s.id === sp.get("u")) ? sp.get("u")! : "";
  const hideDone = sp.get("gizle") === "1";
  const set = (k: string, v: string | null) => {
    const next = new URLSearchParams(sp);
    v ? next.set(k, v) : next.delete(k);
    setSp(next, { replace: true });
  };
  const ctx: HintCtx = {
    shortlist: shortlist.map(k => viewByKey.get(k)).filter((v): v is ProgramView => !!v),
    profile,
    countries: data.countries,
    fundings: data.fundings,
    T,
  };
  const all = progress(list.items, checklist);

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Başvuru süreci</div>
        <h1>Yapılacaklar</h1>
        <p className="lede">
          Sınavlardan vizeye kadar bütün adımlar, aşama aşama. Her ülkenin kendi bölümü var; ortak adımlar en üstte. Mavi kutulardaki bilgiler kısa listenden ve profilinden hesaplanır. İşaretlerin yalnızca bu tarayıcıda saklanır.
        </p>
        <TrackTabs />
      </div>

      <div className="toolbar todo-toolbar">
        <div className="chips" role="group" aria-label="Bölüm">
          <button type="button" className="chipbtn" aria-pressed={!sel} onClick={() => set("u", null)}>Hepsi <span className="n">{all.done}/{all.total}</span></button>
          {sections.map(s => {
            const p = progress(itemsIn(list, s.id), checklist);
            return (
              <button key={s.id} type="button" className="chipbtn" aria-pressed={sel === s.id} onClick={() => set("u", s.id)}>
                {s.country && <Flag c={s.country} />} {s.id === "common" ? "Ortak" : s.name} <span className="n">{p.done}/{p.total}</span>
              </button>
            );
          })}
        </div>
        <label className="check"><input type="checkbox" checked={hideDone} onChange={e => set("gizle", e.target.checked ? "1" : null)} /> Tamamlananları gizle</label>
        <span className="push"><Bar {...all} /></span>
      </div>

      {(isProfileEmpty(profile) || !shortlist.length) && (
        <p className="hint">
          {!shortlist.length ? <>Kısa listen boş; programları <Link to="/programlar">kısa listeye ekleyince</Link> maddelerde sana özel şartlar ve tarihler çıkar. </> : null}
          {isProfileEmpty(profile) ? <>Puanlarını <Link to="/profil">profiline</Link> girersen şartları karşılayıp karşılamadığını da görürsün.</> : null}
        </p>
      )}

      {sections.filter(s => !sel || s.id === sel).map(s => {
        const items = itemsIn(list, s.id);
        const p = progress(items, checklist);
        const shown = items.filter(i => !hideDone || !checklist[i.id]);
        const itemCodes = s.id === "common" ? codes : [s.id];
        return (
          <section key={s.id} className="todo-sec" aria-labelledby={`todo-h-${s.id}`}>
            <div className="todo-sec-head">
              <h2 id={`todo-h-${s.id}`}>{s.country && <Flag c={s.country} />} {s.name}</h2>
              <Bar {...p} />
            </div>
            {s.desc && <p className="todo-sec-desc">{s.desc}</p>}
            {shown.length === 0 && <p className="small muted">Bu bölümde yapılacak iş kalmadı.</p>}
            {list.phases.map((ph, n) => {
              const its = shown.filter(i => i.phase === ph.id);
              if (!its.length) return null;
              return (
                <div key={ph.id} className="todo-phase">
                  <div className="todo-phase-head">
                    <span className="todo-step num">{n + 1}</span>
                    <div><h3>{ph.name}</h3><p className="small muted">{ph.desc}</p></div>
                  </div>
                  <ol className="todo-list">{its.map(i => <Item key={i.id} item={i} codes={itemCodes} ctx={ctx} />)}</ol>
                </div>
              );
            })}
          </section>
        );
      })}

      <p className="hint">Liste {fmt(list.verifiedAt)} tarihinde hazırlandı. Vize belgeleri, ücretler ve süreler değişebilir; her adımda bağlantı verilen resmi sayfadan son durumu kontrol et.</p>
    </>
  );
}
