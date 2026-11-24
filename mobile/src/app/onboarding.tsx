import { router } from 'expo-router';
import { Check, ChevronLeft, FileText, Lock, Mail, ShieldCheck } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, Switch, useWindowDimensions, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LogoMark } from '@/components/Logo';
import { RangeBar } from '@/components/RangeBar';
import { Button, Card, Divider, Txt } from '@/components/ui';
import { brand } from '@/config/brand';
import { testById } from '@/data/labs';
import { LANGUAGES } from '@/i18n';
import { haptic } from '@/lib/feedback';
import { fmtNum } from '@/lib/format';
import { wait } from '@/lib/useStages';
import { Lang, useApp } from '@/store/app';
import { useTheme } from '@/theme';

type Step = 'splash' | 'slides' | 'lang' | 'consent' | 'sign';

export default function Onboarding() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>('splash');
  const fade = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  }, [step]);

  useEffect(() => {
    if (step !== 'splash') return;
    const tm = setTimeout(() => setStep('slides'), 1400);
    return () => clearTimeout(tm);
  }, [step]);

  const back: Partial<Record<Step, Step>> = { lang: 'slides', consent: 'lang', sign: 'consent' };

  return (
    <View style={{ flex: 1, backgroundColor: step === 'splash' ? c.primary : c.bg, paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 16) }}>
      {back[step] && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => setStep(back[step]!)}
          hitSlop={8}
          style={{ width: 44, height: 44, marginLeft: 8, alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronLeft size={26} color={c.primary} />
        </Pressable>
      )}
      <Animated.View style={{ flex: 1, opacity: fade, transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] }}>
        {step === 'splash' && <Splash />}
        {step === 'slides' && <Slides onDone={() => setStep('lang')} />}
        {step === 'lang' && <LangStep onDone={() => setStep('consent')} />}
        {step === 'consent' && <ConsentStep onDone={() => setStep('sign')} />}
        {step === 'sign' && <SignStep />}
      </Animated.View>
    </View>
  );
}

function Splash() {
  const { t } = useTranslation();
  const scale = useState(() => new Animated.Value(0.86))[0];
  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 12 }).start();
  }, []);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18 }}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <LogoMark size={88} inverted />
      </Animated.View>
      <Txt v="largeTitle" style={{ color: '#FFFFFF' }}>
        {brand.name}
      </Txt>
      <Txt v="callout" center style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 260 }}>
        {t('onboarding.tagline')}
      </Txt>
    </View>
  );
}

/* ---------- Value slides with product-fragment illustrations ---------- */

function Slides({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation();
  const { c } = useTheme();
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const [h, setH] = useState(0);
  const ref = useRef<any>(null);
  const slides = [
    { title: t('onboarding.s1Title'), body: t('onboarding.s1Body'), art: <ArtLabs /> },
    { title: t('onboarding.s2Title'), body: t('onboarding.s2Body', { source: t('sources.apple') }), art: <ArtWatch /> },
    { title: t('onboarding.s3Title'), body: t('onboarding.s3Body'), art: <ArtBrief /> },
  ];
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const p = Math.round(e.nativeEvent.contentOffset.x / width);
    if (p !== page) {
      setPage(p);
      haptic.tap();
    }
  };
  const next = () => {
    if (page < 2) ref.current?.scrollTo({ x: (page + 1) * width, animated: true });
    else onDone();
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 44, alignItems: 'flex-end', paddingHorizontal: 8 }}>
        <Button kind="plain" small title={t('onboarding.skip')} onPress={onDone} />
      </View>
      <ScrollView ref={ref} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={onScroll} scrollEventThrottle={32} style={{ flex: 1 }} onLayout={(e) => setH(e.nativeEvent.layout.height)}>
        {slides.map((s) => (
          <View key={s.title} style={{ width, height: h || undefined, paddingHorizontal: 24, justifyContent: 'center', gap: 28 }}>
            <View style={{ height: 280, alignItems: 'center', justifyContent: 'center' }}>{s.art}</View>
            <View style={{ gap: 10 }}>
              <Txt v="title" style={{ fontSize: 26, lineHeight: 32 }} accessibilityRole="header">
                {s.title}
              </Txt>
              <Txt v="body" tone="ink2">
                {s.body}
              </Txt>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={{ paddingHorizontal: 24, gap: 20, paddingTop: 12 }}>
        <View style={{ flexDirection: 'row', gap: 6 }} accessibilityLabel={`${page + 1} / 3`}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ height: 6, width: i === page ? 22 : 6, borderRadius: 3, backgroundColor: i === page ? c.primary : c.hairline }} />
          ))}
        </View>
        <Button title={page < 2 ? t('common.continue') : t('onboarding.getStarted')} onPress={next} />
      </View>
    </View>
  );
}

