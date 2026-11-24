import { ChevronRight } from 'lucide-react-native';
import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { haptic } from '@/lib/feedback';
import { Palette, type as T, useTheme } from '@/theme';

export type LucideIcon = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number; style?: any }>;

/* ---------------- Text ---------------- */

type Variant = keyof Omit<typeof T, 'num'>;
type Tone = 'ink' | 'ink2' | 'ink3' | 'primary' | 'amber' | 'accent' | 'onPrimary' | 'onAccent' | 'ok' | 'danger' | 'onHero';

export function Txt({
  v = 'body',
  tone = 'ink',
  style,
  center,
  ...rest
}: TextProps & { v?: Variant; tone?: Tone; center?: boolean }) {
  const { c } = useTheme();
  return (
    <Text
      {...rest}
      maxFontSizeMultiplier={1.6}
      style={[T[v] as TextStyle, { color: c[tone as keyof Palette] }, center && { textAlign: 'center' }, style]}
    />
  );
}

/* ---------------- Button ---------------- */

type BtnKind = 'primary' | 'secondary' | 'plain' | 'black' | 'outline';

export function Button({
  title,
  onPress,
  kind = 'primary',
  icon: Icon,
  loading,
  disabled,
  style,
  small,
  accessibilityHint,
}: {
  title: string;
  onPress?: () => void;
  kind?: BtnKind;
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
  accessibilityHint?: string;
}) {
  const { c, radius } = useTheme();
  const palette: Record<BtnKind, { bg: string; fg: string; border?: string }> = {
    primary: { bg: c.accent, fg: c.onAccent },
    secondary: { bg: c.primarySoft, fg: c.primary },
    plain: { bg: 'transparent', fg: c.primary },
    black: { bg: '#000000', fg: '#FFFFFF' },
    outline: { bg: 'transparent', fg: c.primary, border: c.hairline },
  };
  const p = palette[kind];
  const off = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!off, busy: !!loading }}
      disabled={off}
      onPress={() => {
        haptic.tap();
        onPress?.();
      }}
      style={({ pressed }) => [
        {
          minHeight: small ? 44 : 54,
          paddingHorizontal: small ? 16 : 20,
          borderRadius: radius.lg,
          backgroundColor: p.bg,
          borderWidth: p.border ? 1 : 0,
          borderColor: p.border,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
          opacity: disabled ? 0.45 : pressed ? 0.82 : 1,
          transform: [{ scale: pressed && kind !== 'plain' ? 0.985 : 1 }],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={p.fg} />
      ) : (
        <>
          {Icon && <Icon size={20} color={p.fg} strokeWidth={2} />}
          <Txt v={small ? 'subhead' : 'headline'} style={{ color: p.fg, fontWeight: '600' }} numberOfLines={1}>
            {title}
          </Txt>
        </>
      )}
    </Pressable>
  );
}

/* ---------------- Grouped list ---------------- */

export function Group({
  title,
  footer,
  children,
  style,
  right,
}: {
  title?: string;
  footer?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  right?: ReactNode;
}) {
  const { c, radius } = useTheme();
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <View style={[{ gap: 8 }, style]}>
      {(title || right) && (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 4 }}>
          {title ? (
            <Txt v="headline" accessibilityRole="header">
              {title}
            </Txt>
          ) : (
            <View />
          )}
          {right}
        </View>
      )}
      <View style={{ backgroundColor: c.surface, borderRadius: radius.lg, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: c.hairline }}>
        {items.map((child, i) => (
          <View key={i}>
            {i > 0 && <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.hairline, marginLeft: 16 }} />}
            {child}
          </View>
        ))}
      </View>
      {footer && (
        <Txt v="footnote" tone="ink3" style={{ paddingHorizontal: 4 }}>
          {footer}
        </Txt>
      )}
    </View>
  );
}

