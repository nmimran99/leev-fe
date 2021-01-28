import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = (props) => {
    const [ auth, setAuth ] = useState({
        isAuth: false,
        user: null,
        token: null,
        refreshToken: null
    });

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            { props.children }
        </AuthContext.Provider>
    );
}



