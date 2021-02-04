import React from 'react';
import clsx from 'clsx';
import { makeStyles, AppBar, IconButton, Grid, Badge } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles'
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';
import AddIcon from '@material-ui/icons/Add';

export const Navbar = ({ toggleMenu, menuOpen, toggleAddMenu}) => {

    const classes = useStyles();
    
    const StyledBadge = withStyles((theme) => ({
        badge: {
          left: 15,
          top: 15,
          border: `0px solid white`,
          fontSize: '0.7rem',
          minWidth: '18px',
          height: '18px'
        },
      }))(Badge);

    return (
        <AppBar
            position='fixed'
            className={classes.navbar}
        >
            <Grid container alignItems='center' justify='space-between' style={{ height: '64px'}}>
                {

                    <Grid item>
                        <IconButton 
                            aria-label='menu'
                            className={classes.iconButton}
                            color='inherit'
                            onClick={toggleMenu}
                        >
                            {
                                !menuOpen ?
                                <MenuRoundedIcon  className={clsx(classes.icon, classes.menuButton)}/> :
                                <ArrowForwardRoundedIcon className={clsx(classes.icon,  classes.menuButton)}/>
                            }   
                        </IconButton>
                    </Grid>
                }
                <Grid item >
                    <div className={classes.logobox}>
                        Leev
                    </div>
                </Grid>
                <Grid item >
                    <div className={classes.navbarIcons}>
                        <IconButton
                            aria-label='Add'
                            className={classes.iconButton}
                            color={'inherit'}
                            onClick={toggleAddMenu}
                        >
                            <AddIcon className={classes.icon}/>
                        </IconButton>
                        <IconButton
                            aria-label='Notifications'
                            className={classes.iconButton}
                            color='inherit'

                        >
                            <StyledBadge 
                                badgeContent={15} 
                                color="secondary"
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left'
                                }}
                            >
                                <NotificationsNoneOutlinedIcon className={classes.icon}/>
                            </StyledBadge>  
                        </IconButton>
                    </div>
                </Grid>
                
            </Grid> 
        </AppBar>
    )
}

const useStyles = makeStyles(theme => ({
    logobox: {
        fontSize: '28px',
        color: 'white',
        fontFamily: 'Crete'     
    },
    navbar: {
        
        height: '64px',
        background: theme.palette.primary.main,
        
        padding: `0 ${theme.spacing(1)}px`
    },
    menuButton: {
        
    },
    navbarIcons: {
        display: 'flex',
        justifyContent: 'space-between',
        width: 'auto'
    },
    drawer: {
        height: 'calc(100vh - 128px)',
        width: '240px',
        flexShrink: 0,
        whiteSpace: 'nowrap',
        marginTop: '128px',
        background: 'transparent',
        [theme.breakpoints.down('md')]: {
            width: '60%'
        }
    },
    drawerOpen: {
        height: 'calc(100vh - 128px)',
        width: '240px',
        [theme.breakpoints.down('md')]: {
            width: '60%'
        },
        
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    iconButton: {
        padding: '6px'
    },
    icon: {
        fontSize: '28px',
        padding: '12px',
        borderRadius: '50px',
        [theme.breakpoints.up('md')]: {
            '&:hover': {
                background: 'rgba(0,0,0,0.5)'
            }
        }
    },
    
}))