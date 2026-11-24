import { router } from 'expo-router';
import { Check, FileText, Plus, X } from 'lucide-react-native';
import React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FlagLabel, valueText } from '@/components/RangeBar';
import { Screen } from '@/components/Screen';
import { Button, Group, IconButton, Txt } from '@/components/ui';
import { Flag, TESTS, flagFor, gpVisit } from '@/data/labs';
import { METRICS, summary } from '@/data/wearables';
import { haptic } from '@/lib/feedback';
import { fmtDate, fmtDay, fmtNum, fmtTime } from '@/lib/format';
import { questionText } from '@/lib/brief';
import { useBriefSelection } from '@/lib/useBriefSelection';
import { latestFor, useApp } from '@/store/app';
import { useTheme } from '@/theme';

function CheckRow({ on, title, detail, flag, onPress }: { on: boolean; title: string; detail: string; flag?: Flag; onPress: () => void }) {
  const tone = flag && flag !== 'within' ? ('amber' as const) : undefined;
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: on }}
      accessibilityLabel={`${title}, ${detail}`}
      onPress={() => {
        haptic.tap();
        onPress();
      }}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, minHeight: 54, paddingVertical: 10, backgroundColor: pressed ? c.surfaceAlt : 'transparent' })}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 7,
          borderWidth: on ? 0 : 1.5,
          borderColor: c.ink3,
          backgroundColor: on ? c.primary : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {on && <Check size={16} color={c.onPrimary} strokeWidth={3} />}
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Txt v="body">{title}</Txt>
        {flag && <FlagLabel flag={flag} />}
      </View>
      <Txt v="subhead" tone={tone ?? 'ink2'} style={{ fontVariant: ['tabular-nums'], fontWeight: tone ? '600' : '400' }}>
        {detail}
      </Txt>
    </Pressable>
  );
}

export default function Brief() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const s = useApp();
  const { tests, metrics, sources } = useBriefSelection();

  const toggleTest = (id: string) => s.set({ briefTests: tests.includes(id) ? tests.filter((x) => x !== id) : [...tests, id] });
  const toggleMetric = (k: string) => s.set({ briefMetrics: metrics.includes(k) ? metrics.filter((x) => x !== k) : [...metrics, k] });

  const available = TESTS.filter((x) => latestFor(x.id, s.reportIds, s.edits));
  const ordered = [...available.filter((x) => tests.includes(x.id)), ...available.filter((x) => !tests.includes(x.id))];

  return (
    <Screen
      topInset
      title={t('brief.title')}
      subtitle={`${t('brief.subtitle')} · ${fmtDay(gpVisit.date)} ${fmtTime(gpVisit.date)}`}
      footer={
        <>
          <Button title={s.briefGeneratedAt ? t('brief.regenerate') : t('brief.generate')} icon={FileText} disabled={!tests.length} onPress={() => router.push('/brief-making')} />
          {s.briefGeneratedAt && (
            <Button kind="plain" small title={`${t('brief.preview')} · ${t('brief.lastMade', { date: fmtDate(s.briefGeneratedAt) })}`} onPress={() => router.push('/brief-preview')} />
          )}
        </>
      }
    >
      <Group title={t('brief.labs')} footer={t('brief.labsFoot')}>
        {ordered.map((test) => {
          const r = latestFor(test.id, s.reportIds, s.edits)!;
          return <CheckRow key={test.id} on={tests.includes(test.id)} title={t(`tests.${test.id}.name`)} detail={valueText(test, r.value)} flag={flagFor(test, r.value)} onPress={() => toggleTest(test.id)} />;
        })}
      </Group>

      <Group title={t('brief.wear')}>
        {sources.length ? (
          sources.flatMap((src) =>
            METRICS.map((m) => {
              const k = `${src}:${m.id}`;
              const sm = summary(src, m.id);
              return (
                <CheckRow
                  key={k}
                  on={metrics.includes(k)}
                  title={`${t(`metrics.${m.id}.name`)}${sources.length > 1 ? ` · ${t(`sources.${src}`)}` : ''}`}
                  detail={`${fmtNum(sm.recent, m.decimals)} ${m.unit}`}
                  onPress={() => toggleMetric(k)}
                />
              );
            }),
          )
        ) : (
          <View style={{ padding: 16, gap: 12 }}>
            <Txt v="callout" tone="ink2">
              {t('brief.noWear')}
            </Txt>
            <Button kind="secondary" small title={t('trends.connect')} onPress={() => router.navigate('/(tabs)/trends')} style={{ alignSelf: 'flex-start' }} />
          </View>
        )}
      </Group>

      <Group title={t('brief.questions')} footer={t('brief.questionsFoot')}>
        {s.questions.map((q, i) => (
          <View key={q.id} style={{ flexDirection: 'row', alignItems: 'flex-start', paddingLeft: 16, paddingRight: 4, paddingVertical: 6, gap: 8 }}>
            <Txt v="body" tone="primary" style={{ fontWeight: '700', marginTop: 9, width: 18 }}>
              {i + 1}
            </Txt>
            <TextInput
              accessibilityLabel={`${t('brief.questions')} ${i + 1}`}
              multiline
              defaultValue={questionText(q, t)}
              onChangeText={(text) => s.updateQuestion(q.id, text)}
              placeholder={t('brief.newQ')}
              placeholderTextColor={c.ink3}
              style={{ flex: 1, fontSize: 17, lineHeight: 23, color: c.ink, paddingVertical: 8, minHeight: 44 }}
            />
            <IconButton icon={X} label={`${t('common.close')} ${i + 1}`} onPress={() => s.removeQuestion(q.id)} />
          </View>
        ))}
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            haptic.tap();
            s.addQuestion({ text: '' });
          }}
          style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, minHeight: 52, backgroundColor: pressed ? c.surfaceAlt : 'transparent' })}
        >
          <Plus size={20} color={c.primary} />
          <Txt v="body" tone="primary" style={{ fontWeight: '600' }}>
            {t('brief.addQ')}
          </Txt>
        </Pressable>
      </Group>
    </Screen>
  );
}
