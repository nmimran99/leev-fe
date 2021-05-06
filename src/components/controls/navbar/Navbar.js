import React, { useState, useContext, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, AppBar, IconButton, Grid, Badge, Icon } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';
import AddIcon from '@material-ui/icons/Add';
import { NotificationsContext } from '../../../context/NotificationsContext';
import { differenceInHours } from 'date-fns'
import MapOutlinedIcon from '@material-ui/icons/MapOutlined';
import { useLocation } from 'react-router';
import notificationIcon from '../../../assets/icons/notification.svg';
import plusIcon from '../../../assets/icons/plus28.svg';
import mapIcon from '../../../assets/icons/map28.svg';
import menuIcon from '../../../assets/icons/menu.svg';


export const Navbar = ({ toggleMenu, menuOpen, toggleAddMenu, toggleMapView, toggleNotifications }) => {
	const classes = useStyles();
	const location = useLocation();
	const { notifications } = useContext(NotificationsContext);
	const [ notifCount, setNotifCount ] = useState(0);
	const [ mapActive, setMapActive ] = useState(location.pathname.includes('map'))

	useEffect(() => {
		setMapActive(location.pathname.includes('map'))
	}, [location])

	useEffect(() => {
		let count = notifications
		.filter(
			(n) =>
				differenceInHours(
					new Date(),
					new Date(n.createdAt)
				) < 6 && !n.read
		).length;
		setNotifCount(count);
	}, [notifications])


	return (
		<AppBar className={classes.navbar}>
			<Grid
				container
				alignItems="center"
				justify="space-between"
				style={{ height: '64px' }}
			>
				{
					<Grid item className={classes.menuGridItem}>
						<IconButton
							aria-label="menu"
							className={classes.iconButton}
							color="inherit"
							onClick={toggleMenu}
						>
							<Icon classes={{root: classes.iconRoot}}>
								<img src="https://img.icons8.com/ios-filled/24/4a90e2/thumbnail-view.png"/>
							</Icon>	
						</IconButton>
						<div className={classes.logobox}>Leev</div>
					</Grid>
				}
				<Grid item>
					
				</Grid>
				<Grid item>
					<div className={classes.navbarIcons}>
						<IconButton
							aria-label="Add"
							className={classes.iconButton}
							color={'inherit'}
							onClick={toggleMapView}
							disabled={mapActive}
						>
							<Icon classes={{root: classes.iconRoot}}>
							<img src="https://img.icons8.com/ios-filled/24/4a90e2/map.png"/>
								</Icon>	
						</IconButton>
						<IconButton
							aria-label="Add"
							className={classes.iconButton}
							color={'inherit'}
							onClick={toggleAddMenu}
						>
							<Icon classes={{root: classes.iconRoot}}>
							<img src="https://img.icons8.com/ios-filled/28/4a90e2/plus-2-math.png"/>
								</Icon>	
						</IconButton>
						<IconButton
							aria-label="Notifications"
							className={classes.iconButton}
                            color="inherit"
                            onClick={toggleNotifications}
						>
							<Badge
								badgeContent={notifCount}
								color="secondary"
                                classes={{
                                    badge: classes.badge
                                }}
							>
								<Icon classes={{root: classes.iconRoot}}>
								<img src="https://img.icons8.com/ios-filled/24/4a90e2/appointment-reminders--v1.png"/>
								</Icon>	
							</Badge>
						</IconButton>
					</div>
				</Grid>
			</Grid>
		</AppBar>
	);
};

const useStyles = makeStyles((theme) => ({
	logobox: {
		fontSize: '30px',
		color: 'white',
		fontFamily: 'Kaushan',
		padding: '0 10px 5px'
	},
	navbar: {
		height: '64px',
		padding: '0 8px',
		background: 'rgba(0,0,0,0.8)',
		backdropFilter: 'blur(22px)',
		boxShadow: 'rgba(0,0,0,0.4) 0px 0px 5px 2px',
	},
	menuGridItem: {
		display: 'flex',
		alignItems: 'center'
	},
	menuButton: {},
	navbarIcons: {
		display: 'flex',
		justifyContent: 'space-between',
		width: 'auto',
	},
	drawer: {
		height: 'calc(100vh - 128px)',
		width: '240px',
		flexShrink: 0,
		whiteSpace: 'nowrap',
		marginTop: '128px',
		background: 'transparent',
		[theme.breakpoints.down('md')]: {
			width: '60%',
		},
	},
	drawerOpen: {
		height: 'calc(100vh - 128px)',
		width: '240px',
		[theme.breakpoints.down('md')]: {
			width: '60%',
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
		padding: '6px',
	},
	icon: {
		fontSize: '28px',
		padding: '12px',
		borderRadius: '50px',
		[theme.breakpoints.up('md')]: {
			'&:hover': {
				background: 'rgba(0,0,0,0.5)',
			},
		},
	},
	badge: {
		border: `1px solid black`,
        top: '12px',
        right: '12px'
	},
	imageIcon: {
		height: '36px',
		width: '36px'
	},
	iconRoot: {
		textAlign: 'center',
		width: '50px',
		height: '50px',
		display: 'grid',
		placeItems: 'center'
	}
}));