export function Row({
  icon: Icon,
  iconTone = 'primary',
  title,
  subtitle,
  value,
  right,
  onPress,
  chevron = !!onPress,
  children,
  accessibilityLabel,
  leading,
}: {
  leading?: ReactNode;
  icon?: LucideIcon;
  iconTone?: 'primary' | 'amber' | 'ink2' | 'accent';
  title: string;
  subtitle?: string;
  value?: string;
  right?: ReactNode;
  onPress?: () => void;
  chevron?: boolean;
  children?: ReactNode;
  accessibilityLabel?: string;
}) {
  const { c } = useTheme();
  const body = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13, minHeight: 52 }}>
      {leading}
      {Icon && (
        <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: iconTone === 'amber' ? c.amberSoft : c.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={19} color={c[iconTone]} strokeWidth={1.9} />
        </View>
      )}
      <View style={{ flex: 1, gap: 2 }}>
        <Txt v="body">{title}</Txt>
        {subtitle ? (
          <Txt v="subhead" tone="ink2">
            {subtitle}
          </Txt>
        ) : null}
        {children}
      </View>
      {value ? (
        <Txt v="body" tone="ink2" style={T.num}>
          {value}
        </Txt>
      ) : null}
      {right}
      {chevron && <ChevronRight size={18} color={c.ink3} />}
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? [title, subtitle, value].filter(Boolean).join(', ')}
      onPress={() => {
        haptic.tap();
        onPress();
      }}
      style={({ pressed }) => ({ backgroundColor: pressed ? c.surfaceAlt : 'transparent' })}
    >
      {body}
    </Pressable>
  );
}

/* ---------------- Card ---------------- */

export function Card({ children, style, onPress, accessibilityLabel }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; accessibilityLabel?: string }) {
  const { c, radius } = useTheme();
  const base: ViewStyle = {
    backgroundColor: c.surface,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: c.hairline,
  };
  if (!onPress) return <View style={[base, style]}>{children}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => {
        haptic.tap();
        onPress();
      }}
      style={({ pressed }) => [base, { opacity: pressed ? 0.85 : 1 }, style]}
    >
      {children}
    </Pressable>
  );
}

/* ---------------- Small pieces ---------------- */

export function Pill({ icon: Icon, label, tone = 'primary' }: { icon?: LucideIcon; label: string; tone?: 'primary' | 'amber' | 'ok' | 'neutral' }) {
  const { c } = useTheme();
  const map = {
    primary: [c.primarySoft, c.primary],
    amber: [c.amberSoft, c.amber],
    ok: [c.okSoft, c.ok],
    neutral: [c.surfaceAlt, c.ink2],
  } as const;
  const [bg, fg] = map[tone];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: bg, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start' }}>
      {Icon && <Icon size={13} color={fg} strokeWidth={2.2} />}
      <Txt v="caption" style={{ color: fg }}>
        {label}
      </Txt>
    </View>
  );
}

export function ProgressBar({ value, style }: { value: number; style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={[{ height: 6, borderRadius: 3, backgroundColor: c.sunken, overflow: 'hidden' }, style]}
    >
      <View style={{ width: `${Math.max(2, value * 100)}%`, height: '100%', backgroundColor: c.primary, borderRadius: 3 }} />
    </View>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  return <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: c.hairline }, style]} />;
}

export function Segmented<K extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: K; label: string }[];
  value: K;
  onChange: (k: K) => void;
}) {
  const { c } = useTheme();
  return (
    <View accessibilityRole="tablist" style={{ flexDirection: 'row', backgroundColor: c.sunken, borderRadius: 11, padding: 3 }}>
      {options.map((o) => {
        const on = o.key === value;
        return (
          <Pressable
            key={o.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => {
              haptic.tap();
              onChange(o.key);
            }}
            style={{
              flex: 1,
              minHeight: 36,
              borderRadius: 9,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: on ? c.surface : 'transparent',
              shadowColor: '#000',
              shadowOpacity: on ? 0.08 : 0,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 1 },
              elevation: on ? 1 : 0,
            }}
          >
            <Txt v="subhead" style={{ fontWeight: on ? '600' : '500', color: on ? c.ink : c.ink2 }}>
              {o.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

export function IconButton({ icon: Icon, label, onPress, tone = 'ink2' }: { icon: LucideIcon; label: string; onPress: () => void; tone?: 'ink2' | 'primary' | 'ink' } & Pick<PressableProps, 'onLongPress'>) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      onPress={() => {
        haptic.tap();
        onPress();
      }}
      style={({ pressed }) => ({ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: pressed ? c.surfaceAlt : 'transparent' })}
    >
      <Icon size={22} color={c[tone]} strokeWidth={1.9} />
    </Pressable>
  );
}
