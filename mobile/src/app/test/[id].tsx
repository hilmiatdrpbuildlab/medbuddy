import { Stack, useLocalSearchParams } from 'expo-router';
import { BadgeCheck, MessageCircleQuestion } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TrendChart } from '@/components/Charts';
import { toast } from '@/components/Feedback';
import { FlagLabel, rangeText, valueText } from '@/components/RangeBar';
import { Screen } from '@/components/Screen';
import { Button, Card, Group, Pill, Row, Txt } from '@/components/ui';
import { flagFor, testById } from '@/data/labs';
import { haptic } from '@/lib/feedback';
import { fmtDate, fmtNum } from '@/lib/format';
import { historyFor, useApp } from '@/store/app';

export default function TestDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { reportIds, edits, questions, addQuestion } = useApp();
  const test = testById(id);
  const history = historyFor(id, reportIds, edits);
  const last = history[history.length - 1];
  const name = t(`tests.${id}.name`);
  const flag = flagFor(test, last.value);
  const asked = questions.some((q) => q.testId === id);

  const add = () => {
    const values = history.map((h) => fmtNum(h.value, test.decimals)).join(' → ') + ' ' + test.unit;
    const ok = addQuestion({ text: t('detail.question', { name, values }), testId: id });
    if (ok) haptic.success();
    toast(ok ? t('detail.added') : t('detail.already'));
  };

  return (
    <Screen
      footer={<Button kind={asked ? 'secondary' : 'primary'} icon={MessageCircleQuestion} title={asked ? t('detail.already') : t('detail.addQuestion')} onPress={add} disabled={asked} />}
    >
      <Stack.Screen options={{ title: '' }} />
      <View style={{ gap: 6 }}>
        <Txt v="largeTitle" accessibilityRole="header">
          {name}
        </Txt>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <Txt v="bigValue" tone={flag === 'within' ? 'ink' : 'amber'}>
            {fmtNum(last.value, test.decimals)}
          </Txt>
          <Txt v="title3" tone="ink2">
            {test.unit}
          </Txt>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <FlagLabel flag={flag} />
          <Txt v="footnote" tone="ink2">
            {t('labs.labRange', { range: rangeText(test) })} · {fmtDate(last.date)}
          </Txt>
        </View>
      </View>

      <Card>
        <TrendChart test={test} history={history} />
      </Card>

      <Group title={t('detail.history')}>
        {[...history].reverse().map((h) => (
          <Row
            key={h.reportId}
            title={valueText(test, h.value)}
            subtitle={`${fmtDate(h.date)} · ${h.lab}`}
            right={flagFor(test, h.value) !== 'within' ? <FlagLabel flag={flagFor(test, h.value)} /> : undefined}
          />
        ))}
      </Group>

      <Card style={{ gap: 10 }}>
        <Txt v="headline" accessibilityRole="header">
          {t('detail.what', { name })}
        </Txt>
        <Txt v="body">{t(`tests.${id}.about`)}</Txt>
        <Pill icon={BadgeCheck} label={t('detail.reviewed')} tone="ok" />
        <Txt v="footnote" tone="ink3">
          {t('detail.generic')} · LOINC {test.loinc}
        </Txt>
      </Card>
    </Screen>
  );
}
