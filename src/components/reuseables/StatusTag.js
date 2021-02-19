
import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import HourglassEmptyRoundedIcon from '@material-ui/icons/HourglassEmptyRounded';
import CachedIcon from '@material-ui/icons/Cached';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import clsx from 'clsx';
import { green, red, yellow } from '@material-ui/core/colors';

export const StatusTag = ({status, type}) => {

    const classes = useStyles();
    const { t, i18n } = useTranslation();
    return (
        <div 
            className={clsx(classes.statusTag,
                status.statusId  === 'ready' ? 
                classes.ready :
                status.statusId  === 'inProgress' ? 
                classes.inProgress :
                status.statusId  === 'Pending' ?
                classes.Pending :
                status.statusId  === 'Close' ?
                classes.Close : null
            )}>
            {
                status.statusId  === 'ready' ? 
                <PlayCircleOutlineIcon className={classes.icon}/> :
                status.statusId  === 'inProgress' ? 
                <CachedIcon className={classes.icon} /> :
                status.statusId  === 'Pending' ?
                <HourglassEmptyRoundedIcon className={classes.icon}className={classes.icon} /> : 
                status.statusId  === 'Close' ?
                <CheckCircleOutlineRoundedIcon className={classes.icon} /> : null
            }
            <div className={classes.title}>
                { t(`faultsModule.statuses.${status.statusId}`)}
            </div>
            
        </div>
    )
}

const useStyles = makeStyles(theme => ({
    statusTag: {
        display: 'flex',
        alignItems: 'center',
        width: 'fit-content',
        padding: '0 5px',
        borderRadius: '5px',
        fontWeight: 600,
        fontSize: '14px',
        whiteSpace: 'nowrap'

    },
    title: {
        padding: '7px 10px 7px 0px'
    },
    ready: {
        background: 'rgba(255,255,255,0.4)',
        color: 'black'
    },
    inProgress: {
        background: yellow[500],
        color: 'black',
        
    },
    Pending: {
        background: red[600]
    },
    Close: {
        background: green[800]
    },
    icon: {
        fontSize: '20px',
        padding: '0 5px'
    }
}))