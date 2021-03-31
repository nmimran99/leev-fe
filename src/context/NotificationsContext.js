import React, { createContext, useState } from 'react';

export const NotificationsContext = createContext();

export const NotificationsContextProvider = (props) => {
    const [ notifications, setNotifications ] = useState([]);

    return (
        <NotificationsContext.Provider value={{ notifications, setNotifications }}>
            { props.children }
        </NotificationsContext.Provider>
    );
}



