import { Grid, makeStyles, Avatar, Fade } from '@material-ui/core';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Message } from './Message';
import logo from '../../assets/logo/leev_logo.png';
import { useTranslation } from 'react-i18next';


export const Messages = ({ data }) => {

    const classes = useStyles();
    const [ messages, setMessages ] = useState(data || []);
    const { t } = useTranslation();

    useEffect(() => {
        setMessages(data);
        console.log(data)
    }, [data])

	return (
		<div className={classes.messagesContainer} >
            <Fade in={data}>
            <div className={classes.topProfile}>
                <Avatar src={logo} className={classes.avatar}/>
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
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
        fontSize: '18px',
        margin: '5px',
        background: 'rgba(0,0,0,0.8)',
        padding: '5px 25px',
        borderRadius: '50px',
    },
    welcomeSub: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '12px',
        background: 'rgba(0,0,0,0.8)',
        borderRadius: '50px',
        padding: '10px 25px',
        margin: '10px 0 30px'
    },
    '@global': {
		'*::-webkit-scrollbar': {
			width: '0em',
        }
	},
}));
