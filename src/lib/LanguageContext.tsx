import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations } from './translations';
import { englishTranslations } from './englishTranslations';

export type RuntimeLanguage = 'ku' | 'ar' | 'en';

interface LanguageContextType {
  lang: RuntimeLanguage;
  setLang: (lang: RuntimeLanguage) => void;
  t: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<RuntimeLanguage>(() => {
    const saved = localStorage.getItem('app-lang');
    return saved === 'ku' || saved === 'ar' || saved === 'en' ? saved : 'ku';
  });

  useEffect(() => {
    localStorage.setItem('app-lang', lang);
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = lang === 'ku' ? 'ckb' : lang;
  }, [lang]);

  const t = lang === 'en' ? englishTranslations : translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
