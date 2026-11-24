import { router, useLocalSearchParams } from 'expo-router';
import { Check, ShieldCheck } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, LayoutChangeEvent, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { StageList } from '@/components/Feedback';
import { LabDocument } from '@/components/LabDocument';
import { Button, ProgressBar, Txt } from '@/components/ui';
import { NEW_REPORT_ID, reportById } from '@/data/labs';
import { haptic } from '@/lib/feedback';
import { Stage, useStages } from '@/lib/useStages';
import { useTheme } from '@/theme';

const ALL: Stage[] = [
  { key: 'uploading', ms: 1500 },
  { key: 'reading', ms: 1500 },
  { key: 'finding', ms: 1400 },
  { key: 'units', ms: 1100 },
  { key: 'verifying', ms: 1300 },
];

export default function Analyzing() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { source = 'pdf' } = useLocalSearchParams<{ source?: string }>();
  const [stages] = useState(() => (source === 'pdf' || source === 'portal' ? ALL : ALL.slice(1)));
  const [finished, setFinished] = useState(false);
  const run = useStages(stages, () => {
    haptic.success();
    setFinished(true);
    AccessibilityInfo.announceForAccessibility(t('analyzing.found', { count: 12 }));
  });

  // Scan band travelling down the page while reading.
  const scan = useState(() => new Animated.Value(0))[0];
  const [docH, setDocH] = useState(300);
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce).catch(() => {});
  }, []);
  useEffect(() => {
    if (finished || reduce) return;
    const loop = Animated.loop(Animated.timing(scan, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [finished, reduce]);

  const current = stages[Math.min(run.index, stages.length - 1)];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 8, height: 44 }}>
        {!finished && (
          <Button
            kind="plain"
            small
            title={t('common.cancel')}
            onPress={() => {
              run.cancel();
              router.back();
            }}
          />
        )}
      </View>

      <View style={{ paddingHorizontal: 24, gap: 6 }}>
        <Txt v="title" accessibilityRole="header">
          {source === 'email' ? t('analyzing.received') : t('analyzing.title')}
        </Txt>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <View style={{ width: '100%', maxWidth: 340 }} onLayout={(e: LayoutChangeEvent) => setDocH(e.nativeEvent.layout.height)}>
          <View style={{ opacity: finished ? 0.35 : 1 }}>
            <LabDocument report={reportById(NEW_REPORT_ID)} scale={0.72} />
          </View>
          {!finished && run.index >= (stages[0].key === 'uploading' ? 1 : 0) && (
            <Animated.View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: -8,
                right: -8,
                height: 34,
                borderRadius: 6,
                backgroundColor: 'rgba(92, 195, 194, 0.22)',
                borderTopWidth: 2,
                borderColor: c.primary,
                transform: [{ translateY: scan.interpolate({ inputRange: [0, 1], outputRange: [0, Math.max(0, docH - 34)] }) }],
              }}
            />
          )}
          {finished && (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}>
                <Check size={40} color={c.onPrimary} strokeWidth={3} />
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={{ paddingHorizontal: 24, gap: 18 }}>
        {finished ? (
          <>
            <View style={{ gap: 4 }}>
              <Txt v="title">{t('analyzing.found', { count: 12 })}</Txt>
              <Txt v="callout" tone="ink2">
                {t('analyzing.foundBody')}
              </Txt>
            </View>
            <Button title={t('analyzing.review')} onPress={() => router.replace({ pathname: '/review', params: { source } })} />
          </>
        ) : (
          <>
            {current.key === 'uploading' && <ProgressBar value={run.progress} />}
            <StageList labels={stages.map((s) => t(`analyzing.${s.key}`))} index={run.index} />
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <ShieldCheck size={15} color={c.ink3} />
              <Txt v="footnote" tone="ink3">
                {t('analyzing.secure')}
              </Txt>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
