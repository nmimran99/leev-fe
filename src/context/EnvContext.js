import React, { createContext, useState } from 'react';

export const EnvContext = createContext();

export const EnvContextProvider = (props) => {
    const [ env, setEnv ] = useState({
        screenHeight: window.innerHeight,
        screenWidth: window.innerWidth
    });

    return (
        <EnvContext.Provider value={{ env, setEnv }}>
            { props.children }
        </EnvContext.Provider>
    );
}