function ArtLabs() {
  const { c } = useTheme();
  const { t } = useTranslation();
  const docs = [
    ['Labo Noord', '2024'],
    ['CKB Gent', '2025'],
    ['Labo Noord', '2026'],
  ];
  return (
    <View style={{ width: 300, gap: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
        {docs.map((d, i) => (
          <View key={d.join()} style={{ transform: [{ rotate: `${(i - 1) * 4}deg` }, { translateY: i === 1 ? -6 : 0 }], backgroundColor: c.surface, borderRadius: 8, padding: 8, borderWidth: 1, borderColor: c.hairline, width: 92, gap: 4 }}>
            <FileText size={16} color={c.ink3} />
            <Txt v="caption" numberOfLines={1}>
              {d[0]}
            </Txt>
            <Txt v="caption" tone="ink2" style={{ fontVariant: ['tabular-nums'] }}>
              {d[1]}
            </Txt>
          </View>
        ))}
      </View>
      <Card style={{ gap: 14 }}>
        {(['ferritin', 'vitd', 'hb'] as const).map((id, i) => {
          const test = testById(id);
          const v = [18, 22, 12.6][i];
          return (
            <View key={id} style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Txt v="subhead">{t(`tests.${id}.name`)}</Txt>
                <Txt v="subhead" style={{ fontWeight: '600', fontVariant: ['tabular-nums'] }}>
                  {fmtNum(v, test.decimals)} {test.unit}
                </Txt>
              </View>
              <RangeBar test={test} value={v} compact />
            </View>
          );
        })}
      </Card>
    </View>
  );
}

function ArtWatch() {
  const { c } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={{ width: 300, alignItems: 'center' }}>
      <Card style={{ width: 300, gap: 8 }}>
        <Txt v="footnote" tone="ink2">
          {t('metrics.sleep.name')} · {t('trends.recent')}
        </Txt>
        <Txt v="bigValue">{fmtNum(6.6, 1)} h</Txt>
        <Txt v="footnote" tone="ink2">
          {t('trends.vsBaseline', { value: `${fmtNum(7.5, 1)} h` })}
        </Txt>
        <Svg width={268} height={70}>
          <Rect x={134} y={0} width={134} height={70} rx={6} fill={c.surfaceAlt} />
          <Path d="M2 22 L30 18 L58 24 L86 19 L114 21 L142 26 L170 33 L198 40 L226 44 L266 47" stroke={c.primary} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M2 21 L266 21" stroke={c.ink3} strokeDasharray="4 4" strokeWidth={1} />
        </Svg>
      </Card>
    </View>
  );
}

function ArtBrief() {
  const { c } = useTheme();
  return (
    <View style={{ width: 196, aspectRatio: 595 / 842, backgroundColor: c.paper, borderRadius: 4, padding: 16, gap: 8, shadowColor: '#0B2A2E', shadowOpacity: 0.16, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 5 }}>
      <View style={{ height: 8, width: '70%', borderRadius: 2, backgroundColor: '#0B5D63' }} />
      <View style={{ height: 2, backgroundColor: '#0B5D63', marginBottom: 4 }} />
      {[0.9, 0.75, 0.85, 0.6].map((w, i) => (
        <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ height: 5, width: `${w * 55}%`, borderRadius: 2, backgroundColor: '#D9DEE2' }} />
          <View style={{ height: 5, width: '18%', borderRadius: 2, backgroundColor: i === 0 ? '#8A4B00' : '#9AA5AD' }} />
        </View>
      ))}
      <View style={{ height: 5, width: '40%', borderRadius: 2, backgroundColor: '#0B5D63', marginTop: 6 }} />
      {[0.95, 0.8, 0.88].map((w, i) => (
        <View key={i} style={{ height: 5, width: `${w * 100}%`, borderRadius: 2, backgroundColor: '#E3E7EA' }} />
      ))}
      <View style={{ flex: 1 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <QRCode value="https://vitalsbrief-demo.pages.dev" size={40} />
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ height: 4, borderRadius: 2, backgroundColor: '#E3E7EA' }} />
          <View style={{ height: 4, width: '70%', borderRadius: 2, backgroundColor: '#E3E7EA' }} />
        </View>
      </View>
    </View>
  );
}

/* ---------- Language ---------- */

