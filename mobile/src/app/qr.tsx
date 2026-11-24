import { Clock, Lock } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Txt } from '@/components/ui';
import { patient } from '@/data/labs';
import { haptic } from '@/lib/feedback';
import { useBrief } from '@/lib/useBrief';
import { useTheme } from '@/theme';

export default function Qr() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { brief } = useBrief();
  useEffect(() => {
    haptic.light();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: c.bg, padding: 24, paddingTop: 32, paddingBottom: insets.bottom + 16, alignItems: 'center', gap: 20 }}>
      <View style={{ gap: 6, alignItems: 'center' }}>
        <Txt v="title" center accessibilityRole="header">
          {t('brief.qrTitle')}
        </Txt>
        <Txt v="callout" tone="ink2" center style={{ maxWidth: 320 }}>
          {t('brief.qrBody')}
        </Txt>
      </View>
      <View
        accessible
        accessibilityLabel={`QR code. ${brief.title}, ${patient.name}`}
        style={{ backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: c.hairline, alignItems: 'center', gap: 12 }}
      >
        <QRCode value={brief.url} size={236} color="#0E2A2E" backgroundColor="#FFFFFF" ecl="L" />
        <Txt v="headline" style={{ color: '#0E2A2E', letterSpacing: 2 }}>
          {brief.token}
        </Txt>
      </View>
      <View style={{ gap: 10, alignSelf: 'stretch' }}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Clock size={16} color={c.ink2} />
          <Txt v="subhead" tone="ink2">
            {t('brief.qrValid', { date: brief.validUntil })}
          </Txt>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Lock size={16} color={c.ink2} />
          <Txt v="footnote" tone="ink2" center>
            {t('brief.qrPrivate')}
          </Txt>
        </View>
      </View>
    </View>
  );
}
