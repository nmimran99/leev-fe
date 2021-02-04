import React from 'react'
import { makeStyles, List, ListItem, ListItemIcon, ListItemText, Grow, ClickAwayListener, useMediaQuery } from '@material-ui/core'
import BusinessRoundedIcon from '@material-ui/icons/BusinessRounded';
import AssignmentRoundedIcon from '@material-ui/icons/AssignmentRounded';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import DescriptionRoundedIcon from '@material-ui/icons/DescriptionRounded';
import BlurOnRoundedIcon from '@material-ui/icons/BlurOnRounded';
import { UserItem } from '../../user/UserItem'
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import SettingsIcon from '@material-ui/icons/Settings';
import { useHistory } from 'react-router-dom'; 

export const SideMenu = ({toggleMenu}) => {

    const classes = useStyles();
    const history = useHistory();
    const matches = useMediaQuery(theme => theme.breakpoints.up('sm'));

    const closeMenu = () => {
        if (matches) {
            toggleMenu()
        }
    }
    
    const handleClick = type => event => {
        toggleMenu();
        history.push(`/workspace/${type}`)
    }

    return (
        <ClickAwayListener onClickAway={closeMenu}>
            <Grow in={true}>
                <div className={classes.sidemenuContainer}>
                    <div className={classes.userContainer}>   
                        <UserItem showTitle/>
                    </div>
                    <List className= { classes.list}>
                        <ListItem button={true} className={classes.listItem}
                            onClick={handleClick('assets')}
                        >
                            <ListItemIcon className={classes.listItemIcon}>
                                <BusinessRoundedIcon fontSize={'medium'} className={classes.icon}/>
                            </ListItemIcon>
                            <ListItemText primary='נכסים' className={classes.listItemText} disableTypography={true}/>
                        </ListItem>
                        <ListItem button={true} className={classes.listItem}
                            onClick={handleClick('systems')}
                        >
                            <ListItemIcon className={classes.listItemIcon}>
                                <BlurOnRoundedIcon fontSize={'medium'} className={classes.icon}/>
                            </ListItemIcon>
                            <ListItemText primary='מערכות' className={classes.listItemText} disableTypography={true}/>
                        </ListItem>
                        <ListItem button={true} className={classes.listItem}
                            onClick={handleClick('tasks')}
                        >
                            <ListItemIcon className={classes.listItemIcon}>
                                <AssignmentRoundedIcon fontSize={'medium'}/>
                            </ListItemIcon>
                            <ListItemText primary='המשימות שלי' className={classes.listItemText} disableTypography={true}/>
                        </ListItem>
                        <ListItem button={true} className={classes.listItem}
                            onClick={handleClick('faults')}
                        >
                            <ListItemIcon className={classes.listItemIcon}>
                                <WarningRoundedIcon fontSize={'medium'}/>
                            </ListItemIcon>
                            <ListItemText primary='תקלות' className={classes.listItemText} disableTypography={true}/>
                        </ListItem>
                        <ListItem button={true} className={classes.listItem}
                            onClick={handleClick('docs')}
                        >
                            <ListItemIcon className={classes.listItemIcon}>
                                <DescriptionRoundedIcon fontSize={'medium'}/>
                            </ListItemIcon>
                            <ListItemText primary='מסמכים' className={classes.listItemText} disableTypography={true}/>
                        </ListItem>
                    </List>
                    <List className={classes.bottomList}>
                        <ListItem button={true} >
                            <ListItemIcon className={classes.listItemIcon}>
                                <SettingsIcon fontSize={'medium'} />
                            </ListItemIcon>
                            <ListItemText primary='הגדרות' className={classes.listItemText} disableTypography={true}/>
                        </ListItem>
                        <ListItem button={true} >
                            <ListItemIcon className={classes.listItemIcon}>
                                <ExitToAppRoundedIcon fontSize={'medium'} />
                            </ListItemIcon>
                            <ListItemText primary='התנתק' className={classes.listItemText} disableTypography={true}/>
                        </ListItem>
                    </List>
                </div>
            </Grow>
        </ClickAwayListener>
        
        
    )
}

const useStyles = makeStyles(theme => ({
    userContainer: {
        width: '85%',
        margin: '20px auto',
        padding: '15px 10px',
        borderRadius: '10px',
        boxShadow: '0 8px 32px 0 rgb(0 0 0 / 37%)',
        '&:hover' :{
            background: 'black',
            transition: 'background 0.2s ease',
            boxShadow: '0 8px 32px 0 rgb(0 0 0 / 80%)',
        }
    },
    sidemenuContainer: {
        zIndex: 2,
        width: '300px',
        background: theme.palette.primary.main,
        boxShadow: 'rgba(0,0,0,0.25) 0px 0px 6px 3px',
        position: 'absolute',
        top: '80px',
        left: '10px',
        borderRadius: '10px',
        [theme.breakpoints.down('sm')]: {
            maxHeight: '70vh',
            overflow: 'scroll'
        }

    },
    list: {
        width: '90%',
        borderTop: '1px solid rgba(255,255,255,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.3)',
        margin: '0px auto',
        padding: '20px 0'
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