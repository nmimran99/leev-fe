import { FiberManualRecordRounded } from '@material-ui/icons';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next }from 'react-i18next';
import { handleLS } from './api/userApi';
import en from './lacales/en/translation.json';
import he from './lacales/he/translation.json';

let fbc = 'en';
let lsg = localStorage.getItem('wb_lang');
if (lsg) {
    fbc = JSON.parse(localStorage.getItem('wb_lang')).lang;
}

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
        fallbackLng: fbc,
        detection: {
            order: ['queryString', 'cookie'],
            cache: ['cookie']
        },
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
    