import React, { useState } from 'react'
import { makeStyles, List, ListItem, ListItemIcon, ListItemText, Box, Divider, Grow, ClickAwayListener, useMediaQuery } from '@material-ui/core'
import AddLocationOutlinedIcon from '@material-ui/icons/AddLocationOutlined';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import QueueIcon from '@material-ui/icons/Queue';
import PostAddIcon from '@material-ui/icons/PostAdd';
import NoteAddOutlinedIcon from '@material-ui/icons/NoteAddOutlined';

export const AddMenu = ({toggleAddMenu}) => {

    const classes = useStyles();
    const matches = useMediaQuery(theme => theme.breakpoints.up('sm'));

    const closeMenu = () => {
        if (matches) {
            toggleAddMenu()
        }
    }  

    return (
        <ClickAwayListener onClickAway={closeMenu}>
            <Grow in={true}>
                <div className={classes.addMenuContainer}>
                    <List className= { classes.list}>
                        <ListItem button={true} className={classes.listItem}>
                            <ListItemIcon className={classes.listItemIcon}>
                                <AddLocationOutlinedIcon fontSize={'medium'} className={classes.icon}/>
                            </ListItemIcon>
                            <ListItemText primary='הוספת נכס' className={classes.listItemText} disableTypography={true}/>
                        </ListItem>
                        <ListItem button={true} className={classes.listItem}>
                            <ListItemIcon className={classes.listItemIcon}>
                                <GroupAddIcon fontSize={'medium'}/>
                            </ListItemIcon>
                            <ListItemText primary='יצירת משתמש' className={classes.listItemText} disableTypography={true}/>
                        </ListItem>
                        <ListItem button={true} className={classes.listItem}>
                            <ListItemIcon className={classes.listItemIcon}>
                                <PostAddIcon fontSize={'medium'}/>
                            </ListItemIcon>
                            <ListItemText primary='יצירת משימה' className={classes.listItemText} disableTypography={true}/>
                        </ListItem>
                        <ListItem button={true} className={classes.listItem}>
                            <ListItemIcon className={classes.listItemIcon}>
                                <QueueIcon fontSize={'medium'}/>
                            </ListItemIcon>
                            <ListItemText primary='יצירת תקלה' className={classes.listItemText} disableTypography={true}/>
                        </ListItem>
                        <ListItem button={true} className={classes.listItem}>
                            <ListItemIcon className={classes.listItemIcon}>
                                <NoteAddOutlinedIcon fontSize={'medium'}/>
                            </ListItemIcon>
                            <ListItemText primary='הוספת מסמך' className={classes.listItemText} disableTypography={true}/>
                        </ListItem>
                    </List>  
                </div>
            </Grow>
        </ClickAwayListener>
        
        
    )
}

const useStyles = makeStyles(theme => ({
    addMenuContainer: {
        zIndex: 2,
        width: '240px',
        background: theme.palette.primary.main,
        boxShadow: 'rgba(0,0,0,0.25) 0px 0px 6px 3px',
        position: 'absolute',
        top: '80px',
        right: '2%',
        borderRadius: '10px',
        [theme.breakpoints.down('sm')]: {
            maxHeight: '70vh',
            overflow: 'scroll'
        }

    },
    list: {
        width: '90%',
        margin: '0px auto'
    },
    listItem: {
        color: 'theme.palette.primary.main',
        margin: '7px auto',
        borderRadius: '10px',
        boxShadow: 'rgba(0,0,0,0.3) 1px 1px 4px 1px',
        transition: 'background box-shadow 0.3s ease-in-out',
        '&:hover': {
            background: 'black',
            transition: 'background box-shadow 0.2s ease-in-out',
            boxShadow: '0 8px 32px 0 rgb(0 0 0 / 80%)',
        }
    }, 
    listItemIcon: {
        color: 'white'
    },
    listItemText: {     
        fontSize: '14px',
        color: 'white'
        
    },
    bottomList: {
        padding: '10px 0'
    }

}));