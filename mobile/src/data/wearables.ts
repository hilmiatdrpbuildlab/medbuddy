/**
 * Synthetic 180-day wearable history for the demo persona.
 * Deterministic (seeded) so every run of the demo shows identical numbers.
 * Story: sleep duration drifts down over the last 90 days; everything else is stable.
 */

export type SourceId = 'apple' | 'garmin';
export type MetricId = 'rhr' | 'hrv' | 'sleep' | 'vo2';

export type MetricDef = { id: MetricId; unit: string; decimals: number };

export const METRICS: MetricDef[] = [
  { id: 'rhr', unit: 'bpm', decimals: 0 },
  { id: 'hrv', unit: 'ms', decimals: 0 },
  { id: 'sleep', unit: 'h', decimals: 1 },
  { id: 'vo2', unit: 'mL/kg/min', decimals: 1 },
];

export const DAYS = 180;
/** Last day of data = the demo's "today". */
export const TODAY = '2026-11-23';

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Shape = { base: number; recent: number; noise: number; weekly?: number };

const SHAPES: Record<SourceId, Record<MetricId, Shape>> = {
  apple: {
    rhr: { base: 56, recent: 58, noise: 1.6, weekly: 0.8 },
    hrv: { base: 52, recent: 47, noise: 5 },
    sleep: { base: 7.5, recent: 6.6, noise: 0.45, weekly: 0.35 },
    vo2: { base: 41.2, recent: 40.6, noise: 0.25 },
  },
  garmin: {
    rhr: { base: 55, recent: 57, noise: 1.5, weekly: 0.7 },
    hrv: { base: 49, recent: 45, noise: 4.5 },
    sleep: { base: 7.4, recent: 6.5, noise: 0.5, weekly: 0.35 },
    vo2: { base: 42, recent: 41, noise: 0.3 },
  },
};

function series(source: SourceId, metric: MetricId): number[] {
  const sh = SHAPES[source][metric];
  const r = rng((source === 'apple' ? 11 : 29) * 97 + metric.charCodeAt(0) * 13 + metric.length);
  const out: number[] = [];
  for (let d = 0; d < DAYS; d++) {
    // First 90 days hold at baseline; last 90 ease toward "recent".
    const t = d < 90 ? 0 : (d - 90) / 89;
    const ease = t * t * (3 - 2 * t);
    const trend = sh.base + (sh.recent - sh.base) * ease;
    const weekly = sh.weekly ? Math.sin((d / 7) * Math.PI * 2) * sh.weekly : 0;
    out.push(trend + weekly + (r() - 0.5) * 2 * sh.noise);
  }
  return out;
}

const cache = new Map<string, number[]>();
export function getSeries(source: SourceId, metric: MetricId) {
  const k = source + metric;
  if (!cache.has(k)) cache.set(k, series(source, metric));
  return cache.get(k)!;
}

const avg = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;

/** 90-day average vs the 90 days before it. */
export function summary(source: SourceId, metric: MetricId) {
  const s = getSeries(source, metric);
  return { recent: avg(s.slice(90)), baseline: avg(s.slice(0, 90)) };
}

/** Weekly averages, for a calm chart without daily noise. */
export function weekly(source: SourceId, metric: MetricId) {
  const s = getSeries(source, metric);
  const out: number[] = [];
  for (let i = 0; i + 7 <= s.length; i += 7) out.push(avg(s.slice(i, i + 7)));
  return out;
}
