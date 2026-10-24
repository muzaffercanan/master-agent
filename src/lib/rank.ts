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
