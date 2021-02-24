import React, { useEffect, useState } from 'react';
import { IconButton, makeStyles, Paper, useMediaQuery, Tooltip, Collapse } from '@material-ui/core';
import { UserItem } from '../../user/UserItem';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import TransferWithinAStationRoundedIcon from '@material-ui/icons/TransferWithinAStationRounded';
import { useTranslation } from 'react-i18next';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import AssignmentRoundedIcon from '@material-ui/icons/AssignmentRounded';
import DescriptionRoundedIcon from '@material-ui/icons/DescriptionRounded';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';


export const SystemControls = ({ editName, expanded, owner, showLinkedUsersToggle, toggleEditOwner, toggleAdditionalDetails }) => {

    const classes = useStyles();
    const { t, i18n } = useTranslation();
    const downSm = useMediaQuery(theme => theme.breakpoints.down('md'));

    return (
        <Collapse in={((!downSm && !editName) || expanded)}>
            <div className={classes.actionsContainer}>
                <div className={classes.actions}>
                    <Tooltip title={t("systemsModule.moreDetails")}>
                        <IconButton
                            className={classes.iconBtn}
                            onClick={toggleAdditionalDetails}
                        >
                            <MoreHorizIcon className={classes.userIcon}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("systemsModule.showTasks")}>
                        <IconButton
                            className={classes.iconBtn}
                        >
                            <AssignmentRoundedIcon className={classes.userIcon}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("systemsModule.showFaults")}>
                        <IconButton
                            className={classes.iconBtn}
                        >
                            <WarningRoundedIcon className={classes.userIcon}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("systemsModule.showDocuments")}>
                        <IconButton
                            className={classes.iconBtn}
                        >
                            <DescriptionRoundedIcon className={classes.userIcon}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("systemsModule.changeManager")}>
                        <IconButton
                            className={classes.iconBtn}
                            onClick={toggleEditOwner}
                        >
                            <TransferWithinAStationRoundedIcon className={classes.userIcon}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("systemsModule.showUsers")}>
                        <IconButton
                            className={classes.iconBtn}
                            onClick={showLinkedUsersToggle}
                        >
                            <PersonRoundedIcon className={classes.userIcon}/>
                        </IconButton>
                    </Tooltip>
                    
                </div>
                <div className={classes.ownerInfo}>
                    <UserItem 
                        user={owner}
                        avatarSize={40}
                        showPhone
                        size={13}
                    />
                </div> 
            </div>
        </Collapse>
    )
}

const useStyles = makeStyles(theme => ({ 
    actionsContainer: {
        display: 'flex',
        width: 'fit-content',
        padding: '5px',
        margin: 'auto 0',
        justifyContent: 'space-between',
        [theme.breakpoints.down('md')] : {
            flexDirection: 'column-reverse',
            alignItems: 'center',
            margin: 'auto',
        }
    },
    actions: {
        margin: 'auto 10px',
        [theme.breakpoints.down('md')] : {
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '50px',
            margin: '10px 0',
            padding: '5px 10px'
        }
    },
    iconBtn: {
        padding: '0px',
        height: 'fit-content',
        width: 'fit-content',
        margin: '0 20px',
        [theme.breakpoints.down('md')]: {
            margin: '5px 10px'
        }
        
    },
    userIcon: {
        fontSize: '20px',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.2)',
        padding: '8px',
        borderRadius: '50px',
        '&:hover': {
            background: 'rgba(0,0,0,0.2)'
        }
        
    },
    ownerInfo: {
        height: 'auto', 
        width: '150px',
        padding: '5px 20px 5px 10px',
        display: 'grid',
        placeItems: 'center',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '5px',
        '&:hover': {
            background: 'rgba(0,0,0,0.8)'
        },
        [theme.breakpoints.down('md')]: {
            marginTop: '5px',
            borderRadius: '50px',
            width: '170px',
            padding: '5px 20px 5px 5px',
        }
    }
}))