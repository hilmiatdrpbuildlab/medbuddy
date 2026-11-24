import { router, useLocalSearchParams } from 'expo-router';
import { Bell, Pill as PillIcon, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button, Card, Group, IconButton, Row, Txt } from '@/components/ui';
import { haptic } from '@/lib/feedback';
import { useTheme } from '@/theme';

function FamilyTree() {
  const { c } = useTheme();
  // Static preview: grandparents → parents → Sophie + sibling. Facts only, no scores.
  const node = (x: number, y: number, label: string, mark?: boolean) => (
    <View key={label} style={{ position: 'absolute', left: x - 34, top: y - 18, width: 68, alignItems: 'center', gap: 2 }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: mark ? c.primary : c.surface, borderWidth: 1.5, borderColor: c.primary, alignItems: 'center', justifyContent: 'center' }}>
        <Txt v="caption" style={{ color: mark ? c.onPrimary : c.primary, fontWeight: '700' }}>
          {label.slice(0, 1)}
        </Txt>
      </View>
      <Txt v="caption" tone="ink2" numberOfLines={1}>
        {label}
      </Txt>
    </View>
  );
  return (
    <View style={{ height: 220 }}>
      <Svg width="100%" height={220} viewBox="0 0 320 220" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute' }}>
        {[
          [70, 40, 160, 110],
          [250, 40, 160, 110],
          [160, 110, 100, 180],
          [160, 110, 220, 180],
        ].map(([a, b, x, y], i) => (
          <Line key={i} x1={a} y1={b} x2={x} y2={y} stroke={c.hairline} strokeWidth={2} />
        ))}
        <Circle cx={160} cy={110} r={3} fill={c.hairline} />
      </Svg>
      <View style={{ position: 'absolute', left: '50%', marginLeft: -160, width: 320, height: 220 }}>
        {node(70, 40, 'Oma Rita')}
        {node(250, 40, 'Opa Jan')}
        {node(160, 110, 'Mama Els')}
        {node(100, 180, 'Sophie', true)}
        {node(220, 180, 'Tom')}
      </View>
    </View>
  );
}

export default function Teaser() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const [notified, setNotified] = useState(false);
  const travel = id === 'travel';
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 8, paddingTop: 12 }}>
        <IconButton icon={X} label={t('common.close')} onPress={() => router.back()} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 20, paddingBottom: insets.bottom + 24 }}>
        <View style={{ gap: 10 }}>
          <Txt v="largeTitle" accessibilityRole="header">
            {travel ? t('home.travelTitle') : t('home.familyTitle')}
          </Txt>
          <Txt v="body" tone="ink2">
            {travel ? t('teaser.travelIntro') : t('teaser.familyIntro')}
          </Txt>
          <Txt v="footnote" tone="ink3">
            {t('teaser.badge')}
          </Txt>
        </View>
        {travel ? (
          <>
            <Group>
              <Row icon={PillIcon} title={t('teaser.travelMed1')} subtitle={t('teaser.travelMed1b')} />
              <Row icon={PillIcon} title={t('teaser.travelMed2')} subtitle={t('teaser.travelMed2b')} />
            </Group>
            <Card style={{ gap: 8, backgroundColor: c.primarySoft, borderColor: c.primarySoft }}>
              <Txt v="title3">{t('teaser.travelCardText')}</Txt>
              <Txt v="footnote" tone="primary">
                {t('teaser.travelCard')}
              </Txt>
            </Card>
          </>
        ) : (
          <Card style={{ gap: 12 }}>
            <FamilyTree />
            <Txt v="footnote" tone="ink2">
              {t('teaser.familyNote')}
            </Txt>
          </Card>
        )}
        <Button
          kind="secondary"
          icon={Bell}
          title={notified ? t('teaser.notified') : t('teaser.notify')}
          disabled={notified}
          onPress={() => {
            haptic.success();
            setNotified(true);
          }}
        />
      </ScrollView>
    </View>
  );
}
