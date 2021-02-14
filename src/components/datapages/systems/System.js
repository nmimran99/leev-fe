import React, { useState } from 'react';
import { Grid, IconButton, makeStyles, Paper, useMediaQuery } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { UpdateSystemOwner } from './UpdateSystemOwner';
import { updateSystemOwner } from '../../../api/systemsApi';
import { SystemName } from './SystemName';
import { SystemLinkedUsers } from './SystemLinkedUsers';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@material-ui/icons/ExpandLessRounded';
import { SystemControls } from './SystemControls';

export const System = ({ systemData }) => {

    const classes = useStyles();
    const { t, i18n } = useTranslation();
    const downSm = useMediaQuery(theme => theme.breakpoints.down('md'));
    const [ data, setData ] = useState(systemData)
    const [ editOwner, setEditOwner ] = useState(false)
    const [ editName, setEditName ] = useState(false)
    const [ expanded, setExpanded ] = useState(false);
    const [ showLinkedUsers, setShowLinkedUsers ] = useState(false);

    const toggleEditOwner = () => {
        if (editOwner) {
            setEditOwner(false);
            return;
        }
        setShowLinkedUsers(false);
        setEditOwner(true);
       
    }

    const updateOwner = async (owner) => {
        const res = await updateSystemOwner(data._id, owner);
        if (res) {
            setData(res);
            setEditOwner(false);
        }
    }

    const setSystemName = name => {
        setData({
            ...data,
            name
        });
    }

    const showLinkedUsersToggle = () => {
        if (!showLinkedUsers) {
            setEditOwner(false);
            setShowLinkedUsers(true);
            return;
        }
        setShowLinkedUsers(false)
    }

    const handleExpand = () => {
        if (expanded) {
            setShowLinkedUsers(false);
            setEditOwner(false);
            setExpanded(false);
            return;
        } 
        setExpanded(true)
    }
    return (
        <Grid item xs={ 12 } sm={7} md={8} lg={11} xl={9}>
            <Paper elevation={9} className={classes.paper}>
                <div className={classes.mainRow}>
                    <div 
                        className={classes.semiMainRow} 
                        onClick={handleExpand}
                        style={{ borderBottom: expanded ? '1px solid rgba(255,255,255,0.2)' : 'none' }}    
                    >
                        <SystemName 
                            systemId={data._id}
                            editName={editName}
                            setEditName={setEditName}
                            setSystemName={setSystemName} 
                            title={data.name}
                        />
                        {
                            (downSm && !editName) ? 
                            <IconButton 
                                className={classes.expandIcon}
                                onClick={handleExpand}
                            > 
                                {
                                    !expanded ?
                                    <ExpandMoreRoundedIcon className={classes.userIcon}/> :
                                    <ExpandLessRoundedIcon className={classes.userIcon}/>
                                }    
                            </IconButton> : null
                        }
                    </div>
                    <SystemControls 
                        editName={editName} 
                        expanded={expanded} 
                        owner={data.owner}
                        showLinkedUsersToggle={showLinkedUsersToggle}
                        toggleEditOwner={toggleEditOwner}
                    />
                </div> 
                <SystemLinkedUsers
                    isOpen={showLinkedUsers}  
                    userList={ data.linkedUsers }  
                    setData={ setData } 
                    systemId={ data._id }                        
                />
                <UpdateSystemOwner 
                    isOpen={editOwner}
                    currentOwner={data.owner}
                    handleSave={updateOwner}
                    handleClose={toggleEditOwner}
                />
            </Paper>
        </Grid>
    )
}

const useStyles = makeStyles(theme => ({
    paper: {
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '5px',
        margin: '4px 5px'
    },
    mainRow: {
        display: 'flex',
        justifyContent: 'space-between',
        widht: 'auto',
        [theme.breakpoints.down('md')] : {
            flexDirection: 'column',
        }
    },
    semiMainRow: {
        display: 'flex',
        width: 'auto',
        justifyContent: 'space-between'
    },
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
    systemName: {
        color: 'white',
        margin: 'auto 20px',
        fontSize: '18px',
        whiteSpace: 'wrap',
        borderRadius: '50px',
        padding: '5px 20px'
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
    },
    editOwner: {
        width: 'auto',
        height: '200px',
        margin: '20px',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '5px'
    }
    
}))