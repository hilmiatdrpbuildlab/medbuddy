import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TestDef, flagFor } from '@/data/labs';
import { haptic } from '@/lib/feedback';
import { fmtDate } from '@/lib/format';
import { useTheme } from '@/theme';
import { FlagLabel, RangeBar, rangeText, valueText } from './RangeBar';
import { Txt } from './ui';

/** One lab result: name, value, the lab's range as a bar, the lab's own flag in words, the date. */
export function TestRow({ test, value, date, showDate = true }: { test: TestDef; value: number; date: string; showDate?: boolean }) {
  const { t } = useTranslation();
  const { c } = useTheme();
  const flag = flagFor(test, value);
  const name = t(`tests.${test.id}.name`);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${valueText(test, value)}, ${t(`flag.${flag}`)}, ${t('labs.labRange', { range: rangeText(test) })}, ${fmtDate(date)}`}
      onPress={() => {
        haptic.tap();
        router.push({ pathname: '/test/[id]', params: { id: test.id } });
      }}
      style={({ pressed }) => ({ paddingHorizontal: 16, paddingVertical: 14, gap: 8, backgroundColor: pressed ? c.surfaceAlt : 'transparent' })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
        <Txt v="body" style={{ flex: 1 }} numberOfLines={1}>
          {name}
        </Txt>
        <Txt v="value" tone={flag === 'within' ? 'ink' : 'amber'}>
          {valueText(test, value)}
        </Txt>
        <ChevronRight size={16} color={c.ink3} style={{ alignSelf: 'center' }} />
      </View>
      <RangeBar test={test} value={value} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <FlagLabel flag={flag} />
        <Txt v="footnote" tone="ink3" style={{ fontVariant: ['tabular-nums'] }}>
          {t('labs.labRange', { range: rangeText(test) })}
          {showDate ? ` · ${fmtDate(date)}` : ''}
        </Txt>
      </View>
    </Pressable>
  );
}
