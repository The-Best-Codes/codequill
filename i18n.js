import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import common_en from '@/public/locales/en/common.json';
import common_es from '@/public/locales/es/common.json';
import common_fr from '@/public/locales/fr/common.json';
import common_af from '@/public/locales/af/common.json';
import common_ar from '@/public/locales/ar/common.json';
import common_ca from '@/public/locales/ca/common.json';
import common_cs from '@/public/locales/cs/common.json';
import common_da from '@/public/locales/da/common.json';
import common_de from '@/public/locales/de/common.json';
import common_el from '@/public/locales/el/common.json';
import common_fi from '@/public/locales/fi/common.json';
import common_he from '@/public/locales/he/common.json';
import common_hu from '@/public/locales/hu/common.json';
import common_it from '@/public/locales/it/common.json';
import common_ja from '@/public/locales/ja/common.json';
import common_ko from '@/public/locales/ko/common.json';
import common_nl from '@/public/locales/nl/common.json';
import common_no from '@/public/locales/no/common.json';
import common_pl from '@/public/locales/pl/common.json';
import common_pt from '@/public/locales/pt/common.json';
import common_ro from '@/public/locales/ro/common.json';
import common_ru from '@/public/locales/ru/common.json';
import common_sr from '@/public/locales/sr/common.json';
import common_sv from '@/public/locales/sv/common.json';
import common_tr from '@/public/locales/tr/common.json';
import common_uk from '@/public/locales/uk/common.json';
import common_vi from '@/public/locales/vi/common.json';
import common_zh from '@/public/locales/zh/common.json';

i18n
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        resources: {
            en: { common: common_en },
            es: { common: common_es },
            fr: { common: common_fr },
            af: { common: common_af },
            ar: { common: common_ar },
            ca: { common: common_ca },
            cs: { common: common_cs },
            da: { common: common_da },
            de: { common: common_de },
            el: { common: common_el },
            fi: { common: common_fi },
            he: { common: common_he },
            hu: { common: common_hu },
            it: { common: common_it },
            ja: { common: common_ja },
            ko: { common: common_ko },
            nl: { common: common_nl },
            no: { common: common_no },
            pl: { common: common_pl },
            pt: { common: common_pt },
            ro: { common: common_ro },
            ru: { common: common_ru },
            sr: { common: common_sr },
            sv: { common: common_sv },
            tr: { common: common_tr },
            uk: { common: common_uk },
            vi: { common: common_vi },
            zh: { common: common_zh },
        },
        lng: 'en', // Default language
        fallbackLng: 'en', // Fallback language
        interpolation: {
            escapeValue: false, // React escapes by default
        },
    });

export default i18n;