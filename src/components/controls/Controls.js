import { Grid, makeStyles } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import { getNotifications } from '../../api/notificationsApi';
import { NotificationsContext } from '../../context/NotificationsContext';
import { CreateContainer } from '../reuseables/CreateContainer';
import { AddMenu } from './navbar/AddMenu';
import { Navbar } from './navbar/Navbar';
import { Notifications } from './navbar/Notifications';
import { SideMenu } from './navbar/SideMenu';

export const Controls = () => {
	const classes = useStyles();
	const { notifications, setNotifications } = useContext(NotificationsContext);
	const [menuOpen, setMenuOpen] = useState(false);
	const [addMenuOpen, setAddMenuOpen] = useState(false);
	const [create, setCreate] = useState(null);
	const [notificationsList, setNotificationsList] = useState(false);
	const [notificationPage, setNotificationPage] = useState(0);
	
	useEffect(() => {
        getNotifications(notificationPage)
        .then(data => {
            if (data) {
				setNotifications(notificationPage ? [ ...notifications, ...data ] : data);
            }
        })
    }, [notificationPage])

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

	

	return (
		<React.Fragment>
			<Grid
				container
				className={classes.controlsContainer}
				justify="center"
			>
				<Grid item xs={12}>
					<Navbar
						toggleMenu={toggleMenu}
						menuOpen={menuOpen}
						toggleAddMenu={toggleAddMenu}
						toggleNotifications={toggleNotifications}
					/>
				</Grid>
			</Grid>
			{menuOpen && <SideMenu toggleMenu={toggleMenu} />}
			{addMenuOpen && (
				<AddMenu toggleAddMenu={toggleAddMenu} toggleAdd={openCreate} />
			)}
			{notificationsList && (
				<Notifications
					open={notificationsList}
					toggleNotifications={toggleNotifications}
					setNotificationPage={setNotificationPage}
				/>
			)}
			{Boolean(create) && (
				<CreateContainer
					isOpen={true}
					handleClose={() => setCreate(null)}
					itemType={create}
				/>
			)}
		</React.Fragment>
	);
};

const useStyles = makeStyles((theme) => ({
	controlsContainer: {
		zIndex: 2,
		height: '64px',
	},
}));
