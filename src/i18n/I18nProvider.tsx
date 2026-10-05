import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translations, type Language, type TranslationKey } from './translations';

type Params = Record<string, string | number>;
export type TFunction = (key: TranslationKey, params?: Params) => string;

interface I18nContextValue {
  language: Language;
  setLanguage: (l: Language) => void;
  t: TFunction;
}

const STORAGE_KEY = 'assignment-manager:lang';
const I18nContext = createContext<I18nContextValue | null>(null);

const detectLanguage = (): Language => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'tr' || stored === 'en') return stored;
  } catch {
    /* ignore */
  }
  return navigator.language?.toLowerCase().startsWith('tr') ? 'tr' : 'en';
};

export function I18nProvider({ children, initialLanguage }: { children: ReactNode; initialLanguage?: Language }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage ?? detectLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((l: Language) => {
    setLanguageState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback<TFunction>(
    (key, params) => {
      let text = translations[language][key];
      if (params) for (const [k, v] of Object.entries(params)) text = text.replace(`{${k}}`, String(v));
      return text;
    },
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
