import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import common_en from '@/public/locales/en/common.json';
import common_es from '@/public/locales/es/common.json';
import common_fr from '@/public/locales/fr/common.json';

i18n
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        resources: {
            en: { common: common_en },
            es: { common: common_es },
            fr: { common: common_fr },
        },
        lng: 'en', // Default language
        fallbackLng: 'en', // Fallback language
        interpolation: {
            escapeValue: false, // React escapes by default
        },
    });

export default i18n;