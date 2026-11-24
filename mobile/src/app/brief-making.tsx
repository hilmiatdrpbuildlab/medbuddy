import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { StageList } from '@/components/Feedback';
import { Button, Txt } from '@/components/ui';
import { haptic } from '@/lib/feedback';
import { useStages } from '@/lib/useStages';
import { useApp } from '@/store/app';
import { useTheme } from '@/theme';

const STAGES = [
  { key: 'collecting', ms: 1300 },
  { key: 'summarizing', ms: 1400 },
  { key: 'laying', ms: 1200 },
];

export default function BriefMaking() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const set = useApp((s) => s.set);
  const run = useStages(STAGES, () => {
    haptic.success();
    set({ briefGeneratedAt: new Date().toISOString() });
    router.replace('/brief-preview');
  });

  // A page assembling itself: lines fill in as each stage completes.
  const filled = Math.min(run.index, STAGES.length);
  const line = (w: `${number}%`, on: boolean, tone = c.paperRule) => <View style={{ height: 7, width: w, borderRadius: 3, backgroundColor: on ? tone : '#F1F3F5' }} />;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 8, height: 44 }}>
        <Button
          kind="plain"
          small
          title={t('common.cancel')}
          onPress={() => {
            run.cancel();
            router.back();
          }}
        />
      </View>
      <Txt v="title" style={{ paddingHorizontal: 24 }} accessibilityRole="header">
        {t('brief.making')}
      </Txt>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 200, aspectRatio: 595 / 842, backgroundColor: c.paper, borderRadius: 4, padding: 18, gap: 9, shadowColor: '#0B2A2E', shadowOpacity: 0.16, shadowRadius: 18, shadowOffset: { width: 0, height: 6 }, elevation: 5 }}>
          {line('65%', true, '#0B5D63')}
          <View style={{ height: 2, backgroundColor: '#0B5D63', marginBottom: 6 }} />
          {line('40%', filled >= 1, '#0B5D63')}
          {line('100%', filled >= 1)}
          {line('92%', filled >= 1)}
          {line('96%', filled >= 1)}
          {line('40%', filled >= 2, '#0B5D63')}
          {line('88%', filled >= 2)}
          {line('80%', filled >= 2)}
          {line('40%', filled >= 3, '#0B5D63')}
          {line('94%', filled >= 3)}
          {line('70%', filled >= 3)}
        </View>
      </View>
      <View style={{ paddingHorizontal: 24 }}>
        <StageList labels={STAGES.map((s) => t(`brief.${s.key}`))} index={run.index} />
      </View>
    </View>
  );
}
