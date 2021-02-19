import React, { useState } from 'react';
import { makeStyles, useMediaQuery, List, ListItem, IconButton, Tooltip } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import { useTranslation } from 'react-i18next';
import { UserItem } from '../user/UserItem';
import { ClearRounded } from '@material-ui/icons';



export const UserList = ({ users, handleRemove, removeTooltip, handleAdd, addTooltip, title, placeholder, width }) => {
    
    const history = useHistory();
    const location = useLocation();
    const classes = useStyles();
    const downSm = useMediaQuery(theme => theme.breakpoints.down('md'));
    const [ userList, setUserList ] = useState(users || []);
    const [ liHover, setLiHover ] = useState(null)

    const toggleHover = index => event => {
        event.stopPropagation();
        setLiHover(index);
    }
    return (
           
        <div className={classes.linked} style={{ width: `${width}px`}}>
            <div className={classes.topRow}>
                <div className={classes.linkedHeader}>
                    {title}
                </div>
                <Tooltip title={addTooltip}>
                    <IconButton 
                        className={classes.addUser}
                        onClick={handleAdd}
                    >
                        <AddRoundedIcon className={classes.icon}/>
                    </IconButton>
                </Tooltip>
                
            </div>
            
            <List className={classes.followingList}>
                {
                    Boolean(userList.length) ?
                        userList.map((user, i) => 
                        <ListItem 
                            key={i} 
                            className={classes.listItem}
                            onMouseEnter={toggleHover(i)}
                            onMouseLeave={() => setLiHover(null)}
                        >
                            <UserItem 
                                user={user} 
                                avatarSize={40}
                                size={11}
                                showTitle
                                showPhone
                            />
                            {
                                (liHover === i || downSm )&&
                                <Tooltip title={removeTooltip}>
                                    <IconButton 
                                        className={classes.removeUser}
                                        onClick={handleRemove(user._id)}
                                    >
                                        <ClearRounded className={classes.icon}/>
                                    </IconButton>
                                </Tooltip>
                            }
                            
                        </ListItem>
                    )
                    : 
                    <ListItem className={classes.placeholder}>
                        {placeholder}
                    </ListItem>
                }
            </List>

        </div>
            

        
    )
}

const useStyles = makeStyles(theme => ({

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
    topRow: {
        margin: '0px auto',
        width: '80%',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    linkedHeader: {
        color: 'white',
        fontSize: '16px',
        padding: '5px',
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
    addUser: {
        color: 'white',
        border: '1px solid rgba(255,255,255,0.2)',
        padding: '5px',
        margin: '0 0 10px 0'
    },
    icon: {
        fontSize: '20px'
    },
    placeholder: {
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '25px',
        color: 'white',
        padding: '10px 20px',
        width: '90%',
        margin: '10px auto'
    }
    
}))