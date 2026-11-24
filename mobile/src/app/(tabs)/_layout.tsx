import { Tabs } from 'expo-router';
import { Activity, FileText, FlaskConical, House } from 'lucide-react-native';
import React from 'react';
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { haptic } from '@/lib/feedback';
import { useTheme } from '@/theme';

export default function TabLayout() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const icon = (Icon: typeof House) =>
    function TabIcon({ color, focused }: { color: unknown; focused: boolean }) {
      return <Icon size={24} color={color as string} strokeWidth={focused ? 2.2 : 1.8} />;
    };
  return (
    <Tabs
      screenListeners={{ tabPress: () => haptic.tap() }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.ink3,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: c.surface,
          borderTopColor: c.hairline,
          ...(Platform.OS === 'web' ? { height: 64, paddingBottom: 8 } : {}),
        },
        sceneStyle: { backgroundColor: c.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.home'), tabBarIcon: icon(House) }} />
      <Tabs.Screen name="labs" options={{ title: t('tabs.labs'), tabBarIcon: icon(FlaskConical) }} />
      <Tabs.Screen name="trends" options={{ title: t('tabs.trends'), tabBarIcon: icon(Activity) }} />
      <Tabs.Screen name="brief" options={{ title: t('tabs.brief'), tabBarIcon: icon(FileText) }} />
    </Tabs>
  );
}
