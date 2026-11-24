import { router } from 'expo-router';
import { CalendarClock, ChevronRight, Plane, Plus, Users, Watch, WifiOff } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/Screen';
import { TestRow } from '@/components/TestRow';
import { Button, Group, Pill, Row, Txt } from '@/components/ui';
import { gpVisit, patient, testById, flagFor } from '@/data/labs';
import { haptic } from '@/lib/feedback';
import { fmtDate, fmtDay, fmtTime } from '@/lib/format';
import { latestFor, sortedReports, useApp } from '@/store/app';
import { useTheme } from '@/theme';

export default function Home() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const { reportIds, edits, connected, briefGeneratedAt, offline } = useApp();
  const reports = sortedReports(reportIds);
  const last = reports[reports.length - 1];

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'home.morning' : hour < 18 ? 'home.afternoon' : 'home.evening';

  // Out-of-range first, then the tests in the story.
  const highlight = ['vitd', 'ferritin', 'hb', 'tsh', 'b12']
    .map((id) => ({ test: testById(id), r: latestFor(id, reportIds, edits) }))
    .filter((x) => x.r)
    .sort((a, b) => Number(flagFor(b.test, b.r!.value) !== 'within') - Number(flagFor(a.test, a.r!.value) !== 'within'))
    .slice(0, 3);

  const sources = (['apple', 'garmin'] as const).filter((s) => connected[s]).map((s) => t(`sources.${s}`));

  return (
    <Screen
      topInset
      title={t(greet, { name: patient.firstName })}
      headerRight={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home.settings')}
          onPress={() => {
            haptic.tap();
            router.push('/settings');
          }}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center' }}
        >
          <Txt v="subhead" tone="primary" style={{ fontWeight: '700' }}>
            SJ
          </Txt>
        </Pressable>
      }
      footer={<Button title={t('home.add')} icon={Plus} onPress={() => router.push('/add-report')} />}
    >
      {offline && <Pill icon={WifiOff} label={t('offline')} tone="neutral" />}

      {/* Next visit — the reason the user opens the app this week */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t('home.nextVisit')}: ${fmtDay(gpVisit.date)} ${fmtTime(gpVisit.date)}, ${gpVisit.doctor}. ${briefGeneratedAt ? t('home.briefReady') : t('home.briefTodo')}`}
        onPress={() => {
          haptic.tap();
          router.navigate('/(tabs)/brief');
        }}
        style={({ pressed }) => ({ backgroundColor: c.hero, borderRadius: 20, padding: 18, gap: 14, opacity: pressed ? 0.92 : 1 })}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <CalendarClock size={18} color={c.onHero} strokeWidth={2} />
          <Txt v="subhead" tone="onHero" style={{ opacity: 0.85, fontWeight: '600' }}>
            {t('home.nextVisit')}
          </Txt>
        </View>
        <View style={{ gap: 2 }}>
          <Txt v="title" tone="onHero" style={{ textTransform: 'capitalize' }}>
            {fmtDay(gpVisit.date)} · {fmtTime(gpVisit.date)}
          </Txt>
          <Txt v="subhead" tone="onHero" style={{ opacity: 0.85 }}>
            {gpVisit.doctor} · {gpVisit.practice}
          </Txt>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255,255,255,0.14)',
            borderRadius: 12,
            paddingHorizontal: 12,
            minHeight: 44,
          }}
        >
          <Txt v="subhead" tone="onHero" style={{ fontWeight: '600' }}>
            {briefGeneratedAt ? `${t('home.briefReady')} · ${fmtDate(briefGeneratedAt)}` : t('home.briefTodo')}
          </Txt>
          <ChevronRight size={18} color={c.onHero} />
        </View>
      </Pressable>

      {last ? (
        <Group
          title={t('home.latest')}
          right={<Button kind="plain" small title={t('home.seeAll')} onPress={() => router.navigate('/(tabs)/labs')} style={{ minHeight: 32, paddingHorizontal: 4 }} />}
          footer={t('home.fromReport', { lab: last.lab, date: fmtDate(last.date) })}
        >
          {highlight.map(({ test, r }) => (
            <TestRow key={test.id} test={test} value={r!.value} date={r!.date} showDate={false} />
          ))}
        </Group>
      ) : null}

      <Group>
        <Row
          icon={Watch}
          title={sources.length ? sources.join(' + ') : t('home.wearableTitle')}
          subtitle={sources.length ? t('trends.lastSync', { time: '07:12' }) : t('home.wearableBody')}
          onPress={() => router.navigate('/(tabs)/trends')}
        />
      </Group>

      <Group title={t('home.roadmap')}>
        <Row icon={Plane} iconTone="ink2" title={t('home.travelTitle')} subtitle={t('home.travelBody')} onPress={() => router.push({ pathname: '/teaser/[id]', params: { id: 'travel' } })} right={<Pill label={t('common.comingSoon')} tone="neutral" />} />
        <Row icon={Users} iconTone="ink2" title={t('home.familyTitle')} subtitle={t('home.familyBody')} onPress={() => router.push({ pathname: '/teaser/[id]', params: { id: 'family' } })} right={<Pill label={t('common.comingSoon')} tone="neutral" />} />
      </Group>
    </Screen>
  );
}
