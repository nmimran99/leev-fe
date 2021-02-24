import React, { useState } from 'react';
import { makeStyles, Button, useMediaQuery } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { StatusTag } from '../../reuseables/StatusTag';
import { FaultLink } from './FaultLink';
import { UserItem } from '../../user/UserItem';
import { getFullAddress } from '../../../api/assetsApi';

export const FaultMinified = ({ data }) => {
    
    const classes = useStyles();
    const downSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const { t, i18n } = useTranslation();

    return (
        <div className={classes.container}>
            
            <div 
                className={classes.topRow}   
            >
                <div className={classes.asset}>
                    { getFullAddress(data.asset, true)}
                </div>
                <div >
                <FaultLink faultId={data.faultId}/>
                </div>
            </div>
            <div className={classes.title}>
                { data.title }
            </div>
            <div className={classes.bottomRow}>
                <div className={classes.userData}>
                    <UserItem size={14} avatarSize={40} user={data.owner._id} showPhone/>
                </div>
                <StatusTag status={data.status} type={'fault'}/>
                
            </div>
            
            
        </div>
            

    )
}

const useStyles = makeStyles(theme => ({
    container: {
        width: '100%',
        height: '100%'
    },
    title: {
        color: "white",
        height: "35%",
        margin: "5px 10px 0px 10px",
        fontSize: "18px",
        display: "-webkit-box",
        WebkitLineClamp: "3",
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis"        
    },
    topRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 5px'
    },
    userData: {
        width: '170px',
        padding: '10px 0px'
    },
    bottomRow: {
        height: '50px',
        width: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    asset: {
        color: 'white',
        borderRadius: '50px',
        background: 'rgba(0,0,0,0.3)',
        padding: '5px 10px',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: 'rgba(0,0,0,0.3) 1px 1px 5px 2px'
    },
    faultLink: {
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '3px 0'
    }
}))