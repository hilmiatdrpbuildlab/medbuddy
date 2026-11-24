import type { TFunction } from 'i18next';
import { brand } from '@/config/brand';
import { TESTS, flagFor, gpVisit, patient, Flag } from '@/data/labs';
import { METRICS, MetricId, SourceId, summary } from '@/data/wearables';
import { addDays, fmtDate, fmtNum, fmtRange } from '@/lib/format';
import { Question, historyFor } from '@/store/app';

/** Everything the brief needs; serialisable so the QR link can carry it (in the URL hash, never sent to a server). */
export type BriefInput = {
  lang: string;
  reportIds: string[];
  edits: Record<string, Record<string, number>>;
  tests: string[];
  metrics: string[];
  questions: string[];
  generatedAt: string;
};

export type BriefLab = {
  id: string;
  name: string;
  value: string;
  range: string;
  flag: Flag;
  previous: string | null;
  date: string;
  lab: string;
};

export type BriefMetric = { key: string; name: string; source: string; recent: string; baseline: string; delta: string };

export type BriefModel = {
  title: string;
  patientName: string;
  born: string;
  generated: string;
  visit: string;
  labs: BriefLab[];
  metrics: BriefMetric[];
  questions: string[];
  reportsLine: string;
  token: string;
  url: string;
  validUntil: string;
  labels: Record<string, string>;
};

export const questionText = (q: Question, t: TFunction) => (q.text.startsWith('qDefault') ? t(`brief.${q.text}`) : q.text);

export function buildBrief(input: BriefInput, t: TFunction): BriefModel {
  const labs: BriefLab[] = TESTS.filter((x) => input.tests.includes(x.id)).map((test) => {
    const h = historyFor(test.id, input.reportIds, input.edits);
    const last = h[h.length - 1];
    const prev = h.length > 1 ? h[h.length - 2] : null;
    return {
      id: test.id,
      name: t(`tests.${test.id}.name`),
      value: `${fmtNum(last.value, test.decimals)} ${test.unit}`,
      range: `${fmtRange(test.low, test.high, test.decimals)}`,
      flag: flagFor(test, last.value),
      previous: prev ? `${fmtNum(prev.value, test.decimals)} (${fmtDate(prev.date)})` : null,
      date: fmtDate(last.date),
      lab: last.lab,
    };
  });

  const metrics: BriefMetric[] = input.metrics.map((key) => {
    const [source, id] = key.split(':') as [SourceId, MetricId];
    const def = METRICS.find((m) => m.id === id)!;
    const s = summary(source, id);
    const d = s.recent - s.baseline;
    return {
      key,
      name: t(`metrics.${id}.name`),
      source: t(`sources.${source}`),
      recent: `${fmtNum(s.recent, def.decimals)} ${def.unit}`,
      baseline: `${fmtNum(s.baseline, def.decimals)} ${def.unit}`,
      delta: `${d >= 0 ? '+' : '−'}${fmtNum(Math.abs(d), def.decimals)} ${def.unit}`,
    };
  });

  const payload = encode(input);
  const token = 'SJ-7Q2K';
  return {
    title: t('briefDoc.title'),
    patientName: patient.name,
    born: fmtDate(patient.born),
    generated: fmtDate(input.generatedAt),
    visit: `${fmtDate(gpVisit.date)} · ${gpVisit.doctor}`,
    labs,
    metrics,
    questions: input.questions.filter((q) => q.trim()),
    reportsLine: t('briefDoc.reports', { count: input.reportIds.length }),
    token,
    url: `${brand.briefBaseUrl}${token}#${payload}`,
    validUntil: fmtDate(addDays(input.generatedAt.slice(0, 10), brand.briefLinkDays)),
    labels: {
      patient: t('briefDoc.patient'),
      born: t('briefDoc.born'),
      visit: t('briefDoc.visit'),
      generated: t('briefDoc.generated'),
      labs: t('briefDoc.labs'),
      test: t('briefDoc.test'),
      result: t('briefDoc.result'),
      range: t('briefDoc.range'),
      previous: t('briefDoc.previous'),
      below: t('flag.below'),
      above: t('flag.above'),
      wearables: t('briefDoc.wearables'),
      recent: t('briefDoc.recent'),
      baseline: t('briefDoc.baseline'),
      change: t('briefDoc.change'),
      questions: t('briefDoc.questions'),
      disclaimer: t('briefDoc.disclaimer'),
      source: t('briefDoc.source'),
      scan: t('briefDoc.scan'),
    },
  };
}

/* ---------- URL payload (base64url JSON) ---------- */

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

function utf8(s: string) {
  const out: number[] = [];
  for (const ch of s) {
    const cp = ch.codePointAt(0)!;
    if (cp < 0x80) out.push(cp);
    else if (cp < 0x800) out.push(0xc0 | (cp >> 6), 0x80 | (cp & 63));
    else if (cp < 0x10000) out.push(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
    else out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
  }
  return out;
}

function fromUtf8(b: number[]) {
  let s = '';
  for (let i = 0; i < b.length; ) {
    const x = b[i];
    let cp: number;
    if (x < 0x80) {
      cp = x;
      i += 1;
    } else if (x < 0xe0) {
      cp = ((x & 31) << 6) | (b[i + 1] & 63);
      i += 2;
    } else if (x < 0xf0) {
      cp = ((x & 15) << 12) | ((b[i + 1] & 63) << 6) | (b[i + 2] & 63);
      i += 3;
    } else {
      cp = ((x & 7) << 18) | ((b[i + 1] & 63) << 12) | ((b[i + 2] & 63) << 6) | (b[i + 3] & 63);
      i += 4;
    }
    s += String.fromCodePoint(cp);
  }
  return s;
}

export function encode(input: BriefInput) {
  const compact = { l: input.lang, r: input.reportIds, e: input.edits, t: input.tests, m: input.metrics, q: input.questions, g: input.generatedAt };
  const bytes = utf8(JSON.stringify(compact));
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const n = (bytes[i] << 16) | ((bytes[i + 1] ?? 0) << 8) | (bytes[i + 2] ?? 0);
    out += B64[(n >> 18) & 63] + B64[(n >> 12) & 63];
    if (i + 1 < bytes.length) out += B64[(n >> 6) & 63];
    if (i + 2 < bytes.length) out += B64[n & 63];
  }
  return out;
}

