import { IconButton, makeStyles, useMediaQuery } from "@material-ui/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import { isNewMessage } from "../../api/messengerApi";
import { AuthContext } from "../../context/AuthContext";
import { UserItem } from "../user/UserItem";
import { MessageInput } from "./MessageInput";
import { Messages } from "./Messages";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { EnvContext } from "../../context/EnvContext";
import clsx from 'clsx'

export const MainConversation = ({ setCurrent, current, sendMessage, readAllMessages }) => {
	const classes = useStyles(); 
    const inputContainer = useRef();
    const messagesCotainer = useRef();
    const { auth } = useContext(AuthContext);
    const { env } = useContext(EnvContext);
    const downSm = useMediaQuery(theme => theme.breakpoints.down('sm'));

    useEffect(() => {
        if (isNewMessage(current, auth.user._id)) {
            readAllMessages()
        }
    }, [current.messages])

    useEffect(() => {
        console.log('this runs')
        if (env.inputFocused) {
            inputContainer.current.style.paddingBottom = '0px';
            messagesCotainer.current.style.height = 'calc(100% - 140px)';
            return;
        } 
        inputContainer.current.style.paddingBottom = '30px';
        messagesCotainer.current.style.height = 'calc(100% - 170px)';
    }, [env])

    const handleClick = (value) => {
        sendMessage(value);
    };

	return (
		<div className={classes.mainContainer}>
            <div className={classes.userBar} >
                <UserItem user={current.participant} avatarSize={50} showName showTitle size={13}/>
                { downSm &&
                    <IconButton className={classes.backButton} onClick={() => setCurrent(null)}>
                        <ArrowBackIosIcon className={classes.icon} />
                    </IconButton>
                }
            </div>
            <div className={classes.messagesContainer} ref={messagesCotainer}>
                {
                    <Messages data={[...current.messages]} />
                }
                
            </div>
            <div className={clsx(classes.inputContainer)} ref={inputContainer} >
                <MessageInput handleClick={handleClick} />
            </div>
        </div>
	);
};

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        height: '100%',
        width: '100%',
    },
    userBar: {
        boxShadow: '0 1px 2px 0px rgba(0,0,0,0.37)',
        padding: '0 20px',
        background: '#222',
        borderRadius: "0 20px 0 0",
        height: '90px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            borderRadius: "0",
        }
    },
    messagesContainer: {
        height: 'calc(100% - 140px)',
        [theme.breakpoints.down('sm')]: {
            height: 'calc(100% - 170px)',
        }
    },
    inputContainer: {
        padding: '0px 5px 0px',
        background: '#222',
        borderRadius: "0 0 20px 0",
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        [theme.breakpoints.down('sm')]: {
            paddingBottom: '30px',
            borderRadius: "0",
        }
    },
    inputFocused: {
        paddingBottom: '0px'
    },
    form: {
		color: 'black',
        width: '100%',
        margin: '0 5px 0 0px',
		border: '1px solid rgba(0,0,0,0.2)',
		borderRadius: '42px'
	},
	textInput: {
        padding: '4px 10px',
        borderRadius: '42px',
        color: 'white',
		'& input': {
			color: 'white',
			width: '80%',
            padding: '4px 10px',
            fontSize: '14px'
		},
		'& label': {
			color: 'white',
			paddingLeft: '5px',
		},
		'& fieldset': {
			borderColor: 'rgba(255,255,255,0.2)',
			borderRadius: '42px',
		},
	},
    postBtn: {
        background: '#42A5F5',
		color: 'white',
        padding: '7px',
		margin: ' 0 5px 1px'
	},
	icon: {
        fontSize: '20px',
        color: 'white'
	},
}));
