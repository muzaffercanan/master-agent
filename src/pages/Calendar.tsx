import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { countries, data, views } from "../state/data";
import { useStore } from "../state/store";
import { buildCalendar } from "../lib/calendar";
import { buildIcs, downloadText } from "../lib/ics";
import { Timeline } from "../components/Timeline";
import { Flag } from "../components/bits";

const all = buildCalendar(views, countries, data.fundings);

export function CalendarPage() {
  const [sp, setSp] = useSearchParams();
  const { shortlist } = useStore();
  const c = sp.get("c") ?? "";
  const mine = sp.get("sl") === "1";
  const kind = sp.get("kind") ?? "";
  const past = sp.get("past") === "1";
  const set = (k: string, v: string) => {
    const n = new URLSearchParams(sp);
    if (v) n.set(k, v);
    else n.delete(k);
    setSp(n, { replace: true });
  };

  const events = useMemo(
    () => all.filter(e => (!c || e.country?.code === c || !!e.hosts?.includes(c)) && (!kind || e.kind === kind) && (!mine || e.kind !== "application" || e.keys.some(k => shortlist.includes(k)))),
    [c, kind, mine, shortlist],
  );

  const exportIcs = () => {
    const ics = buildIcs(events.map(e => ({ uid: e.uid, start: e.s, end: e.e, title: `${e.k === "tahmin" ? "[tahmin] " : ""}${e.t}`, description: e.d })));
    downloadText(`master-atlasi-takvim${c ? "-" + c : ""}.ics`, ics);
  };

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Bütün ülkeler tek akışta</div>
        <h1>Takvim</h1>
        <p className="lede">Sınavlar, burs çağrıları ve başvuru dönemleri. Kalan gün sayısı bugüne göre hesaplanır. "Takvime aktar" ile görünen olayları telefonuna veya Google Takvim'e ekleyebilirsin.</p>
      </div>
      <div className="toolbar">
        <div className="chips">
          <button type="button" className="chipbtn" aria-pressed={!c} onClick={() => set("c", "")}>Tüm ülkeler</button>
          {countries.map(k => <button key={k.code} type="button" className="chipbtn" aria-pressed={c === k.code} onClick={() => set("c", k.code)}><Flag c={k} /> {k.name}</button>)}
        </div>
        <div className="chips">
          <button type="button" className="chipbtn" aria-pressed={!kind} onClick={() => set("kind", "")}>Hepsi</button>
          <button type="button" className="chipbtn" aria-pressed={kind === "application"} onClick={() => set("kind", "application")}>Başvuru dönemleri</button>
          <button type="button" className="chipbtn" aria-pressed={kind === "scholarship"} onClick={() => set("kind", "scholarship")}>Burs çağrıları</button>
          <button type="button" className="chipbtn" aria-pressed={kind === "general"} onClick={() => set("kind", "general")}>Sınavlar</button>
        </div>
        <label className="check"><input type="checkbox" checked={mine} onChange={e => set("sl", e.target.checked ? "1" : "")} /> Yalnızca kısa listemdeki okullar</label>
        <label className="check"><input type="checkbox" checked={past} onChange={e => set("past", e.target.checked ? "1" : "")} /> Geçmişi göster</label>
        <button type="button" className="btn primary push" onClick={exportIcs} disabled={!events.length}>Takvime aktar (.ics)</button>
      </div>
      <Timeline events={events} hidePast={!past} />
    </>
  );
}
