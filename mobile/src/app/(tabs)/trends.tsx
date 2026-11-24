import { router } from 'expo-router';
import { BedDouble, Gauge, HeartPulse, Info, Plus, Waves } from 'lucide-react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MetricChart } from '@/components/Charts';
import { Screen } from '@/components/Screen';
import { appleDevices } from '@/i18n';
import { SourceGlyph } from '@/components/SourceGlyph';
import { Button, Card, Group, Row, Segmented, Txt, LucideIcon } from '@/components/ui';
import { METRICS, MetricId, SourceId, summary, weekly } from '@/data/wearables';
import { fmtNum } from '@/lib/format';
import { useApp } from '@/store/app';
import { useTheme } from '@/theme';

const ICONS: Record<MetricId, LucideIcon> = { rhr: HeartPulse, hrv: Waves, sleep: BedDouble, vo2: Gauge };

export default function Trends() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const connected = useApp((s) => s.connected);
  const sources = (['apple', 'garmin'] as SourceId[]).filter((s) => connected[s]);
  const [source, setSource] = useState<SourceId>(sources[0] ?? 'apple');
  const active = connected[source] ? source : sources[0];

  if (!sources.length) {
    return (
      <Screen topInset title={t('trends.title')} subtitle={t('trends.subtitle')}>
        <Card style={{ gap: 10, paddingVertical: 22 }}>
          <Txt v="title3">{t('trends.connectTitle')}</Txt>
          <Txt v="callout" tone="ink2">
            {t('trends.connectBody')}
          </Txt>
        </Card>
        <Group>
          {(['apple', 'garmin'] as SourceId[]).map((s) => (
            <Row
              key={s}
              title={t(`sources.${s}`)}
              subtitle={s === 'apple' ? appleDevices : 'Forerunner · Venu · Fenix'}
              right={<Button small kind="secondary" title={t('trends.connect')} onPress={() => router.push({ pathname: '/connect/[source]', params: { source: s } })} />}
              chevron={false}
              leading={<SourceGlyph source={s} />}
            />
          ))}
        </Group>
      </Screen>
    );
  }

  return (
    <Screen topInset title={t('trends.title')} subtitle={t('trends.lastSync', { time: '07:12' })}>
      {sources.length > 1 && <Segmented options={sources.map((s) => ({ key: s, label: t(`sources.${s}`) }))} value={active!} onChange={setSource} />}
      <View style={{ gap: 12 }}>
        {METRICS.map((m) => {
          const s = summary(active!, m.id);
          const Icon = ICONS[m.id];
          const value = `${fmtNum(s.recent, m.decimals)} ${m.unit}`;
          const base = `${fmtNum(s.baseline, m.decimals)} ${m.unit}`;
          return (
            <Card key={m.id} style={{ gap: 10 }} accessibilityLabel={`${t(`metrics.${m.id}.name`)}. ${t('trends.recent')} ${value}. ${t('trends.vsBaseline', { value: base })}`}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon size={18} color={c.primary} strokeWidth={2} />
                <Txt v="subhead" tone="ink2" style={{ fontWeight: '600' }}>
                  {t(`metrics.${m.id}.name`)}
                </Txt>
              </View>
              <Txt v="title" style={{ fontVariant: ['tabular-nums'] }}>
                {value}
                <Txt v="subhead" tone="ink2">
                  {'  ·  '}
                  {t('trends.recent')}
                </Txt>
              </Txt>
              <MetricChart weeks={weekly(active!, m.id)} baseline={s.baseline} decimals={m.decimals} unit={m.unit} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 18, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: c.ink3 }} />
                <Txt v="footnote" tone="ink2" style={{ fontVariant: ['tabular-nums'] }}>
                  {t('trends.vsBaseline', { value: base })}
                </Txt>
              </View>
            </Card>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 4 }}>
        <Info size={16} color={c.ink3} style={{ marginTop: 2 }} />
        <Txt v="footnote" tone="ink3" style={{ flex: 1 }}>
          {t('trends.explain')}
        </Txt>
      </View>
      {sources.length < 2 && (
        <Button
          kind="outline"
          icon={Plus}
          title={`${t('trends.addSource')} · ${t(`sources.${connected.apple ? 'garmin' : 'apple'}`)}`}
          onPress={() => router.push({ pathname: '/connect/[source]', params: { source: connected.apple ? 'garmin' : 'apple' } })}
        />
      )}
    </Screen>
  );
}
