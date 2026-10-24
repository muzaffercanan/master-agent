// npm run links — checks every official link in data/ and reports broken ones.
// Many university sites block HEAD or bots, so a failure here means "look at it", not "definitely broken".
import fs from "node:fs";
import path from "node:path";

const DATA = path.resolve(import.meta.dirname, "../data");
const urls = new Map<string, Set<string>>(); // url -> files that use it

function walk(dir: string) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith(".json")) {
      const text = fs.readFileSync(p, "utf8");
      for (const m of text.matchAll(/"(?:url|link)":\s*"(https?:\/\/[^"]+)"/g)) {
        const set = urls.get(m[1]) ?? new Set();
        set.add(path.relative(DATA, p));
        urls.set(m[1], set);
      }
    }
  }
}
walk(DATA);

async function check(url: string): Promise<string | null> {
  const opts = { redirect: "follow" as const, signal: AbortSignal.timeout(15_000), headers: { "User-Agent": "Mozilla/5.0 (master-atlasi link check)" } };
  try {
    let r = await fetch(url, { ...opts, method: "HEAD" });
    if (r.status === 405 || r.status === 403 || r.status === 400) r = await fetch(url, { ...opts, method: "GET" });
    return r.ok ? null : `HTTP ${r.status}`;
  } catch (e) {
    return (e as Error).name === "TimeoutError" ? "zaman aşımı" : (e as Error).message;
  }
}

const list = [...urls.keys()];
const broken: [string, string][] = [];
let i = 0;
async function worker() {
  while (i < list.length) {
    const url = list[i++];
    const err = await check(url);
    if (err) broken.push([url, err]);
  }
}
await Promise.all(Array.from({ length: 8 }, worker));

console.log(`${list.length} bağlantı kontrol edildi, ${broken.length} sorunlu.`);
for (const [url, err] of broken.sort()) console.log(`  ✗ ${err.padEnd(14)} ${url}\n      ${[...urls.get(url)!].join(", ")}`);
process.exit(broken.length ? 1 : 0);
