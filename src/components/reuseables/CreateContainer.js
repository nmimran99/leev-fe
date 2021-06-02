import { makeStyles, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { createNewAsset } from '../../api/assetsApi';
import { uploadDocument } from '../../api/documentsApi';
import { createNewFault } from '../../api/faultsApi';
import { createLocation } from '../../api/locationsApi';
import { createNewSystem } from '../../api/systemsApi';
import { createNewTask } from '../../api/tasksApi';
import { SnackbarContext } from '../../context/SnackbarContext';
import { UpsertAsset } from '../datapages/assets/UpsertAsset';
import { UpsertDocument } from '../datapages/documents/UpsertDocument';
import { UpsertFault } from '../datapages/faults/UpsertFault';
import { UpsertLocation } from '../datapages/locations/UpsertLocation';
import { UpsertSystem } from '../datapages/systems/UpsertSystem';
import { UpsertTask } from '../datapages/tasks/UpsertTask';




export const CreateContainer = ({ isOpen, handleClose, itemType }) => {

    const location = useLocation();
    const history = useHistory();
    const { t } = useTranslation();
    const { snackbar, setSnackbar }  = useContext(SnackbarContext);

 
    const handleSaveAsset = details => {
        createNewAsset(details)
        .then(res => {
            if (res.status === 403) {
                setSnackbar(res);
                return; 
            }
            if (location.pathname === '/workspace/assets') {
                history.go(0);
            }
        })
        .finally(() => {
            handleClose();
        })
    }

    const handleSaveSystem = details => {
        createNewSystem(details)
        .then(res => {
            if (res.status === 403) {
                setSnackbar(res); 
                return; 
            }
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
        .then(res => {
   
            if (res.status === 403) {
                setSnackbar(res);
                handleClose();  
                return; 
            };
            setSnackbar({
                text: "faultsModule.faultSuccesfullyCreated",
                severity: 'success',
            });
            handleClose();
            history.push(`/workspace/faults/${res.faultId}`)
            
        })
    }

    const handleSaveTask = details => {

        createNewTask(details)
        .then(res => {
            if (res.status === 403) {
                setSnackbar(res); 
                return; 
            }
            history.push(`/workspace/tasks/${res.taskId}`)
        })
        .finally(() => {
            handleClose(); 
        })
    }

    const handleSaveDocument = details => {
        uploadDocument(details)
        .then(res => {
            if (res.status === 403) {
                setSnackbar(res);
                handleClose();  
                return; 
            }
            history.push(`/workspace/documents`)
        })
        .finally(() => {
            handleClose(); 
        })
    }
    
    const handleSaveLocation = details => {
        createLocation(details)
        .then(res => {
            if (res.status === 403) {
                setSnackbar(res);
                handleClose();  
                return; 
            }
            console.log(res)
             history.push(`/workspace/assets/${details.asset}?tab=locations`)
        })
        .finally(() => {
            handleClose()
        })
    }
    return (
        <React.Fragment>
            {
                itemType === 'asset' ?
                <UpsertAsset 
                    handleClose={handleClose}
                    handleSave={handleSaveAsset}
                /> : 
                itemType ==='system' ? 
                <UpsertSystem 
                    handleClose={handleClose}
                    handleSave={handleSaveSystem}
                /> :
                itemType ==='location' ? 
                <UpsertLocation 
                    handleClose={handleClose}
                    handleSave={handleSaveLocation}
                /> : 
                itemType === 'fault' ?
                <UpsertFault 
                    handleClose={handleClose}
                    handleSave={handleSaveFault}
                /> 
                : 
                itemType === 'task' ?
                <UpsertTask 
                    handleClose={handleClose}
                    handleSave={handleSaveTask}
                />
                : 
                itemType === 'document' ?
                <UpsertDocument 
                    handleClose={handleClose}
                    handleSave={handleSaveDocument}
                /> : null
            }
        </React.Fragment>
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