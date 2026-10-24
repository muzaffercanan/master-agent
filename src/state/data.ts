// Derived, memoised views over the static dataset (computed once per session).
import { data } from "../data";
import { buildViews, type ProgramView } from "../lib/programs";

export { data };
export const views: ProgramView[] = buildViews(data);
export const viewByKey = new Map(views.map(v => [v.key, v]));
export const uniById = new Map(data.universities.map(u => [u.id, u]));
export const countryByCode = new Map(data.countries.map(c => [c.code, c]));
/** countries in display order: Türkiye first, then alphabetical */
export const countries = [...data.countries].sort((a, b) => (a.code === "tr" ? -1 : b.code === "tr" ? 1 : a.name.localeCompare(b.name, "tr")));
