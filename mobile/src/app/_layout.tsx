import '@/i18n';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import i18n from 'i18next';
import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { InboundBanner, ToastHost } from '@/components/Feedback';
import { useApp } from '@/store/app';
import { useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Web backup build only: `?seed=start` skips onboarding, `?seed=full` also imports the
 * new report, connects Apple Health and prepares a brief (for rehearsals and screenshots).
 * Optional `&lang=nl|fr` and `&theme=dark`.
 */
function seedFromUrl() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  const q = new URLSearchParams(window.location.search);
  const seed = q.get('seed');
  const s = useApp.getState();
  const lang = q.get('lang');
  if (lang === 'en' || lang === 'nl' || lang === 'fr') s.set({ lang });
  const theme = q.get('theme');
  if (theme === 'dark' || theme === 'light') s.set({ appearance: theme });
  if (seed === 'start' || seed === 'full') s.set({ onboarded: true });
  if (seed === 'full') {
    s.addReport('r2026');
    s.set({ connected: { apple: true, garmin: false }, briefGeneratedAt: '2026-11-23T08:30:00.000Z' });
  }
}

export default function RootLayout() {
  const { c, scheme } = useTheme();
  const { t } = useTranslation();
  const lang = useApp((s) => s.lang);
  const [ready, setReady] = useState(() => {
    const hydrated = useApp.persist.hasHydrated();
    if (hydrated) seedFromUrl();
    return hydrated;
  });

  useEffect(
    () =>
      useApp.persist.onFinishHydration(() => {
        seedFromUrl();
        setReady(true);
      }),
    [],
  );

  useEffect(() => {
    if (i18n.language !== lang) void i18n.changeLanguage(lang);
  }, [lang]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(c.bg).catch(() => {});
  }, [c.bg]);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return <View style={{ flex: 1, backgroundColor: c.bg }} />;

  const header = {
    headerStyle: { backgroundColor: c.bg },
    headerTintColor: c.primary,
    headerTitleStyle: { color: c.ink, fontWeight: '600' as const },
    headerShadowVisible: false,
    headerTransparent: false,
    headerBackButtonDisplayMode: 'minimal' as const,
    contentStyle: { backgroundColor: c.bg },
  };
  const sheet = {
    presentation: 'formSheet' as const,
    sheetGrabberVisible: true,
    sheetCornerRadius: 24,
    headerShown: false,
    contentStyle: { backgroundColor: c.bg },
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={header}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false, animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="add-report" options={{ ...sheet, sheetAllowedDetents: Platform.OS === 'android' ? [0.75] : 'fitToContents' }} />
        <Stack.Screen name="portal" options={{ ...sheet, sheetAllowedDetents: [0.85] }} />
        <Stack.Screen name="forward" options={{ ...sheet, sheetAllowedDetents: [0.7] }} />
        <Stack.Screen name="camera" options={{ presentation: 'fullScreenModal', headerShown: false }} />
        <Stack.Screen name="analyzing" options={{ presentation: 'fullScreenModal', headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="review" options={{ presentation: 'fullScreenModal', headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="test/[id]" options={{ title: '' }} />
        <Stack.Screen name="connect/[source]" options={{ presentation: 'modal', headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="brief-making" options={{ presentation: 'fullScreenModal', headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="brief-preview" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="qr" options={{ ...sheet, sheetAllowedDetents: [0.8] }} />
        <Stack.Screen name="settings" options={{ title: t('settings.title') }} />
        <Stack.Screen name="demo" options={{ title: t('demo.title') }} />
        <Stack.Screen name="teaser/[id]" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="b/[token]" options={{ headerShown: false }} />
      </Stack>
      <InboundBanner />
      <ToastHost />
    </View>
  );
}
