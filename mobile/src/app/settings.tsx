import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { Check, Download, Info, ShieldCheck, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Platform, Pressable, Switch, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/Feedback';
import { LogoMark } from '@/components/Logo';
import { Screen } from '@/components/Screen';
import { Group, Row, Segmented, Txt } from '@/components/ui';
import { brand } from '@/config/brand';
import { LANGUAGES } from '@/i18n';
import { haptic } from '@/lib/feedback';
import { Appearance, Lang, historyFor, useApp } from '@/store/app';
import { TESTS } from '@/data/labs';
import { useTheme } from '@/theme';

function confirm(message: string, onYes: () => void, yes: string, no: string) {
  if (Platform.OS === 'web') {
    if (window.confirm(message)) onYes();
    return;
  }
  Alert.alert(message, undefined, [
    { text: no, style: 'cancel' },
    { text: yes, style: 'destructive', onPress: onYes },
  ]);
}

export default function Settings() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const s = useApp();
  const [showAi, setShowAi] = useState(false);

  const exportData = async () => {
    const data = {
      exportedAt: new Date().toISOString(),
      results: TESTS.map((x) => ({ loinc: x.loinc, unit: x.unit, history: historyFor(x.id, s.reportIds, s.edits) })),
      consents: s.consents,
    };
    const json = JSON.stringify(data, null, 2);
    try {
      if (Platform.OS === 'web') {
        toast(t('common.saved'));
        return;
      }
      const file = new FileSystem.File(FileSystem.Paths.cache, 'vitalsbrief-export.json');
      file.create({ overwrite: true });
      file.write(json);
      await Sharing.shareAsync(file.uri, { mimeType: 'application/json', UTI: 'public.json' });
    } catch {}
  };

  return (
    <Screen>
      <Group title={t('settings.language')}>
        {LANGUAGES.map((l) => (
          <Row
            key={l.code}
            title={l.label}
            onPress={() => s.set({ lang: l.code as Lang })}
            chevron={false}
            right={l.code === s.lang ? <Check size={22} color={c.primary} strokeWidth={2.5} /> : undefined}
          />
        ))}
      </Group>

      <Group title={t('settings.appearance')}>
        <View style={{ padding: 12 }}>
          <Segmented<Appearance>
            options={[
              { key: 'system', label: t('settings.system') },
              { key: 'light', label: t('settings.light') },
              { key: 'dark', label: t('settings.dark') },
            ]}
            value={s.appearance}
            onChange={(v) => s.set({ appearance: v })}
          />
        </View>
      </Group>

      <Group title={t('settings.privacy')} footer={t('settings.security')}>
        <Row
          icon={ShieldCheck}
          title={t('settings.deleteOriginals')}
          subtitle={t('settings.deleteOriginalsBody')}
          chevron={false}
          right={<Switch accessibilityLabel={t('settings.deleteOriginals')} value={s.deleteOriginals} onValueChange={(v) => s.set({ deleteOriginals: v })} trackColor={{ true: c.primary, false: c.sunken }} thumbColor="#FFFFFF" />}
        />
        <Row icon={Download} title={t('settings.export')} subtitle={t('settings.exportBody')} onPress={exportData} />
        <Row
          icon={Trash2}
          iconTone="ink2"
          title={t('settings.wipe')}
          onPress={() =>
            confirm(
              t('settings.wipeConfirm'),
              () => {
                s.wipe();
                haptic.warn();
                toast(t('settings.wipeDone'));
              },
              t('settings.wipe'),
              t('common.cancel'),
            )
          }
        />
      </Group>

      <Group title={t('settings.about')}>
        <Row icon={Info} title={t('settings.ai')} onPress={() => setShowAi(!showAi)} chevron={!showAi} />
        {showAi ? (
          <View style={{ padding: 16, paddingTop: 0 }}>
            <Txt v="callout" tone="ink2">
              {t('settings.aiBody')}
            </Txt>
          </View>
        ) : null}
      </Group>

      <Pressable
        accessibilityRole="button"
        accessibilityHint={t('settings.holdHint')}
        delayLongPress={700}
        onLongPress={() => {
          haptic.success();
          router.push('/demo');
        }}
        style={{ alignItems: 'center', gap: 8, paddingVertical: 8 }}
      >
        <LogoMark size={44} />
        <Txt v="headline">{brand.name}</Txt>
        <Txt v="footnote" tone="ink3">
          {t('settings.version', { v: Constants.expoConfig?.version ?? '1.0.0' })} · {t('common.sample')}
        </Txt>
      </Pressable>
    </Screen>
  );
}
