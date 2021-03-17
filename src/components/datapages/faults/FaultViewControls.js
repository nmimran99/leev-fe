import { IconButton, makeStyles, Tooltip } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import TransferWithinAStationRoundedIcon from '@material-ui/icons/TransferWithinAStationRounded';
import React from 'react';
import { useTranslation } from 'react-i18next';


export const FaultViewControls = ({ id, faultId, editFault, updateOwner, changeStatus }) => {

    const classes = useStyles();
    const { t, i18n } = useTranslation();

    const openInNewWindow = () => {
        window.open(`http://localhost:3000/workspace/faults/${faultId}`)
    }
    
    return (
        <div className={classes.container}> 
            <Tooltip title={t("general.openInNew")}>
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
                    onClick={editFault}
                >
                    <CreateIcon className={classes.icon}/>
                </IconButton>
            </Tooltip>
            <Tooltip title={t("faultsModule.controls.changeOwner")}>
                <IconButton
                    className={classes.iconBtn}
                    onClick={updateOwner}
                >
                    <TransferWithinAStationRoundedIcon className={classes.icon}/>
                </IconButton>
            </Tooltip>
            <Tooltip title={t("faultsModule.controls.changeStatus")}>
                <IconButton
                    className={classes.iconBtn}
                    onClick={changeStatus}
                >
                    <DoubleArrowIcon className={classes.icon}/>
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
        padding: '10px',
        '&:hover': {
            background: 'rgba(0,0,0,0.7)'
        }
    },
    icon: {
        fontSize: '20px',
    }
}))