import { Grid, makeStyles } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router';
import { getNotifications } from '../../api/notificationsApi';
import { NotificationsContext } from '../../context/NotificationsContext';
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
	const [ menuOpen, setMenuOpen ] = useState(false);
	const [ addMenuOpen, setAddMenuOpen ] = useState(false);
	const [ create, setCreate ] = useState(null);
	const [ notificationsList, setNotificationsList ] = useState(false);
	const [ settings, setSettings ] = useState(false);

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
			setMenuOpen(true);
		}
	};

	const toggleAddMenu = () => {
		if (addMenuOpen) {
			setAddMenuOpen(false);
		} else {
			setAddMenuOpen(true);
		}
	};

	const toggleMapView = () => {
		history.push('/workspace/map?lat=32.063603&lng=34.785933');
	};
	const openCreate = (itemType) => (event) => {
		toggleAddMenu();
		setCreate(itemType);
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

	return (
		<React.Fragment>
			<Grid container className={classes.controlsContainer} justify="center">
				<Grid item xs={12}>
					<Navbar
						toggleMenu={toggleMenu}
						menuOpen={menuOpen}
						toggleAddMenu={toggleAddMenu}
						toggleNotifications={toggleNotifications}
						toggleMapView={toggleMapView}
						
					/>
				</Grid>
			</Grid>
			{menuOpen && <SideMenu toggleMenu={toggleMenu} toggleSettings={toggleSettings} />}
			{addMenuOpen && <AddMenu toggleAddMenu={toggleAddMenu} toggleAdd={openCreate} />}
			{notificationsList && (
				<Notifications
					open={notificationsList}
					toggleNotifications={toggleNotifications}
					fetchNotifications={fetchNotifications}
				/>
			)}
			{Boolean(create) && <CreateContainer isOpen={true} handleClose={() => setCreate(null)} itemType={create} />}
			{Boolean(settings) && <Settings handleClose={() => setSettings(false)} open={settings} />}
		</React.Fragment>
	);
};

const useStyles = makeStyles((theme) => ({
	controlsContainer: {
		zIndex: 2,
		height: '64px',
	},
}));
