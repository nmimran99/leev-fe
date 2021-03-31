import {
	ClickAwayListener,
	Grow,
	IconButton,
	makeStyles,
	useMediaQuery,
} from '@material-ui/core';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import { differenceInHours } from 'date-fns';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { updateArrayStateField } from '../../../api/genericApi';
import { updateNotificationRead } from '../../../api/notificationsApi';
import { NotificationsContext } from '../../../context/NotificationsContext';
import { Notification } from './Notiofication';

export const Notifications = ({
	open,
	toggleNotifications,
	setNotificationPage
}) => {
	const classes = useStyles();
	const { t, i18n } = useTranslation();
	const { notifications, setNotifications } = useContext(
		NotificationsContext
	);
	const matches = useMediaQuery((theme) => theme.breakpoints.up('sm'));

	const updateNotificationReadStatus = async (notificationId, read) => {
		const res = await updateNotificationRead(notificationId, read);
		if (res) {
			let nt = await updateArrayStateField(
				notifications,
				notificationId,
				'read',
				read
			);
			setNotifications([...nt]);
		}
	};

	return (
		<ClickAwayListener onClickAway={toggleNotifications}>
			<Grow in={open}>
				<div className={classes.container}>
					<div className={classes.header}>
						<div>{t('notificationsModule.notifications')}</div>
						<IconButton onClick={toggleNotifications}>
							<ClearRoundedIcon className={classes.icon} />
						</IconButton>
					</div>
					<div className={classes.list} onClick={toggleNotifications}>
						<React.Fragment>
							<div className={classes.subheader}>
								{t('notificationsModule.new')}
							</div>
							{notifications
								.filter(
									(n) =>
										differenceInHours(
											new Date(),
											new Date(n.createdAt)
										) < 6
								)
								.map((n, i) => (
									<Notification
										data={n}
										key={i}
										updateNotificationReadStatus={
											updateNotificationReadStatus
										}
									/>
								))}
							<div className={classes.subheader}>
								{t('notificationsModule.earlier')}
							</div>
							{notifications
								.filter(
									(n) =>
										differenceInHours(
											new Date(),
											new Date(n.createdAt)
										) > 6
								)
								.map((n, i) => (
									<Notification
										data={n}
										key={i}
										updateNotificationReadStatus={
											updateNotificationReadStatus
										}
									/>
								))}
						</React.Fragment>
					</div>
				</div>
			</Grow>
		</ClickAwayListener>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		zIndex: 2,
		width: '360px',
		background: theme.palette.primary.main,
		border: '1px solid rgba(255,255,255,0.2)',
		backdropFilter: 'blur(10px)',
		boxShadow: 'rgba(0,0,0,0.25) 0px 0px 6px 3px',
		position: 'absolute',
		borderRadius: '10px',
		top: '70px',
		right: '1%',
		borderRadius: '10px',
		height: 'fit-content',
		maxHeight: '80vh',
		[theme.breakpoints.down('sm')]: {
			width: '100%',
			right: '0',
			maxHeight: '80vh',
			border: 'none',
			top: 0,
			borderRadius: 0,
		},
	},
	list: {
		width: '100%',
		margin: '0px auto',
		padding: 0,
		margin: 0,
		overflow: 'overlay',
		borderRadius: '0 0 10px 10px',
		height: '70vh',
		[theme.breakpoints.down('sm')]: {
			maxHeight: '80vh',
			marginBottom: '50px',
		},
	},
	listItem: {
		height: '100px',
		color: 'theme.palette.primary.main',
		transition: 'background box-shadow 0.3s ease-in-out',
		'&:hover': {
			background: 'rgba(0,0,0,0.6)',
			transition: 'background box-shadow 0.2s ease-in-out',
			boxShadow: '0 8px 32px 0 rgb(0 0 0 / 80%)',
		},
	},
	listItemIcon: {
		color: 'white',
	},
	listItemText: {
		fontSize: '14px',
		color: 'white',
	},
	bottomList: {
		padding: '10px 0',
	},
	header: {
		height: '40px',
		color: 'white',
		display: 'flex',
		fontSize: '22px',
		alignItems: 'center',
		borderBottom: '1px solid rgba(255,255,255,0.2)',
		padding: '10px 20px',
		justifyContent: 'space-between',
		borderRadius: '10px 10px 0 0',
	},
	icon: {
		color: 'white',
	},
	subheader: {
		color: 'white',
		width: 'fit-content',
		margin: '10px 20px 5px',
		fontSize: '18px',
		borderBottom: '1px solid rgba(255,255,255,0.5)',
	},
}));
