import React, { createContext, useState } from 'react';

export const FiltersContext = createContext();

export const FiltersContextProvider = (props) => {
    const [ filters, setFilters ] = useState({
        sortBy: null,
        sortOrder: 'asc',
        activeFilters: []
    });

    return (
        <FiltersContext.Provider value={{ filters, setFilters }}>
            { props.children }
        </FiltersContext.Provider>
    );
}



