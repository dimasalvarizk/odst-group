import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import idTranslation from './locales/id.json';
import arTranslation from './locales/ar.json';

const getInitialLanguage = (): string => {
  const savedLang = localStorage.getItem('lang');
  if (savedLang) return savedLang;
  
  // Optional browser language detection
  const browserLang = navigator.language.split('-')[0];
  if (['en', 'id', 'ar'].includes(browserLang)) {
    return browserLang;
  }
  
  return 'en';
};

const initialLanguage = getInitialLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      id: { translation: idTranslation },
      ar: { translation: arTranslation },
    },
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

// Apply layout direction attributes immediately
document.documentElement.dir = initialLanguage === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = initialLanguage;

// Listen for language changes and update storage + layout attributes dynamically
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng);
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

export default i18n;
