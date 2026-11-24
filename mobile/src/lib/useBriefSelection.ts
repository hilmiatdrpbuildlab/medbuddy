import type { SourceId } from '@/data/wearables';
import { autoBriefTests, useApp } from '@/store/app';

/** Current brief selection: user choice, or the automatic default. */
export function useBriefSelection() {
  const s = useApp();
  const tests = s.briefTests ?? autoBriefTests(s.reportIds, s.edits, s.questions);
  const sources = (['apple', 'garmin'] as SourceId[]).filter((x) => s.connected[x]);
  let metrics = s.briefMetrics.filter((k) => sources.includes(k.split(':')[0] as SourceId));
  if (!metrics.length && sources.length) metrics = ['rhr', 'hrv', 'sleep'].map((m) => `${sources[0]}:${m}`);
  return { tests, metrics, sources };
}
