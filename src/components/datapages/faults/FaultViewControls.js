import React from 'react';
import { makeStyles, Grid, IconButton, Tooltip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CreateIcon from '@material-ui/icons/Create';
import TransferWithinAStationRoundedIcon from '@material-ui/icons/TransferWithinAStationRounded';
import GroupAddRoundedIcon from '@material-ui/icons/GroupAddRounded';


export const FaultViewControls = ({ id, faultId }) => {

    const classes = useStyles();
    const { t, i18n } = useTranslation();

    const openInNewWindow = () => {
        window.open(`http://localhost:3000/workspace/faults/${faultId}`)
    }
    
    return (
        <div className={classes.container}> 
            <Tooltip title={t("faultsModule.controls.openInNew")}>
                <IconButton
                    className={classes.iconBtn}
                    onClick={openInNewWindow}
                >
                    <OpenInNewIcon className={classes.icon}/>
                </IconButton>
            </Tooltip>
            <Tooltip title={t("faultsModule.controls.editDetails")}>
                <IconButton
                    className={classes.iconBtn}
                >
                    <CreateIcon className={classes.icon}/>
                </IconButton>
            </Tooltip>
            <Tooltip title={t("faultsModule.controls.changeOwner")}>
                <IconButton
                    className={classes.iconBtn}
                >
                    <TransferWithinAStationRoundedIcon className={classes.icon}/>
                </IconButton>
            </Tooltip>
            <Tooltip title={t("faultsModule.controls.addFollowing")}>
                <IconButton
                    className={classes.iconBtn}
                >
                    <GroupAddRoundedIcon className={classes.icon}/>
                </IconButton>
            </Tooltip>
        </div>
    )
}

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex'
    },
    iconBtn: {
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '50px',
        color: 'white',
        margin: '0 5px',
        '&:hover': {
            background: 'rgba(0,0,0,0.7)'
        }
    },
    icon: {

    }
}))