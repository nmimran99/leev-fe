import { Grid, LinearProgress, makeStyles, useMediaQuery } from '@material-ui/core';
import dateFormat from 'dateformat';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router';
import { getFullAddress } from '../../../api/assetsApi';
import { addFollowingUser, getFault, removeFollowingUser, saveFaultComment, updateFault, updateFaultComment, updateFaultOwner, updateFaultStatus } from '../../../api/faultsApi';
import { LanguageContext } from '../../../context/LanguageContext';
import { AddFollower } from '../../reuseables/AddFollower';
import { Carousel } from '../../reuseables/Carousel';
import { CommentSection } from '../../reuseables/CommentSection';
import { StatusTag } from '../../reuseables/StatusTag';
import { UpdateOwner } from '../../reuseables/UpdateOwner';
import { UpdateStatus } from '../../reuseables/UpdateStatus';
import { UserList } from '../../reuseables/UserList';
import { UserItem } from '../../user/UserItem';
import { FaultLink } from './FaultLink';
import { FaultViewControls } from './FaultViewControls';
import { UpsertFault } from './UpsertFault';



export const FaultView = ({ fid, faultData, updateFaultState }) => {
    
    const history = useHistory();
    const location = useLocation();
    const { t } = useTranslation();
    const classes = useStyles();
    const { lang } = useContext(LanguageContext);
    const downSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const [ fault, setFault ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const { faultId } = useParams();
    const [ editFault, setEditFault ] = useState(null);
    const [ changeOwner, setChangeOwner ] = useState(false);
    const [ addFollowerModal, setAddFollowerModal ] = useState(null);
    const [ changeStatus, setChangeStatus ] = useState(null);
    
    useEffect(() => {
        if (faultData) {
            setFault(faultData);
            setIsLoading(false);
            return;
        };
        getFault(faultId || fid, false)
        .then(data => {
            if (!data) {
                history.push('/workspace/faults');
            }
            setFault(data);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }, [faultData, faultId])

    const updateFaultDetails = (details) => {
        updateFault(details)
        .then(data => {
            if (data) {
                if (location.pathname === `/workspace/faults/${data.faultId}`) {
                    setFault(data);
                    setEditFault(null);
                } else {
                    history.push(`/workspace/faults/${data.faultId}`);
                }
                
            }
            return;
        })
        .catch(e => {
            console.log(e.message);
            history.push(`/workspace/faults`);
        })
    }

    const updateOwner = (userId) => {
        updateFaultOwner(fault._id, userId)
        .then(data => {
            setFault({
                ...fault, 
                owner: data.owner
            });
            setChangeOwner(false);
        })
    }

    const removeFollower = async userId => {
        const res = await removeFollowingUser(fault._id, userId);
        if (res) {
            setFault({
                ...fault,
                following: res.following
            })
        }
    }

    const addFollower = (userId) => async event => {
        event.stopPropagation();
        const res = await addFollowingUser(fault._id, userId);
        if (res) {
            setFault({
                ...fault,
                following: res.following
            });
            setAddFollowerModal(null);
        }
    }

    const handleChangeStatus = async (statusId) => {
        const res = await updateFaultStatus(fault._id, statusId);
        if (res) {
            setFault({
                ...fault,
                status: res.status
            });
            if (updateFaultState) {
                updateFaultState(res._id, 'status', res.status);
            }
            setChangeStatus(null);     
        }
    }

    const handleSaveComment = async (faultId, userId, text) => {
        const res = await saveFaultComment(faultId, userId, text);
        if(updateFaultState) {
            updateFaultState(res._id, 'comments', res.comments);
        };
        return Promise.resolve(res);
    }

    const handleUpdateComment = async (faultId, commentId, text) => {
        const res = await updateFaultComment(faultId, commentId, text);
        if(updateFaultState) {
            updateFaultState(res._id, 'comments', res.comments);
        }
        return Promise.resolve(res);

    }

    return (
        isLoading ? 
        <LinearProgress />
        :
        <React.Fragment>
            <Grid container className={classes.container} justify='space-between' alignItems='flex-start'>
                <Grid container className={classes.controls} >
                    <Grid item xs={12} className={classes.controlsGriditem}>
                        <div className={classes.faultId}>
                            <FaultLink faultId={fault.faultId} size={18} />
                        </div>
                        <FaultViewControls 
                            id={fault._id} 
                            faultId={fault.faultId}
                            editFault={() => setEditFault(fault._id)}
                            updateOwner={() => setChangeOwner(true)} 
                            changeStatus={() => setChangeStatus(true)}
                        />
                    </Grid>   
                    <Grid item xs={12} className={classes.controlsGriditem}
                        style={{ justifyContent: downSm ? 'center' : 'flex-start'}}
                    >
                        <StatusTag 
                                status={fault.status}
                                type='fault'
                                size={'16px'}
                            /> 
                    </Grid>
                                 
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={8} xl={9}  className={classes.rightContainer} >
                    <div className={classes.asset}>
                        {getFullAddress(fault.asset)}
                    </div>  
                    <div className={classes.title}>
                        { fault.title }
                    </div>
                    <div className={classes.desc}>
                        <div className={classes.openDate}>
                            {`${t("faultsModule.createDate")} ${dateFormat(fault.createdAt, lang.dateformat )}`}
                        </div>
                        {fault.description}
                    </div>
                    {
                        Boolean(fault.images.length) &&
                        <Carousel 
                            images={fault.images}
                            isOpen={Boolean(fault.images.length)}
                            size={300}
                        />
                    }
                </Grid>
                <Grid item xs={8} sm={12} md={4} lg={3} xl={3} className={classes.leftContainer}>
                    <div className={classes.owner}>
                        <UserItem 
                            user={fault.owner}
                            showTitle
                            showPhone
                            showName
                            size={12}
                            avatarSize={50}    
                        />
                    </div>
                    <UserList 
                        users={fault.following}
                        removeTooltip={t("faultsModule.controls.removeFollower")}
                        addTooltip={t("faultsModule.controls.addFollowing")}
                        placeholder={t("faultsModule.noFollowers")}
                        title={t("faultsModule.followingUsers")}
                        handleRemove={removeFollower}
                        handleAdd={() => setAddFollowerModal(true)}
                    />
                </Grid>
                <Grid item xs={12} className={classes.comments}>
                    <CommentSection 
                        parent={fault}
                        saveComment={handleSaveComment}
                        updateComment={handleUpdateComment}
                    />
                </Grid>
            </Grid>
            <UpdateOwner 
                handleClose={() => setChangeOwner(false)}
                handleSave={updateOwner}
                isOpen={changeOwner}
                currentOwner={fault.owner}
                title={t("faultsModule.updateOwner")}
                instructions={t("faultsModule.updateOwnerInstructions")}
            />
            {
                changeStatus &&
                <UpdateStatus 
                    handleClose={() => setChangeStatus(false)}
                    handleSave={handleChangeStatus}
                    isOpen={changeStatus}
                    currentStatus={fault.status}
                    title={t("faultsModule.changeStatus")}
                    instructions={t("faultsModule.changeStatusInstructions")}
                    module={'faults'}
                />
            }
            {
                addFollowerModal &&
                <AddFollower 
                    handleClose={() => setAddFollowerModal(false)}
                    handleSave={addFollower}
                    isOpen={addFollowerModal}
                    followerList={fault.following}
                    title={t("faultsModule.addFollower")}
                    instructions={t("faultsModule.addFollowerInstructions")}
                />
            }
            
            {
                Boolean(editFault) &&
                <UpsertFault 
                    faultId={editFault}
                    handleClose={() => setEditFault(null)}
                    handleUpdate={updateFaultDetails}
                />
            }
            
        </React.Fragment>      
    )
}

const useStyles = makeStyles(theme => ({
    container: {
        overflowY: 'overlay',
        height: '100%',
        [theme.breakpoints.down('sm')]: {
            height: 'auto'
        }
    },
    rightContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: '0 30px',
        [theme.breakpoints.down('sm')]: {
            alignItems: 'center',
            padding: '0 15px'
        }
        
    },
    asset: {
        color: 'white',
        fontSize: '16px',
        background: 'black',
        width: 'fit-content',
        padding: '10px 20px',
        borderRadius: '50px',
        boxShadow: 'rgba(0,0,0,0.25) 0 0 5px 2px',
        textAlign: 'center'
    },
    title: {
        color: 'white',
        fontSize: '22px',
        padding: '15px 0',
        alignSelf: 'flex-end',
        width: '100%'
    },
    desc: {
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '10px',
        padding: '20px',
        color: 'white',
        width: '90%',
        wordBreak: 'break-word'
    },
    leftContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        padding: '10px 30px',
        [theme.breakpoints.down('sm')]: {
            alignItems: 'center',
        }
    },
    owner: {
        background: 'rgba(0,0,0,0.4)',
        padding: '5px 30px',
        borderRadius: '10px',
        width: 'fit-content',
        height: '70px'
        
    },
    controls: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 30px 0px 30px',
    },
    controlsGriditem: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '10px 0'
    },
    faultId: {
        padding: '10px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    linked: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        background: 'rgba(0,0,0,0.4)',
        margin: '10px 0',
        borderRadius: '10px',
        padding: '10px 0',
        height: '300px'
       
    },
    linkedHeader: {
        color: 'white',
        fontSize: '16px',
        padding: '5px',
        margin: '0px auto',
        width: '80%',
        borderBottom: '1px solid rgba(255,255,255,0.2)'

    },
    followingList: {
        padding: '5px',
        overflowY: 'auto',
        
    },
    listItem: {
        width: '250px',
        borderRadius: '5px',
        '&:hover': {
            background: 'rgba(0,0,0,0.4)',
        }
    },
    removeUser: {
        color: 'white',
        '&:hover': {
            background: 'rgba(0,0,0,0.3)'
        }
    },
    openDate: {
        color: 'white',
        fontSize: '14px',
        margin: '0 0 15px 0px',
        padding: '7px 15px',
        background: 'rgba(0,0,0,0.4)',
        width: 'fit-content',
        borderRadius: '50px'
    },
    comments: {
        background: 'rgba(0,0,0,0.4)',
        margin: '20px 30px',
        borderRadius: '10px',
        [theme.breakpoints.down('sm')]: {
            margin: '20px 0px',
        }
    },
    status: {
        margin: '10px 0'
    }
    
}))