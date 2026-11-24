import { Platform, TextStyle, useColorScheme } from 'react-native';
import { brand } from '@/config/brand';
import { useApp } from '@/store/app';

export type Palette = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  sunken: string;
  ink: string;
  ink2: string;
  ink3: string;
  hairline: string;
  primary: string;
  onPrimary: string;
  primarySoft: string;
  hero: string;
  onHero: string;
  accent: string;
  onAccent: string;
  amber: string;
  amberSoft: string;
  ok: string;
  okSoft: string;
  band: string;
  marker: string;
  danger: string;
  scrim: string;
  paper: string;
  paperInk: string;
  paperInk2: string;
  paperRule: string;
};

const light: Palette = {
  bg: '#F4F7F8',
  surface: '#FFFFFF',
  surfaceAlt: '#EDF2F3',
  sunken: '#E6EDEE',
  ink: '#0E2A2E',
  ink2: '#4A6266',
  ink3: '#5C7276',
  hairline: '#DCE5E7',
  primary: brand.colors.primary,
  onPrimary: '#FFFFFF',
  primarySoft: '#E3F0EF',
  hero: brand.colors.primary,
  onHero: '#FFFFFF',
  accent: brand.colors.accent,
  onAccent: '#FFFFFF',
  amber: '#8A4B00',
  amberSoft: '#FFF1D6',
  ok: '#1F6B4A',
  okSoft: '#E2F2EA',
  band: '#D6E6E6',
  marker: brand.colors.primary,
  danger: '#9B2C1F',
  scrim: 'rgba(8, 24, 27, 0.45)',
  paper: '#FFFFFF',
  paperInk: '#14202A',
  paperInk2: '#55626B',
  paperRule: '#D9DEE2',
};

const dark: Palette = {
  bg: '#0B1416',
  surface: '#132023',
  surfaceAlt: '#1A2A2D',
  sunken: '#0F1A1C',
  ink: '#E6EFF0',
  ink2: '#9FB3B6',
  ink3: '#8DA2A5',
  hairline: '#243538',
  primary: brand.colors.primaryDark,
  onPrimary: '#06201F',
  primarySoft: '#16393B',
  hero: '#124547',
  onHero: '#E6F4F3',
  accent: brand.colors.accentDark,
  onAccent: '#2A0E07',
  amber: '#F2B649',
  amberSoft: '#2E220C',
  ok: '#7FD1A8',
  okSoft: '#123126',
  band: '#1E3B3D',
  marker: brand.colors.primaryDark,
  danger: '#F19A8B',
  scrim: 'rgba(0, 0, 0, 0.6)',
  paper: '#FFFFFF',
  paperInk: '#14202A',
  paperInk2: '#55626B',
  paperRule: '#D9DEE2',
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 } as const;

const family = Platform.select({ ios: 'System', android: 'sans-serif', default: undefined });
const num: TextStyle = { fontVariant: ['tabular-nums'] };

export const type = {
  largeTitle: { fontFamily: family, fontSize: 32, lineHeight: 38, fontWeight: '700', letterSpacing: -0.4 },
  title: { fontFamily: family, fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.2 },
  title3: { fontFamily: family, fontSize: 19, lineHeight: 24, fontWeight: '600' },
  headline: { fontFamily: family, fontSize: 17, lineHeight: 22, fontWeight: '600' },
  body: { fontFamily: family, fontSize: 17, lineHeight: 24, fontWeight: '400' },
  callout: { fontFamily: family, fontSize: 16, lineHeight: 22, fontWeight: '400' },
  subhead: { fontFamily: family, fontSize: 15, lineHeight: 20, fontWeight: '400' },
  footnote: { fontFamily: family, fontSize: 13, lineHeight: 18, fontWeight: '400' },
  caption: { fontFamily: family, fontSize: 12, lineHeight: 16, fontWeight: '500' },
  value: { fontFamily: family, fontSize: 17, lineHeight: 22, fontWeight: '600', ...num },
  bigValue: { fontFamily: family, fontSize: 34, lineHeight: 40, fontWeight: '700', letterSpacing: -0.5, ...num },
  num,
} satisfies Record<string, TextStyle>;

export function useTheme() {
  const system = useColorScheme();
  const appearance = useApp((s) => s.appearance);
  const scheme = appearance === 'system' ? (system ?? 'light') : appearance;
  const c = scheme === 'dark' ? dark : light;
  return { c, scheme, space, radius, type };
}

export type Theme = ReturnType<typeof useTheme>;
