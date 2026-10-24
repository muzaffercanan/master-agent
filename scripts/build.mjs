// npm run build  -> dist/index.html (full page) + dist/artifact.html (artifact fragment)
// npm run check  -> only validates data/*.json
import fs from "node:fs";
import path from "node:path";
import { DIST, assemble, loadData, validate } from "./lib.mjs";

const checkOnly = process.argv.includes("--check");

let data;
try {
  data = loadData();
} catch (e) {
  console.error("✗ " + e.message);
  process.exit(1);
}
const errs = validate(data);
if (errs.length) {
  console.error(`✗ Veri doğrulaması başarısız (${errs.length} hata):`);
  errs.forEach(e => console.error("  - " + e));
  process.exit(1);
}
const nProg = data.universities.reduce((a, u) => a + u.progs.length, 0);
console.log(`✓ Veri geçerli: ${data.universities.length} üniversite, ${nProg} program, ${data.timeline.length} takvim kaydı`);
if (checkOnly) process.exit(0);

fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, "index.html"), assemble(data, { mode: "page" }));
fs.writeFileSync(path.join(DIST, "artifact.html"), assemble(data, { mode: "artifact" }));
console.log("✓ dist/index.html ve dist/artifact.html yazıldı");
