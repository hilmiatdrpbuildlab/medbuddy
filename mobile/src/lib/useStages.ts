import { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '@/store/app';
import { haptic } from './feedback';

export type Stage = { key: string; ms: number };

/**
 * Runs a list of staged steps with realistic, jittered timing (±20%).
 * Fast mode (Demo controls) runs at ~25% for rehearsals.
 * `progress` is 0..1 within the current stage, for progress bars.
 */
export function useStages(stages: Stage[], onDone: () => void, { autoStart = true } = {}) {
  const fast = useApp((s) => s.fastMode);
  const [index, setIndex] = useState(autoStart ? 0 : -1);
  const [progress, setProgress] = useState(0);
  const cancelled = useRef(false);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (index < 0 || index >= stages.length) return;
    const total = stages[index].ms * (0.8 + Math.random() * 0.4) * (fast ? 0.25 : 1);
    const start = Date.now();
    const iv = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / total);
      setProgress(p);
      if (p < 1) return;
      clearInterval(iv);
      if (cancelled.current) return;
      haptic.light();
      setIndex(index + 1);
      if (index + 1 >= stages.length) doneRef.current();
    }, 50);
    return () => clearInterval(iv);
  }, [index, stages, fast]);

  const start = useCallback(() => setIndex(0), []);
  const cancel = useCallback(() => {
    cancelled.current = true;
  }, []);

  return { index, progress, done: index >= stages.length, start, cancel };
}

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
