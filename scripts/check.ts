// npm run check — validates every file in data/ against the schema and cross-references.
import fs from "node:fs";
import path from "node:path";
import { parseDataset } from "../src/data/dataset";

const DATA = path.resolve(import.meta.dirname, "../data");
const json = (rel: string) => JSON.parse(fs.readFileSync(path.join(DATA, rel), "utf8"));
const list = (dir: string) =>
  fs.existsSync(path.join(DATA, dir)) ? fs.readdirSync(path.join(DATA, dir)).filter(f => f.endsWith(".json")).map(f => `${dir}/${f}`) : [];

let raw;
try {
  raw = {
    countries: list("countries").map(file => ({ file, json: json(file) })),
    universities: fs
      .readdirSync(path.join(DATA, "universities"))
      .flatMap(c => list(`universities/${c}`))
      .map(file => ({ file, json: json(file) })),
    fundings: list("scholarships").map(file => ({ file, json: json(file) })),
    rankings: list("rankings").map(file => ({ file, json: json(file) })),
    fields: json("fields.json"),
    fx: json("fx.json"),
    csr: json("tr/csrankings.json"),
  };
} catch (e) {
  console.error("✗ JSON okunamadı: " + (e as Error).message);
  process.exit(1);
}

const { dataset, errors } = parseDataset(raw);
if (errors.length) {
  console.error(`✗ Veri doğrulaması başarısız (${errors.length} hata):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
const progs = dataset.universities.reduce((a, u) => a + u.programs.length, 0);
const byCountry = dataset.countries.map(c => `${c.code}: ${dataset.universities.filter(u => u.country === c.code).length} okul`).join(", ");
console.log(`✓ Veri geçerli — ${dataset.universities.length} üniversite, ${progs} program (${byCountry}), ${dataset.fundings.length} burs, ${dataset.rankings.map(t => `${t.country} sıralaması: ${t.entries.length} kurum × ${t.sources.length} liste`).join(", ")}`);
