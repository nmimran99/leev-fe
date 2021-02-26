import React, { useState } from 'react';
import { makeStyles, Button, useMediaQuery, Grid } from '@material-ui/core';
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
        <Grid container className={classes.container} alignItems='flex-start'>
            <Grid container justify='space-between' alignItems='center' className={classes.topRow}>
                <Grid item xs={9} >
                    <div className={classes.asset}>
                        { getFullAddress(data.asset, true)}
                    </div>    
                </Grid>
                <Grid item xs={3} className={classes.link}>
                    <FaultLink faultId={data.faultId} size={14} />
                </Grid>
            </Grid>
            <Grid xs={12} item className={classes.title}>
                { data.title }
            </Grid> 
            <Grid container justify='space-between' alignItems='center' className={classes.bottomRow}>
                <Grid item xs={7} className={classes.userData}>
                    <UserItem size={13} avatarSize={40} user={data.owner._id} showPhone/>
                </Grid>
                <Grid item xs={5} className={classes.status} >
                    <StatusTag status={data.status} type={'fault'}/>
                </Grid>  
            </Grid>   
        </Grid>
            

    )
}

const useStyles = makeStyles(theme => ({
    container: {
        width: '100%',
        height: '100%',
        position: 'relative'
    },
    title: {
        color: "white",
        fontSize: "18px",
        padding: '10px 0',
        display: "-webkit-box",
        WebkitLineClamp: "3",
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        height: '60px'       
    },
    topRow: {
        padding: '5px',
        maxHeight: '60px'
    },
    userData: {
        padding: '10px 0px'
    },
    bottomRow: {
        height: '50px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxHeight: '50px'
    },
    asset: {
        color: 'white',
        borderRadius: '50px',
        background: 'rgba(0,0,0,0.4)',
        padding: '5px 15px',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: 'rgba(0,0,0,0.3) 1px 1px 5px 2px',
        width: 'fit-content',
        textAlign: 'center'
    },
    faultLink: {
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '3px 0'
    },
    status: {
        display: 'flex',
        justifyContent: 'center'
    },
    link: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
}))