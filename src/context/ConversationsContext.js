import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSocket } from '../components/reuseables/customHooks/useSocket';
import { AuthContext } from './AuthContext';

export const ConversationsContext = createContext();

export const ConversationsContextProvider = ({ children}) => {
    const { auth } = useContext(AuthContext);
    const [ conversations, setConversations ] = useState([]);
    const { socket } = useSocket();

    useEffect(() => {
        if(!socket) return;
        socket.on('userConversations', uc => {
            let ucc = uc.map(c => ({ ...c, participant: c.participants.filter(p => p._id != auth.user._id )[0]}));
            setConversations(ucc)
        });

        socket.on('receive-message', msg => {
            setConversations(convs => {
                let convIndex = convs.findIndex(c => c._id === msg.conversation);
                let conv = convs[convIndex];
                convs.splice(convIndex, 1)
                conv.messages.push(msg);
                return [conv, ...convs];
            })
        });

        socket.on('messages-read', conversation => {
            if(conversation) {
                setConversations(convos => {
                    let convoIndex = convos.findIndex(c => c._id === conversation);
                    let messages = convos[convoIndex].messages.map(m => {
                        if (!m.read) {
                            m.read = true;
                        }
                        return m;
                    })
                    convos[convoIndex].messages = messages;
                    return [...convos];
                })
            }
        })

    }, [socket]);

    return (
        <ConversationsContext.Provider value={{ conversations, setConversations }}>
            { children }
        </ConversationsContext.Provider>
    );
}



