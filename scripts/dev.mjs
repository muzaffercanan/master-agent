// npm run dev -> http://localhost:5173, rebuilds on every change in src/ or data/ and reloads the browser.
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { ROOT, assemble, loadData, validate } from "./lib.mjs";

const PORT = Number(process.env.PORT) || 5173;
const clients = new Set();
let page = "";

function errorPage(lines) {
  const items = lines.map(l => `<li>${l.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c])}</li>`).join("");
  return `<!doctype html><meta charset="utf-8"><title>Derleme hatası</title>
<body style="font:15px system-ui;padding:32px;max-width:900px">
<h1 style="color:#b42318">Derleme hatası</h1><ul>${items}</ul>
<script>new EventSource("/__reload").onmessage=()=>location.reload();</script></body>`;
}

function rebuild() {
  try {
    const data = loadData();
    const errs = validate(data);
    if (errs.length) {
      page = errorPage(errs);
      console.error(`✗ ${errs.length} veri hatası (tarayıcıda listelendi)`);
    } else {
      page = assemble(data, { mode: "page", liveReload: true });
      console.log(`✓ ${new Date().toLocaleTimeString("tr-TR")} derlendi`);
    }
  } catch (e) {
    page = errorPage([e.message]);
    console.error("✗ " + e.message);
  }
  for (const res of clients) res.write("data: reload\n\n");
}

rebuild();

let timer;
for (const dir of ["src", "data"]) {
  fs.watch(path.join(ROOT, dir), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 120);
  });
}

http
  .createServer((req, res) => {
    if (req.url === "/__reload") {
      res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
      res.write("retry: 1000\n\n");
      clients.add(res);
      req.on("close", () => clients.delete(res));
      return;
    }
    if (req.url === "/" || req.url.startsWith("/?") || req.url.startsWith("/#") || req.url === "/index.html") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      res.end(page);
      return;
    }
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Bulunamadı");
  })
  .listen(PORT, () => console.log(`→ http://localhost:${PORT}  (src/ ve data/ izleniyor, çıkmak için Ctrl+C)`));
