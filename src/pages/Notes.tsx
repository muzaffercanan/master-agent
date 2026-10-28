import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { data, uniById, viewByKey } from "../state/data";
import { useStore, type NotesSync } from "../state/store";
import { noteTitle, visibleNotes, type Note } from "../lib/notes";
import { fmt } from "../lib/dates";
import { norm } from "../lib/text";

/** "uni/prog" or "okul:<id>" as a readable label and a page link. */
export function noteLink(link: string): { label: string; to: string } | null {
  if (link.startsWith("okul:")) {
    const u = uniById.get(link.slice(5));
    return u ? { label: u.short, to: `/okul/${u.id}` } : null;
  }
  const v = viewByKey.get(link);
  return v ? { label: `${v.uni.short} · ${v.program.name}`, to: `/program/${v.key}` } : null;
}

const when = (iso: string) => {
  const d = new Date(iso);
  return `${fmt(d)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

function SyncLine({ s }: { s: NotesSync }) {
  if (s.state === "loading") return <span className="nsync">Kayıt yeri kontrol ediliyor…</span>;
  if (s.state === "disk")
    return <span className="nsync disk" title="Proje klasöründe notes/notlar.json ve okunabilir kopyası notes/notlar.md">Diske kaydedildi: <code>notes/notlar.json</code>{s.at && <> · {when(s.at).split(" ").pop()}</>}</span>;
  if (s.state === "error") return <span className="nsync warn">Diske yazılamadı; notlar şimdilik yalnızca bu tarayıcıda. Sunucu açıkken kendiliğinden yeniden denenir.</span>;
  return (
    <span className="nsync warn">
      Notlar yalnızca bu tarayıcıda. Diske de yazılması için uygulamayı <code>npm run dev</code> ile aç; ya da <Link to="/profil">Profil → Yedeği indir</Link>.
    </span>
  );
}

/** Notes attached to a program or school, with a button to add one. Used on detail pages. */
export function LinkedNotes({ link }: { link: string }) {
  const { notes } = useStore();
  const mine = visibleNotes(notes.filter(n => n.link === link), "", norm);
  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Notlarım</h3>
        <Link className="btn sm" to={`/notlar?yeni=${encodeURIComponent(link)}`}>Not ekle</Link>
      </div>
      {mine.length ? (
        <ul className="nlinked">
          {mine.map(n => (
            <li key={n.id}>
              <Link to={`/notlar?n=${n.id}`}>{noteTitle(n)}</Link>
              <span className="hint">{when(n.updated)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted small">Bu sayfaya bağlı notun yok.</p>
      )}
    </div>
  );
}

function Editor({ n, onDone }: { n: Note; onDone: () => void }) {
  const { updateNote, deleteNote } = useStore();
  const l = n.link ? noteLink(n.link) : null;
  return (
    <div className="panel neditor">
      <input className="ntitle" type="text" value={n.title} placeholder="Başlık" aria-label="Not başlığı" onChange={e => updateNote(n.id, { title: e.target.value })} />
      <div className="nmeta">
        <select value={n.link ?? ""} onChange={e => updateNote(n.id, { link: e.target.value || undefined })} aria-label="Bağlı program veya okul">
          <option value="">Bağlantı yok</option>
          {data.universities.map(u => (
            <optgroup key={u.id} label={u.short}>
              <option value={`okul:${u.id}`}>{u.short} (okulun geneli)</option>
              {u.programs.map(p => <option key={p.id} value={`${u.id}/${p.id}`}>{p.name}</option>)}
            </optgroup>
          ))}
        </select>
        {l && <Link className="small" to={l.to}>Sayfaya git →</Link>}
        <label className="check"><input type="checkbox" checked={!!n.pinned} onChange={e => updateNote(n.id, { pinned: e.target.checked })} /> Üstte sabitle</label>
      </div>
      <textarea className="nbody" value={n.body} placeholder="Notunu yaz. Her harf kendiliğinden kaydedilir." aria-label="Not metni" onChange={e => updateNote(n.id, { body: e.target.value })} />
      <div className="nfoot">
        <span className="hint">Oluşturuldu {when(n.created)} · son düzenleme {when(n.updated)}</span>
        <button
          type="button"
          className="btn sm danger"
          onClick={() => {
            const empty = !n.title.trim() && !n.body.trim();
            if (!empty && !window.confirm(`"${noteTitle(n)}" silinsin mi?`)) return;
            deleteNote(n.id);
            onDone();
          }}
        >
          Notu sil
        </button>
      </div>
    </div>
  );
}

export function NotesPage() {
  const { notes, addNote, deleteNote, notesSync } = useStore();
  const [sp, setSp] = useSearchParams();
  const [q, setQ] = useState("");
  const current = sp.get("n");
  const list = useMemo(() => visibleNotes(notes, q, norm), [notes, q]);
  const total = notes.filter(n => !n.deleted).length;
  const sel = notes.find(n => n.id === current && !n.deleted);

  const open = (id: string | null) => {
    // leaving an untouched new note behind would only add clutter
    if (sel && sel.id !== id && !sel.title.trim() && !sel.body.trim()) deleteNote(sel.id);
    setSp(id ? { n: id } : {}, { replace: true });
  };

  // "/notlar?yeni=<link>" comes from the "Not ekle" button on program and school pages
  // (the ref keeps StrictMode's double effect run from creating two notes)
  const yeni = sp.get("yeni");
  const handled = useRef<string | null>(null);
  useEffect(() => {
    if (yeni == null || handled.current === yeni) return;
    handled.current = yeni;
    setSp({ n: addNote(yeni || undefined) }, { replace: true });
  }, [yeni, addNote, setSp]);

  return (
    <>
      <header className="page-head">
        <div className="eyebrow">Kendi notların</div>
        <h1>Notlar</h1>
        <p className="lede">Aklına gelenleri buraya yaz; istersen bir programa veya okula bağla, o sayfada da görünür. Yazdıkça kaydedilir.</p>
        <SyncLine s={notesSync} />
      </header>

      <div className={`notes${sel ? " has-sel" : ""}`}>
        <aside className="panel nlist">
          <div className="nlist-head">
            <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Notlarda ara" aria-label="Notlarda ara" />
            <button type="button" className="btn primary" onClick={() => open(addNote())}>Yeni not</button>
          </div>
          {list.length ? (
            <ul>
              {list.map(n => {
                const l = n.link ? noteLink(n.link) : null;
                return (
                  <li key={n.id}>
                    <button type="button" className="nitem" aria-current={n.id === current ? "true" : undefined} onClick={() => open(n.id)}>
                      <span className="nt">{n.pinned && <span className="npin" aria-label="Sabit">●</span>}{noteTitle(n)}</span>
                      <span className="ns">{n.body.trim().replace(/\s+/g, " ").slice(0, 90) || "Boş not"}</span>
                      <span className="nd">{when(n.updated)}{l ? ` · ${l.label}` : ""}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="muted small nempty">{total ? "Aramana uyan not yok." : "Henüz notun yok. \"Yeni not\" ile başla."}</p>
          )}
          <p className="hint nlist-foot">{total} not</p>
        </aside>

        {sel ? (
          <Editor key={sel.id} n={sel} onDone={() => setSp({}, { replace: true })} />
        ) : (
          <div className="panel nplace">
            <p className="muted">Soldan bir not seç ya da yeni bir not başlat.</p>
          </div>
        )}
      </div>
    </>
  );
}
