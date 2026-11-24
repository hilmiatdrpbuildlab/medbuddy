import { router } from 'expo-router';
import { Check, CircleCheck, Mail } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, AccessibilityInfo, Animated, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { create } from 'zustand';
import { haptic } from '@/lib/feedback';
import { useApp } from '@/store/app';
import { useTheme } from '@/theme';
import { Txt } from './ui';

/* ---------------- Toast ("Saved") ---------------- */

const useToastStore = create<{ msg: string | null; n: number }>(() => ({ msg: null, n: 0 }));
export const toast = (msg: string) => {
  useToastStore.setState((s) => ({ msg, n: s.n + 1 }));
  AccessibilityInfo.announceForAccessibility(msg);
};

export function ToastHost() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { msg, n } = useToastStore();
  const a = useState(() => new Animated.Value(0))[0];
  useEffect(() => {
    if (!msg) return;
    a.setValue(0);
    Animated.sequence([
      Animated.timing(a, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.delay(1700),
      Animated.timing(a, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(({ finished }) => finished && useToastStore.setState({ msg: null }));
  }, [n]);
  if (!msg) return null;
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        alignSelf: 'center',
        bottom: insets.bottom + 96,
        opacity: a,
        transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: c.ink,
        paddingHorizontal: 16,
        paddingVertical: 11,
        borderRadius: 999,
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      <CircleCheck size={18} color={c.bg} />
      <Txt v="subhead" style={{ color: c.bg, fontWeight: '600' }}>
        {msg}
      </Txt>
    </Animated.View>
  );
}

/* ---------------- Inbound email banner (simulated push) ---------------- */

export function InboundBanner() {
  const { t } = useTranslation();
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const inbound = useApp((s) => s.inbound);
  const set = useApp((s) => s.set);
  const a = useState(() => new Animated.Value(0))[0];
  useEffect(() => {
    if (!inbound) return;
    haptic.success();
    Animated.spring(a, { toValue: 1, useNativeDriver: true, damping: 18 }).start();
    const tm = setTimeout(() => Animated.timing(a, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => set({ inbound: false })), 9000);
    return () => clearTimeout(tm);
  }, [inbound]);
  if (!inbound) return null;
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: 10,
        right: 10,
        top: insets.top + 6,
        transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [-140, 0] }) }],
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t('inbound.title')}. ${t('inbound.body')}`}
        onPress={() => {
          set({ inbound: false });
          router.push({ pathname: '/analyzing', params: { source: 'email' } });
        }}
        style={{
          flexDirection: 'row',
          gap: 12,
          alignItems: 'center',
          padding: 14,
          borderRadius: 20,
          backgroundColor: c.surface,
          borderWidth: 1,
          borderColor: c.hairline,
          shadowColor: '#000',
          shadowOpacity: 0.16,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6,
        }}
      >
        <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}>
          <Mail size={20} color={c.onPrimary} />
        </View>
        <View style={{ flex: 1 }}>
          <Txt v="subhead" style={{ fontWeight: '600' }}>
            {t('inbound.title')}
          </Txt>
          <Txt v="footnote" tone="ink2">
            {t('inbound.body')}
          </Txt>
        </View>
        <Txt v="caption" tone="ink3">
          {t('inbound.now')}
        </Txt>
      </Pressable>
    </Animated.View>
  );
}

/* ---------------- Stage checklist ---------------- */

export function StageList({ labels, index }: { labels: string[]; index: number }) {
  const { c } = useTheme();
  return (
    <View style={{ gap: 14 }} accessibilityLiveRegion="polite">
      {labels.map((l, i) => {
        const done = i < index;
        const active = i === index;
        return (
          <View key={l} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, opacity: i > index ? 0.45 : 1 }}>
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: done ? c.primary : active ? c.primarySoft : c.sunken,
              }}
            >
              {done ? <Check size={15} color={c.onPrimary} strokeWidth={3} /> : active ? <ActivityIndicator size="small" color={c.primary} /> : null}
            </View>
            <Txt v="body" tone={done || active ? 'ink' : 'ink2'} style={{ fontWeight: active ? '600' : '400' }}>
              {l}
            </Txt>
          </View>
        );
      })}
    </View>
  );
}

/* ---------------- Skeleton ---------------- */

export function Skeleton({ h = 16, w = '100%', r = 8 }: { h?: number; w?: number | `${number}%`; r?: number }) {
  const { c } = useTheme();
  const a = useState(() => new Animated.Value(0.5))[0];
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(a, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(a, { toValue: 0.5, duration: 600, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return <Animated.View style={{ height: h, width: w, borderRadius: r, backgroundColor: c.sunken, opacity: a }} />;
}
