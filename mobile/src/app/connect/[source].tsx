import { router, useLocalSearchParams } from 'expo-router';
import { BedDouble, Check, Gauge, HeartPulse, Waves } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { SourceGlyph } from '@/components/SourceGlyph';
import { Button, Divider, ProgressBar, Txt, LucideIcon } from '@/components/ui';
import { brand } from '@/config/brand';
import { METRICS, MetricId, SourceId } from '@/data/wearables';
import { haptic } from '@/lib/feedback';
import { useApp } from '@/store/app';
import { useTheme } from '@/theme';

const ICONS: Record<MetricId, LucideIcon> = { rhr: HeartPulse, hrv: Waves, sleep: BedDouble, vo2: Gauge };
type Phase = 'perm' | 'connecting' | 'importing' | 'done';

export default function Connect() {
  const { source: raw } = useLocalSearchParams<{ source: string }>();
  const source: SourceId = raw === 'garmin' ? 'garmin' : 'apple';
  const { t } = useTranslation();
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const fast = useApp((s) => s.fastMode);
  const connected = useApp((s) => s.connected);
  const set = useApp((s) => s.set);
  const [phase, setPhase] = useState<Phase>('perm');
  const [allowed, setAllowed] = useState<Record<MetricId, boolean>>({ rhr: true, hrv: true, sleep: true, vo2: true });
  const [day, setDay] = useState(0);
  const sourceName = t(`sources.${source}`);
  const k = fast ? 0.25 : 1;

  useEffect(() => {
    if (phase === 'connecting') {
      const tm = setTimeout(() => setPhase('importing'), 1300 * k);
      return () => clearTimeout(tm);
    }
    if (phase === 'importing') {
      const start = Date.now();
      const total = 3200 * k;
      const iv = setInterval(() => {
        const p = Math.min(1, (Date.now() - start) / total);
        setDay(Math.round(p * 180));
        if (p >= 1) {
          clearInterval(iv);
          haptic.success();
          set({ connected: { ...connected, [source]: true } });
          setPhase('done');
        }
      }, 40);
      return () => clearInterval(iv);
    }
  }, [phase]);

  if (phase === 'perm') {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 24, gap: 20 }}>
          <View style={{ alignItems: 'center', gap: 14 }}>
            <SourceGlyph source={source} size={60} />
            <Txt v="title" center>
              {source === 'apple' ? t('connect.permTitle', { name: brand.name }) : t('connect.garminSign')}
            </Txt>
            <Txt v="callout" tone="ink2" center>
              {source === 'apple' ? t('connect.permBody', { source: sourceName }) : t('connect.garminBody', { name: brand.name })}
            </Txt>
          </View>
          <View style={{ backgroundColor: c.surface, borderRadius: 14, borderWidth: 1, borderColor: c.hairline }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, minHeight: 48 }}>
              <Txt v="subhead" tone="ink2" style={{ fontWeight: '600' }}>
                {sourceName}
              </Txt>
              <Button kind="plain" small title={t('connect.allowAll')} onPress={() => setAllowed({ rhr: true, hrv: true, sleep: true, vo2: true })} style={{ minHeight: 40 }} />
            </View>
            {METRICS.map((m) => {
              const Icon = ICONS[m.id];
              return (
                <View key={m.id}>
                  <Divider style={{ marginLeft: 16 }} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, minHeight: 52 }}>
                    <Icon size={20} color={c.primary} />
                    <Txt v="body" style={{ flex: 1 }}>
                      {t(`metrics.${m.id}.name`)}
                    </Txt>
                    <Switch
                      accessibilityLabel={t(`metrics.${m.id}.name`)}
                      value={allowed[m.id]}
                      onValueChange={(v) => {
                        haptic.tap();
                        setAllowed({ ...allowed, [m.id]: v });
                      }}
                      trackColor={{ true: c.ok, false: c.sunken }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <View style={{ padding: 20, paddingBottom: insets.bottom + 16, gap: 8 }}>
          <Button title={t('connect.allow')} onPress={() => setPhase('connecting')} disabled={!Object.values(allowed).some(Boolean)} />
          <Button kind="plain" title={t('connect.dontAllow')} onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  const done = phase === 'done';
  return (
    <View style={{ flex: 1, backgroundColor: c.bg, padding: 24, paddingTop: insets.top + 40, paddingBottom: insets.bottom + 16 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 22 }}>
        <View>
          <SourceGlyph source={source} size={72} />
          {done && (
            <View style={{ position: 'absolute', right: -8, bottom: -8, width: 30, height: 30, borderRadius: 15, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: c.bg }}>
              <Check size={16} color={c.onPrimary} strokeWidth={3} />
            </View>
          )}
        </View>
        <View style={{ alignItems: 'center', gap: 6 }} accessibilityLiveRegion="polite">
          <Txt v="title" center>
            {phase === 'connecting' ? t('connect.connecting', { source: sourceName }) : done ? t('connect.done') : t('connect.building')}
          </Txt>
          <Txt v="callout" tone="ink2" center style={{ fontVariant: ['tabular-nums'] }}>
            {done ? t('connect.doneBody') : phase === 'importing' ? t('connect.importing', { day }) : ' '}
          </Txt>
        </View>
        {!done && <ProgressBar value={phase === 'connecting' ? 0.04 : day / 180} style={{ alignSelf: 'stretch', marginHorizontal: 24 }} />}
      </View>
      {done && (
        <Button
          title={t('connect.view')}
          onPress={() => {
            router.back();
            router.navigate('/(tabs)/trends');
          }}
        />
      )}
    </View>
  );
}
