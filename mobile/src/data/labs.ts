/**
 * Synthetic demo data for persona "Sophie Janssens" (fictional).
 * Lab names, values and reports are invented. Codes follow LOINC, units UCUM.
 * All numbers and explanations must be checked by the clinical advisor before pitching.
 */

export type CategoryId = 'blood' | 'iron' | 'vitamins' | 'thyroid' | 'glucose' | 'lipids' | 'kidney';

export type TestDef = {
  id: string;
  loinc: string;
  category: CategoryId;
  unit: string; // UCUM display unit
  decimals: number;
  /** Lab reference range. null = open-ended on that side. */
  low: number | null;
  high: number | null;
  /** Name as printed on the lab report (Dutch, the source language). */
  sourceName: string;
};

export const CATEGORIES: CategoryId[] = ['blood', 'iron', 'vitamins', 'thyroid', 'glucose', 'lipids', 'kidney'];

export const TESTS: TestDef[] = [
  { id: 'hb', loinc: '718-7', category: 'blood', unit: 'g/dL', decimals: 1, low: 12.0, high: 15.5, sourceName: 'Hemoglobine' },
  { id: 'crp', loinc: '1988-5', category: 'blood', unit: 'mg/L', decimals: 1, low: null, high: 5.0, sourceName: 'C-reactief proteïne' },
  { id: 'ferritin', loinc: '2276-4', category: 'iron', unit: 'ng/mL', decimals: 0, low: 15, high: 150, sourceName: 'Ferritine' },
  { id: 'vitd', loinc: '1989-3', category: 'vitamins', unit: 'ng/mL', decimals: 0, low: 30, high: 100, sourceName: '25-OH vitamine D' },
  { id: 'b12', loinc: '2132-9', category: 'vitamins', unit: 'pg/mL', decimals: 0, low: 200, high: 900, sourceName: 'Vitamine B12' },
  { id: 'tsh', loinc: '3016-3', category: 'thyroid', unit: 'mIU/L', decimals: 2, low: 0.4, high: 4.0, sourceName: 'TSH' },
  { id: 'glucose', loinc: '1558-6', category: 'glucose', unit: 'mg/dL', decimals: 0, low: 70, high: 100, sourceName: 'Glucose nuchter' },
  { id: 'hba1c', loinc: '4548-4', category: 'glucose', unit: '%', decimals: 1, low: 4.0, high: 5.6, sourceName: 'HbA1c' },
  { id: 'chol', loinc: '2093-3', category: 'lipids', unit: 'mg/dL', decimals: 0, low: null, high: 190, sourceName: 'Totaal cholesterol' },
  { id: 'ldl', loinc: '13457-7', category: 'lipids', unit: 'mg/dL', decimals: 0, low: null, high: 115, sourceName: 'LDL-cholesterol (berekend)' },
  { id: 'hdl', loinc: '2085-9', category: 'lipids', unit: 'mg/dL', decimals: 0, low: 45, high: null, sourceName: 'HDL-cholesterol' },
  { id: 'creat', loinc: '2160-0', category: 'kidney', unit: 'mg/dL', decimals: 2, low: 0.51, high: 0.95, sourceName: 'Creatinine' },
];

export const testById = (id: string) => TESTS.find((t) => t.id === id)!;

export type LabReport = {
  id: string;
  lab: string;
  labAddress: string;
  date: string; // ISO date of sampling
  requester: string;
  sampleId: string;
  values: Record<string, number>;
};

export const REPORTS: LabReport[] = [
  {
    id: 'r2024',
    lab: 'Labo Noord',
    labAddress: 'Kortrijksesteenweg 112, 9000 Gent',
    date: '2024-10-14',
    requester: 'Dr. A. Peeters',
    sampleId: 'LN-24-118204',
    values: { hb: 13.4, crp: 1.2, ferritin: 52, vitd: 34, b12: 410, tsh: 1.8, glucose: 86, hba1c: 5.1, chol: 182, ldl: 104, hdl: 62, creat: 0.78 },
  },
  {
    id: 'r2025',
    lab: 'Centrum Klinische Biologie',
    labAddress: 'Sint-Pietersnieuwstraat 40, 9000 Gent',
    date: '2025-11-03',
    requester: 'Dr. A. Peeters',
    sampleId: 'CKB-25-77310',
    values: { hb: 13.1, crp: 0.8, ferritin: 31, vitd: 27, b12: 365, tsh: 2.1, glucose: 88, hba1c: 5.2, chol: 176, ldl: 98, hdl: 64, creat: 0.81 },
  },
  {
    id: 'r2026',
    lab: 'Labo Noord',
    labAddress: 'Kortrijksesteenweg 112, 9000 Gent',
    date: '2026-11-20',
    requester: 'Dr. A. Peeters',
    sampleId: 'LN-26-203117',
    values: { hb: 12.6, crp: 2.1, ferritin: 18, vitd: 22, b12: 342, tsh: 2.3, glucose: 91, hba1c: 5.2, chol: 188, ldl: 109, hdl: 61, creat: 0.79 },
  },
];

/** The report that the demo "imports" live. */
export const NEW_REPORT_ID = 'r2026';
export const INITIAL_REPORT_IDS = ['r2024', 'r2025'];

export const reportById = (id: string) => REPORTS.find((r) => r.id === id)!;

export type Flag = 'below' | 'above' | 'within';

export function flagFor(t: TestDef, v: number): Flag {
  if (t.low != null && v < t.low) return 'below';
  if (t.high != null && v > t.high) return 'above';
  return 'within';
}

export const patient = {
  name: 'Sophie Janssens',
  firstName: 'Sophie',
  born: '1992-03-08',
  city: 'Gent',
  email: 'sophie',
};

export const gpVisit = {
  date: '2026-12-03T09:40:00',
  doctor: 'Dr. An Peeters',
  practice: 'Huisartsenpraktijk Sint-Pieters, Gent',
};
