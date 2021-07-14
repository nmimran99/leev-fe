import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client'

export const SocketContext = createContext();

export const SocketContextProvider = ({ id, children}) => {
    const [ socket, setSocket ] = useState(null);

    useEffect(() => {
        const newSocket = io.connect(`${process.env.REACT_APP_CHAT_URL}`, { query: { id }})
        setSocket(newSocket);
        return () => newSocket.close();
    }, [id])

    return (
        <SocketContext.Provider value={{ socket, setSocket }}>
            { children }
        </SocketContext.Provider>
    );
}



