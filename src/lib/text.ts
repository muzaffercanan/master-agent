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

/** Turkish names for study countries that appear in scholarship records. */
export const COUNTRY_NAME: Record<string, string> = {
  tr: "Türkiye", de: "Almanya", it: "İtalya", at: "Avusturya", fr: "Fransa", es: "İspanya", pt: "Portekiz", nl: "Hollanda", be: "Belçika",
  fi: "Finlandiya", se: "İsveç", no: "Norveç", dk: "Danimarka", ee: "Estonya", si: "Slovenya", hr: "Hırvatistan", hu: "Macaristan",
  cz: "Çekya", gr: "Yunanistan", mk: "Kuzey Makedonya", ie: "İrlanda", pl: "Polonya", gb: "Birleşik Krallık", ch: "İsviçre",
  il: "İsrail", jp: "Japonya", cn: "Çin", kr: "Güney Kore", us: "ABD", ca: "Kanada",
};
export const countryName = (code: string) => COUNTRY_NAME[code] ?? code.toUpperCase();

/** Locative suffix by vowel harmony and consonant hardening: "Türkiye'de", "Almanya'da", "Mısır'da", "Irak'ta". */
export function locative(name: string): string {
  const vowels = name.toLocaleLowerCase("tr").match(/[aıoueiöü]/g);
  const front = vowels ? "eiöü".includes(vowels[vowels.length - 1]) : false;
  const hard = /[çfhkpsşt]$/i.test(name);
  return `${name}'${hard ? "t" : "d"}${front ? "e" : "a"}`;
}
