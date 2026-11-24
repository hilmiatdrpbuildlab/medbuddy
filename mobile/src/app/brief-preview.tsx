import * as Print from 'expo-print';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { Maximize2, Minimize2, Printer, QrCode, Share, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BriefSheet } from '@/components/BriefSheet';
import { toast } from '@/components/Feedback';
import { Button, IconButton, Txt } from '@/components/ui';
import { briefHtml } from '@/lib/brief';
import { qrSvg } from '@/lib/qrSvg';
import { useBrief } from '@/lib/useBrief';
import { useTheme } from '@/theme';

export default function BriefPreview() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { brief } = useBrief();
  const [busy, setBusy] = useState<'share' | 'print' | null>(null);
  const [zoom, setZoom] = useState(false);
  const html = () => briefHtml(brief, qrSvg(brief.url));

  const share = async () => {
    setBusy('share');
    try {
      if (Platform.OS === 'web') {
        await Print.printAsync({ html: html() });
      } else {
        const { uri } = await Print.printToFileAsync({ html: html(), width: 595, height: 842 });
        if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { UTI: 'com.adobe.pdf', mimeType: 'application/pdf', dialogTitle: brief.title });
        else toast(t('brief.shareFail'));
      }
    } catch {
      // user dismissed the share sheet
    }
    setBusy(null);
  };

  const print = async () => {
    setBusy('print');
    try {
      await Print.printAsync({ html: html() });
    } catch {}
    setBusy(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.sunken }}>
      <View style={{ paddingTop: Platform.OS === 'ios' ? 12 : insets.top + 4, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ width: 44 }} />
        <Txt v="headline">{t('brief.preview')}</Txt>
        <IconButton icon={X} label={t('common.close')} onPress={() => router.back()} />
      </View>
      <ScrollView maximumZoomScale={3} minimumZoomScale={1} contentContainerStyle={{ padding: 20, paddingTop: 8, gap: 10 }}>
        {zoom ? (
          <ScrollView horizontal contentContainerStyle={{ width: 595 }}>
            <Pressable accessibilityRole="button" accessibilityLabel={t('brief.fit')} onPress={() => setZoom(false)} style={{ width: 595 }}>
              <BriefSheet b={brief} />
            </Pressable>
          </ScrollView>
        ) : (
          <Pressable accessibilityRole="button" accessibilityLabel={t('brief.zoom')} onPress={() => setZoom(true)}>
            <BriefSheet b={brief} />
          </Pressable>
        )}
        <Pressable onPress={() => setZoom(!zoom)} hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 44 }}>
          {zoom ? <Minimize2 size={14} color={c.ink2} /> : <Maximize2 size={14} color={c.ink2} />}
          <Txt v="footnote" tone="ink2">
            {zoom ? t('brief.fit') : t('brief.zoom')}
          </Txt>
        </Pressable>
      </ScrollView>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: insets.bottom + 12, backgroundColor: c.bg, gap: 10 }}>
        <Button title={t('brief.showQr')} icon={QrCode} onPress={() => router.push('/qr')} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button kind="secondary" title={t('brief.share')} icon={Share} onPress={share} loading={busy === 'share'} style={{ flex: 1 }} />
          <Button kind="secondary" title={t('brief.print')} icon={Printer} onPress={print} loading={busy === 'print'} style={{ flex: 1 }} />
        </View>
      </View>
    </View>
  );
}
