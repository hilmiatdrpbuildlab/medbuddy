import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { Camera, FileUp, Mail, Share } from 'lucide-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Group, Row, Txt } from '@/components/ui';
import { useTheme } from '@/theme';

export default function AddReport() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const insets = useSafeAreaInsets();

  const pickPdf = async () => {
    // Real document picker; whatever is picked maps to the demo report.
    const res = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'], copyToCacheDirectory: false }).catch(() => null);
    if (!res || res.canceled) return;
    router.replace({ pathname: '/analyzing', params: { source: 'pdf', name: res.assets[0]?.name ?? '' } });
  };

  return (
    <ScrollView style={{ backgroundColor: c.bg }} contentContainerStyle={{ padding: 20, paddingTop: 28, paddingBottom: insets.bottom + 24, gap: 18 }}>
      <View style={{ gap: 6 }}>
        <Txt v="title" accessibilityRole="header">
          {t('add.title')}
        </Txt>
        <Txt v="callout" tone="ink2">
          {t('add.body')}
        </Txt>
      </View>
      <Group>
        <Row icon={FileUp} title={t('add.pdf')} subtitle={t('add.pdfBody')} onPress={pickPdf} />
        <Row icon={Camera} title={t('add.photo')} subtitle={t('add.photoBody')} onPress={() => router.replace('/camera')} />
        <Row icon={Share} title={t('add.portal')} subtitle={t('add.portalBody')} onPress={() => router.replace('/portal')} />
        <Row icon={Mail} title={t('add.forward')} subtitle={t('add.forwardBody')} onPress={() => router.replace('/forward')} />
      </Group>
    </ScrollView>
  );
}
