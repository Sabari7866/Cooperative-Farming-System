import React from 'react';

type Translations = Record<string, string>;
type Locale = 'en' | 'ta' | 'hi';

async function loadYaml(locale: Locale): Promise<Translations> {
  // Load from public/i18n; accessible in both dev and production bundles
  const path = `/i18n/${locale}.yml?v=${Math.random()}`;
  const res = await fetch(path);
  if (!res.ok) return {};
  const text = await res.text();
  // Minimal YAML parser for flat key: value pairs (no nesting)
  const lines = text.split(/\r?\n/);
  const map: Translations = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf(':');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed
      .slice(idx + 1)
      .trim()
      .replace(/^"|"$/g, '');
    if (key) map[key] = value;
  }
  return map;
}

export const I18nContext = React.createContext<{
  locale: Locale;
  t: (key: string) => string;
  setLocale: (l: Locale) => void;
}>({ locale: 'en', t: (k) => k, setLocale: () => { } });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(
    (localStorage.getItem('locale') as Locale) || 'en',
  );
  const [dict, setDict] = React.useState<Translations>({});

  const setLocale = React.useCallback((l: Locale) => {
    localStorage.setItem('locale', l);
    setLocaleState(l);
  }, []);

  React.useEffect(() => {
    loadYaml(locale)
      .then(setDict)
      .catch(() => setDict({}));
  }, [locale]);

  const t = React.useCallback(
    (key: string) => {
      return dict[key] || key;
    },
    [dict],
  );

  return <I18nContext.Provider value={{ locale, t, setLocale }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return React.useContext(I18nContext);
}
