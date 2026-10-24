// Shared build logic: load data, validate it, assemble the page.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const DIST = path.join(ROOT, "dist");

const DATA_FILES = {
  meta: "meta.json",
  fields: "fields.json",
  cities: "cities.json",
  universities: "universities.json",
  eligibility: "eligibility.json",
  timeline: "timeline.json",
  csrankings: "csrankings.json",
  sources: "sources.json",
};

export function loadData() {
  const data = {};
  for (const [key, file] of Object.entries(DATA_FILES)) {
    const p = path.join(ROOT, "data", file);
    try {
      data[key] = JSON.parse(fs.readFileSync(p, "utf8"));
    } catch (e) {
      throw new Error(`data/${file} okunamadı: ${e.message}`);
    }
  }
  return data;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const STATUS = new Set(["kesin", "tahmin"]);

/** Returns a list of human-readable problems; empty list means the data is consistent. */
export function validate(d) {
  const errs = [];
  const err = (where, msg) => errs.push(`${where}: ${msg}`);
  const validDate = s => DATE.test(s) && !isNaN(new Date(s + "T00:00:00"));

  const fieldKeys = new Set(Object.keys(d.fields));
  const cities = new Set(d.cities);
  const ids = new Set();

  d.universities.forEach((u, i) => {
    const w = `universities[${i}] (${u.id ?? "?"})`;
    for (const k of ["id", "name", "short", "city", "type", "lang", "next", "req", "fund"])
      if (typeof u[k] !== "string" || !u[k]) err(w, `"${k}" eksik`);
    if (ids.has(u.id)) err(w, "id tekrar ediyor");
    ids.add(u.id);
    if (!cities.has(u.city)) err(w, `şehir "${u.city}" cities.json'da yok`);
    for (const k of ["fall", "spring"]) {
      if (!u[k] || typeof u[k].t !== "string") err(w, `"${k}.t" eksik`);
      else if (!STATUS.has(u[k].k)) err(w, `"${k}.k" kesin|tahmin olmalı`);
    }
    if (!Array.isArray(u.progs) || !u.progs.length) err(w, "program listesi boş");
    (u.progs || []).forEach((p, j) => {
      if (!p.n || !p.t) err(`${w}.progs[${j}]`, "ad (n) ve tür (t) zorunlu");
      if (!Array.isArray(p.f) || !p.f.length) err(`${w}.progs[${j}]`, "en az bir alan (f) gerekli");
      (p.f || []).forEach(f => fieldKeys.has(f) || err(`${w}.progs[${j}]`, `bilinmeyen alan "${f}"`));
    });
    if (!Array.isArray(u.people)) err(w, '"people" dizi olmalı');
    (u.links || []).forEach(([l, h], j) => (!l || !/^https?:\/\//.test(h)) && err(`${w}.links[${j}]`, "geçersiz bağlantı"));
  });

  d.eligibility.forEach((r, i) => {
    const w = `eligibility[${i}] (${r.p ?? "?"})`;
    if (!ids.has(r.u)) err(w, `bilinmeyen üniversite "${r.u}"`);
    if (typeof r.m === "number") {
      if (r.m < 0 || r.m > 100) err(w, "ALES 0–100 arası olmalı");
    } else if (r.m && Array.isArray(r.m.tiers) && typeof r.m.default === "number") {
      const g = r.m.tiers.map(t => t.gpa);
      if (g.some((x, k) => k && x > g[k - 1])) err(w, "tiers büyükten küçüğe GNO sıralı olmalı");
    } else err(w, '"m" sayı ya da {default, tiers} olmalı');
    if (r.g != null && (typeof r.g !== "number" || r.g < 0 || r.g > 4)) err(w, "GNO 0–4 arası olmalı");
  });

  d.timeline.forEach((ev, i) => {
    const w = `timeline[${i}] (${ev.t ?? "?"})`;
    if (!validDate(ev.s)) err(w, `başlangıç tarihi "${ev.s}" YYYY-AA-GG değil`);
    if (ev.e != null && !validDate(ev.e)) err(w, `bitiş tarihi "${ev.e}" YYYY-AA-GG değil`);
    if (ev.e && ev.e < ev.s) err(w, "bitiş başlangıçtan önce");
    if (!STATUS.has(ev.k)) err(w, "k kesin|tahmin olmalı");
  });

  (d.meta.urgent || []).forEach((p, i) => {
    if (!validDate(p.s) || (p.e && !validDate(p.e))) err(`meta.urgent[${i}]`, "tarih biçimi hatalı");
  });
  if (!validDate(d.meta.todayFallback)) err("meta.todayFallback", "tarih biçimi hatalı");
  d.sources.forEach(([l, h], i) => (!l || !/^https?:\/\//.test(h)) && err(`sources[${i}]`, "geçersiz kaynak"));
  return errs;
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

/**
 * Assemble the page.
 * mode "page": full HTML document for local use / static hosting.
 * mode "artifact": fragment without <html>/<head>/<body>, for publishing as a Claude artifact.
 */
export function assemble(data, { mode = "page", liveReload = false } = {}) {
  // "</" inside JSON could close the <script> tag early
  const json = JSON.stringify(data).replace(/<\//g, "<\\/");
  const script = `<script>\nconst DATA = ${json};\n${read("src/app.js")}</script>\n`;
  const reload = liveReload
    ? `<script>new EventSource("/__reload").onmessage=()=>location.reload();</script>\n`
    : "";
  const head = read("src/head.html");
  const body = read("src/body.html");
  if (mode === "artifact") return head + body + script;
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
${head}</head>
<body>
${body}${script}${reload}</body>
</html>
`;
}
