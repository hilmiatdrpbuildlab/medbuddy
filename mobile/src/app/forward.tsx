import * as Clipboard from 'expo-clipboard';
import { Copy, Mail, ShieldCheck } from 'lucide-react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/Feedback';
import { Button, Txt } from '@/components/ui';
import { brand } from '@/config/brand';
import { patient } from '@/data/labs';
import { haptic } from '@/lib/feedback';
import { useTheme } from '@/theme';

export default function Forward() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const [copied, setCopied] = useState(false);
  const address = `${patient.email}@${brand.inboxDomain}`;
  return (
    <View style={{ flex: 1, backgroundColor: c.bg, padding: 20, paddingTop: 28, paddingBottom: insets.bottom + 16, gap: 22 }}>
      <View style={{ gap: 6 }}>
        <Txt v="title" accessibilityRole="header">
          {t('forward.title')}
        </Txt>
        <Txt v="callout" tone="ink2">
          {t('forward.body')}
        </Txt>
      </View>
      <View style={{ backgroundColor: c.surface, borderRadius: 16, borderWidth: 1, borderColor: c.hairline, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Mail size={22} color={c.primary} />
        <Txt v="headline" selectable style={{ flex: 1 }} numberOfLines={1} adjustsFontSizeToFit>
          {address}
        </Txt>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <ShieldCheck size={18} color={c.ink2} />
        <Txt v="footnote" tone="ink2" style={{ flex: 1 }}>
          {t('forward.hint')}
        </Txt>
      </View>
      <View style={{ flex: 1 }} />
      <Button
        title={copied ? t('common.copied') : t('forward.copy')}
        icon={Copy}
        onPress={async () => {
          await Clipboard.setStringAsync(address).catch(() => {});
          haptic.success();
          setCopied(true);
          toast(t('common.copied'));
        }}
      />
    </View>
  );
}
