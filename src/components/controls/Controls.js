import { Grid, makeStyles, useMediaQuery } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router';
import { getNotifications } from '../../api/notificationsApi';
import { isResident } from '../../api/userApi';
import { AuthContext } from '../../context/AuthContext';
import { EnvContext } from '../../context/EnvContext';
import { NotificationsContext } from '../../context/NotificationsContext';
import { UpsertContext } from '../../context/UpsertContext';
import { Messenger } from '../messages/Messenger';
import { Can } from '../reuseables/Can';
import { CreateContainer } from '../reuseables/CreateContainer';
import { AddMenu } from './navbar/AddMenu';
import { Navbar } from './navbar/Navbar';
import { Notifications } from './navbar/Notifications';
import { SideMenu } from './navbar/SideMenu';
import { Settings } from './settings/Settings';

export const Controls = () => {
	const classes = useStyles();
	const history = useHistory();
	const location = useLocation();
	const { notifications, setNotifications } = useContext(NotificationsContext);
	const { upsertData, setUpsertData } = useContext(UpsertContext);
	const { auth } = useContext(AuthContext);
	const { env } = useContext(EnvContext);
	const downSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
	const [ menuOpen, setMenuOpen ] = useState(false);
	const [ addMenuOpen, setAddMenuOpen ] = useState(false);
	const [ notificationsList, setNotificationsList ] = useState(false);
	const [ settings, setSettings ] = useState(false);
	const [ messenger, setMessenger ] = useState(false);
	

	useEffect(() => {
		fetchNotifications(0);
	}, []);

	const fetchNotifications = async (notificationPage) => {
		const data = await getNotifications(notificationPage);
		if (data) {
			setNotifications(notificationPage ? [...notifications, ...data] : data);
		}
	};

	const toggleMenu = () => {
		if (menuOpen) {
			setMenuOpen(false);
		} else {
			if (addMenuOpen) {
				setAddMenuOpen(false);
			}
			setMenuOpen(true);
		}
	};

	const toggleAddMenu = () => {
		if (addMenuOpen) {
			setAddMenuOpen(false);
		} else {
			if (menuOpen) {
				setMenuOpen(false);
			}
			setAddMenuOpen(true);
		}
	};

	const toggleMapView = () => {
		history.push('/workspace/map?lat=32.063603&lng=34.785933');
	};

	const toggleCalenderView = () => {
		history.push('/workspace/calender');
	}

	const openCreate = (itemType) => (event) => {
		toggleAddMenu();
		setUpsertData({ itemId: null, module: itemType })
	};

	const toggleNotifications = () => {
		if (notificationsList) {
			setNotificationsList(false);
		} else {
			setNotificationsList(true);
		}
	};

	const toggleSettings = () => {
		if (settings) {
			setSettings(false);
		} else {
			setSettings(true);
		}
	}; 

	const toggleMessenger = () => {
		if (messenger) {
			setMessenger(false);
		} else {
			setMessenger(true);
		}
	}

	return (
		<React.Fragment>
		
				<div container className={classes.controlsContainer} justify="center">	
				<Navbar
					toggleMenu={toggleMenu}
					menuOpen={menuOpen}
					toggleAddMenu={toggleAddMenu}
					toggleNotifications={toggleNotifications}
					toggleMapView={toggleMapView}
					toggleCalenderView={toggleCalenderView}
					toggleMessenger={toggleMessenger}
					
				/>
			</div>
		
			<SideMenu toggleMenu={toggleMenu} toggleSettings={toggleSettings} menuOpen={menuOpen}/>
			<Can shouldRender={!isResident(auth.user)}>
				{addMenuOpen && <AddMenu toggleAddMenu={toggleAddMenu} toggleAdd={openCreate} addMenuOpen={addMenuOpen} />}
			</Can>
			
			{notificationsList && (
				<Notifications
					open={notificationsList}
					toggleNotifications={toggleNotifications}
					fetchNotifications={fetchNotifications}
				/>
			)}
			<Can shouldRender={!isResident(auth.user)}>
				{Boolean(upsertData.module) && <CreateContainer isOpen={true} handleClose={() => setUpsertData({ itemId: null, module: null })} />}
			</Can>
			{Boolean(settings) && <Settings handleClose={() => setSettings(false)} open={settings} />}
			{Boolean(messenger) && <Messenger toggleMessenger={toggleMessenger} />}
		</React.Fragment>
	);
};

const useStyles = makeStyles((theme) => ({
	controlsContainer: {
		zIndex: 2,
		height: '64px',
		backdropFilter: 'blur(22px)',
		width: '100%',
		[theme.breakpoints.down('sm')]: {
			borderRadius: '30px 30px 0 0',
			bottom: '0',
			background: 'black',
			height: '84px',
			boxShadow: '0px 0 2px 0px rgba(255,255,255,0.5)'
		}
	},
}));
