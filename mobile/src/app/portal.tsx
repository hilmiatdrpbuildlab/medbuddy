import { router } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button, Txt } from '@/components/ui';
import { brand } from '@/config/brand';
import { useTheme } from '@/theme';

export default function Portal() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const steps = [t('portal.step1'), t('portal.step2'), t('portal.step3', { name: brand.name })];
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 28, gap: 22 }}>
        <View style={{ gap: 6 }}>
          <Txt v="title" accessibilityRole="header">
            {t('portal.title')}
          </Txt>
          <Txt v="callout" tone="ink2">
            {t('portal.body', { name: brand.name })}
          </Txt>
        </View>
        <View style={{ gap: 18 }}>
          {steps.map((s, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 14 }}>
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
                <Txt v="subhead" tone="primary" style={{ fontWeight: '700' }}>
                  {i + 1}
                </Txt>
              </View>
              <Txt v="body" style={{ flex: 1, paddingTop: 3 }}>
                {s}
              </Txt>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={{ padding: 20, paddingBottom: insets.bottom + 16 }}>
        <Button title={t('portal.try')} onPress={() => router.replace({ pathname: '/analyzing', params: { source: 'portal' } })} />
      </View>
    </View>
  );
}
