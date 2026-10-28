// User state kept in localStorage: profile, shortlist, compare list, application tracker, to-do list, notes.
// Notes are also mirrored to notes/notlar.json through the dev server (scripts/notes-plugin.ts).
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { EMPTY_PROFILE, type Profile } from "../lib/eligibility";
import { mergeNotes, newNote, notesDiffer, type Note } from "../lib/notes";

export const TRACK_STATUSES = ["araştırılıyor", "hazırlanıyor", "başvuruldu", "mülakat", "kabul", "ret", "vazgeçildi"] as const;
export type TrackStatus = (typeof TRACK_STATUSES)[number];
export interface TrackEntry {
  status: TrackStatus;
  docs: Record<string, boolean>;
  notes: string;
  updated: string;
}

interface UserState {
  profile: Profile;
  shortlist: string[]; // program keys "uni/prog"
  compare: string[];
  tracker: Record<string, TrackEntry>;
  /** ticked to-do items by id (data/checklist.json) */
  checklist: Record<string, boolean>;
  /** personal notes, deleted ones kept as tombstones */
  notes: Note[];
}

/** Where the notes are safe: "disk" = written to notes/notlar.json, "local" = only this browser. */
export interface NotesSync {
  state: "loading" | "disk" | "local" | "error";
  at?: string;
}

