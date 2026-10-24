/** Color tier for a published world rank: 1–100 top, 101–200 mid, beyond 200 low. */
export type RankTier = "top" | "mid" | "low";

/** Reads the best position from THE-style rank text ("25", "=143", "301–325", "2001+"). */
export function rankTier(rank: string): RankTier | undefined {
  const m = rank.match(/\d+/);
  if (!m) return undefined;
  const n = Number(m[0]);
  return n <= 100 ? "top" : n <= 200 ? "mid" : "low";
}
