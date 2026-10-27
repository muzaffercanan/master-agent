// User state kept in localStorage: profile, shortlist, compare list, application tracker, to-do list.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { EMPTY_PROFILE, type Profile } from "../lib/eligibility";

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
}

const KEY = "mla_v2_user";
const EMPTY: UserState = { profile: EMPTY_PROFILE, shortlist: [], compare: [], tracker: {}, checklist: {} };

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
      exportJson: () => JSON.stringify({ version: 2, ...state }, null, 2),
      importJson: text => {
        const s = JSON.parse(text) as Partial<UserState>;
        if (!s || typeof s !== "object" || !("profile" in s)) throw new Error("Bu dosya bir Master Atlası yedeği değil.");
        setState({ ...EMPTY, ...s, profile: { ...EMPTY_PROFILE, ...(s.profile ?? {}) } });
      },
    }),
    [state, setTrack],
  );
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error("StoreProvider eksik");
  return s;
}
