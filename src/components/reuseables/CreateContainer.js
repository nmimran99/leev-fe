import { makeStyles } from '@material-ui/core';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { createNewAsset } from '../../api/assetsApi';
import { createNewFault } from '../../api/faultsApi';
import { createNewSystem } from '../../api/systemsApi';
import { createNewTask } from '../../api/tasksApi';
import { UpsertAsset } from '../datapages/assets/UpsertAsset';
import { UpsertFault } from '../datapages/faults/UpsertFault';
import { UpsertSystem } from '../datapages/systems/UpsertSystem';
import { UpsertTask } from '../datapages/tasks/UpsertTask';




export const CreateContainer = ({ isOpen, handleClose, itemType }) => {

    const location = useLocation();
    const history = useHistory();
 
    const handleSaveAsset = details => {
        createNewAsset(details)
        .then(data => {
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
            handleClose();
            history.push(`/workspace/faults/${data.faultId}`)
        })
    }

    const handleSaveTask = details => {
        console.log(details)
        createNewTask(details)
        .then(data => {
            handleClose();
            history.push(`/workspace/tasks/${data.taskId}`)
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
                />
                : 
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