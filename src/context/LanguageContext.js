import React, { createContext, useState, useEffect } from 'react';
import i18n from '../i18n'

export const LanguageContext = createContext();

export const LanguageContextProvider = (props) => {
    const [ lang, setLang ] = useState({
        name: 'hebrew',
        code: 'he',
        dir: 'rtl',
        dateformat: 'dd/MM/yyyy HH:mm',
        dateonly: 'dd/MM/yyyy',
        timeonly: 'HH:mm'
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



