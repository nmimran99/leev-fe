import { Grid, makeStyles, Avatar, Fade } from '@material-ui/core';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Message } from './Message';
import { useTranslation } from 'react-i18next';


export const Messages = ({ data }) => {

    const classes = useStyles();
    const [ messages, setMessages ] = useState(data || []);
    const { t } = useTranslation();
    const ms = useRef();

    useEffect(() => {
        setMessages(data);
    }, [data])

    useEffect(() => {
        if (ms) {
            // ms.current.scrollTop = ms.current.scrollHeight - ms.current.clientHeight;
            let len = ms.current.children.length;
            ms.current.children[len - 1].scrollIntoView({ bahavior: 'smooth'}) 
        }    
    }, [ messages ])

	return (
		<div className={classes.messagesContainer} ref={ms} >
            <Fade in={Boolean(data.length)}>
            <div className={classes.topProfile}>
                <Avatar src={'https://leevstore.blob.core.windows.net/images/leev_logo_round.png'} className={classes.avatar}/>
                <div className={classes.welcome}>
                    {t("chatbot.welcome")}
                </div>
                <div className={classes.welcomeSub}>
                    {t("chatbot.welcomeSub")}
                </div>
            </div>
            </Fade>
           
            {
                messages.length ?
                messages.map((m,i) => 
                    <Message data={m} key={i} />
                ):
                null
            }
        </div>
	);
};

const useStyles = makeStyles((theme) => ({
    messagesContainer: {
        padding: '10px 0',
        height: 'calc(100% - 120px)',
        overflow: 'auto'
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
