import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AppLanguage = 'vi' | 'en';

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const savedLang = localStorage.getItem('lovenote-language');
    return (savedLang as AppLanguage) || 'vi';
  });

  useEffect(() => {
    localStorage.setItem('lovenote-language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
