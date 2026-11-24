import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Camera as CameraIcon, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { StageList } from '@/components/Feedback';
import { LabDocument } from '@/components/LabDocument';
import { Button, Txt } from '@/components/ui';
import { NEW_REPORT_ID, reportById } from '@/data/labs';
import { haptic } from '@/lib/feedback';
import { useStages } from '@/lib/useStages';
import { useTheme } from '@/theme';

const PHOTO_STAGES = [
  { key: 'crop', ms: 1500 },
  { key: 'enhance', ms: 2000 },
];

/** Edge-detection frame: four corner brackets that settle on the page. */
function Frame({ detected }: { detected: boolean }) {
  const a = useState(() => new Animated.Value(0))[0];
  useEffect(() => {
    Animated.timing(a, { toValue: detected ? 1 : 0, duration: 380, useNativeDriver: false }).start();
  }, [detected]);
  const inset = a.interpolate({ inputRange: [0, 1], outputRange: [28, 10] });
  const color = detected ? '#7FE0C4' : 'rgba(255,255,255,0.9)';
  const corner = (pos: object, rot: string) => (
    <View style={[{ position: 'absolute', width: 34, height: 34, borderColor: color, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 10, transform: [{ rotate: rot }] }, pos]} />
  );
  return (
    <Animated.View pointerEvents="none" style={{ position: 'absolute', top: inset, left: inset, right: inset, bottom: inset }}>
      {corner({ top: 0, left: 0 }, '0deg')}
      {corner({ top: 0, right: 0 }, '90deg')}
      {corner({ bottom: 0, right: 0 }, '180deg')}
      {corner({ bottom: 0, left: 0 }, '270deg')}
    </Animated.View>
  );
}

export default function CameraScreen() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const [perm, request] = useCameraPermissions();
  const [useSample, setUseSample] = useState(Platform.OS === 'web');
  const [detected, setDetected] = useState(false);
  const [captured, setCaptured] = useState(false);
  const cam = useRef<CameraView>(null);
  const live = !useSample && perm?.granted;

  useEffect(() => {
    if (captured) return;
    const tm = setTimeout(() => {
      setDetected(true);
      haptic.light();
    }, 1600);
    return () => clearTimeout(tm);
  }, [live, useSample, captured]);

  const stages = useStages(
    PHOTO_STAGES,
    () => router.replace({ pathname: '/analyzing', params: { source: 'photo' } }),
    { autoStart: false },
  );

  const capture = async () => {
    haptic.success();
    try {
      if (live) await cam.current?.takePictureAsync({ quality: 0.6, skipProcessing: true });
    } catch {}
    setCaptured(true);
    stages.start();
  };

  const needsPerm = !useSample && perm && !perm.granted;

  return (
    <View style={{ flex: 1, backgroundColor: '#05090A' }}>
      <View style={{ paddingTop: insets.top + 4, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('common.cancel')} onPress={() => router.back()} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <X size={26} color="#FFFFFF" />
        </Pressable>
        <Txt v="headline" style={{ color: '#FFFFFF' }}>
          {t('camera.title')}
        </Txt>
        <View style={{ width: 44 }} />
      </View>

      {needsPerm ? (
        <View style={{ flex: 1, justifyContent: 'center', padding: 28, gap: 14 }}>
          <CameraIcon size={36} color="#FFFFFF" />
          <Txt v="title" style={{ color: '#FFFFFF' }}>
            {t('camera.noPermTitle')}
          </Txt>
          <Txt v="body" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {t('camera.noPermBody')}
          </Txt>
          <Button title={t('camera.allow')} onPress={request} style={{ marginTop: 10 }} />
          <Button kind="plain" title={t('camera.useSample')} onPress={() => setUseSample(true)} />
        </View>
      ) : (
        <>
          <View style={{ flex: 1, margin: 16, borderRadius: 22, overflow: 'hidden', backgroundColor: '#1A2224', justifyContent: 'center' }}>
            {live && !captured ? (
              <CameraView ref={cam} style={{ flex: 1 }} facing="back" />
            ) : (
              <View style={{ padding: 26, transform: [{ rotate: captured ? '0deg' : '-2.5deg' }], opacity: captured ? 1 : 0.92 }}>
                <LabDocument report={reportById(NEW_REPORT_ID)} scale={0.9} />
              </View>
            )}
            {!captured && <Frame detected={detected} />}
          </View>
          <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 18, gap: 18, minHeight: 170, justifyContent: 'center' }}>
            {captured ? (
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18 }}>
                <StageList labels={[t('camera.cropping'), t('camera.enhancing')]} index={stages.index} />
              </View>
            ) : (
              <>
                <Txt v="callout" center style={{ color: detected ? '#7FE0C4' : 'rgba(255,255,255,0.85)', fontWeight: '600' }} accessibilityLiveRegion="polite">
                  {detected ? t('camera.detected') : t('camera.hint')}
                </Txt>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('camera.capture')}
                  onPress={capture}
                  style={({ pressed }) => ({
                    alignSelf: 'center',
                    width: 78,
                    height: 78,
                    borderRadius: 39,
                    borderWidth: 4,
                    borderColor: '#FFFFFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <View style={{ width: 62, height: 62, borderRadius: 31, backgroundColor: detected ? '#7FE0C4' : '#FFFFFF' }} />
                </Pressable>
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
}
