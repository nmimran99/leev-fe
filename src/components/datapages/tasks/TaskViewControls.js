import {
	MenuItem,
	makeStyles,
	IconButton,
	ListItemIcon,
	Menu,
	Fade,
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import TransferWithinAStationRoundedIcon from '@material-ui/icons/TransferWithinAStationRounded';
import AccessAlarmRoundedIcon from '@material-ui/icons/AccessAlarmRounded';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { LanguageContext } from '../../../context/LanguageContext';
import clsx from 'clsx';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { Can } from '../../reuseables/Can';

export const TaskViewControls = ({
	task,
	editTask,
	updateOwner,
	changeStatus,
	handleScheduler,
}) => {
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);
	const { t, i18n } = useTranslation();
	const [expanded, setExpanded] = useState(null);
	const [data, setData] = useState(task);

	useEffect(() => {
		setData(task);
		console.log(task);
	}, [task]);

	const openInNewWindow = () => {
		window.open(`http://localhost:3000/workspace/tasks/${task.taskId}`);
	};

	const handleExpanded = (event) => {
		if (expanded) {
			setExpanded(null);
		}
		setExpanded(event.currentTarget);
	};

	return (
		<div>
			<IconButton className={classes.expandIcon} onClick={handleExpanded}>
				<MoreVertIcon className={classes.icon} />
			</IconButton>
			<Menu
				onClick={() => setExpanded(null)}
				className={classes.container}
				anchorEl={expanded}
				open={Boolean(expanded)}
				onClose={() => setExpanded(null)}
				classes={{
					paper: classes.menu,
				}}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
			>
				<div
					style={{
						direction: lang.code === 'he' ? 'rtl' : 'ltr',
					}}
					className={classes.menuHeader}
				>
					{t('tasksModule.controls.taskMenu')}
					<IconButton
						style={{ display: 'flex', justifyContent: 'flex-end' }}
						onClick={() => setExpanded(null)}
						className={classes.close}
					>
						<CloseRoundedIcon className={classes.icon} />
					</IconButton>
				</div>
				<MenuItem
					style={{ direction: lang.code === 'he' ? 'rtl' : 'ltr' }}
					className={classes.iconBtn}
					onClick={openInNewWindow}
				>
					<ListItemIcon>
						<OpenInNewIcon className={classes.icon} />
					</ListItemIcon>
					{t('general.openInNew')}
				</MenuItem>
				<Can
					module="tasks"
					action="update"
					userList={[
						...data.relatedUsers.map((u) => u._id),
						data.owner._id,
					]}
				>
					<MenuItem
						style={{
							direction: lang.code === 'he' ? 'rtl' : 'ltr',
						}}
						className={classes.iconBtn}
						onClick={editTask}
					>
						<ListItemIcon>
							<CreateIcon className={classes.icon} />
						</ListItemIcon>
						{t('tasksModule.controls.editDetails')}
					</MenuItem>
				</Can>

				<Can
					module="tasks"
					action="changeOwner"
					userList={[
						...data.relatedUsers.map((u) => u._id),
						data.owner._id,
					]}
				>
					<MenuItem
						style={{
							direction: lang.code === 'he' ? 'rtl' : 'ltr',
						}}
						className={classes.iconBtn}
						onClick={updateOwner}
					>
						<ListItemIcon>
							<TransferWithinAStationRoundedIcon
								className={classes.icon}
							/>
						</ListItemIcon>
						{t('tasksModule.controls.changeOwner')}
					</MenuItem>
				</Can>

				<Can
					module="tasks"
					action="changeStatus"
					userList={[
						...data.relatedUsers.map((u) => u._id),
						data.owner._id,
					]}
				>
					<MenuItem
						style={{
							direction: lang.code === 'he' ? 'rtl' : 'ltr',
						}}
						className={classes.iconBtn}
						onClick={changeStatus}
					>
						<ListItemIcon>
							<DoubleArrowIcon className={classes.icon} />
						</ListItemIcon>
						{t('tasksModule.controls.changeStatus')}
					</MenuItem>
				</Can>

				<Can
					module="tasks"
					action="changeSchedule"
					userList={[
						...data.relatedUsers.map((u) => u._id),
						data.owner._id,
					]}
				>
					<MenuItem
						style={{
							direction: lang.code === 'he' ? 'rtl' : 'ltr',
						}}
						className={classes.iconBtn}
						onClick={handleScheduler}
					>
						<ListItemIcon>
							<AccessAlarmRoundedIcon className={classes.icon} />
						</ListItemIcon>
						{t('tasksModule.controls.schedule')}
					</MenuItem>
				</Can>
			</Menu>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		display: 'flex',
	},
	expandIcon: {
		color: 'white',
		background: 'rgba(0,0,0,0.3)',
		'&:hover': {
			background: 'rgba(0,0,0,0.5)',
		},
	},
	iconBtn: {
		color: 'white',
		marginRight: '20px',
		borderRadius: '0 25px 25px 0',
		'&:hover': {
			transform: 'scale(1.077)',
		},
	},
	icon: {
		fontSize: '20px',
		color: 'white',
	},
	menu: {
		background: 'rgba(0,0,0,0.7)',
		backdropFilter: 'blur(10px)',
		color: 'white',
		boxShadow: 'rgba(0,0,0,0.4) 0 0 2px 1px',
		borderRadius: '10px',
	},
	menuitem: {
		minWidth: '200px',
	},
	menuHeader: {
		borderBottom: '1px solid rgba(255,255,255,0.2)',
		marginBottom: '10px',
		display: 'flex',
		justifyContent: 'space-between',
		padding: '5px 10px 5px 20px',
		alignItems: 'center',
		outline: 'none',
	},
	close: {
		padding: '6px',
		margin: 0,
	},
}));
