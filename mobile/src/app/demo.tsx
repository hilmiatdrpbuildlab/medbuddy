import { router } from 'expo-router';
import { Mail, RotateCcw, WifiOff, Zap } from 'lucide-react-native';
import React from 'react';
import { Alert, Platform, Switch, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/Feedback';
import { Screen } from '@/components/Screen';
import { Group, Row, Segmented, Txt } from '@/components/ui';
import { useApp } from '@/store/app';
import { useTheme } from '@/theme';

export default function Demo() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const s = useApp();

  const reset = () => {
    const go = () => {
      s.reset();
      toast(t('demo.resetDone'));
      router.dismissAll();
      router.replace('/onboarding');
    };
    if (Platform.OS === 'web') return window.confirm(t('demo.resetConfirm')) && go();
    Alert.alert(t('demo.resetConfirm'), undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('demo.reset'), style: 'destructive', onPress: go },
    ]);
  };

  return (
    <Screen>
      <Txt v="callout" tone="ink2">
        {t('demo.body')}
      </Txt>
      <Group title={t('demo.speed')}>
        <View style={{ padding: 12 }}>
          <Segmented
            options={[
              { key: 'normal', label: t('demo.normal') },
              { key: 'fast', label: t('demo.fast') },
            ]}
            value={s.fastMode ? 'fast' : 'normal'}
            onChange={(v) => s.set({ fastMode: v === 'fast' })}
          />
        </View>
      </Group>
      <Group>
        <Row
          icon={Mail}
          title={t('demo.inbound')}
          subtitle={t('demo.inboundBody')}
          onPress={() => {
            toast(t('demo.scheduled'));
            router.dismissAll();
            router.navigate('/(tabs)');
            setTimeout(() => useApp.getState().set({ inbound: true }), 3000);
          }}
        />
        <Row
          icon={WifiOff}
          title={t('demo.offline')}
          subtitle={t('demo.offlineBody')}
          chevron={false}
          right={<Switch accessibilityLabel={t('demo.offline')} value={s.offline} onValueChange={(v) => s.set({ offline: v })} trackColor={{ true: c.primary, false: c.sunken }} thumbColor="#FFFFFF" />}
        />
        <Row icon={Zap} title={`${t('demo.speed')}: ${s.fastMode ? t('demo.fast') : t('demo.normal')}`} chevron={false} />
      </Group>
      <Group>
        <Row icon={RotateCcw} iconTone="ink2" title={t('demo.reset')} subtitle={t('demo.resetBody')} onPress={reset} />
      </Group>
    </Screen>
  );
}
