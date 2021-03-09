import React, { createContext, useState, useEffect } from 'react';
import i18n from '../i18n'

export const LanguageContext = createContext();

export const LanguageContextProvider = (props) => {
    const [ lang, setLang ] = useState({
        name: 'hebrew',
        code: 'he',
        dir: 'rtl',
        dateformat: 'dd/mm/yyyy HH:MM',
        dateonly: 'dd/mm/yyyy',
        timeonly: 'HH:MM'
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



