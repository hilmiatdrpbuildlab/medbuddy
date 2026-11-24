import React from 'react';
import { Platform } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import type { SourceId } from '@/data/wearables';

/** Neutral marks for the two data sources (not the vendors' logos). */
export function SourceGlyph({ source, size = 34 }: { source: SourceId; size?: number }) {
  if (source === 'apple' && Platform.OS === 'android')
    return (
      <Svg width={size} height={size} viewBox="0 0 34 34">
        <Rect width={34} height={34} rx={9} fill="#E8F0FE" />
        <Path d="M17 25s-7-4-7-9a3.9 3.9 0 0 1 7-2.4A3.9 3.9 0 0 1 24 16c0 5-7 9-7 9z" fill="none" stroke="#1A73E8" strokeWidth={2.2} strokeLinejoin="round" />
      </Svg>
    );
  if (source === 'apple')
    return (
      <Svg width={size} height={size} viewBox="0 0 34 34">
        <Rect width={34} height={34} rx={9} fill="#FFFFFF" stroke="#E2E6E8" />
        <Path d="M17 26s-8-4.6-8-10.2A4.4 4.4 0 0 1 17 13a4.4 4.4 0 0 1 8 2.8C25 21.4 17 26 17 26z" fill="#FF3B5C" />
      </Svg>
    );
  return (
    <Svg width={size} height={size} viewBox="0 0 34 34">
      <Rect width={34} height={34} rx={9} fill="#11161A" />
      <Path d="M17 8 L25 22 H9 Z" fill="none" stroke="#FFFFFF" strokeWidth={2.4} strokeLinejoin="round" />
    </Svg>
  );
}
