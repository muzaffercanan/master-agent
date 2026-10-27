// Loads every JSON file under /data at build time (Vite import.meta.glob) and parses it once.
import { parseDataset, type Dataset } from "./dataset";

const countryFiles = import.meta.glob("/data/countries/*.json", { eager: true, import: "default" });
const uniFiles = import.meta.glob("/data/universities/*/*.json", { eager: true, import: "default" });
const fundingFiles = import.meta.glob("/data/scholarships/*.json", { eager: true, import: "default" });
const rankingFiles = import.meta.glob("/data/rankings/*.json", { eager: true, import: "default" });
const checklist = import.meta.glob("/data/checklist.json", { eager: true, import: "default" })["/data/checklist.json"];
const fields = import.meta.glob("/data/fields.json", { eager: true, import: "default" })["/data/fields.json"];
const fx = import.meta.glob("/data/fx.json", { eager: true, import: "default" })["/data/fx.json"];
const csr = import.meta.glob("/data/tr/csrankings.json", { eager: true, import: "default" })["/data/tr/csrankings.json"];

const entries = (m: Record<string, unknown>) => Object.entries(m).map(([file, json]) => ({ file: file.replace("/data/", ""), json }));

const parsed = parseDataset({ countries: entries(countryFiles), universities: entries(uniFiles), fundings: entries(fundingFiles), rankings: entries(rankingFiles), checklist, fields, fx, csr });

export const dataErrors: string[] = parsed.errors;
export const data: Dataset = parsed.dataset;
