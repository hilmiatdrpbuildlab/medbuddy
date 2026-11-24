import { Lock } from 'lucide-react-native';
import React, { useEffect, useMemo } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BriefSheet } from '@/components/BriefSheet';
import { Wordmark } from '@/components/Logo';
import { Txt } from '@/components/ui';
import { REPORTS } from '@/data/labs';
import { BriefInput, buildBrief, decode } from '@/lib/brief';
import { Lang, useApp } from '@/store/app';
import { useTheme } from '@/theme';

/**
 * Read-only GP Brief opened from the QR code (served by the web build on Cloudflare Pages).
 * The brief travels in the URL fragment, which browsers never send to the server.
 */
export default function SharedBrief() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const set = useApp((s) => s.set);

  const input: BriefInput = useMemo(() => {
    const hash = Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.hash.slice(1) : '';
    return (
      decode(hash) ?? {
        lang: 'en',
        reportIds: REPORTS.map((r) => r.id),
        edits: {},
        tests: ['vitd', 'ferritin', 'hb', 'tsh'],
        metrics: ['apple:rhr', 'apple:hrv', 'apple:sleep'],
        questions: [t('brief.qDefault1'), t('brief.qDefault2'), t('brief.qDefault3')],
        generatedAt: '2026-11-23T09:00:00.000Z',
      }
    );
  }, []);

  useEffect(() => {
    if (['en', 'nl', 'fr'].includes(input.lang)) set({ lang: input.lang as Lang });
  }, [input.lang]);

  const brief = buildBrief(input, t);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.sunken }} contentContainerStyle={{ alignItems: 'center', paddingTop: insets.top + 20, paddingBottom: 40, paddingHorizontal: 16 }}>
      <View style={{ width: '100%', maxWidth: 720, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <Wordmark size={32} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Lock size={14} color={c.ink2} />
            <Txt v="footnote" tone="ink2">
              {t('brief.qrPrivate')}
            </Txt>
          </View>
        </View>
        <Txt v="subhead" tone="ink2">
          {t('brief.qrValid', { date: brief.validUntil })} · {brief.token}
        </Txt>
        <BriefSheet b={brief} showQr={false} />
        <Txt v="footnote" tone="ink3" center>
          {t('common.sample')}
        </Txt>
      </View>
    </ScrollView>
  );
}
