import { makeStyles } from '@material-ui/core';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { createNewAsset, updateAsset } from '../../api/assetsApi';
import { updateDocumentDetails, uploadDocument } from '../../api/documentsApi';
import { createNewFault, updateFault } from '../../api/faultsApi';
import { createLocation, updateLocation } from '../../api/locationsApi';
import { createNewSystem, updateSystemAdditionalData } from '../../api/systemsApi';
import { createNewTask, updateTask } from '../../api/tasksApi';
import { SnackbarContext } from '../../context/SnackbarContext';
import { UpsertContext } from '../../context/UpsertContext';
import { UpsertAsset } from '../datapages/assets/UpsertAsset';
import { UpsertClient } from '../datapages/clients/UpsertClient';
import { UpsertDocument } from '../datapages/documents/UpsertDocument';
import { UpsertFault } from '../datapages/faults/UpsertFault';
import { UpsertLocation } from '../datapages/locations/UpsertLocation';
import { UpsertSystem } from '../datapages/systems/UpsertSystem';
import { UpsertTask } from '../datapages/tasks/UpsertTask';




export const CreateContainer = ({ isOpen, handleClose }) => {

    const location = useLocation();
    const history = useHistory();
    const { upsertData } = useContext(UpsertContext);
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

    const handleAssetUpdate = async (details) => {
		const res = await updateAsset(details);
		if (res.status === 403) {
			setSnackbar(res);
		} else if (res) {
			history.go(0);
		}
		handleClose();
	};

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

    const handleUpdateSystem = (details) => {
		updateSystemAdditionalData(details)
			.then((res) => {
				if (res.status === 403) {
					setSnackbar(res)
				} else if (res) {
                    history.go(0);  
				}
			})
			.finally(() => {
				handleClose();
			});
	};

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

    const handleUpdateFault = (details) => {
		    updateFault(details)
			.then((res) => {
				if (res.status === 403) {
					setSnackbar(res);
				} else if (res) {
					if (location.pathname === `/workspace/faults/${res.faultId}`) {
						history.go(0);
					} else {
						history.push(`/workspace/faults/${res.faultId}`);
					}
				}
				handleClose();
				return;
			})
			.catch((e) => {
				console.log(e.message);
				history.push(`/workspace/faults`);
			});
	};

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

    const handleUpdateTask = (details) => {
		updateTask(details)
			.then((res) => {
				if (res.status === 403) {
					setSnackbar(res);
				} else if (res) {
					if (location.pathname === `/workspace/tasks/${res.taskId}`) {
						history.go(0);
					} else {
						history.push(`/workspace/tasks/${res.taskId}`);
					}
				}
				handleClose();
				return;
			})
			.catch((e) => {
				console.log(e.message);
				history.push(`/workspace/tasks`);
			});
	};

    const handleSaveDocument = details => {
        uploadDocument(details)
        .then(res => {
            if (res.status === 403) {
                setSnackbar(res);
                handleClose();  
                return; 
            }
            if (location.pathname === '/workspace/documents') {
                history.go(0);
            }
            history.push(`/workspace/documents`)
        })
        .finally(() => {
            handleClose(); 
        })
    }

    const handleUpdateDocument = details => {
        updateDocumentDetails(details)
        .then(res => {
            if (res.status === 403) {
                setSnackbar(res);
                handleClose();  
                return; 
            }
            if (location.pathname === '/workspace/documents') {
                history.go(0);
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
             history.push(`/workspace/assets/${details.asset}?tab=locations`)
        })
        .finally(() => {
            handleClose()
        })
    }

    const handleUpdateLocation = async (details) => {
		updateLocation(details).then((res) => {
			if ([403, 500].includes(res.status)) {
				setSnackbar(res);
				return;
			}
			history.go(0)
		});
	};

    return (
        <React.Fragment>
            {
                upsertData.module === 'clients' ?
                <UpsertClient 
                    handleClose={handleClose}
                /> : 
                upsertData.module === 'assets' ?
                <UpsertAsset
                    assetId={upsertData.itemId} 
                    handleClose={handleClose}
                    handleSave={handleSaveAsset}
                    handleUpdate={handleAssetUpdate}
                /> : 
                upsertData.module ==='systems' ? 
                <UpsertSystem
                    systemId={upsertData.itemId} 
                    handleClose={handleClose}
                    handleSave={handleSaveSystem}
                    handleUpdate={handleUpdateSystem}
                /> :
                upsertData.module ==='locations' ? 
                <UpsertLocation
                    locationId={upsertData.itemId} 
                    handleClose={handleClose}
                    handleSave={handleSaveLocation}
                    handleUpdate={handleUpdateLocation}
                /> : 
                upsertData.module === 'faults' ?
                <UpsertFault 
                    faultId={upsertData.itemId}
                    handleClose={handleClose}
                    handleSave={handleSaveFault}
                    handleUpdate={handleUpdateFault}
                /> 
                : 
                upsertData.module === 'tasks' ?
                <UpsertTask 
                    taskId={upsertData.itemId}
                    handleClose={handleClose}
                    handleSave={handleSaveTask}
                    handleUpdate={handleUpdateTask}
                />
                : 
                upsertData.module === 'documents' ?
                <UpsertDocument
                    documentId={upsertData.itemId} 
                    handleClose={handleClose}
                    handleSave={handleSaveDocument}
                    handleUpdate={handleUpdateDocument}
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