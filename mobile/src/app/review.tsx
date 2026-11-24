import { router } from 'expo-router';
import { CircleCheck, Pencil } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/Feedback';
import { LabDocument } from '@/components/LabDocument';
import { FlagLabel } from '@/components/RangeBar';
import { Button, IconButton, Txt } from '@/components/ui';
import { NEW_REPORT_ID, TESTS, flagFor, reportById } from '@/data/labs';
import { haptic } from '@/lib/feedback';
import { fmtDate, fmtNum } from '@/lib/format';
import { useApp } from '@/store/app';
import { useTheme } from '@/theme';

export default function Review() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const report = reportById(NEW_REPORT_ID);
  const addReport = useApp((s) => s.addReport);
  const [sel, setSel] = useState<string | null>('ferritin');
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [edits, setEdits] = useState<Record<string, number>>({});

  const val = (id: string) => edits[id] ?? report.values[id];
  const docRef = useRef<any>(null);
  const rowY = useRef<Record<string, number>>({});
  useEffect(() => {
    const y = sel ? rowY.current[sel] : undefined;
    if (y != null) docRef.current?.scrollTo({ y: Math.max(0, y - 60), animated: true });
  }, [sel]);

  const saveEdit = (id: string) => {
    const n = parseFloat(draft.replace(',', '.'));
    if (!isNaN(n) && n !== report.values[id]) setEdits((e) => ({ ...e, [id]: n }));
    setEditing(null);
    haptic.success();
  };

  const confirm = () => {
    haptic.success();
    addReport(NEW_REPORT_ID, edits);
    toast(t('common.saved'));
    router.dismissAll();
    router.navigate('/(tabs)/labs');
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ paddingTop: insets.top + 4, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button kind="plain" small title={t('common.cancel')} onPress={() => router.back()} />
        <Txt v="headline">{t('review.title')}</Txt>
        <View style={{ width: 80 }} />
      </View>

      <View style={{ paddingHorizontal: 20, paddingVertical: 8, gap: 2 }}>
        <Txt v="subhead" tone="ink2">
          {report.lab} · {fmtDate(report.date)}
        </Txt>
        <Txt v="footnote" tone="ink3">
          {t('review.intro')}
        </Txt>
      </View>

      {/* Extracted values */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        <View style={{ backgroundColor: c.surface, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: c.hairline, overflow: 'hidden' }}>
          {TESTS.map((test, i) => {
            const v = val(test.id);
            const on = sel === test.id;
            const isEditing = editing === test.id;
            const edited = edits[test.id] != null;
            return (
              <View key={test.id}>
                {i > 0 && <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.hairline, marginLeft: 48 }} />}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 4, backgroundColor: on ? c.primarySoft : 'transparent' }}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`${t(`tests.${test.id}.name`)}, ${fmtNum(v, test.decimals)} ${test.unit}, ${edited ? t('review.edited') : t('review.matches')}`}
                  onPress={() => {
                    haptic.tap();
                    setSel(test.id);
                  }}
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 14, minHeight: 54 }}
                >
                  <CircleCheck size={22} color={edited ? c.primary : c.ok} strokeWidth={2} />
                  <View style={{ flex: 1, paddingVertical: 8, gap: 3 }}>
                    <Txt v="body" numberOfLines={1}>
                      {t(`tests.${test.id}.name`)}
                    </Txt>
                    {edited ? (
                      <Txt v="caption" tone="primary">
                        {t('review.edited')}
                      </Txt>
                    ) : flagFor(test, v) !== 'within' ? (
                      <FlagLabel flag={flagFor(test, v)} />
                    ) : null}
                  </View>
                  {!isEditing && (
                    <Txt v="value">
                      {fmtNum(v, test.decimals)}{' '}
                      <Txt v="subhead" tone="ink2">
                        {test.unit}
                      </Txt>
                    </Txt>
                  )}
                </Pressable>
                  {isEditing ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <TextInput
                        autoFocus
                        accessibilityLabel={t('review.editing')}
                        value={draft}
                        onChangeText={setDraft}
                        keyboardType="decimal-pad"
                        onSubmitEditing={() => saveEdit(test.id)}
                        style={{ width: 76, minHeight: 40, borderRadius: 10, borderWidth: 1.5, borderColor: c.primary, paddingHorizontal: 10, fontSize: 17, color: c.ink, textAlign: 'right', backgroundColor: c.surface }}
                      />
                      <Button small kind="secondary" title={t('common.save')} onPress={() => saveEdit(test.id)} />
                    </View>
                  ) : (
                    <>
                      <IconButton
                        icon={Pencil}
                        label={`${t('common.edit')} ${t(`tests.${test.id}.name`)}`}
                        onPress={() => {
                          setSel(test.id);
                          setDraft(fmtNum(v, test.decimals));
                          setEditing(test.id);
                        }}
                      />
                    </>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Original document with the selected line highlighted */}
      <View style={{ height: '38%', backgroundColor: c.sunken, borderTopWidth: StyleSheet.hairlineWidth, borderColor: c.hairline }}>
        <Txt v="footnote" tone="ink2" style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 6, fontWeight: '600' }}>
          {t('review.original')}
        </Txt>
        <ScrollView ref={docRef} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <LabDocument report={report} highlight={sel} scale={1.05} onRowY={(id, y) => (rowY.current[id] = y)} />
        </ScrollView>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: insets.bottom + 12, backgroundColor: c.bg }}>
        <Button title={t('review.confirm', { count: TESTS.length })} onPress={confirm} disabled={!!editing} />
      </View>
    </View>
  );
}
