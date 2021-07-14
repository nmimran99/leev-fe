import { makeStyles } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from './Message';


export const Messages = ({ data }) => {

    const classes = useStyles();
    const [ messages, setMessages ] = useState(data || []);
    const { t } = useTranslation();
    const ms = useRef();

    useEffect(() => {
        setMessages([...data]);
    }, [data])

    useEffect(() => {
        if (ms) {
            let len = ms.current.children.length;
            if (!ms.current.children.length) return;
            ms.current.children[len - 1].scrollIntoView({ bahavior: 'smooth'}) 
        }    
    }, [ messages ])

    const loadMessages = () => {
        if (!messages.length) return null;
        const msgs = messages.map((m,i) => { 
            return <Message data={{...m}} key={i} />
        });
        return msgs;
    }

	return (
		<div className={classes.messagesContainer} ref={ms} >
            {
              loadMessages()
            }
        </div>
	);
};

const useStyles = makeStyles((theme) => ({
    messagesContainer: {
        padding: '10px 100px',
        height: 'calc(100% - 20px)',
        overflow: 'auto',
        [theme.breakpoints.down('sm')]: {
            padding: '10px 20px',
        }
    },
    topProfile: {
        width: '100%',
        display: 'grid',
        placeItems: 'center'
    },
    avatar: {
        height: '150px',
        width: '150px',
        margin: '10px'
    },
    welcome: {
        color: 'white',
        fontSize: '14px',
        margin: '5px',
        background: 'rgba(0,0,0,0.8)',
        padding: '10px 25px',
        borderRadius: '50px',
    },
    welcomeSub: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '12px',
        background: 'rgba(0,0,0,0.8)',
        borderRadius: '50px',
        padding: '10px 25px',
        margin: '5px 30px 30px',
        textAlign: 'center'
    },
    '@global': {
		'*::-webkit-scrollbar': {
			width: '0em',
        }
	},
}));
