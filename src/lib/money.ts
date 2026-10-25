import type { Currency, Fx, Money } from "../schema";

const PER_YEAR: Record<Money["per"], number | null> = { semester: 2, year: 1, month: 12, total: null, once: null };

/** Amount per academic year in the original currency; null for one-off or total amounts. */
export function perYear(m: Money): number | null {
  const k = PER_YEAR[m.per];
  return k == null ? null : m.amount * k;
}

export function convert(amount: number, from: Currency, to: Currency, fx: Fx): number | null {
  const a = fx.perEUR[from], b = fx.perEUR[to];
  if (a == null || b == null) return null;
  return (amount / a) * b;
}

const SYMBOL: Record<Currency, string> = { EUR: "€", TRY: "₺", USD: "$", CHF: "CHF ", HUF: "HUF", SEK: "SEK", DKK: "DKK", GBP: "£" };
/** currencies written after the number, Turkish style: "43.700 HUF" */
const SUFFIX = new Set<Currency>(["TRY", "HUF", "SEK", "DKK"]);
const PER_LABEL: Record<Money["per"], string> = { semester: "/dönem", year: "/yıl", month: "/ay", total: " toplam", once: "" };

export function fmtAmount(amount: number, currency: Currency): string {
  // whole amounts stay whole; amounts with cents keep both digits (722,58 €), as the sources publish them
  const digits = Number.isInteger(amount) ? 0 : 2;
  const n = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(amount);
  return SUFFIX.has(currency) ? `${n} ${SYMBOL[currency]}` : `${SYMBOL[currency]}${n}`;
}
export function fmtMoney(m: Money): string {
  return fmtAmount(m.amount, m.currency) + PER_LABEL[m.per];
}
