import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { brand } from '@/config/brand';
import { useTheme } from '@/theme';
import { Txt } from './ui';

/** Mark: a page with a lab-range band and a value marker — the product's signature, as an icon. */
export function LogoMark({ size = 40, inverted }: { size?: number; inverted?: boolean }) {
  const { c: th } = useTheme();
  const c = inverted ? { ...th, primary: '#FFFFFF', onPrimary: brand.colors.primary } : th;
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessibilityLabel={brand.name}>
      <Rect x={0} y={0} width={48} height={48} rx={13} fill={c.primary} />
      <Rect x={11} y={14} width={20} height={3.4} rx={1.7} fill={c.onPrimary} opacity={0.55} />
      <Rect x={11} y={22.3} width={26} height={3.4} rx={1.7} fill={c.onPrimary} opacity={0.55} />
      <Rect x={11} y={31} width={26} height={5} rx={2.5} fill={c.onPrimary} opacity={0.3} />
      <Rect x={14} y={31} width={20} height={5} rx={2.5} fill={c.onPrimary} />
      <Circle cx={24} cy={33.5} r={4.2} fill={c.accent} stroke={c.primary} strokeWidth={2} />
    </Svg>
  );
}

export function Wordmark({ size = 40 }: { size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <LogoMark size={size} />
      <Txt v="title" style={{ fontSize: size * 0.55, lineHeight: size * 0.7 }}>
        {brand.name}
      </Txt>
    </View>
  );
}
