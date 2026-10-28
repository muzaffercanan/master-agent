// Personal notes. Kept in localStorage and mirrored to notes/notlar.json by the dev server;
// both copies are merged note by note so neither side can wipe the other.

export interface Note {
  id: string;
  title: string;
  body: string;
  /** program key "uni/prog" or "okul:<uniId>" */
  link?: string;
  pinned?: boolean;
  /** ISO timestamps */
  created: string;
  updated: string;
  /** tombstone: kept so a deleted note does not come back from the other copy */
  deleted?: boolean;
}

export function newNote(id: string, now: string, link?: string): Note {
  return { id, title: "", body: "", link, created: now, updated: now };
}

/** Union by id; the later edit wins, and on a tie a deletion wins. */
export function mergeNotes(a: Note[], b: Note[]): Note[] {
  const by = new Map<string, Note>();
  for (const n of [...a, ...b]) {
    const cur = by.get(n.id);
    if (!cur || n.updated > cur.updated || (n.updated === cur.updated && n.deleted && !cur.deleted)) by.set(n.id, n);
  }
  return [...by.values()];
}

/** True when merging `incoming` into `base` would change anything. */
export function notesDiffer(base: Note[], incoming: Note[]): boolean {
  const m = new Map(base.map(n => [n.id, n.updated + (n.deleted ? "x" : "")]));
  return incoming.some(n => {
    const cur = m.get(n.id);
    return cur == null || n.updated + (n.deleted ? "x" : "") > cur;
  });
}

export function noteTitle(n: Note): string {
  return n.title.trim() || n.body.trim().split("\n")[0].slice(0, 60) || "Başlıksız not";
}

/** Lowercase without accents, so "munih" finds "Münih" and "ogrenci" finds "öğrenci". */
const fold = (norm: (s: string) => string, s: string) => norm(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i");

/** Live notes matching every word of q (accent-insensitive), pinned first, newest edit first. */
export function visibleNotes(notes: Note[], q: string, norm: (s: string) => string): Note[] {
  const words = fold(norm, q).split(/\s+/).filter(Boolean);
  return notes
    .filter(n => !n.deleted)
    .filter(n => {
      if (!words.length) return true;
      const hay = fold(norm, `${n.title} ${n.body}`);
      return words.every(w => hay.includes(w));
    })
    .sort((x, y) => Number(!!y.pinned) - Number(!!x.pinned) || y.updated.localeCompare(x.updated));
}

/** "2026-10-28 03:57" in the machine's local time. */
export function localStamp(iso: string): string {
  const d = new Date(iso);
  const p = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** Plain-text copy for notes/notlar.md, readable without the app. */
export function notesMarkdown(notes: Note[], linkLabel: (link: string) => string = l => l): string {
  const live = notes.filter(n => !n.deleted).sort((a, b) => b.updated.localeCompare(a.updated));
  const parts = live.map(n => {
    const meta = [`son düzenleme ${localStamp(n.updated)}`, n.link ? `bağlantı: ${linkLabel(n.link)}` : null, n.pinned ? "sabit" : null].filter(Boolean).join(" · ");
    return `## ${noteTitle(n)}\n\n_${meta}_\n\n${n.body.trim()}\n`;
  });
  return `# Notlarım\n\nBu dosya uygulama tarafından otomatik yazılır; asıl kayıt notlar.json'dadır.\n\n${parts.join("\n")}`;
}
