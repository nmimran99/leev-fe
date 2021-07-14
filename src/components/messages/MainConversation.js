import { IconButton, makeStyles, useMediaQuery } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { isNewMessage } from "../../api/messengerApi";
import { AuthContext } from "../../context/AuthContext";
import { UserItem } from "../user/UserItem";
import { MessageInput } from "./MessageInput";
import { Messages } from "./Messages";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

export const MainConversation = ({ setCurrent, current, sendMessage, readAllMessages }) => {
	const classes = useStyles(); 
    const { auth } = useContext(AuthContext);
    const downSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const [ messages, setMessages ] = useState([])

    useEffect(() => {
        setMessages(current.messages);
        if (isNewMessage(current, auth.user._id)) {
            readAllMessages()
        }
    }, [current.messages])

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
            <div className={classes.messagesContainer} >
                {
                    <Messages data={[...current.messages]} />
                }
                
            </div>
            <div className={classes.inputContainer} >
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
        background: 'rgba(0,0,0,0.6)',
        borderRadius: "0 20px 0 0",
        height: '90px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    messagesContainer: {
        height: 'calc(100% - 170px)',
    },
    inputContainer: {
        padding: '0px 20px 30px',
        background: 'rgba(0,0,0,0.6)',
        borderRadius: "0 0 20px 0",
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        

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
