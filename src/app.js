/* Data is injected at build time from data/*.json (see scripts/build.mjs). */
const { meta: META, fields: FIELDS, cities: CITY_ORDER, universities: UNIS, eligibility: CHECK,
        timeline: TIMELINE, csrankings: CSR, sources: SOURCES } = DATA;
const TODAY_FALLBACK = META.todayFallback;

/* ---------- helpers ---------- */
const $ = (s,el=document)=>el.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
const AYLAR = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
function parseD(s){ const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); }
function fmt(d){ return d.getDate()+" "+AYLAR[d.getMonth()]+" "+d.getFullYear(); }
function fmtShort(d){ return d.getDate()+" "+AYLAR[d.getMonth()]; }
function today(){ const n=new Date(); const t=new Date(n.getFullYear(),n.getMonth(),n.getDate()); return isNaN(t)?parseD(TODAY_FALLBACK):t; }
const DAY=86400000;
function daysBetween(a,b){ return Math.round((b-a)/DAY); }
function statusText(ev,T){
  const s=parseD(ev.s), e=ev.e?parseD(ev.e):s;
  const toS=daysBetween(T,s), toE=daysBetween(T,e);
  if(toE<0) return {txt:"geçti", past:true, soon:false};
  if(toS>0) return {txt:toS+" gün sonra", past:false, soon: toS<=21};
  if(ev.e) return {txt:(toE===0?"bugün bitiyor":toE+" gün kaldı"), past:false, soon:true};
  return {txt:"bugün", past:false, soon:true};
}
function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function lsSet(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
const uniById = Object.fromEntries(UNIS.map(u=>[u.id,u]));
const fieldLabel = k => FIELDS[k].n.split(" / ")[0].split(":")[0];
/* Turkish-aware lowercase for search */
function norm(s){ return String(s).replace(/I/g,"ı").replace(/İ/g,"i").toLowerCase(); }
function hi(text,q){
  const t=esc(text);
  if(!q) return t;
  const nt=norm(t), nq=norm(q); let out="", i=0;
  while(true){ const j=nt.indexOf(nq,i); if(j<0){ out+=t.slice(i); break; } out+=t.slice(i,j)+"<mark>"+t.slice(j,j+nq.length)+"</mark>"; i=j+nq.length; }
  return out;
}

/* ---------- theme ---------- */
const SUN='<circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2M12 19.4v2M2.6 12h2M19.4 12h2M5.4 5.4l1.4 1.4M17.2 17.2l1.4 1.4M18.6 5.4l-1.4 1.4M6.8 17.2l-1.4 1.4"/>';
const MOON='<path d="M20 14.2A8.4 8.4 0 019.8 4 8.4 8.4 0 1020 14.2z"/>';
function applyTheme(mode){
  const root=document.documentElement;
  if(mode==="dark"||mode==="light") root.setAttribute("data-theme",mode); else root.removeAttribute("data-theme");
  const dark = mode==="dark" || (mode!=="light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  $("#themeIcon").innerHTML = dark? SUN : MOON;
  $("#themeLbl").textContent = dark? "Açık" : "Koyu";
  $("#themeBtn").setAttribute("aria-label", dark? "Açık temaya geç" : "Koyu temaya geç");
}
function initTheme(){
  let mode = lsGet("mla_theme") || "system";
  applyTheme(mode);
  $("#themeBtn").onclick = ()=>{
    const root=document.documentElement;
    const nowDark = root.getAttribute("data-theme")==="dark" || (!root.hasAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    mode = nowDark? "light" : "dark";
    lsSet("mla_theme",mode); applyTheme(mode);
  };
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{ if(!document.documentElement.hasAttribute("data-theme")) applyTheme("system"); });
}

/* ---------- hero ---------- */
function renderHero(T){
  $("#todayStr").textContent = fmt(T);
  $("#uniCount").textContent = UNIS.length;
  $("#progCount").textContent = UNIS.reduce((a,u)=>a+u.progs.length,0);
  $("#cityCount").textContent = new Set(UNIS.map(u=>u.city)).size;
  const picks = DATA.meta.urgent;
  const upcoming = picks.filter(p=>!statusText(p,T).past);
  const list = upcoming.length?upcoming:TIMELINE.filter(ev=>!statusText(ev,T).past).slice(0,3).map(ev=>({s:ev.s,e:ev.e,w:ev.t,n:ev.d}));
  $("#urgent").innerHTML = list.map(p=>{
    const st=statusText(p,T); const s=parseD(p.s);
    const when = p.e? fmtShort(s)+" – "+fmt(parseD(p.e)) : fmt(s);
    return `<div class="u${st.soon?" hot":""}"><span class="when">${esc(when)}</span><span class="what">${esc(p.w)}</span><span class="small muted">${esc(p.n||"")}</span><span class="left" style="color:${st.soon?"var(--bad)":"var(--ink-2)"}">${esc(st.txt)}</span></div>`;
  }).join("");
}

/* ---------- timeline ---------- */
function renderTimeline(T){
  const groups={};
  TIMELINE.slice().sort((a,b)=>parseD(a.s)-parseD(b.s)).forEach(ev=>{
    const d=parseD(ev.s); const key=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");
    (groups[key]=groups[key]||[]).push(ev);
  });
  $("#timeline").innerHTML = Object.keys(groups).sort().map(k=>{
    const [y,m]=k.split("-").map(Number);
    const items = groups[k].map(ev=>{
      const st=statusText(ev,T); const s=parseD(ev.s);
      const when = ev.e? fmtShort(s)+" – "+fmtShort(parseD(ev.e))+(parseD(ev.e).getFullYear()!==s.getFullYear()?" "+parseD(ev.e).getFullYear():"") : fmtShort(s);
      return `<div class="tl-item${st.past?" past":""}${st.soon&&!st.past?" soon":""}">
        <div class="d">${esc(when)}</div>
        <div class="t">${esc(ev.t)}</div>
        <div class="s"><span class="pill ${ev.k}">${ev.k}</span><span class="left-pill">${esc(st.txt)}</span></div>
        ${ev.d?`<div class="x">${esc(ev.d)}</div>`:""}
      </div>`;
    }).join("");
    return `<div class="tl-month"><div class="m">${AYLAR[m-1]} ${y}</div><div class="tl-items">${items}</div></div>`;
  }).join("");
}

/* ---------- calendar table ---------- */
function renderCal(){
  const order = UNIS.slice().sort((a,b)=>CITY_ORDER.indexOf(a.city)-CITY_ORDER.indexOf(b.city));
  $("#calTable tbody").innerHTML = order.map(u=>`<tr>
    <td><b>${esc(u.short)}</b><span class="sub">${esc(u.city)} · ${esc(u.type)}</span></td>
    <td><span class="pill ${u.fall.k}">${u.fall.k}</span> ${esc(u.fall.t)}</td>
    <td><span class="pill ${u.spring.k}">${u.spring.k}</span> ${esc(u.spring.t)}</td>
    <td><span class="pill tahmin">tahmin</span> ${esc(u.next)}</td>
  </tr>`).join("");
}

/* ---------- checker ---------- */
/* m: number, or {default, tiers:[{gpa, ales}]} where the first tier with gpa >= tier.gpa applies */
function minFor(r,g){
  if(typeof r.m==="number") return r.m;
  if(g==null) return r.m.default;
  const t=r.m.tiers.find(x=>g>=x.gpa);
  return t? t.ales : null;
}
function renderCheck(){
  const ales = parseFloat($("#alesIn").value);
  const gpaRaw = parseFloat($("#gpaIn").value);
  const gpa = isNaN(gpaRaw)?null:gpaRaw;
  const city = $("#cityIn").value;
  lsSet("mla_ales",$("#alesIn").value); lsSet("mla_gpa",$("#gpaIn").value); lsSet("mla_city",city);
  let ok=0,near=0,bad=0;
  const rows = CHECK.filter(r=>!city || uniById[r.u].city===city).map(r=>{
    const u=uniById[r.u];
    const m = minFor(r,gpa);
    let cls, label, order;
    if(r.g!=null && gpa!=null && gpa < r.g){ cls="bad"; label="GNO eşiğin altında"; order=3; }
    else if(m==null){ cls="bad"; label="GNO eşiğin altında"; order=3; }
    else if(m===0){ cls="ok"; label="ALES aranmıyor"; order=1; }
    else if(isNaN(ales)){ cls="na"; label="ALES gir"; order=2; }
    else if(ales>=m){ cls="ok"; label="Asgari şartı geçiyor"; order=0; }
    else if(m-ales<=5){ cls="near"; label=(m-ales).toFixed(1).replace(".0","")+" puan eksik"; order=2; }
    else { cls="bad"; label=(m-ales).toFixed(1).replace(".0","")+" puan eksik"; order=3; }
    if(cls==="ok") ok++; else if(cls==="near") near++; else if(cls==="bad") bad++;
    const mTxt = m===0? "yok" : (m==null? "–" : (typeof r.m==="object"? m+" (GNO'na göre)" : String(m)));
    return {order, html:`<tr>
      <td class="nowrap"><span class="pill ${cls}">${esc(label)}</span></td>
      <td><b>${esc(r.p)}</b>${r.note?`<span class="sub">${esc(r.note)}</span>`:""}</td>
      <td class="nowrap">${esc(u.short)}<span class="sub">${esc(u.city)}</span></td>
      <td class="num">${esc(mTxt)}</td>
      <td class="num">${r.g!=null? r.g.toFixed(2) : "–"}</td>
      <td class="small">${esc(r.e)}</td>
    </tr>`};
  }).sort((a,b)=>a.order-b.order);
  $("#checkTable tbody").innerHTML = rows.map(r=>r.html).join("");
  $("#checkSummary").innerHTML = `<b style="color:var(--ok)">${ok}</b> geçiyor · <b style="color:var(--warn)">${near}</b> sınırda · <b style="color:var(--bad)">${bad}</b> yetmiyor`;
}

/* ---------- favorites ---------- */
let favs = new Set();
function loadFavs(){
  try{ const raw=lsGet("mla_favs"); if(raw) JSON.parse(raw).forEach(id=>{ if(uniById[id]) favs.add(id); }); }catch(e){}
}
function saveFavs(){ lsSet("mla_favs", JSON.stringify([...favs])); }
function syncFavBtn(){
  $("#favCount").textContent = favs.size;
  const b=$("#favBtn");
  b.setAttribute("aria-pressed", String(state.favOnly));
  b.classList.toggle("on", state.favOnly);
}
function toggleFav(id){
  if(favs.has(id)) favs.delete(id); else favs.add(id);
  saveFavs(); syncFavBtn(); renderUnis();
}

/* ---------- uni list ---------- */
let state = {city:"", field:"", q:"", favOnly:false};
function renderFilters(){
  const cities = CITY_ORDER.filter(c=>UNIS.some(u=>u.city===c));
  $("#cityFilters").innerHTML = `<span class="lbl">Şehir</span>` + [["","Tümü"]].concat(cities.map(c=>[c,c])).map(([v,l])=>`<button type="button" class="fbtn" data-city="${esc(v)}" aria-pressed="${state.city===v}">${esc(l)} <span class="muted">${v?UNIS.filter(u=>u.city===v).length:UNIS.length}</span></button>`).join("");
  const fkeys = Object.keys(FIELDS);
  $("#fieldFilters").innerHTML = `<span class="lbl">Alan</span>` + [["","Tüm alanlar"]].concat(fkeys.map(k=>[k,fieldLabel(k)])).map(([v,l])=>`<button type="button" class="fbtn" data-field="${esc(v)}" aria-pressed="${state.field===v}">${esc(l)}</button>`).join("");
  document.querySelectorAll("[data-city]").forEach(b=>b.onclick=()=>{state.city=b.dataset.city; lsSet("mla_fcity",state.city); renderFilters(); renderUnis();});
  document.querySelectorAll("[data-field]").forEach(b=>b.onclick=()=>{state.field=b.dataset.field; lsSet("mla_ffield",state.field); renderFilters(); renderUnis();});
}
function progMatches(p,q){
  return norm(p.n).includes(q) || norm(p.t).includes(q) || p.f.some(k=>norm(FIELDS[k].n).includes(q));
}
function uniMatches(u,q){
  if(!q) return true;
  return norm(u.name).includes(q) || norm(u.short).includes(q) || norm(u.city).includes(q) ||
         norm(u.type).includes(q) || norm(u.lang).includes(q) || norm(u.people.join(" ")).includes(q) ||
         u.progs.some(p=>progMatches(p,q));
}
function uniCard(u){
  const q = norm(state.q);
  const isFav = favs.has(u.id);
  const progs = u.progs.map(p=>{
    const hitField = state.field && p.f.includes(state.field);
    const hitQ = q && progMatches(p,q);
    const tags = p.f.map(k=>`<span class="chip">${esc(fieldLabel(k))}</span>`).join("");
    return `<li class="${hitField||hitQ?"hit":""}"><span class="pn">${hi(p.n,state.q)}</span><span class="pt">${esc(p.t)}</span>${p.d?`<span class="pd">${esc(p.d)}</span>`:""}<span class="tags">${tags}</span></li>`;
  }).join("");
  const people = u.people.length? `<div class="kv"><span class="k">Öne çıkan araştırmacılar</span><ul class="people">${u.people.map(x=>`<li>${hi(x,state.q)}</li>`).join("")}</ul><span class="small muted">CSRankings verisi ve bölüm sayfalarından. Başvurmadan önce hâlâ bölümde olduklarını kontrol et.</span></div>`:"";
  return `<article class="uni${isFav?" fav":""}" id="u-${u.id}">
    <div class="uni-head">
      <div>
        <h4>${hi(u.name,state.q)}</h4>
        <div class="meta"><span class="chip">${esc(u.city)}</span><span class="chip">${esc(u.type)}</span><span class="chip">${esc(u.lang)}</span>${u.yok!=="–"?`<span class="pill kesin">YÖK ${esc(u.yok)}</span>`:""}${u.csr!=="–"?`<span class="pill na">${esc(u.csr)}</span>`:""}</div>
      </div>
      <button class="starbtn" type="button" data-fav="${esc(u.id)}" aria-pressed="${isFav}" title="${isFav?"Kısa listeden çıkar":"Kısa listeye ekle"}">
        <svg viewBox="0 0 24 24" stroke-linejoin="round"><path d="M12 3.6l2.6 5.3 5.9.85-4.25 4.15 1 5.9L12 17l-5.25 2.8 1-5.9L3.5 9.75l5.9-.85z"/></svg>
        <span>${isFav?"Kısa listede":"Kısa listeye ekle"}</span>
      </button>
    </div>
    <div class="uni-body">
      <div>
        <div class="kv"><span class="k">Programlar (${u.progs.length})</span><ul class="progs">${progs}</ul></div>
      </div>
      <div>
        <div class="kv"><span class="k">Güz 2026-27 <span class="pill ${u.fall.k}">${u.fall.k}</span></span><span class="v">${esc(u.fall.t)}</span></div>
        <div class="kv"><span class="k">Bahar <span class="pill ${u.spring.k}">${u.spring.k}</span></span><span class="v">${esc(u.spring.t)}</span></div>
        <div class="kv"><span class="k">Güz 2027 beklentisi</span><span class="v">${esc(u.next)}</span></div>
        <div class="kv"><span class="k">Şartlar</span><span class="v">${esc(u.req)}</span></div>
        <div class="kv"><span class="k">Ücret ve burs</span><span class="v">${esc(u.fund)}</span></div>
        ${people}
        <div class="kv"><span class="k">Resmi sayfalar</span><div class="links">${u.links.map(([l,h])=>`<a href="${esc(h)}" target="_blank" rel="noopener">${esc(l)}</a>`).join("")}</div></div>
      </div>
    </div>
  </article>`;
}
function renderUnis(){
  const q = norm(state.q);
  const list = UNIS.filter(u=>(!state.city||u.city===state.city)
    && (!state.field||u.progs.some(p=>p.f.includes(state.field)))
    && (!state.favOnly||favs.has(u.id))
    && uniMatches(u,q));
  const byCity = {};
  list.forEach(u=>(byCity[u.city]=byCity[u.city]||[]).push(u));
  const parts = [`${list.length} üniversite gösteriliyor`];
  if(state.field) parts.push(`alan: ${FIELDS[state.field].n}`);
  if(state.city) parts.push(`şehir: ${state.city}`);
  if(state.favOnly) parts.push("yalnızca kısa liste");
  if(state.q) parts.push(`arama: "${state.q}"`);
  $("#uniCountLine").textContent = parts.join(" · ");
  const html = CITY_ORDER.filter(c=>byCity[c]).map(c=>`<div class="city-block"><div class="city-title"><h3>${esc(c)}</h3><span class="eyebrow">${byCity[c].length} üniversite</span></div>${byCity[c].map(uniCard).join("")}</div>`).join("");
  $("#uniList").innerHTML = html || `<div class="empty">${state.favOnly&&!favs.size? "Kısa listen henüz boş. Üniversite kartlarındaki yıldıza bas." : "Bu filtrelerle eşleşen üniversite yok. Aramayı temizle ya da filtreyi \"Tümü\" yap."}</div>`;
  document.querySelectorAll("[data-fav]").forEach(b=>b.onclick=()=>toggleFav(b.dataset.fav));
}

/* ---------- search ---------- */
function initSearch(){
  const inp=$("#q"), clr=$("#qClear");
  const run = ()=>{ state.q=inp.value.trim(); clr.hidden = !state.q; renderUnis(); };
  inp.addEventListener("input",run);
  inp.addEventListener("keydown",e=>{ if(e.key==="Escape"){ inp.value=""; run(); } });
  clr.onclick = ()=>{ inp.value=""; run(); inp.focus(); };
  $("#favBtn").onclick = ()=>{ state.favOnly=!state.favOnly; syncFavBtn(); renderUnis();
    if(state.favOnly) document.getElementById("sehirler").scrollIntoView({block:"start"}); };
}

/* ---------- fields ---------- */
function renderFields(){
  $("#fieldList").innerHTML = Object.keys(FIELDS).map(k=>{
    const F=FIELDS[k];
    const byCity={};
    UNIS.forEach(u=>u.progs.forEach(p=>{ if(p.f.includes(k)){ (byCity[u.city]=byCity[u.city]||[]).push(`${u.short}: ${p.n} (${p.t})`);} }));
    const total = Object.values(byCity).reduce((a,b)=>a+b.length,0);
    const where = CITY_ORDER.filter(c=>byCity[c]).map(c=>`<div><b>${esc(c)}</b> · ${byCity[c].map(esc).join(" · ")}</div>`).join("");
    return `<div class="fcard">
      <div style="display:grid;gap:7px;align-content:start">
        <h3>${esc(F.n)}</h3>
        <p class="small">${esc(F.d)}</p>
        <p class="small muted"><b>CS mezunu için:</b> ${esc(F.note)}</p>
        <span class="eyebrow">${total} program kaydı</span>
      </div>
      <div class="where">${where||'<span class="muted">Bu raporda kayıt yok.</span>'}</div>
    </div>`;
  }).join("");
}

/* ---------- csr ---------- */
function renderCSR(){
  const max = Math.max(...CSR.map(r=>r.a));
  $("#csrTable tbody").innerHTML = CSR.map(r=>`<tr>
    <td><b>${esc(r.i)}</b></td>
    <td><div style="display:flex;align-items:center;gap:9px"><span class="num" style="width:34px">${r.a.toFixed(1)}</span><div class="bar" style="flex:1"><i style="width:${(r.a/max*100).toFixed(1)}%"></i></div></div></td>
    <td><div style="display:flex;align-items:center;gap:9px"><span class="num" style="width:34px">${r.b.toFixed(1)}</span><div class="bar" style="flex:1"><i style="width:${(r.b/max*100).toFixed(1)}%"></i></div></div></td>
    <td class="num">${r.p}</td>
    <td class="small">${esc(r.people)}</td>
  </tr>`).join("");
}

function renderSources(){
  $("#srcList").innerHTML = SOURCES.map(([l,h])=>`<li><a href="${esc(h)}" target="_blank" rel="noopener">${esc(l)}</a></li>`).join("");
}

/* ---------- active section in nav ---------- */
function initNavHighlight(){
  const links = [...document.querySelectorAll("nav.toc a")];
  const targets = links.map(a=>document.getElementById(a.getAttribute("href").slice(1))).filter(Boolean);
  if(!("IntersectionObserver" in window) || !targets.length) return;
  const seen = new Map();
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>seen.set(e.target.id, e.intersectionRatio>0 ? e.boundingClientRect.top : Infinity));
    let best=null, bestTop=Infinity;
    seen.forEach((top,id)=>{ if(top<Infinity && Math.abs(top)<Math.abs(bestTop)){ bestTop=top; best=id; } });
    links.forEach(a=>a.classList.toggle("active", best && a.getAttribute("href")==="#"+best));
  }, {rootMargin:"-130px 0px -60% 0px", threshold:[0,.01,.2]});
  targets.forEach(t=>io.observe(t));
}

function init(){
  initTheme();
  const T = today();
  renderHero(T); renderTimeline(T); renderCal();
  const sel=$("#cityIn");
  CITY_ORDER.filter(c=>CHECK.some(r=>uniById[r.u].city===c)).forEach(c=>{ const o=document.createElement("option"); o.value=c; o.textContent=c; sel.appendChild(o); });
  const a=lsGet("mla_ales"), g=lsGet("mla_gpa"), c=lsGet("mla_city");
  if(a!==null) $("#alesIn").value=a;
  if(g!==null) $("#gpaIn").value=g;
  if(c!==null) sel.value=c;
  ["alesIn","gpaIn","cityIn"].forEach(id=>{ $("#"+id).addEventListener("input",renderCheck); $("#"+id).addEventListener("change",renderCheck); });
  renderCheck();
  const fc=lsGet("mla_fcity"), ff=lsGet("mla_ffield");
  if(fc!==null && (fc===""||UNIS.some(u=>u.city===fc))) state.city=fc;
  if(ff!==null && (ff===""||FIELDS[ff])) state.field=ff;
  loadFavs(); syncFavBtn(); initSearch();
  renderFilters(); renderUnis(); renderFields(); renderCSR(); renderSources();
  initNavHighlight();
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
