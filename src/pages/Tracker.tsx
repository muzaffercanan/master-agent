import { Link } from "react-router-dom";
import { viewByKey } from "../state/data";
import { TRACK_STATUSES, useStore, type TrackEntry } from "../state/store";
import { nextDeadline, type ProgramView } from "../lib/programs";
import { fmt, today } from "../lib/dates";
import { Countdown, Flag } from "../components/bits";
import { TrackTabs } from "./Checklist";

/** Document checklist derived from the program's requirements. */
export function docsFor(v: ProgramView): string[] {
  const r = v.requirements;
  const docs = ["Transkript", "Diploma / mezuniyet belgesi", "CV", "Niyet mektubu", "Referans mektubu 1", "Referans mektubu 2"];
  if (r.english && (r.english.ielts != null || r.english.toefl != null || r.english.yds != null || r.english.note)) docs.push("İngilizce belgesi");
  if (r.ales && !r.ales.notRequired) docs.push("ALES sonuç belgesi");
  if (r.gre?.policy === "required") docs.push("GRE sonucu");
  if (r.advisorLetter === "required") docs.push("Danışman kabul mektubu");
  for (const d of r.documents ?? []) if (!docs.includes(d)) docs.push(d);
  return docs;
}

function TrackCard({ k, e }: { k: string; e: TrackEntry }) {
  const { setTrack, removeTrack } = useStore();
  const v = viewByKey.get(k);
  if (!v) return null;
  const docs = docsFor(v);
  const done = docs.filter(d => e.docs[d]).length;
  const next = nextDeadline(v.intakes, today());
  return (
    <div className="panel trow">
      <div>
        <Link to={`/program/${k}`}><b>{v.program.name}</b></Link>
        <div className="small muted"><Flag c={v.country} /> {v.uni.short} · {v.uni.city}</div>
      </div>
      <div className="btnrow">
        <select value={e.status} onChange={x => setTrack(k, { status: x.target.value as TrackEntry["status"] })} aria-label="Durum">
          {TRACK_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {next && <span className="small">{next.kind === "deadline" ? "Son gün" : "Açılış"} {fmt(next.date)} <Countdown s={next.kind === "open" ? next.date : undefined} e={next.kind === "deadline" ? next.date : undefined} /></span>}
      </div>
      <div className="progress" title={`${done}/${docs.length} belge`}><i style={{ width: `${(done / docs.length) * 100}%` }} /></div>
      <details>
        <summary className="small">Belgeler ({done}/{docs.length})</summary>
        <div className="doclist" style={{ marginTop: 6 }}>
          {docs.map(d => (
            <label key={d} className="check"><input type="checkbox" checked={!!e.docs[d]} onChange={x => setTrack(k, { docs: { ...e.docs, [d]: x.target.checked } })} /> {d}</label>
          ))}
        </div>
      </details>
      <textarea placeholder="Notlar (hocayla yazışma, mülakat tarihi…)" value={e.notes} onChange={x => setTrack(k, { notes: x.target.value })} />
      <div className="btnrow" style={{ justifyContent: "space-between" }}>
        <span className="hint">Güncelleme: {e.updated ? fmt(e.updated) : "—"}</span>
        <button type="button" className="btn sm" onClick={() => removeTrack(k)}>Takipten çıkar</button>
      </div>
    </div>
  );
}

export function TrackerPage() {
  const { tracker } = useStore();
  const entries = Object.entries(tracker);
  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Başvuru süreci</div>
        <h1>Takip</h1>
        <p className="lede">Her program için durum, belge kontrol listesi ve notlar. Belge listesi programın şartlarından otomatik çıkarılır.</p>
        <TrackTabs />
      </div>
      {!entries.length && <div className="empty">Takipte program yok. Bir programın sayfasında ya da listede "Takibe al" düğmesine bas.</div>}
      {TRACK_STATUSES.map(s => {
        const list = entries.filter(([, e]) => e.status === s);
        if (!list.length) return null;
        return (
          <div key={s} style={{ display: "grid", gap: 10 }}>
            <div className="city-title"><h3 style={{ textTransform: "capitalize" }}>{s}</h3><span className="eyebrow">{list.length}</span></div>
            <div className="kanban">{list.map(([k, e]) => <TrackCard key={k} k={k} e={e} />)}</div>
          </div>
        );
      })}
    </>
  );
}
