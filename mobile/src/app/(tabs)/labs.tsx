import { router } from 'expo-router';
import { FileText, FlaskConical, Plus, ShieldCheck } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/Feedback';
import { Screen } from '@/components/Screen';
import { TestRow } from '@/components/TestRow';
import { Button, Card, Group, Pill, Row, Txt } from '@/components/ui';
import { CATEGORIES, TESTS } from '@/data/labs';
import { fmtDate } from '@/lib/format';
import { latestFor, sortedReports, useApp } from '@/store/app';
import { useTheme } from '@/theme';

let warmed = false;

export default function Labs() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const { reportIds, edits } = useApp();
  const reports = sortedReports(reportIds);
  const last = reports[reports.length - 1];
  const [loading, setLoading] = useState(!warmed);

  useEffect(() => {
    if (warmed) return;
    const tm = setTimeout(() => {
      warmed = true;
      setLoading(false);
    }, 650);
    return () => clearTimeout(tm);
  }, []);

  if (!last) {
    return (
      <Screen topInset title={t('labs.title')}>
        <Card style={{ alignItems: 'center', gap: 12, paddingVertical: 32 }}>
          <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
            <FlaskConical size={28} color={c.primary} />
          </View>
          <Txt v="title3" center>
            {t('labs.empty')}
          </Txt>
          <Txt v="callout" tone="ink2" center style={{ maxWidth: 300 }}>
            {t('labs.emptyBody')}
          </Txt>
          <Button title={t('home.add')} icon={Plus} onPress={() => router.push('/add-report')} style={{ alignSelf: 'stretch', marginTop: 8 }} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen topInset title={t('labs.title')} subtitle={t('labs.summary', { count: reports.length, date: fmtDate(last.date) })}>
      <Pill icon={ShieldCheck} label={t('common.trust')} />
      {loading
        ? [0, 1, 2].map((i) => (
            <View key={i} style={{ gap: 10 }}>
              <Skeleton h={18} w={120} />
              <Card style={{ gap: 12 }}>
                <Skeleton h={16} w="70%" />
                <Skeleton h={8} />
                <Skeleton h={12} w="45%" />
              </Card>
            </View>
          ))
        : CATEGORIES.map((cat) => {
            const tests = TESTS.filter((x) => x.category === cat);
            return (
              <Group key={cat} title={t(`categories.${cat}`)}>
                {tests.map((test) => {
                  const r = latestFor(test.id, reportIds, edits)!;
                  return <TestRow key={test.id} test={test} value={r.value} date={r.date} />;
                })}
              </Group>
            );
          })}
      {!loading && (
        <Group title={t('labs.reports')}>
          {[...reports].reverse().map((r) => (
            <Row key={r.id} icon={FileText} iconTone="ink2" title={r.lab} subtitle={`${fmtDate(r.date)} · ${t('labs.values', { count: Object.keys(r.values).length })}`} />
          ))}
        </Group>
      )}
    </Screen>
  );
}
