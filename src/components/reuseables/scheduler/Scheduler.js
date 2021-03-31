import {
	Backdrop,
	Button,
	Fade,
	Grid,
	makeStyles,
	Modal,
	Paper,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../../context/LanguageContext';
import { ScheduleItem } from './ScheduleItem';
import clsx from 'clsx';
import { AuthContext } from '../../../context/AuthContext';

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

export const Scheduler = ({ scData, handleSave, handleClose }) => {
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);
	const { t } = useTranslation();
	const { auth } = useContext(AuthContext);
	const [schedules, setSchedules] = useState([
		{
			tenant: auth.user.tenant,
			createdBy: auth.user._id,
			startDate: '',
			interval: '',
			intervalNumber: 1
		},
	]);

	useEffect(() => {
		setSchedules(scData)
	}, [scData])

	const updateSchedules = async (data, index) => {
		let scs = [...schedules];
		scs[index] = data;
		setSchedules(scs);
	};

	const removeSchedule = (index) => (event) => {
		let scs = schedules.filter((s, i) => s._id !== index && index !== i);
		setSchedules(scs);
	};

	const handleAddSchedule = () => {
		setSchedules([
			...schedules,
			{
				tenant: auth.user.tenant,
				createdBy: auth.user._id,
				startDate: '',
				interval: '',
				intervalNumber: 1
			},
		]);
	};

	const handleConfirm = async () => {
		console.log(schedules)
		await handleSave(schedules);
		handleClose();
	}

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
					className={classes.gridCont}
				>
					<Grid item xs={12} sm={9} md={6} lg={6} xl={4}>
						<Paper
							elevation={6}
							className={classes.paper}
							style={{ direction: lang.dir }}
						>
							<Grid container>
								<Grid
									item
									xs={12}
									className={classes.headerRow}
								>
									<div className={classes.title}>
										{t('tasksModule.upsert.scheduleTitle')}
										<div
											className={
												classes.notificationsInstructions
											}
										>
											{t(
												'tasksModule.upsert.notificationsInstructions'
											)}
										</div>
									</div>
								</Grid>

							
									{
									schedules.length ? 
									schedules.map((sc, i) => (
										<Grid
											item
											xs={12}
											className={
												classes.scheduleContainer
											}
											key={i}
										>
											<ScheduleItem
												scData={sc}
												updateSchedules={
													updateSchedules
												}
												removeSchedule={removeSchedule}
												index={i}
											/>
										</Grid>
									)) :
									<div className={classes.noItems}>
										{t("scheduler.noItems")}
									</div>
								
								}
									<Grid item xs={12}>
										<Button
											className={classes.addBtn}
											startIcon={
												<AddIcon
													className={classes.addIcon}
												/>
											}
											onClick={handleAddSchedule}
										>
											{t(
												'tasksModule.upsert.addScheduling'
											)}
										</Button>
									</Grid>
							

								<Grid item xs={12} className={classes.controls}>
									<Button
										className={clsx(
											classes.control,
											classes.save
										)}
										onClick={handleConfirm}
									>
										{t('controls.confirm')}
									</Button>
									<Button
										className={clsx(
											classes.control,
											classes.cancel
										)}
										onClick={handleClose}
									>
										{t('controls.cancel')}
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
        backdropFilter: 'blur(10px)'   
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
			position: 'absolute',
			top: 0
        },
        '&:focus': {
            outline: 'none'
        }
	},
	headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',      
        borderBottom: '1px solid rgba(255,255,255,0.2)',
    },
    title: {
        color: 'white',
        padding: '20px 10px 10px',
        fontSize: '24px'
    },
	scheduleContainer: {
		border: '1px solid rgba(255,255,255, 0.2)',
		borderRadius: '10px',
		padding: '10px',
		margin: '10px',
		height: 'fit-content',
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
		padding: '8px 30px 8px 15px',
		margin: '10px',
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
		padding: '10px 0',
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
	controls: {
		borderTop: '1px solid rgba(255,255,255,0.2)',
		display: 'flex',
		justifyContent: 'space-between',
		padding: '10px',
		marginTop: '100px'
	},
	control: {
		width: '30%',
		border: '1px solid rgba(255,255,255,0.5)',
		fontSize: '16px',
		margin: '5px',
		padding: '5px 30px',
		borderRadius: '30px',
		color: 'white',
	},
	save: {
		background: 'rgba(0,0,0,0.2)',
		'&:hover': {
			background: 'black',
		},
		'&:disabled': {
			color: 'rgba(255,255,255,0.3)',
		},
	},
	cancel: {
		'&:hover': {
			boxShadow: 'inset rgba(255,255,255,0.3) 0 0 2px 1px',
		},
	},
	noItems: {
		color: 'white',
		padding: '10px 20px',
		borderRadius: '50px',
		margin: '10px',
		background: 'rgba(0,0,0,0.5)'
	}
}));
