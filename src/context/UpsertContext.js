import React, { createContext, useState } from 'react';


export const UpsertContext = createContext();

export const UpsertContextProvider = ({ children}) => {
    const [ upsertData, setUpsertData ] = useState({
        itemId: null,
        module: null
    });


    return (
        <UpsertContext.Provider value={{ upsertData, setUpsertData }}>
            { children }
        </UpsertContext.Provider>
    );
}



