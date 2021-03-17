import React, { useState, useEffect, useContext } from 'react';
import {
	makeStyles,
	Grid,
	Select,
	Button,
	MenuItem,
	IconButton,
	Collapse,
	TextField,
	Modal,
	Fade,
	Backdrop,
	Paper,
} from '@material-ui/core';
import { LanguageContext } from '../../../context/LanguageContext';
import AddIcon from '@material-ui/icons/Add';
import { useTranslation } from 'react-i18next';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import heLocale from 'date-fns/locale/he';
import { updateArrayStateField } from '../../../api/genericApi';
import { ScheduleItem } from './ScheduleItem';

const intervals = ['day', 'week', 'month', 'year', 'date'];
const months = [
	'january',
	'february',
	'march',
	'april',
	'may',
	'june',
	'july',
	'august',
	'september',
	'october',
	'november',
	'december',
];

export const Scheduler = ({
	scData,
	addScheduling,
	removeScheduling,
	changeSchedule,
	handleClose,
	parent,
}) => {
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);
	const { t } = useTranslation();
	const [schedules, setSchedules] = useState([
		{
			startDate: '',
			interval: '',
			day: null,
			month: null,
			time: '',
			nextDate: '',
		},
	]);

	const updateSchedules = async (data, index) => {
		let scs = [...schedules];
		scs[index] = data;
		setSchedules(scs);
	};

	const removeSchedule = (index) => event => {
		let scs = schedules.filter((s, i) => s._id !== index || index !== i);
		setSchedules(scs);
	};

	return (
		<Modal
			open={true}
			onClose={handleClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
			className={classes.modal}
		>
			<Fade in={true}>
				<Grid
					container
					justify="center"
					alignItems="center"
					style={{ outline: '0' }}
				>
					<Grid item xs={12} sm={9} md={6} lg={6} xl={4}>

					
					<Paper
						elevation={6}
						className={classes.paper}
						style={{ direction: lang.dir }}
					>
						<Grid container>
							<Grid item xs={12}>
								<div
									className={
										classes.notificationsInstructions
									}
								>
									{t(
										'tasksModule.upsert.notificationsInstructions'
									)}
								</div>
							</Grid>
							{schedules.map((sc, i) => (
								<Grid
									item
									xs={12}
									className={classes.scheduleContainer}
									key={i}
								>
									<ScheduleItem
										scData={sc}
										updateSchedules={updateSchedules}
										removeSchedule={removeSchedule}
										index={i}
									/>
								</Grid>
							))}
							<Grid item xs={12}>
								<Button
									className={classes.addBtn}
									startIcon={
										<AddIcon className={classes.addIcon} />
									}
									onClick={addScheduling}
								>
									{t('tasksModule.upsert.addScheduling')}
								</Button>
							</Grid>
						</Grid>
					</Paper>
					</Grid>
				</Grid>
			</Fade>
		</Modal>
	);
};

const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backdropFilter: 'blur(10px)',
		outline: 'none !important',
	},
	paper: {
		background: 'rgba(0,0,0,0.4)',
		border: '1px solid rgba(255,255,255,0.2)',
		borderRadius: '10px',
		padding: '10px 20px',
		overflowY: 'overlay',
		height: '80vh',
		[theme.breakpoints.down('sm')]: {
			height: '81vh',
			borderRadius: '0',
			border: '0',
			padding: '10px 5px',
		},
		'&:focus': {
			outline: 'none',
		},
	},
	scheduleContainer: {
		border: '1px solid rgba(255,255,255, 0.2)',
		borderRadius: '10px',
		padding: '10px',
		margin: '10px',
	},
	textContainer: {
		padding: '5px',
		display: 'flex',
		alignItems: 'center',
	},
	selectInput: {
		width: '100%',
		'& fieldset': {
			borderRadius: '5px',
		},
	},
	menupaper: {
		background: 'rgba(0,0,0,0.8)',
		backdropFilter: 'blur(10px)',
		height: '200px',
		overflowY: 'auto',
		border: '1px solid rgba(255,255,255,0.2)',
		marginRight: '7px',
		marginLeft: '-5px',
	},
	menuitem: {
		color: 'white',
		width: '100%',
		'&:hover': {
			background: 'rgba(255,255,255,0.1)',
		},
	},
	addBtn: {
		color: 'rgba(255,255,255,0.6)',
		fontSize: '16px',
		border: '1px solid rgba(255,255,255,0.6)',
		borderRadius: '50px',
		padding: '5px 30px 5px 15px',
		margin: '5px',
		whiteSpace: 'nowrap',
		'&:hover': {
			background: 'rgba(255,255,255,0.8)',
			color: 'rgba(0,0,0,0.8)',
		},
	},
	iconBtn: {
		color: 'rgba(255,255,255,0.6)',
		fontSize: '16px',
		border: '1px solid rgba(255,255,255,0.6)',
		borderRadius: '50px',
		padding: '10px',
		margin: '0 10px',
		'&:hover': {
			background: 'rgba(255,255,255,0.8)',
			color: 'rgba(0,0,0,0.8)',
		},
	},
	notificationsInstructions: {
		color: 'rgba(255,255,255,0.6)',
		fontSize: '12px',
		marginBottom: '10px',
	},
	repeatLabel: {
		color: 'white',
	},
	textField: {
		width: '100%',
		'& fieldset': {
			borderRadius: '5px',
		},
	},
	textField: {
		width: '100%',
		'& fieldset': {
			borderRadius: '5px',
		},
	},
}));
