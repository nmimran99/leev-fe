import {
    Button,
	Grid,
	IconButton,
	makeStyles,
	MenuItem,
	Select,
	TextField,
} from '@material-ui/core';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../../context/LanguageContext';
import { CustomDateTimePicker } from '../datepickers/CustomDateTimePicker';
import { CustomTimePicker } from '../datepickers/CustomTimePicker';
import { format, addYears, addDays, addWeeks } from 'date-fns';
import clsx from 'clsx';
import { DayOfWeek } from './DayOfWeek'

const days = [
	'sunday',
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
];
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

export const ScheduleItem = ({
	scData,
	updateSchedules,
	index,
	removeSchedule,
}) => {
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);
	const { t } = useTranslation();
    const [schedule, setSchedule] = useState(scData);

	useEffect(() => {
        console.log(schedule)
		updateSchedules(schedule, index);
	}, [schedule]);

	const handleChangeStartDate = (date) => {
		setSchedule({
			...schedule,
			startDate: date,
		});
	};

	const handleChangeTime = (time) => {
		setSchedule({
			...schedule,
			time: time,
		});
	};

	const handleChange = (fieldName, payload) => (event) => {
        console.log(fieldName, payload)
		setSchedule({
			...schedule,
			[fieldName]: payload ? payload : event.target.value,
		});
	};

	const getNextIterationDate = () => {
		if (schedule.interval === 'year') {
			return format(
				addYears(new Date(schedule.startDate), 1),
				lang.dateformat
			);
        }
	};

	return (
		<Grid container className={classes.textContainer}>
			<Grid container className={classes.gridItem}>
				<Grid item xs={4} lg={6} xl={6}>
					<div className={classes.label}>
						{t('scheduler.startDateText')}
					</div>
				</Grid>
				<Grid item xs={8} lg={6} xl={6}>
					<CustomDateTimePicker
						label={t('scheduler.startDate')}
						data={schedule.startDate}
						handleChange={handleChangeStartDate}
					/>
				</Grid>
			</Grid>
			<Grid container className={classes.gridItem}>
				<Grid item xs={4} lg={6} xl={6}>
					<div className={classes.label}>
						{t('scheduler.repeatEvery')}
					</div>
				</Grid>
				<Grid item xs={8} lg={6} xl={6}>
					<Select
						variant={'outlined'}
						value={schedule.interval}
						onChange={handleChange('interval')}
						className={classes.selectInput}
						MenuProps={{
							anchorOrigin: {
								vertical: 'bottom',
								horizontal: 'center',
							},
							transformOrigin: {
								vertical: 'top',
								horizontal: 'center',
							},

							classes: {
								paper: classes.menupaper,
							},
						}}
					>
						{intervals.map((interval, i) => (
							<MenuItem
								key={i}
								value={interval}
								style={{
									direction: lang.dir,
								}}
								className={classes.menuitem}
							>
								{t(`dates.${interval}`)}
							</MenuItem>
						))}
					</Select>
				</Grid>
			</Grid>
			{schedule.interval === 'year' && (
				<Grid item xs={12}>
					<div className={classes.nextIteration}>
						{`${t(
							'scheduler.nextIteration'
						)} ${getNextIterationDate()}`}
					</div>
				</Grid>
			)}
			{schedule.interval === 'day' && (
				<Grid container className={classes.gridItem}>
					<Grid item xs={4} lg={6} xl={6}>
						<div className={classes.label}>
							{t('scheduler.inTime')}
						</div>
					</Grid>
					<Grid item xs={8} lg={6} xl={6}>
						<CustomTimePicker
							data={schedule.time}
							handleChange={handleChangeTime}
						/>
					</Grid>
				</Grid>
			)}
			{schedule.interval === 'week' && (
				<Grid container className={classes.gridItem}>
					<Grid item xs={4} md={3} lg={3} xl={3}>
						<div
							className={classes.label}
							onClick={handleChange('')}
						>
							{t('scheduler.inDay')}
						</div>
					</Grid>
					<Grid item xs={8} md={9} lg={9} xl={9}>
						<div className={classes.dayContainer}>
							{days.map((d, i) => (
								<DayOfWeek 
                                    day={d}
                                    handleClick={handleChange('day', i+1)}
                                    isChecked={schedule.day === i+1}
                                />
							))}
						</div>
					</Grid>
				</Grid>
			)}
			<Grid item xs={12} className={classes.remove}>
				<IconButton
					className={classes.iconBtn}
					onClick={removeSchedule(index)}
				>
					<DeleteOutlineRoundedIcon className={classes.icon} />
				</IconButton>
			</Grid>
		</Grid>
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
		padding: '10px',
	},
	label: {
		color: 'white',
		padding: '0 10px',
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
	gridItem: {
		display: 'flex',
		alignItems: 'center',
		padding: '5px 10px',
		[theme.breakpoints.down('sm')]: {
			padding: '5px',
		},
	},
	nextIteration: {
		padding: '10px 20px',
		color: 'rgba(255,255,255,0.5)',
		fontSize: '16px',
		textAlign: 'right',
	},
	remove: {
		display: 'flex',
		justifyContent: 'flex-end',
		margin: '10px',
	},
	dayContainer: {
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		color: 'white',
		fontSize: '14px',
	},
	day: {
		display: 'grid',
		placeItems: 'center',
		background: 'rgba(0,0,0,0.3)',
		border: '1px solid rgba(255,255,255,0.2)',
		borderRadius: '50px',
		height: '30px',
		width: '30px',
		margin: '0 3px',
		cursor: 'pointer',
		'&:hover': {
			background: 'rgba(255,255,255,0.4)',
		},
	},
	dayChosen: {
		background: 'white',
		color: 'black',
	},
}));
