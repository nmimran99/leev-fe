import React, { useState, } from 'react';
import { Grid, makeStyles, Collapse, Tooltip, IconButton, useMediaQuery, Fade } from '@material-ui/core';
import { UserItem } from '../../user/UserItem';
import { getFullName } from '../../../api/genericApi';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import { useTranslation } from 'react-i18next';
import { AlertDialog } from '../../reuseables/AlertDialog';
import { addUser, removeSystemUser } from '../../../api/systemsApi';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import { AddLinkedUser } from './AddLinkedUser';

export const SystemLinkedUsers = ({ userList, setData, systemId, isOpen }) => {

    const classes = useStyles();
    const downSm = useMediaQuery(theme => theme.breakpoints.down('md'));
    const [ linkedUsers, setLinkedUsers ] = useState(userList || []);
    const [ showControls, setShowControls ] = useState(null);
    const [ showAddLinkedUser, setShowAddLinkedUser ] = useState(false);
    const [ alertDialog ,setAlertDialog ] = useState(null)
    const { t, i18n } = useTranslation(); 

    const confirmRemove = linkedUser => event => {
        event.stopPropagation();
        let toRemove = linkedUsers.find(user => user._id === linkedUser._id)
        setAlertDialog({
            text: `${t("systemsModule.userRemoveConfirmText")} ${getFullName(toRemove)}?`,
            title: t("systemsModule.userRemoveConfirmTitle"),
            handleConfirm: async () => { 
                const res = await removeSystemUser(systemId, linkedUser._id);
                if (res) {
                    setData(res);
                    setAlertDialog(null);
                    setLinkedUsers([]);
                    setLinkedUsers(res.linkedUsers);
                }  
            },
            handleCancel: () => setAlertDialog(null)
        })
    }

    const handleAddLinkedUser = () => {
        if (showAddLinkedUser) {
            setShowAddLinkedUser(false);
            return;
        }
        setShowAddLinkedUser(true);
    }

    const handleAddLinekdUser = async userId => {
        const res = await addUser(systemId, userId);
        if (res) {
            setData(res);
            setLinkedUsers(res.linkedUsers);
            setShowAddLinkedUser(false);
        }
    }

    return (
        <Collapse in={isOpen} >
            <div className={classes.linkedusers}>
                <Grid container justify='flex-start' className={ classes.container} alignItems='center'>
                    <Grid item xs={12} className={classes.titleContainer}>
                        <div className={classes.title}>
                            {t("systemsModule.assignedUsers")}
                        </div>
                        <IconButton 
                            className={classes.addBtn}
                            onClick={handleAddLinkedUser}
                        >
                            <AddRoundedIcon className={classes.icon}/>
                        </IconButton>
                        {
                            showAddLinkedUser &&
                            <AddLinkedUser 
                                isOpen={showAddLinkedUser}
                                handleClose={handleAddLinkedUser}
                                linkedUsers={linkedUsers}
                                handleSave={handleAddLinekdUser}

                            />
                        }
                        
                    </Grid>
                    {
                        linkedUsers.length ? 
                        linkedUsers.map((linkedUser, i) => {
                            return (
                                <Grid item xs={12} sm={7} md={6} lg={3} className={classes.gridItem}>
                                    <div 
                                        className={classes.userCont}
                                        onMouseEnter={() => setShowControls(i)}
                                        onMouseLeave={() => setShowControls(null)}
                                        key={i}
                                    >
                                        <UserItem 
                                            user={linkedUser}
                                            showTitle
                                            showPhone
                                            showName
                                            avatarSize={'50px'}
                                            size={13}
                                        />
                                        <Fade in={showControls === i || downSm}>
                                            <Tooltip title={t("systemsModule.removeUser")}>
                                                <IconButton 
                                                    className={classes.removeuser}
                                                    onClick={confirmRemove(linkedUser)}
                                                >
                                                    <ClearRoundedIcon className={classes.icon}/>
                                                </IconButton>
                                            </Tooltip>
                                        </Fade> 
                                    </div>
                                </Grid>
                            )
                        }) :
                        <div className={classes.noUsers}>
                            {t("systemsModule.noUsersAssigned")}
                        </div>

                    }
                    {
                        Boolean(alertDialog) &&
                        <AlertDialog 
                            alertDialog={alertDialog}
                            open={Boolean(alertDialog)}
                        />
                    }    
                </Grid>
            </div>
        </Collapse>
    )
}


const useStyles = makeStyles(theme => ({
    linkedusers: {
        width: 'auto',
        margin: '10px',
        borderRadius: '25px',
        background: 'rgba(0,0,0,0.1)',
        boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.2)',
    },
    container: {
        width: 'auto',
        padding: '5px',
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '5px',
        border: '1px solid rgba(255,255,255,0.2)',
    },
    gridItem: {
        borderRadius: '20px',
        padding: '5px 10px',
        '&:hover':{
            background: 'rgba(0,0,0,0.2)',
            boxShadow: '-0px 0px 5px 2px rgba(0,0,0,0.2)',
            
        }
    },
    titleContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        margin: '0 10px',
        padding: '5px 5px 10px'

    },
    addBtn: {
        fontSize: '20px',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.2)',
        padding: '2px',
        borderRadius: '50px',
        '&:hover': {
            background: 'rgba(0,0,0,0.2)'
        }
    },
    cell: {
        color: 'white',
        textAlign: 'center'
    },
    userCont: {
        width: '100%',
        display: 'flex',
        padding: '5px 10px',
        position: 'relative'
    },
    removeuser: {
        padding: '4px',
        margin: 'auto 4px',
        height: '50%',
        '&:hover' :{
            background: 'rgba(255,255,255,0.1)'
        }
    },
    icon: {
        fontSize: '20px',
        color: 'white',
        padding: '8px'
    },
    title: {
        color: 'white',
        fontSize: '16px'
    },
    noUsers: {
        margin: '10px',
        padding: '0px 0 15px',
        color: 'white',
        fontSize: '14px',
        background: 'rgba(0,0,0,0.4)',
        padding: '10px 20px',
        borderRadius: '25px'
    }
    
}))