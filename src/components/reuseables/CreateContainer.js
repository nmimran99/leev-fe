import React, { useState, useContext, useEffect } from 'react';
import { makeStyles, useMediaQuery, Modal, Backdrop } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';
import { CreateAsset } from '../datapages/assets/CreateAsset';
import { createNewAsset } from '../../api/assetsApi';
import { useHistory, useLocation } from 'react-router';
import { UpsertSystem } from '../datapages/systems/UpsertSystem';
import { createNewSystem } from '../../api/systemsApi';
import { UpsertFault } from '../datapages/faults/UpsertFault';
import { createNewFault } from '../../api/faultsApi';




export const CreateContainer = ({ isOpen, handleClose, itemType }) => {

    const location = useLocation();
    const history = useHistory();
    const classes = useStyles();
    const { lang } = useContext(LanguageContext);
    const downSm = useMediaQuery(theme => theme.breakpoints.down('md'));
    const { t, i18n } = useTranslation();
 
    const handleSaveAsset = details => {
        createNewAsset(details)
        .then(data => {
            console.log(data)
            if (location.pathname === '/workspace/assets') {
                console.log('here')
                history.go(0);
            }
        })
        .finally(() => {
            handleClose();
        })
    }

    const handleSaveSystem = details => {
        createNewSystem(details)
        .then(data => {
            console.log(data);
            if (location.pathname === '/workspace/systems') {
                history.go(0);
            }
        })
        .finally(() => {
            handleClose();
        })
    }

    const handleSaveFault = details => {
        createNewFault(details)
        .then(data => {
            console.log(data)
            handleClose();
            history.push(`/workspace/faults/${data.faultId}`)
        })
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500
            }}
            className={classes.modal}
        >
            {
                itemType === 'asset' ?
                <CreateAsset 
                    handleClose={handleClose}
                    handleSave={handleSaveAsset}
                /> : 
                itemType ==='system' ? 
                <UpsertSystem 
                    handleClose={handleClose}
                    handleSave={handleSaveSystem}
                />
                : 
                itemType === 'fault' ?
                <UpsertFault 
                    handleClose={handleClose}
                    handleSave={handleSaveFault}
                /> : null
            }
           
        </Modal>
    )
}


const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)'   
    }
}))