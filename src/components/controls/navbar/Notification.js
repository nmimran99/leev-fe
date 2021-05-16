import {
	makeStyles,
    useMediaQuery,
    IconButton,
    Button,
    Avatar
} from '@material-ui/core';
import AddLocationOutlinedIcon from '@material-ui/icons/AddLocationOutlined';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { getDatediffString, getFullName, updateStateField } from '../../../api/genericApi';
import { generateNotificationBody, generateNotificationHeader } from '../../../api/notificationsApi';
import { useHistory } from 'react-router';
import clsx from 'clsx';

export const Notification = ({ data, updateNotificationReadStatus }) => {
    const classes = useStyles();
    const history = useHistory();
	const { t, i18n } = useTranslation();
    const [ notification, setNotification ] = useState(data);
     
    useEffect(() => {
        setNotification(data);
    }, [data])
    
    const GenerateText = () => {
        return (
            <div className={classes.textContainer}>
                <div className={classes.generateNotificationHeader}>
                    {generateNotificationHeader(notification)}
                </div>
                <div className={classes.generateNotificationBody}>
                    {generateNotificationBody(notification)}
                </div>
                <div className={classes.timePassed}>
                    {getDatediffString(notification.createdAt)}
                </div>
            </div>
            
        )
    }

    const handleClick = async () => {
        await updateNotificationReadStatus(notification._id, true);
        history.push(`/workspace/${notification.actionOn.objectType}/${notification.actionOn.externalId}`)
    }

    const handleNotificationStatus = event => {
        event.stopPropagation();
        updateNotificationReadStatus(notification._id, !notification.read)
    }

	return (
        <Button 
            className={classes.container}
            onClick={handleClick}
        >
            <div className={classes.sideIconContainer}>
                {          
                    <Avatar src={notification.actionBy ? notification.actionBy.avatar : null } alt={'ab'} className={classes.avatar} /> 
                }
            </div>
            <div className={clsx(classes.contentContainer, notification.read && classes.read)}>
                <GenerateText />
            </div>
            <div className={classes.readContainer}>
                {
                    notification.read ? 
                    null : 
                    <FiberManualRecordIcon className={classes.icon} />
                }
            </div>
            <Button 
                className={classes.markAsRead}
                onClick={handleNotificationStatus}
            >
                {notification.read ? t("notificationsModule.markAsUnread"): t("notificationsModule.markAsRead")}
            </Button>
        </Button>
	);
};


const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        width: '100%',
        height: '110px',
        padding: '0',
        textAlign: 'left',
        '&:hover': {
            background: 'rgba(0,0,0,0.6)'
        }
    },
    sideIconContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '20%'
    },
    contentContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '70%',
        color: 'white'
    },
    textContainer: {
        fontSize: '14px',
        padding: '10px',
        wordBreak: 'nobreak',
        width: '100%',
        
    },
    readContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '10%'
    },
    avatar: {
        width: '50px',
        height: '50px'
    },
    icon: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: '13px'
    },
    generateNotificationHeader: {
        fontSize: '14px',
        color: 'rgba(255,255,255,0.7)',
        padding: '0',
        height: '25px'
    },
    generateNotificationBody: {
        padding: '3px',
        lineHeight: '20px'
    },
    timePassed:  {
        fontSize: '12px',
        color: 'rgba(255,255,255,0.6)'
    },
    markAsRead: {
        position: 'absolute',
        top: '7px',
        right: '5px',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.6)',
        padding: 0,
        borderRadius: '50px',
        border: '1px solid transparent',
        padding: '2px 5px',
        '&:hover': {
            color: 'white',
           border: '1px solid rgba(255,255,255,0.6)',
        }
    },
    read: {
        opacity: '0.4'
    }
  
}));
