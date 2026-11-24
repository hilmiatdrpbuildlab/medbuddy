import React, { useState } from 'react';
import { LayoutChangeEvent, Platform, Pressable, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { TestDef, flagFor } from '@/data/labs';
import { fmtDate, fmtMonthYear, fmtNum } from '@/lib/format';
import { haptic } from '@/lib/feedback';
import type { Result } from '@/store/app';
import { useTheme } from '@/theme';

const FONT = Platform.select({ web: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', default: undefined });
import { rangeText, valueText } from './RangeBar';
import { Txt } from './ui';

function useWidth(initial = 320) {
  const [w, setW] = useState(initial);
  return { w, onLayout: (e: LayoutChangeEvent) => setW(Math.round(e.nativeEvent.layout.width)) };
}

/** Domain fitted to the data; the lab band is clipped to it rather than flattening the line. */
function trendDomain(test: TestDef, values: number[]) {
  const vmin = Math.min(...values);
  const vmax = Math.max(...values);
  const span = Math.max(vmax - vmin, (test.high ?? test.low ?? vmax) * 0.2);
  let min = vmin - span * 0.45;
  let max = vmax + span * 0.45;
  if (test.low != null && test.low < min && test.low > vmin - span * 1.5) min = test.low - span * 0.15;
  if (test.high != null && test.high > max && test.high < vmax + span * 1.5) max = test.high + span * 0.15;
  min = Math.max(0, min);
  return { min, max, lo: Math.max(min, test.low ?? min), hi: Math.min(max, test.high ?? max) };
}

/** Lab trend: one line, gray lab-range band, tappable points that show value + source. */
export function TrendChart({ test, history }: { test: TestDef; history: Result[] }) {
  const { t } = useTranslation();
  const { c } = useTheme();
  const { w, onLayout } = useWidth();
  const [picked, setSel] = useState<number | null>(null);
  const sel = picked ?? history.length - 1;
  const H = 180;
  const padL = 8;
  const padR = 8;
  const padT = 16;
  const padB = 26;
  const { min, max, lo, hi } = trendDomain(test, history.map((h) => h.value));
  const times = history.map((h) => new Date(h.date).getTime());
  const t0 = times[0] ?? 0;
  const t1 = times[times.length - 1] ?? 1;
  const x = (tm: number) => padL + 14 + ((tm - t0) / Math.max(1, t1 - t0)) * (w - padL - padR - 28);
  const y = (v: number) => padT + (1 - (Math.min(max, Math.max(min, v)) - min) / (max - min)) * (H - padT - padB);
  const path = history.map((h, i) => `${i ? 'L' : 'M'}${x(times[i])},${y(h.value)}`).join(' ');
  const cur = history[sel];

  const label = history.map((h) => `${fmtDate(h.date)}: ${valueText(test, h.value)}`).join('; ');

  return (
    <View onLayout={onLayout} accessible accessibilityLabel={t('detail.chartA11y', { range: rangeText(test), points: label })}>
      {cur && (
        <View style={{ marginBottom: 8 }}>
          <Txt v="footnote" tone="ink2">
            {fmtDate(cur.date)} · {cur.lab}
          </Txt>
        </View>
      )}
      <Svg width={w} height={H}>
        <Rect x={0} y={y(hi)} width={w} height={Math.max(2, y(lo) - y(hi))} fill={c.band} opacity={0.75} rx={4} />
        <SvgText fontFamily={FONT} x={w - 6} y={y(hi) + 13} fontSize={11} fill={c.ink2} textAnchor="end">
          {t('detail.labRange')}
          {test.high != null && test.high <= max ? ` · ${fmtNum(test.high, test.decimals)}` : ''}
        </SvgText>
        {test.low != null && test.low >= min && (
          <SvgText fontFamily={FONT} x={6} y={y(lo) - 5} fontSize={11} fontWeight="600" fill={c.ink2} textAnchor="start">
            {`${t('detail.lowerLimit')} ${fmtNum(test.low, test.decimals)}`}
          </SvgText>
        )}
        <Line x1={0} x2={w} y1={H - padB} y2={H - padB} stroke={c.hairline} strokeWidth={1} />
        <Path d={path} stroke={c.primary} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {history.map((h, i) => {
          const off = flagFor(test, h.value) !== 'within';
          const on = i === sel;
          return (
            <React.Fragment key={h.reportId}>
              {on && <Circle cx={x(times[i])} cy={y(h.value)} r={11} fill={off ? c.amber : c.primary} opacity={0.16} />}
              <Circle cx={x(times[i])} cy={y(h.value)} r={on ? 6.5 : 5} fill={off ? c.amber : c.primary} stroke={c.surface} strokeWidth={2.5} />
              <SvgText fontFamily={FONT} x={x(times[i])} y={y(h.value) - 14} fontSize={12} fontWeight="600" fill={c.ink} textAnchor="middle">
                {fmtNum(h.value, test.decimals)}
              </SvgText>
              <SvgText fontFamily={FONT} x={x(times[i])} y={H - 8} fontSize={11} fill={c.ink2} textAnchor={i === 0 && history.length > 1 ? 'start' : i === history.length - 1 && history.length > 1 ? 'end' : 'middle'} dx={i === 0 && history.length > 1 ? -8 : i === history.length - 1 && history.length > 1 ? 8 : 0}>
                {fmtMonthYear(h.date)}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
      {history.map((h, i) => (
        <Pressable
          key={h.reportId}
          accessibilityRole="button"
          accessibilityLabel={`${fmtDate(h.date)}, ${valueText(test, h.value)}, ${h.lab}`}
          onPress={() => {
            haptic.tap();
            setSel(i);
          }}
          style={{ position: 'absolute', left: x(times[i]) - 22, top: (cur ? 28 : 0) + y(h.value) - 22, width: 44, height: 44 }}
        />
      ))}
    </View>
  );
}

/** Wearable trend: weekly averages, dashed baseline, the last 90 days marked. Neutral colours only. */
export function MetricChart({ weeks, baseline, decimals, unit }: { weeks: number[]; baseline: number; decimals: number; unit: string }) {
  const { t } = useTranslation();
  const { c } = useTheme();
  const { w, onLayout } = useWidth();
  const H = 96;
  const pad = 6;
  // Minimum span of ±15% around the baseline, so small day-to-day shifts look as small as they are.
  const lo = Math.min(...weeks, baseline * 0.85);
  const hi = Math.max(...weeks, baseline * 1.15);
  const span = hi - lo || 1;
  const x = (i: number) => pad + (i / (weeks.length - 1)) * (w - pad * 2);
  const y = (v: number) => pad + 4 + (1 - (v - lo) / span) * (H - pad * 2 - 18);
  const path = weeks.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
  const mid = x(weeks.length / 2);
  return (
    <View onLayout={onLayout} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      <Svg width={w} height={H}>
        <Rect x={mid} y={0} width={w - mid} height={H - 16} fill={c.surfaceAlt} rx={6} />
        <Line x1={pad} x2={w - pad} y1={y(baseline)} y2={y(baseline)} stroke={c.ink3} strokeDasharray="4 4" strokeWidth={1} />
        <Path d={path} stroke={c.primary} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <SvgText fontFamily={FONT} x={pad} y={H - 3} fontSize={11} fill={c.ink2}>
          {t('trends.axisStart')}
        </SvgText>
        <SvgText fontFamily={FONT} x={mid + 6} y={H - 3} fontSize={11} fill={c.ink2}>
          {t('trends.axisRecent')}
        </SvgText>
        <SvgText fontFamily={FONT} x={w - pad} y={H - 3} fontSize={11} fill={c.ink2} textAnchor="end">
          {t('trends.axisToday')}
        </SvgText>
      </Svg>
      <View style={{ position: 'absolute', left: 0, top: 0 }} accessibilityLabel={`${fmtNum(baseline, decimals)} ${unit}`} />
    </View>
  );
}
