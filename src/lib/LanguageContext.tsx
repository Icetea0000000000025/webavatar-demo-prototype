import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type TranslationKey } from './translations';
export type { TranslationKey };

type Language = 'en' | 'th' | 'zh' | 'ja' | 'ko' | 'es' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const updateWidgetGreeting = (lang: Language) => {
  if (typeof window !== 'undefined' && (window as any).ChatWidgetConfig) {
    const instructions: Record<Language, string> = {
      en: 'Greet the user in English.',
      th: 'Greet the user in Thai.',
      zh: 'Greet the user in Chinese.',
      ja: 'Greet the user in Japanese.',
      ko: 'Greet the user in Korean.',
      es: 'Greet the user in Spanish.',
      fr: 'Greet the user in French.',
    };
    (window as any).ChatWidgetConfig.greetingInstruction = instructions[lang] || instructions['en'];
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = window.localStorage.getItem('webavatar-demo-lang');
      const validLangs: Language[] = ['en', 'th', 'zh', 'ja', 'ko', 'es', 'fr'];
      return (saved && validLangs.includes(saved as Language)) ? (saved as Language) : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    updateWidgetGreeting(language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem('webavatar-demo-lang', lang);
    } catch (e) {
      console.error('Failed to save language to localStorage', e);
    }
    updateWidgetGreeting(lang);
  };

  const t = (key: TranslationKey): string => {
    const dict = translations[language];
    return (dict as any)[key] ?? (translations['en'] as any)[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
