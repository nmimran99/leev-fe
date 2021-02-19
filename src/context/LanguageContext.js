import React, { createContext, useState, useEffect } from 'react';
import { getLabelsByLanguage } from '../api/genericApi';
import i18n from '../i18n'

export const LanguageContext = createContext();

export const LanguageContextProvider = (props) => {
    const [ lang, setLang ] = useState({
        name: 'hebrew',
        code: 'he',
        dir: 'rtl',
        dateformat: 'dd/mm/yyyy',
        timeformat: 'HH:MM'
    })

    useEffect(() => {
        i18n.changeLanguage(lang.code)
    }, [lang])

    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            { props.children }
        </LanguageContext.Provider>
    );
}



