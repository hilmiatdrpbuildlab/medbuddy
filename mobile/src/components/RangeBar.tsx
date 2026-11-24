import { ArrowDown, ArrowUp } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Flag, TestDef, flagFor } from '@/data/labs';
import { fmtNum, fmtRange } from '@/lib/format';
import { useTheme } from '@/theme';
import { Txt } from './ui';

/** Domain that keeps the lab range in the middle ~55% of the track. */
export function domainFor(t: TestDef, values: number[]) {
  const lo = t.low ?? 0;
  const hi = t.high ?? (t.low ?? 1) * 2.2;
  const span = hi - lo;
  let min = t.low == null ? 0 : lo - span * 0.4;
  let max = hi + span * 0.4;
  for (const v of values) {
    if (v < min) min = v - span * 0.1;
    if (v > max) max = v + span * 0.1;
  }
  return { min: Math.max(0, min), max, lo, hi: t.high == null ? max : hi };
}

/**
 * The signature element: the lab's own range as a band, the value as a marker.
 * Outside the range the marker turns amber and the words say so; colour never carries it alone.
 */
export function RangeBar({ test, value, compact }: { test: TestDef; value: number; compact?: boolean }) {
  const { c } = useTheme();
  const { min, max, lo, hi } = domainFor(test, [value]);
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const flag = flagFor(test, value);
  const off = flag !== 'within';
  const h = compact ? 6 : 8;
  const dot = compact ? 12 : 14;
  return (
    <View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden style={{ height: dot + 2, justifyContent: 'center' }}>
      <View style={{ height: h, borderRadius: h / 2, backgroundColor: c.sunken }} />
      <View
        style={{
          position: 'absolute',
          left: `${pct(lo)}%`,
          width: `${pct(hi) - pct(lo)}%`,
          height: h,
          borderRadius: h / 2,
          backgroundColor: c.band,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: `${Math.min(97, Math.max(0, pct(value)))}%`,
          marginLeft: -dot / 2,
          width: dot,
          height: dot,
          borderRadius: dot / 2,
          backgroundColor: off ? c.amber : c.marker,
          borderWidth: 2.5,
          borderColor: c.surface,
        }}
      />
    </View>
  );
}

export function FlagLabel({ flag }: { flag: Flag }) {
  const { t } = useTranslation();
  const { c } = useTheme();
  if (flag === 'within') return null;
  const Icon = flag === 'below' ? ArrowDown : ArrowUp;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: c.amberSoft, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 }}>
      <Icon size={13} color={c.amber} strokeWidth={2.4} />
      <Txt v="caption" tone="amber">
        {t(flag === 'below' ? 'flag.below' : 'flag.above')}
      </Txt>
    </View>
  );
}

export function rangeText(test: TestDef) {
  return `${fmtRange(test.low, test.high, test.decimals)} ${test.unit}`;
}

export function valueText(test: TestDef, v: number) {
  return `${fmtNum(v, test.decimals)} ${test.unit}`;
}
