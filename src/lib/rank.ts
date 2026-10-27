import type { RankingEntry, RankingTable } from "../schema";

/** Color tier for a published world rank: 1–100 top, 101–200 mid, beyond 200 low. */
export type RankTier = "top" | "mid" | "low";

/** Best position in THE-style rank text ("25", "=143", "301–325", "2001+"); undefined for "Reporter" and the like. */
export function rankPos(rank: string): number | undefined {
  const m = rank.match(/\d+/);
  return m ? Number(m[0]) : undefined;
}

export function rankTier(rank: string): RankTier | undefined {
  const n = rankPos(rank);
  if (n == null) return undefined;
  return n <= 100 ? "top" : n <= 200 ? "mid" : "low";
}

/** Sortable position: bands count by their midpoint ("301–325" → 313), open bands by their floor ("1401+" → 1401). */
export function rankValue(rank: string): number | undefined {
  const m = rank.match(/(\d+)(?:–(\d+))?/);
  if (!m) return undefined;
  const lo = Number(m[1]);
  return m[2] ? Math.round((lo + Number(m[2])) / 2) : lo;
}

export function median(xs: number[]): number | undefined {
  if (!xs.length) return undefined;
  const s = [...xs].sort((a, b) => a - b);
  const k = Math.floor(s.length / 2);
  return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2;
}

export interface RankRow {
  entry: RankingEntry;
  /** rank text per shown source, in the order asked for */
  ranks: (string | undefined)[];
  /** median sortable position over the shown sources that list the school */
  median?: number;
  count: number;
}

/** One row per school listed in at least one of the given sources. */
export function rankingRows(table: RankingTable, sourceIds: string[]): RankRow[] {
  return table.entries
    .map(entry => {
      const ranks = sourceIds.map(id => entry.ranks[id]);
      const vals = ranks.map(r => (r ? rankValue(r) : undefined)).filter((x): x is number => x != null);
      return { entry, ranks, median: median(vals), count: vals.length };
    })
    .filter(r => r.count > 0);
}

/**
 * Ascending by median or by one column (index into the shown sources); unlisted schools go last.
 * By median, schools listed in fewer than half the shown sources follow the rest, so a single good rank can't lead the table.
 */
export function sortRankingRows(rows: RankRow[], by: "median" | number): RankRow[] {
  const shown = rows[0]?.ranks.length ?? 0;
  const key = (r: RankRow) => {
    if (by === "median") return r.median == null ? undefined : r.median + (r.count * 2 < shown ? 1e6 : 0);
    const t = r.ranks[by];
    return t ? rankValue(t) : undefined;
  };
  const byName = (a: RankRow, b: RankRow) => a.entry.short.localeCompare(b.entry.short, "tr");
  return [...rows].sort((a, b) => {
    const x = key(a), y = key(b);
    if (x == null || y == null) return x == null && y == null ? byName(a, b) : x == null ? 1 : -1;
    return x - y || (a.median ?? Infinity) - (b.median ?? Infinity) || byName(a, b);
  });
}
