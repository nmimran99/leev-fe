import React, { useContext, useEffect, useState } from "react";
import { makeStyles, Avatar } from "@material-ui/core";
import { getFullName } from "../../api/genericApi";
import { format, parseISO } from "date-fns";
import { LanguageContext } from "../../context/LanguageContext";
import { AuthContext } from "../../context/AuthContext";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { isNewMessage } from "../../api/messengerApi";

export const Conversation = ({ data, setCurrent }) => {
	const classes = useStyles();
    const { lang } = useContext(LanguageContext);
    const { auth } = useContext(AuthContext);
    const [ hasNewMessage, setHasNewMessage ] = useState(false);

    useEffect(() => {
        if (isNewMessage(data, auth.user._id)) {
            setHasNewMessage(true);
            return;
        }
        setHasNewMessage(false);
    }, [data])



	return (
		<div className={classes.mainContainer} onClick={setCurrent} style={{ fontWeight: hasNewMessage ? 'bold' : 'normal' }}>
            <div className={classes.avatarContainer}>
                <Avatar src={data.participant.avatar} alt={'abc'} className={classes.avatar} />
            </div>
            <div className={classes.detailsContainer}>
                <div className={classes.fullName}>
                    { getFullName(data.participant) }
                </div>
                <div className={classes.lastMessage}>
                    {data.messages.length ? data.messages[data.messages.length - 1].data.text : ''}
                </div>
                <div className={classes.lastMessageDate}>
                    {format(parseISO(data.lastMessageAt), lang.timeonly)}
                </div>
                {
                    hasNewMessage &&
                    <FiberManualRecordIcon className={classes.newMessageDot}/>
                }
                
            </div>
        </div>
	);
};

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        height: '80px',
        width: '100%',
        display: 'flex',
        cursor: 'pointer',
        position: 'relative'
    },
    avatarContainer: {
        display: 'grid',
        placeItems: 'center',
        width: '80px'
    },
    avatar: {
        height: '50px',
        width: '50px'
    },
    detailsContainer: {
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        width: 'calc(100% - 80px)',
        padding: '10px 0',
        position: 'relative'
    },
    fullName: {
        color: 'rgba(255,255,255,0.8)',
        height: '30px',
        display: 'flex',
        alignItems: 'center'
    },
    lastMessage: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: '13px',
        maxWidth: '80%',
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    lastMessageDate: {
        color: 'rgba(255,255,255,0.5)',
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '13px',
        padding: '5px'
    },
    newMessageDot: {
        color: '#42A5F5',
        fontSize: '16px',
        position: 'absolute',
        right: '25px',
        top: '35px',
    }
}));
