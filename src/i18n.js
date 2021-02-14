import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next }from 'react-i18next';
import en from './lacales/en/translation.json';
import he from './lacales/he/translation.json';

const resources = {
    en: {
        translation: en
    },
    he: {
        translation: he
    }
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'he',
        detection: {
            order: ['queryString', 'cookie'],
            cache: ['cookie']
        },
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
    