const KEY = "mla_v2_user";
const EMPTY: UserState = { profile: EMPTY_PROFILE, shortlist: [], compare: [], tracker: {}, checklist: {}, notes: [] };
const NOTES_URL = "./__notes";
const nowIso = () => new Date().toISOString();
const uid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`);

function load(): UserState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const s = JSON.parse(raw) as Partial<UserState>;
    return { ...EMPTY, ...s, profile: { ...EMPTY_PROFILE, ...(s.profile ?? {}) } };
  } catch {
    return EMPTY;
  }
}

interface Store extends UserState {
  setProfile: (p: Profile) => void;
  toggleShortlist: (key: string) => void;
  toggleCompare: (key: string) => void;
  clearCompare: () => void;
  setTrack: (key: string, patch: Partial<TrackEntry>) => void;
  removeTrack: (key: string) => void;
  setChecked: (id: string, done: boolean) => void;
  notesSync: NotesSync;
  /** creates an empty note and returns its id */
  addNote: (link?: string) => string;
  updateNote: (id: string, patch: Partial<Pick<Note, "title" | "body" | "link" | "pinned">>) => void;
  deleteNote: (id: string) => void;
  exportJson: () => string;
  importJson: (text: string) => void;
}

const Ctx = createContext<Store | null>(null);
export const MAX_COMPARE = 4;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserState>(load);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable: keep in memory */
    }
  }, [state]);

  // ---- notes mirror on disk ----
  const [notesSync, setNotesSync] = useState<NotesSync>({ state: "loading" });
  const loaded = useRef(false);
  const lastSent = useRef("");
  const notesRef = useRef(state.notes);
  notesRef.current = state.notes;

  const pushNotes = useCallback(async (notes: Note[], keepalive = false) => {
    const json = JSON.stringify({ notes });
    if (json === lastSent.current) return;
    try {
      const r = await fetch(NOTES_URL, { method: "PUT", headers: { "Content-Type": "application/json" }, body: json, keepalive });
      if (!r.ok) throw new Error(String(r.status));
      lastSent.current = json;
      const disk = ((await r.json()) as { notes: Note[] }).notes;
      setState(s => (notesDiffer(s.notes, disk) ? { ...s, notes: mergeNotes(s.notes, disk) } : s));
      setNotesSync({ state: "disk", at: nowIso() });
    } catch {
      setNotesSync(x => ({ state: x.state === "disk" ? "error" : "local", at: x.at }));
    }
  }, []);

  // read the disk copy on start and whenever the tab comes back into view (another tab or port may have written it)
  useEffect(() => {
    let alive = true;
    const pull = () =>
      fetch(NOTES_URL)
        .then(r => (r.ok && r.headers.get("content-type")?.includes("json") ? r.json() : Promise.reject(new Error("no notes server"))))
        .then((d: { notes: Note[] }) => {
          if (!alive) return;
          const merged = mergeNotes(notesRef.current, d.notes);
          setState(s => (notesDiffer(s.notes, d.notes) ? { ...s, notes: mergeNotes(s.notes, d.notes) } : s));
          loaded.current = true;
          void pushNotes(merged);
        })
        .catch(() => alive && setNotesSync(x => (x.state === "disk" ? { ...x, state: "error" } : { state: "local" })));
    void pull();
    const onShow = () => document.visibilityState === "visible" && void pull();
    document.addEventListener("visibilitychange", onShow);
    return () => {
      alive = false;
      document.removeEventListener("visibilitychange", onShow);
    };
  }, [pushNotes]);

  useEffect(() => {
    if (!loaded.current) return;
    const t = setTimeout(() => void pushNotes(state.notes), 600);
    return () => clearTimeout(t);
  }, [state.notes, pushNotes]);

  useEffect(() => {
    const flush = () => loaded.current && void pushNotes(notesRef.current, true);
    window.addEventListener("pagehide", flush);
    return () => window.removeEventListener("pagehide", flush);
  }, [pushNotes]);

  const toggle = (list: string[], key: string, max = Infinity) =>
    list.includes(key) ? list.filter(k => k !== key) : list.length >= max ? list : [...list, key];

  const setTrack = useCallback((key: string, patch: Partial<TrackEntry>) => {
    setState(s => {
      const prev = s.tracker[key] ?? { status: "araştırılıyor" as TrackStatus, docs: {}, notes: "", updated: "" };
      return { ...s, tracker: { ...s.tracker, [key]: { ...prev, ...patch, updated: new Date().toISOString().slice(0, 10) } } };
    });
  }, []);

  const store = useMemo<Store>(
    () => ({
      ...state,
      setProfile: profile => setState(s => ({ ...s, profile })),
      toggleShortlist: key => setState(s => ({ ...s, shortlist: toggle(s.shortlist, key) })),
      toggleCompare: key => setState(s => ({ ...s, compare: toggle(s.compare, key, MAX_COMPARE) })),
      clearCompare: () => setState(s => ({ ...s, compare: [] })),
      setTrack,
      removeTrack: key =>
        setState(s => {
          const tracker = { ...s.tracker };
          delete tracker[key];
          return { ...s, tracker };
        }),
      setChecked: (id, done) =>
        setState(s => {
          const checklist = { ...s.checklist };
          if (done) checklist[id] = true;
          else delete checklist[id];
          return { ...s, checklist };
        }),
      notesSync,
      addNote: link => {
        const n = newNote(uid(), nowIso(), link);
        setState(s => ({ ...s, notes: [...s.notes, n] }));
        return n.id;
      },
      updateNote: (id, patch) => setState(s => ({ ...s, notes: s.notes.map(n => (n.id === id ? { ...n, ...patch, updated: nowIso() } : n)) })),
      deleteNote: id => setState(s => ({ ...s, notes: s.notes.map(n => (n.id === id ? { ...n, title: "", body: "", deleted: true, updated: nowIso() } : n)) })),
      exportJson: () => JSON.stringify({ version: 2, ...state }, null, 2),
      importJson: text => {
        const s = JSON.parse(text) as Partial<UserState>;
        if (!s || typeof s !== "object" || !("profile" in s)) throw new Error("Bu dosya bir Master Atlası yedeği değil.");
        // notes are merged, never replaced: an old backup must not erase newer notes
        setState(prev => ({ ...EMPTY, ...s, profile: { ...EMPTY_PROFILE, ...(s.profile ?? {}) }, notes: mergeNotes(prev.notes, Array.isArray(s.notes) ? s.notes : []) }));
      },
    }),
    [state, setTrack, notesSync],
  );
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error("StoreProvider eksik");
  return s;
}
