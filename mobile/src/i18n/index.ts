import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { Platform } from 'react-native';
import { initReactI18next } from 'react-i18next';
import en from './en';
import fr from './fr';
import nl from './nl';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'fr', label: 'Français' },
] as const;

export function deviceLanguage(): 'en' | 'nl' | 'fr' {
  const code = getLocales()[0]?.languageCode;
  return code === 'nl' || code === 'fr' ? code : 'en';
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, nl: { translation: nl }, fr: { translation: fr } },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
});

// Apple Health does not exist on Android: the same source is Health Connect there.
if (Platform.OS === 'android') {
  for (const lng of ['en', 'nl', 'fr']) i18n.addResource(lng, 'translation', 'sources.apple', 'Health Connect');
}

export const appleDevices = Platform.OS === 'android' ? 'Android · Wear OS' : 'iPhone · Apple Watch';

export default i18n;
