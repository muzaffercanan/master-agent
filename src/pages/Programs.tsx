import { useId, useMemo, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { applyFilters, DEFAULT_FILTERS, derive, matchesSchoolTier, parseFilters, serializeFilters, type Filters } from "../lib/filters";
import { today } from "../lib/dates";
import { LANG_LABEL, LEVEL_LABEL, TERM_LABEL } from "../lib/text";
import { countries, data, views } from "../state/data";
import { useStore } from "../state/store";
import { ProgramRow } from "../components/ProgramRow";

type ListKey = "country" | "city" | "uni" | "field" | "level" | "lang" | "term";

/** Collapsible filter section. Starts open when asked to, or when it holds an active filter. */
function FilterGroup({ title, count = 0, clear, defaultOpen = true, children }: { title: string; count?: number; clear?: () => void; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen || count > 0);
  const id = useId();
  return (
    <div className="fgroup">
      <div className="fgroup-head">
        <button type="button" className="fgroup-toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen(o => !o)}>
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 4.5l3 3 3-3" /></svg>
          {title}
          {count > 0 && <span className="fcount" aria-label={`${count} seçili`}>{count}</span>}
        </button>
        {clear && <button type="button" className="fclear" onClick={clear}>temizle</button>}
      </div>
      <div className="fgroup-body" id={id} hidden={!open}>{children}</div>
    </div>
  );
}

export function ProgramsPage() {
  const [sp, setSp] = useSearchParams();
  const f = useMemo(() => parseFilters(sp), [sp]);
  const { profile, shortlist } = useStore();
  const [panelOpen, setPanelOpen] = useState(false);
  const T = useMemo(today, []);

  const derived = useMemo(() => derive(views, { profile, fx: data.fx, T }), [profile, T]);
  const results = useMemo(() => applyFilters(derived, f, { shortlist, T }), [derived, f, shortlist, T]);

  const set = (patch: Partial<Filters>) => setSp(serializeFilters({ ...f, ...patch }), { replace: true });
  const toggle = (k: ListKey, v: string) => set({ [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v] } as Partial<Filters>);

  // options narrow with the higher-level choices (scope → country → city → school)
  const scoped = views.filter(v => (f.scope === "tr" ? v.uni.country === "tr" : f.scope === "abroad" ? v.uni.country !== "tr" : true));
  const inCountry = scoped.filter(v => !f.country.length || f.country.includes(v.uni.country));
  const inCity = inCountry.filter(v => !f.city.length || f.city.includes(v.uni.city));
  const count = (list: typeof views, pick: (v: (typeof views)[number]) => string[]) => {
    const m = new Map<string, number>();
    for (const v of list) for (const k of new Set(pick(v))) m.set(k, (m.get(k) ?? 0) + 1);
    return m;
  };
  const countryCounts = count(scoped, v => [v.uni.country]);
  const cityCounts = count(inCountry, v => [v.uni.city]);
  const uniCounts = count(inCity, v => [v.uni.id]);
  const fieldCounts = count(scoped, v => v.program.fields);
  const unis = [...new Map(inCity.map(v => [v.uni.id, v.uni])).values()].sort((a, b) => a.short.localeCompare(b.short, "tr"));
  const hasForeign = views.some(v => v.uni.country !== "tr");
  const topCount = scoped.filter(v => v.uni.topTier).length;
  const topNames = [...new Set(views.filter(v => v.uni.topTier).map(v => v.uni.short))].sort((a, b) => a.localeCompare(b, "tr")).join(", ");
  const RANKS = [100, 250, 500];

  const chips = (k: ListKey, opts: [string, ReactNode, number?][]) => (
    <div className="chips">
      {opts.map(([v, label, n]) => (
        <button key={v} type="button" className="chipbtn" aria-pressed={f[k].includes(v)} onClick={() => toggle(k, v)}>
          {label}
          {n != null && <span className="n">{n}</span>}
        </button>
      ))}
    </div>
  );
  const group = (title: string, children: ReactNode, clear?: () => void, count = 0, defaultOpen = true) => (
    <FilterGroup title={title} count={count} clear={clear} defaultOpen={defaultOpen}>{children}</FilterGroup>
  );
  const num = (k: "due" | "maxEur" | "maxIelts" | "maxGpa", placeholder: string, step = 1) => (
    <input type="number" step={step} min={0} placeholder={placeholder} value={f[k] ?? ""} onChange={e => set({ [k]: e.target.value === "" ? null : parseFloat(e.target.value) } as Partial<Filters>)} />
  );

  // human-readable list of active filters
  const active: [string, () => void][] = [];
  const label = (k: ListKey, v: string) =>
    k === "country" ? countries.find(c => c.code === v)?.name ?? v
    : k === "uni" ? unis.find(u => u.id === v)?.short ?? data.universities.find(u => u.id === v)?.short ?? v
    : k === "field" ? data.fields[v]?.n.split(" / ")[0] ?? v
    : k === "level" ? LEVEL_LABEL[v] : k === "lang" ? LANG_LABEL[v] : k === "term" ? TERM_LABEL[v] : v;
  for (const k of ["country", "city", "uni", "field", "level", "lang", "term"] as ListKey[]) for (const v of f[k]) active.push([label(k, v), () => toggle(k, v)]);
  if (f.scope) active.push([f.scope === "tr" ? "Türkiye" : "Yurt dışı", () => set({ scope: "" })]);
  if (f.single) active.push(["Tek dönem alanlar", () => set({ single: false })]);
  if (f.due != null) active.push([`${f.due} gün içinde son başvuru`, () => set({ due: null })]);
  if (f.elig) active.push([f.elig === "ok" ? "Profilime uyanlar" : "Uyan + sınırda", () => set({ elig: "" })]);
  if (f.free) active.push(["Ücretsiz", () => set({ free: false })]);
  if (f.maxEur != null) active.push([`≤ €${f.maxEur}/yıl`, () => set({ maxEur: null })]);
  if (f.regional) active.push([f.regional === "yes" ? "Bölgesel ücret var" : "Bölgesel ücret yok", () => set({ regional: "" })]);
  if (f.schol) active.push(["Burs var", () => set({ schol: false })]);
  if (f.noAles) active.push(["ALES istemeyen", () => set({ noAles: false })]);
  if (f.noGre) active.push(["GRE zorunlu olmayan", () => set({ noGre: false })]);
  if (f.maxIelts != null) active.push([`IELTS şartı ≤ ${f.maxIelts}`, () => set({ maxIelts: null })]);
  if (f.maxGpa != null) active.push([`GNO şartı ≤ ${f.maxGpa}`, () => set({ maxGpa: null })]);
  if (f.top) active.push(["Seçkin Türk okulları", () => set({ top: false })]);
  if (f.rank != null) active.push([`THE ilk ${f.rank}`, () => set({ rank: null })]);
  if (f.sl) active.push(["Kısa listem", () => set({ sl: false })]);
  if (f.q) active.push([`“${f.q}”`, () => set({ q: "" })]);

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Program gezgini</div>
        <h1>Programlar</h1>
        <p className="lede">Bütün ülkelerdeki programlar tek listede. Filtreler adres çubuğunda saklanır; linki kopyalarsan aynı görünüm açılır. Uygunluk etiketleri <Link to="/profil">profilindeki</Link> puanlara göre hesaplanır.</p>
      </div>

      <div className="explorer">
        <aside className={`fpanel${panelOpen ? " open" : ""}`} aria-label="Filtreler">
          <div className="fsearch">
            <input type="search" value={f.q} placeholder="Program, okul, hoca…" aria-label="Listede ara" onChange={e => set({ q: e.target.value })} />
          </div>
          {group(
            "Kapsam",
            <div className="chips">
              {([["", "Tümü"], ["tr", "Türkiye"], ["abroad", "Yurt dışı"]] as const).map(([v, l]) => (
                <button key={v} type="button" className="chipbtn" aria-pressed={f.scope === v} onClick={() => set({ scope: v, country: [], city: [], uni: [] })} disabled={v === "abroad" && !hasForeign}>{l}</button>
              ))}
            </div>,
            undefined,
            f.scope ? 1 : 0,
          )}
          {group("Ülke", chips("country", countries.filter(c => countryCounts.has(c.code)).map(c => [c.code, <><span className="flag">{c.flag}</span> {c.name}</>, countryCounts.get(c.code)])), f.country.length ? () => set({ country: [], city: [], uni: [] }) : undefined, f.country.length)}
          {group("Şehir / bölge", chips("city", [...cityCounts.entries()].sort((a, b) => a[0].localeCompare(b[0], "tr")).map(([c, n]) => [c, c, n])), f.city.length ? () => set({ city: [], uni: [] }) : undefined, f.city.length, false)}
          {group(
            "Okul",
            <select value="" onChange={e => e.target.value && toggle("uni", e.target.value)}>
              <option value="">Okul ekle…</option>
              {unis.filter(u => !f.uni.includes(u.id)).map(u => <option key={u.id} value={u.id}>{u.short} ({uniCounts.get(u.id)})</option>)}
            </select>,
            undefined,
            f.uni.length,
          )}
          {group(
            "Okul düzeyi",
            <>
              <div className="chips">
                <button type="button" className="chipbtn" aria-pressed={f.top} onClick={() => set({ top: !f.top })} disabled={!f.top && !topCount} title={topNames}>
                  Seçkin Türk okulları<span className="n">{topCount}</span>
                </button>
              </div>
              <span className="hint">{topNames}</span>
              <span className="hint">THE dünya sırası</span>
              <div className="chips">
                {RANKS.map(r => (
                  <button key={r} type="button" className="chipbtn" aria-pressed={f.rank === r} onClick={() => set({ rank: f.rank === r ? null : r })}>
                    İlk {r}<span className="n">{scoped.filter(v => matchesSchoolTier(v.uni, false, r)).length}</span>
                  </button>
                ))}
              </div>
              {f.top && f.rank != null && <span className="hint">İkisi birden seçili: seçkin Türk okulları ve THE sırası ilk {f.rank} içinde olan okullar birlikte listelenir.</span>}
            </>,
            f.top || f.rank != null ? () => set({ top: false, rank: null }) : undefined,
            (f.top ? 1 : 0) + (f.rank != null ? 1 : 0),
          )}
          {group("Alan", chips("field", Object.keys(data.fields).filter(k => fieldCounts.has(k)).map(k => [k, data.fields[k].n.split(" / ")[0].split(":")[0], fieldCounts.get(k)])), f.field.length ? () => set({ field: [] }) : undefined, f.field.length, false)}
          {group("Derece", chips("level", (["master-thesis", "master-nonthesis", "phd"] as const).map(k => [k, LEVEL_LABEL[k]])), undefined, f.level.length)}
          {group("Eğitim dili", chips("lang", [...new Set(views.flatMap(v => v.program.languages))].map(k => [k, LANG_LABEL[k]])), undefined, f.lang.length)}
          {group(
            "Başvuru dönemi",
            <>
              {chips("term", (["fall", "spring", "winter", "summer"] as const).filter(t => views.some(v => v.intakes.some(i => i.term === t))).map(t => [t, TERM_LABEL[t]]))}
              <label className="check"><input type="checkbox" checked={f.single} onChange={e => set({ single: e.target.checked })} /> Yalnızca tek dönem alanlar</label>
              <div className="chips">
                {[30, 60, 90, 180].map(d => (
                  <button key={d} type="button" className="chipbtn" aria-pressed={f.due === d} onClick={() => set({ due: f.due === d ? null : d })}>≤ {d} gün</button>
                ))}
              </div>
              <span className="hint">Gün filtresi: son başvurusu bu süre içinde olanlar</span>
            </>,
            undefined,
            f.term.length + (f.single ? 1 : 0) + (f.due != null ? 1 : 0),
          )}
          {group(
            "Şartlar",
            <>
              <div className="chips">
                <button type="button" className="chipbtn" aria-pressed={f.elig === "ok"} onClick={() => set({ elig: f.elig === "ok" ? "" : "ok" })}>Profilime uyanlar</button>
                <button type="button" className="chipbtn" aria-pressed={f.elig === "okNear"} onClick={() => set({ elig: f.elig === "okNear" ? "" : "okNear" })}>+ sınırda</button>
              </div>
              <label className="check"><input type="checkbox" checked={f.noAles} onChange={e => set({ noAles: e.target.checked })} /> ALES istemeyen</label>
              <label className="check"><input type="checkbox" checked={f.noGre} onChange={e => set({ noGre: e.target.checked })} /> GRE zorunlu olmayan</label>
              <label className="subfield"><span className="hint">IELTS şartı en fazla</span>{num("maxIelts", "örn. 6.5", 0.5)}</label>
              <label className="subfield"><span className="hint">GNO şartı en fazla (4'lük)</span>{num("maxGpa", "örn. 2.75", 0.05)}</label>
            </>,
            undefined,
            (f.elig ? 1 : 0) + (f.noAles ? 1 : 0) + (f.noGre ? 1 : 0) + (f.maxIelts != null ? 1 : 0) + (f.maxGpa != null ? 1 : 0),
          )}
          {group(
            "Ücret ve burs",
            <>
              <label className="check"><input type="checkbox" checked={f.free} onChange={e => set({ free: e.target.checked })} /> Ücretsiz</label>
              <label className="subfield"><span className="hint">Yıllık toplam en fazla (€, ücret + dönem + bölgesel)</span>{num("maxEur", "örn. 3000", 100)}</label>
              <div className="chips">
                <button type="button" className="chipbtn" aria-pressed={f.regional === "no"} onClick={() => set({ regional: f.regional === "no" ? "" : "no" })}>Bölgesel ücret yok</button>
                <button type="button" className="chipbtn" aria-pressed={f.regional === "yes"} onClick={() => set({ regional: f.regional === "yes" ? "" : "yes" })}>var</button>
              </div>
              <label className="check"><input type="checkbox" checked={f.schol} onChange={e => set({ schol: e.target.checked })} /> Okul veya program bursu olan</label>
            </>,
            undefined,
            (f.free ? 1 : 0) + (f.maxEur != null ? 1 : 0) + (f.regional ? 1 : 0) + (f.schol ? 1 : 0),
          )}
          {group("Liste", <label className="check"><input type="checkbox" checked={f.sl} onChange={e => set({ sl: e.target.checked })} /> Yalnızca kısa listem ({shortlist.length})</label>, undefined, f.sl ? 1 : 0)}
        </aside>

        <section aria-label="Sonuçlar" style={{ padding: 0, border: 0 }}>
          <div className="results-bar">
            <span className="count"><b>{results.length}</b> / {views.length} program</span>
            <div className="btnrow">
              <button type="button" className="btn sm fpanel-toggle" onClick={() => setPanelOpen(o => !o)} aria-expanded={panelOpen}>{panelOpen ? "Filtreleri gizle" : "Filtreler"}{active.length > 0 && <span className="fcount">{active.length}</span>}</button>
              <label className="small muted" htmlFor="sort">Sırala</label>
              <select id="sort" value={f.sort} onChange={e => set({ sort: e.target.value as Filters["sort"] })}>
                <option value="deadline">Yaklaşan son başvuru</option>
                <option value="cost">Yıllık maliyet</option>
                <option value="uni">Okul</option>
                <option value="name">Program adı</option>
              </select>
              {active.length > 0 && <button type="button" className="btn sm" onClick={() => setSp(serializeFilters({ ...DEFAULT_FILTERS, sort: f.sort }))}>Filtreleri sıfırla</button>}
            </div>
          </div>
          {active.length > 0 && (
            <div className="activefilters">
              {active.map(([t, rm]) => (
                <span key={t} className="chip">{t}<button type="button" onClick={rm} aria-label={`${t} filtresini kaldır`}>×</button></span>
              ))}
            </div>
          )}
          <div className="plist">
            {results.map(d => <ProgramRow key={d.view.key} d={d} />)}
            {!results.length && <div className="empty">Bu filtrelerle eşleşen program yok. Bir filtreyi kaldırmayı dene.</div>}
          </div>
        </section>
      </div>
    </>
  );
}
