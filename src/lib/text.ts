/** Turkish-aware lowercase for search (I→ı, İ→i). */
export function norm(s: string): string {
  return s.replace(/I/g, "ı").replace(/İ/g, "i").toLowerCase();
}

export const LANG_LABEL: Record<string, string> = { tr: "Türkçe", en: "İngilizce", de: "Almanca", it: "İtalyanca", fr: "Fransızca" };
export const TERM_LABEL: Record<string, string> = { fall: "Güz", spring: "Bahar", winter: "Kış (WiSe)", summer: "Yaz / SoSe" };
export const LEVEL_LABEL: Record<string, string> = {
  "master-thesis": "Tezli / araştırma YL",
  "master-nonthesis": "Tezsiz / profesyonel",
  master: "Yüksek lisans",
  phd: "Doktora",
};
export const TYPE_LABEL: Record<string, string> = { state: "Devlet", foundation: "Vakıf", private: "Özel" };
