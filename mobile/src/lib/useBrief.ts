import { useTranslation } from 'react-i18next';
import { BriefInput, buildBrief, questionText } from '@/lib/brief';
import { useBriefSelection } from '@/lib/useBriefSelection';
import { useApp } from '@/store/app';

/** The brief as currently configured by the user. */
export function useBrief() {
  const { t, i18n } = useTranslation();
  const s = useApp();
  const { tests, metrics } = useBriefSelection();
  const input: BriefInput = {
    lang: i18n.language,
    reportIds: s.reportIds,
    edits: s.edits,
    tests,
    metrics,
    questions: s.questions.map((q) => questionText(q, t)).filter((q) => q.trim()),
    generatedAt: s.briefGeneratedAt ?? new Date().toISOString(),
  };
  return { input, brief: buildBrief(input, t) };
}
