import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../state/store";
import { bavarian, type Profile } from "../lib/eligibility";
import { downloadText } from "../lib/ics";
import { countries } from "../state/data";
import { Flag } from "../components/bits";

const SUGGESTED_AREAS = ["Matematik", "Programlama", "Algoritma ve veri yapıları", "Bilgisayar sistemleri", "Yapay zekâ / ML", "İstatistik"];

export function ProfilePage() {
  const { profile, setProfile, exportJson, importJson } = useStore();
  const [msg, setMsg] = useState("");
  const [area, setArea] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2600);
  };

  const num = (k: keyof Profile, label: string, opts: { min?: number; max?: number; step?: number; hint?: string } = {}) => (
    <div className="field">
      <label htmlFor={`p-${k}`}>{label}</label>
      <input
        id={`p-${k}`}
        type="number"
        min={opts.min ?? 0}
        max={opts.max}
        step={opts.step ?? 1}
        value={(profile[k] as number | undefined) ?? ""}
        onChange={e => setProfile({ ...profile, [k]: e.target.value === "" ? undefined : parseFloat(e.target.value) })}
      />
      {opts.hint && <span className="hint">{opts.hint}</span>}
    </div>
  );

  const de = countries.find(c => c.gpaConversion);
  const ectsEntries = Object.entries(profile.ects);

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Senin bilgilerin</div>
        <h1>Profil</h1>
        <p className="lede">Bu bilgiler yalnızca bu tarayıcıda saklanır ve her programdaki uygunluk etiketlerini hesaplar. Boş bıraktığın alanlar "eksik bilgi" olarak görünür.</p>
      </div>

      <div className="panel">
        <h3>Not ve sınavlar</h3>
        <div className="formgrid">
          {num("gpa", "GNO", { step: 0.01, max: profile.gpaScale === 4 ? 4 : 100 })}
          <div className="field">
            <label htmlFor="p-scale">GNO ölçeği</label>
            <select id="p-scale" value={profile.gpaScale} onChange={e => setProfile({ ...profile, gpaScale: Number(e.target.value) as 4 | 100 })}>
              <option value={4}>4'lük</option>
              <option value={100}>100'lük</option>
            </select>
          </div>
          {num("ales", "ALES SAY", { max: 100, step: 0.01 })}
          {num("yds", "YDS / YÖKDİL", { max: 100, step: 0.25 })}
          {num("ielts", "IELTS", { max: 9, step: 0.5 })}
          {num("toefl", "TOEFL iBT", { max: 120 })}
          {num("greQ", "GRE Quant", { min: 130, max: 170 })}
          <div className="field">
            <label htmlFor="p-eu">Vatandaşlık</label>
            <select id="p-eu" value={profile.nonEU ? "non" : "eu"} onChange={e => setProfile({ ...profile, nonEU: e.target.value === "non" })}>
              <option value="non">AB dışı (T.C.)</option>
              <option value="eu">AB vatandaşı</option>
            </select>
            <span className="hint">Yurt dışı ücret hesabını etkiler</span>
          </div>
        </div>
        {de?.gpaConversion && profile.gpa != null && profile.gpaScale === 4 && (
          <p className="small">
            Alman not sistemindeki karşılığın (Bavyera formülü, <Flag c={de} /> {de.name} kuralı): <b className="num">{bavarian(profile.gpa, de.gpaConversion.nMax, de.gpaConversion.nMin).toFixed(2)}</b>
          </p>
        )}
      </div>

      <div className="panel">
        <h3>Ders uyumu (ECTS)</h3>
        <p className="small muted">Yurt dışı programlar çoğunlukla alan bazında kredi ister (örneğin "matematikte en az 30 ECTS"). Transkriptindeki dersleri alanlara göre toplayıp gir. Türk kredisi genelde ECTS'e eşit değildir; transkriptindeki ECTS sütununu kullan.</p>
        <div className="formgrid">
          {ectsEntries.map(([a, v]) => (
            <div className="field" key={a}>
              <label htmlFor={`e-${a}`}>{a}</label>
              <div className="btnrow" style={{ flexWrap: "nowrap" }}>
                <input id={`e-${a}`} type="number" min={0} value={v} onChange={e => setProfile({ ...profile, ects: { ...profile.ects, [a]: parseFloat(e.target.value) || 0 } })} />
                <button type="button" className="btn sm" aria-label={`${a} alanını sil`} onClick={() => { const n = { ...profile.ects }; delete n[a]; setProfile({ ...profile, ects: n }); }}>×</button>
              </div>
            </div>
          ))}
        </div>
        <div className="btnrow">
          <input type="text" list="area-suggest" placeholder="Alan adı (örn. Matematik)" value={area} onChange={e => setArea(e.target.value)} />
          <datalist id="area-suggest">{SUGGESTED_AREAS.map(a => <option key={a} value={a} />)}</datalist>
          <button type="button" className="btn" disabled={!area.trim() || area.trim() in profile.ects} onClick={() => { setProfile({ ...profile, ects: { ...profile.ects, [area.trim()]: 0 } }); setArea(""); }}>Alan ekle</button>
        </div>
      </div>

      <div className="panel">
        <h3>Yedekle ve taşı</h3>
        <p className="small muted">Profil, kısa liste, karşılaştırma ve başvuru takibi bu tarayıcıda durur. Başka bir bilgisayara taşımak ya da yedeklemek için JSON olarak indir.</p>
        <div className="btnrow">
          <button type="button" className="btn" onClick={() => downloadText("master-atlasi-yedek.json", exportJson(), "application/json")}>Yedeği indir</button>
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>Yedekten yükle</button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={async e => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                importJson(await f.text());
                flash("Yedek yüklendi.");
              } catch (err) {
                flash((err as Error).message || "Dosya okunamadı.");
              }
              e.target.value = "";
            }}
          />
          <Link className="btn primary" to="/programlar?elig=okNear">Bana uyan programları göster</Link>
        </div>
      </div>
      {msg && <div className="toast" role="status">{msg}</div>}
    </>
  );
}
