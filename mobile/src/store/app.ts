import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { INITIAL_REPORT_IDS, REPORTS, TESTS, flagFor } from '@/data/labs';
import type { SourceId } from '@/data/wearables';

export type Lang = 'en' | 'nl' | 'fr';
export type Appearance = 'system' | 'light' | 'dark';
export type ImportSource = 'pdf' | 'photo' | 'portal' | 'email';

type Consents = { labs: boolean; wearables: boolean; ai: boolean };

export type Question = { id: string; text: string; testId?: string };

type State = {
  onboarded: boolean;
  lang: Lang;
  appearance: Appearance;
  consents: Consents;
  reportIds: string[];
  /** User corrections made during review: reportId -> testId -> value */
  edits: Record<string, Record<string, number>>;
  connected: Record<SourceId, boolean>;
  questions: Question[];
  /** Test ids chosen for the brief; null = automatic (latest out-of-range + key results). */
  briefTests: string[] | null;
  briefMetrics: string[];
  briefGeneratedAt: string | null;
  deleteOriginals: boolean;
  // Demo controls
  fastMode: boolean;
  offline: boolean;
  inbound: boolean;
};

type Actions = {
  set: (p: Partial<State>) => void;
  addReport: (id: string, edits?: Record<string, number>) => void;
  addQuestion: (q: Omit<Question, 'id'>) => boolean;
  updateQuestion: (id: string, text: string) => void;
  removeQuestion: (id: string) => void;
  reset: () => void;
  wipe: () => void;
};

const initialQuestions = (): Question[] => [
  { id: 'q1', text: 'qDefault1' },
  { id: 'q2', text: 'qDefault2' },
  { id: 'q3', text: 'qDefault3' },
];

const initial: State = {
  onboarded: false,
  lang: 'en',
  appearance: 'system',
  consents: { labs: true, wearables: true, ai: false },
  reportIds: INITIAL_REPORT_IDS,
  edits: {},
  connected: { apple: false, garmin: false },
  questions: initialQuestions(),
  briefTests: null,
  briefMetrics: ['apple:rhr', 'apple:hrv', 'apple:sleep'],
  briefGeneratedAt: null,
  deleteOriginals: true,
  fastMode: false,
  offline: false,
  inbound: false,
};

export const useApp = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initial,
      set: (p) => set(p),
      addReport: (id, edits) =>
        set((s) => ({
          reportIds: s.reportIds.includes(id) ? s.reportIds : [...s.reportIds, id],
          edits: edits && Object.keys(edits).length ? { ...s.edits, [id]: edits } : s.edits,
          briefTests: null,
        })),
      addQuestion: (q) => {
        const s = get();
        if (q.testId && s.questions.some((x) => x.testId === q.testId)) return false;
        set({ questions: [...s.questions, { ...q, id: 'q' + Date.now() }] });
        return true;
      },
      updateQuestion: (id, text) => set((s) => ({ questions: s.questions.map((q) => (q.id === id ? { ...q, text } : q)) })),
      removeQuestion: (id) => set((s) => ({ questions: s.questions.filter((q) => q.id !== id) })),
      reset: () => {
        const { lang, appearance } = get();
        set({ ...initial, questions: initialQuestions(), lang, appearance, onboarded: false });
      },
      wipe: () => set({ reportIds: [], edits: {}, connected: { apple: false, garmin: false }, briefGeneratedAt: null }),
    }),
    {
      name: 'vitalsbrief-demo',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ inbound, ...rest }) => rest as unknown as State,
    },
  ),
);

/* ---------- Derived data ---------- */

export type Result = { reportId: string; date: string; lab: string; value: number };

export function sortedReports(ids: string[]) {
  return REPORTS.filter((r) => ids.includes(r.id)).sort((a, b) => a.date.localeCompare(b.date));
}

export function valueOf(reportId: string, testId: string, edits: State['edits']) {
  const r = REPORTS.find((x) => x.id === reportId)!;
  return edits[reportId]?.[testId] ?? r.values[testId];
}

export function historyFor(testId: string, ids: string[], edits: State['edits']): Result[] {
  return sortedReports(ids).map((r) => ({ reportId: r.id, date: r.date, lab: r.lab, value: valueOf(r.id, testId, edits) }));
}

export function latestFor(testId: string, ids: string[], edits: State['edits']): Result | undefined {
  const h = historyFor(testId, ids, edits);
  return h[h.length - 1];
}

/** Automatic brief selection: everything outside the lab range + the tests with questions. */
export function autoBriefTests(ids: string[], edits: State['edits'], questions: Question[]) {
  const out = TESTS.filter((t) => {
    const l = latestFor(t.id, ids, edits);
    return l && flagFor(t, l.value) !== 'within';
  }).map((t) => t.id);
  for (const q of questions) if (q.testId && !out.includes(q.testId)) out.push(q.testId);
  if (!out.includes('ferritin')) out.push('ferritin');
  for (const id of ['hb', 'tsh']) if (out.length < 5 && !out.includes(id)) out.push(id);
  return out;
}
