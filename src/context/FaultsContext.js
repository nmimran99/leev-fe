import React, { createContext, useState, useEffect } from 'react';

export const FaultsContext = createContext();

export const FaultsContextProvider = (props) => {
    const [ faults, setFaults ] = useState([]);

    return (
        <FaultsContext.Provider value={{ faults, setFaults }}>
            { props.children }
        </FaultsContext.Provider>
    );
}



