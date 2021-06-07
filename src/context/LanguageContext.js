import React, { createContext, useState, useEffect } from 'react';
import { getLocalization } from '../api/genericApi';
import { handleLS } from '../api/userApi';
import i18n from '../i18n'

export const LanguageContext = createContext();

export const LanguageContextProvider = (props) => {

    const [ lang, setLang ] = useState({})

    useEffect(() => {
        handleLS('wb_lang', 'get')
        .then(defaultLang => {
            if (defaultLang) {
                setLang(getLocalization(defaultLang.lang))
            } else {
                setLang(getLocalization('en'))
            }
        }); 
    }, []);

    useEffect(() => {
        i18n.changeLanguage(lang.code)
    }, [lang])

    

    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            { props.children }
        </LanguageContext.Provider>
    );
}



