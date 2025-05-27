import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './translations';

// Inicializar i18next
i18n
  .use(initReactI18next)
  .init({
    resources: translations,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Obtener el idioma del navegador
    const browserLang = navigator.language || navigator.userLanguage;
    // Si el idioma comienza con 'es', usar español, de lo contrario usar inglés
    return browserLang.startsWith('es') ? 'es' : 'en';
  });

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'es' ? 'en' : 'es');
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe ser usado dentro de un LanguageProvider');
  }
  return context;
} 