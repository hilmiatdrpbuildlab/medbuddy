import React, { ReactNode } from 'react';
import { ScrollView, ScrollViewProps, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Txt } from './ui';

/**
 * Standard screen: scrolling content on the app ground, optional in-content large title
 * (top-level tabs) and an optional sticky footer that holds the screen's single primary action.
 */
export function Screen({
  title,
  subtitle,
  headerRight,
  children,
  footer,
  topInset = false,
  scroll = true,
  contentStyle,
  ...rest
}: {
  title?: string;
  subtitle?: string;
  headerRight?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** true when there is no native header above (tabs, full-screen flows). */
  topInset?: boolean;
  scroll?: boolean;
  contentStyle?: ScrollViewProps['contentContainerStyle'];
} & ScrollViewProps) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const head = title ? (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
      <View style={{ flex: 1, gap: 4 }}>
        <Txt v="largeTitle" accessibilityRole="header">
          {title}
        </Txt>
        {subtitle ? (
          <Txt v="subhead" tone="ink2">
            {subtitle}
          </Txt>
        ) : null}
      </View>
      {headerRight}
    </View>
  ) : null;

  const pad = { paddingTop: topInset ? insets.top + 12 : 16, paddingHorizontal: 16, paddingBottom: footer ? 24 : 40, gap: 24 };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      {scroll ? (
        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={[pad, contentStyle]} keyboardShouldPersistTaps="handled" {...rest}>
          {head}
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, pad, contentStyle as object]}>
          {head}
          {children}
        </View>
      )}
      {footer ? (
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: topInset ? 12 : Math.max(insets.bottom, 12) + 4, // tab bar already owns the bottom inset
            backgroundColor: c.bg,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: c.hairline,
            gap: 8,
          }}
        >
          {footer}
        </View>
      ) : null}
    </View>
  );
}
