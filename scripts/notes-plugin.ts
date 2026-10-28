// Vite plugin: mirrors the notes page to notes/notlar.json on disk, so notes survive a cleared
// browser, another port (each port has its own localStorage) or another browser.
// GET /__notes returns the file; PUT merges the sent notes into it and returns the result.
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { join, resolve } from "node:path";
import type { Connect, Plugin } from "vite";
import { mergeNotes, notesMarkdown, type Note } from "../src/lib/notes";

function readNotes(file: string): Note[] {
  if (!existsSync(file)) return [];
  const s = JSON.parse(readFileSync(file, "utf8")) as { notes?: Note[] };
  return Array.isArray(s.notes) ? s.notes : [];
}

function writeNotes(dir: string, file: string, notes: Note[]): void {
  mkdirSync(join(dir, "yedek"), { recursive: true });
  // first write of each day keeps yesterday's file as a dated backup
  const backup = join(dir, "yedek", `notlar-${new Date().toISOString().slice(0, 10)}.json`);
  if (existsSync(file) && !existsSync(backup)) copyFileSync(file, backup);
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, JSON.stringify({ version: 1, saved: new Date().toISOString(), notes }, null, 2) + "\n", "utf8");
  renameSync(tmp, file);
  writeFileSync(join(dir, "notlar.md"), notesMarkdown(notes), "utf8");
}

function body(req: IncomingMessage): Promise<string> {
  return new Promise((ok, fail) => {
    let s = "";
    req.setEncoding("utf8");
    req.on("data", c => {
      s += c;
      if (s.length > 5_000_000) fail(new Error("too large"));
    });
    req.on("end", () => ok(s));
    req.on("error", fail);
  });
}

export function notesPlugin(folder = "notes"): Plugin {
  const dir = resolve(folder);
  const file = join(dir, "notlar.json");
  const handler: Connect.NextHandleFunction = async (req, res: ServerResponse, next) => {
    if (req.url !== "/" && req.url !== "") return next();
    const send = (code: number, data: unknown) => {
      res.statusCode = code;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(data));
    };
    try {
      if (req.method === "GET") return send(200, { notes: readNotes(file) });
      if (req.method === "PUT" || req.method === "POST") {
        const sent = (JSON.parse(await body(req)) as { notes?: Note[] }).notes;
        if (!Array.isArray(sent)) return send(400, { error: "notes missing" });
        const merged = mergeNotes(readNotes(file), sent);
        writeNotes(dir, file, merged);
        return send(200, { notes: merged });
      }
      send(405, { error: "method" });
    } catch (e) {
      send(500, { error: String(e) });
    }
  };
  return {
    name: "mla-notes",
    configureServer(server) {
      server.middlewares.use("/__notes", handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use("/__notes", handler);
    },
  };
}