export function decode(s: string): BriefInput | null {
  try {
    const bytes: number[] = [];
    let buf = 0;
    let bits = 0;
    for (const ch of s) {
      const v = B64.indexOf(ch);
      if (v < 0) continue;
      buf = (buf << 6) | v;
      bits += 6;
      if (bits >= 8) {
        bits -= 8;
        bytes.push((buf >> bits) & 255);
      }
    }
    const o = JSON.parse(fromUtf8(bytes));
    return { lang: o.l, reportIds: o.r, edits: o.e ?? {}, tests: o.t, metrics: o.m, questions: o.q, generatedAt: o.g };
  } catch {
    return null;
  }
}

/* ---------- Printable A4 HTML (expo-print) ---------- */

const esc = (s: string) => s.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]!);

export function briefHtml(b: BriefModel, qrSvg?: string) {
  const L = b.labels;
  const labRows = b.labs
    .map(
      (l) => `<tr>
  <td>${esc(l.name)}</td>
  <td class="num ${l.flag !== 'within' ? 'off' : ''}">${esc(l.value)}${l.flag !== 'within' ? `<span class="flag">${l.flag === 'below' ? '↓ ' + esc(L.below) : '↑ ' + esc(L.above)}</span>` : ''}</td>
  <td class="num muted">${esc(l.range)}</td>
  <td class="num muted">${l.previous ? esc(l.previous) : '—'}</td>
  <td class="muted">${esc(l.date)} · ${esc(l.lab)}</td></tr>`,
    )
    .join('');
  const metricRows = b.metrics
    .map((m) => `<tr><td>${esc(m.name)} <span class="muted">· ${esc(m.source)}</span></td><td class="num">${esc(m.recent)}</td><td class="num muted">${esc(m.baseline)}</td><td class="num">${esc(m.delta)}</td></tr>`)
    .join('');
  const qs = b.questions.map((q) => `<li>${esc(q)}</li>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(b.title)}</title>
<style>
@page { size: A4; margin: 16mm 15mm; }
* { box-sizing: border-box; }
body { font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #14202A; font-size: 10.5pt; line-height: 1.38; margin: 0; font-variant-numeric: tabular-nums; }
header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0B5D63; padding-bottom: 8px; }
h1 { font-size: 17pt; margin: 0 0 2px; color: #0B5D63; letter-spacing: -0.2px; }
h2 { font-size: 10.5pt; margin: 16px 0 6px; color: #0B5D63; text-transform: uppercase; letter-spacing: 0.6px; }
.meta { display: grid; grid-template-columns: repeat(4, auto); gap: 2px 18px; margin-top: 10px; font-size: 9.5pt; }
.meta b { display: block; font-size: 8pt; color: #55626B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; font-size: 8pt; color: #55626B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; padding: 4px 6px; border-bottom: 1px solid #D9DEE2; }
td { padding: 5px 6px; border-bottom: 1px solid #EEF1F3; vertical-align: top; }
.num { text-align: right; white-space: nowrap; }
th.num { text-align: right; }
.muted { color: #55626B; }
.off { font-weight: 700; }
.flag { display: block; font-size: 8pt; font-weight: 600; color: #8A4B00; }
ol { margin: 0; padding-left: 18px; } li { margin-bottom: 4px; }
footer { margin-top: 18px; padding-top: 8px; border-top: 1px solid #D9DEE2; display: flex; gap: 14px; align-items: center; font-size: 8pt; color: #55626B; }
.qr svg { width: 72px; height: 72px; display: block; }
.brand { font-weight: 700; color: #0B5D63; font-size: 10pt; }
</style></head><body>
<header><div><h1>${esc(b.title)}</h1><div class="muted">${esc(b.reportsLine)}</div></div><div class="brand">${esc(brand.name)}</div></header>
<div class="meta"><div><b>${esc(L.patient)}</b>${esc(b.patientName)}</div><div><b>${esc(L.born)}</b>${esc(b.born)}</div><div><b>${esc(L.visit)}</b>${esc(b.visit)}</div><div><b>${esc(L.generated)}</b>${esc(b.generated)}</div></div>
<h2>${esc(L.labs)}</h2>
<table><thead><tr><th>${esc(L.test)}</th><th class="num">${esc(L.result)}</th><th class="num">${esc(L.range)}</th><th class="num">${esc(L.previous)}</th><th>${esc(L.source)}</th></tr></thead><tbody>${labRows}</tbody></table>
${b.metrics.length ? `<h2>${esc(L.wearables)}</h2><table><thead><tr><th></th><th class="num">${esc(L.recent)}</th><th class="num">${esc(L.baseline)}</th><th class="num">${esc(L.change)}</th></tr></thead><tbody>${metricRows}</tbody></table>` : ''}
${b.questions.length ? `<h2>${esc(L.questions)}</h2><ol>${qs}</ol>` : ''}
<footer>${qrSvg ? `<div class="qr">${qrSvg}</div>` : ''}<div>${esc(L.disclaimer)}<br>${esc(L.scan)} · ${esc(b.token)}</div></footer>
</body></html>`;
}
