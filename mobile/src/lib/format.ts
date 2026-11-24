import i18n from 'i18next';

const LOCALES: Record<string, string> = { en: 'en-GB', nl: 'nl-BE', fr: 'fr-BE' };
export const locale = () => LOCALES[i18n.language] ?? 'en-GB';

export function fmtNum(v: number, decimals = 0) {
  return new Intl.NumberFormat(locale(), { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v);
}

const d = (iso: string) => new Date(iso.length === 10 ? iso + 'T12:00:00' : iso);

/** 20 Nov 2026 / 20 nov. 2026 */
export const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat(locale(), { day: 'numeric', month: 'short', year: 'numeric' }).format(d(iso));

/** Nov 2024 — chart axis */
export const fmtMonthYear = (iso: string) =>
  new Intl.DateTimeFormat(locale(), { month: 'short', year: 'numeric' }).format(d(iso));

/** Thu 3 Dec */
export const fmtDay = (iso: string) =>
  new Intl.DateTimeFormat(locale(), { weekday: 'short', day: 'numeric', month: 'short' }).format(d(iso));

export const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat(locale(), { hour: '2-digit', minute: '2-digit', hour12: false }).format(d(iso));

export function fmtRange(low: number | null, high: number | null, decimals: number) {
  if (low != null && high != null) return `${fmtNum(low, decimals)}–${fmtNum(high, decimals)}`;
  if (high != null) return `< ${fmtNum(high, decimals)}`;
  if (low != null) return `> ${fmtNum(low, decimals)}`;
  return '—';
}

export function addDays(iso: string, n: number) {
  const x = d(iso);
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
}