function LangStep({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation();
  const { c } = useTheme();
  const lang = useApp((s) => s.lang);
  const set = useApp((s) => s.set);
  return (
    <View style={{ flex: 1, paddingHorizontal: 24, gap: 24 }}>
      <View style={{ gap: 8, marginTop: 8 }}>
        <Txt v="largeTitle" accessibilityRole="header">
          {t('onboarding.langTitle')}
        </Txt>
        <Txt v="body" tone="ink2">
          {t('onboarding.langBody')}
        </Txt>
      </View>
      <View style={{ gap: 10 }} accessibilityRole="radiogroup">
        {LANGUAGES.map((l) => {
          const on = l.code === lang;
          return (
            <Pressable
              key={l.code}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              onPress={() => {
                haptic.tap();
                set({ lang: l.code as Lang });
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                minHeight: 60,
                paddingHorizontal: 18,
                borderRadius: 16,
                backgroundColor: c.surface,
                borderWidth: on ? 2 : 1,
                borderColor: on ? c.primary : c.hairline,
              }}
            >
              <Txt v="headline" style={{ flex: 1 }}>
                {l.label}
              </Txt>
              {on && (
                <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={16} color={c.onPrimary} strokeWidth={3} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
      <View style={{ flex: 1 }} />
      <Button title={t('common.continue')} onPress={onDone} />
    </View>
  );
}

/* ---------- GDPR Art. 9 consent, per purpose ---------- */

function ConsentStep({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation();
  const { c } = useTheme();
  const consents = useApp((s) => s.consents);
  const set = useApp((s) => s.set);
  const items = [
    { key: 'labs' as const, title: t('onboarding.cLabs'), body: t('onboarding.cLabsBody'), required: true },
    { key: 'wearables' as const, title: t('onboarding.cWear'), body: t('onboarding.cWearBody', { source: t('sources.apple') }) },
    { key: 'ai' as const, title: t('onboarding.cAi'), body: t('onboarding.cAiBody') },
  ];
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, gap: 24, paddingBottom: 16 }}>
        <View style={{ gap: 8, marginTop: 8 }}>
          <Txt v="largeTitle" accessibilityRole="header">
            {t('onboarding.consentTitle')}
          </Txt>
          <Txt v="body" tone="ink2">
            {t('onboarding.consentBody')}
          </Txt>
        </View>
        <View style={{ backgroundColor: c.surface, borderRadius: 16, borderWidth: 1, borderColor: c.hairline }}>
          {items.map((it, i) => (
            <View key={it.key}>
              {i > 0 && <Divider style={{ marginLeft: 16 }} />}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 }}>
                <View style={{ flex: 1, gap: 3 }}>
                  <Txt v="headline">{it.title}</Txt>
                  <Txt v="subhead" tone="ink2">
                    {it.body}
                  </Txt>
                </View>
                <Switch
                  accessibilityLabel={it.title}
                  value={it.required ? true : consents[it.key]}
                  disabled={it.required}
                  onValueChange={(v) => {
                    haptic.tap();
                    set({ consents: { ...consents, [it.key]: v } });
                  }}
                  trackColor={{ true: c.primary, false: c.sunken }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
          <ShieldCheck size={18} color={c.primary} style={{ marginTop: 1 }} />
          <Txt v="footnote" tone="ink2" style={{ flex: 1 }}>
            {t('settings.security')} {t('onboarding.consentFoot')}
          </Txt>
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
        <Button title={t('onboarding.agree')} onPress={onDone} />
      </View>
    </View>
  );
}

/* ---------- Simulated sign-in ---------- */

function SignStep() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const set = useApp((s) => s.set);
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setBusy(true);
    await wait(900);
    haptic.success();
    set({ onboarded: true });
    router.replace('/(tabs)');
  };
  return (
    <View style={{ flex: 1, paddingHorizontal: 24, gap: 24 }}>
      <View style={{ alignItems: 'center', gap: 16, marginTop: 40 }}>
        <LogoMark size={72} />
        <Txt v="largeTitle" center accessibilityRole="header">
          {t('onboarding.signTitle')}
        </Txt>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', paddingHorizontal: 12 }}>
          <Lock size={16} color={c.ink2} />
          <Txt v="subhead" tone="ink2" center style={{ flexShrink: 1 }}>
            {t('onboarding.signBody')}
          </Txt>
        </View>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ gap: 12 }}>
        <Button kind="black" title={t('onboarding.apple')} onPress={go} loading={busy} icon={AppleGlyph} />
        <Button kind="outline" title={t('onboarding.email')} onPress={go} disabled={busy} icon={Mail} />
        <Txt v="footnote" tone="ink3" center>
          {t('onboarding.terms')}
        </Txt>
      </View>
    </View>
  );
}

/** Apple logo glyph (authored path) for the simulated Sign in with Apple button. */
function AppleGlyph({ size = 20, color = '#FFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76-1.47.02-2.83.86-3.59 2.17-1.54 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.24 2.73 2.2 1.1-.04 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.14.84-1.22 1.18-2.41 1.2-2.47-.03-.01-2.3-.88-2.32-3.5zM14.2 6.13c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.64-1.05 1.68-.92 2.67.97.08 1.96-.49 2.56-1.22z"
      />
    </Svg>
  );
}
