import React, { createContext, useState } from 'react';

export const SnackbarContext = createContext();

export const SnackbarContextProvider = (props) => {
    const [ snackbar, setSnackbar ] = useState(null);

    return (
        <SnackbarContext.Provider value={{ snackbar, setSnackbar }}>
            { props.children }
        </SnackbarContext.Provider>
    );
}



