import {
	makeStyles,
	Grid,
	FormControl,
	Select,
	MenuItem,
	LinearProgress,
	IconButton,
	Button
} from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import React, { useState, useEffect, useContext } from 'react';
import {
	getFullAddress,
	getShortAddress,
	getUnit,
} from '../../../api/assetsApi';
import { LanguageContext } from '../../../context/LanguageContext';
import { FaultMinified } from '../faults/FaultMinified';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import AssignmentRoundedIcon from '@material-ui/icons/AssignmentRounded';
import { TaskMinified } from '../tasks/TaskMinified';

export const MarkerData = ({ markersData, handleClose }) => {
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState(markersData);
	const [faults, setFaults] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [selectedAsset, setSelectedAsset] = useState(data[0].asset._id);
	const [type, setType] = useState(null);
	const [ detailsActive, setDetailsActive ] = useState('faults');

	useEffect(() => {
		if (data.length) {
			if (data.length > 1) {
				let addressList = data.map((md) => getShortAddress(md.asset));
				let unique = addressList.filter(function (value, index, self) {
					return self.indexOf(value) === index;
				});
				if (addressList.length === 1) {
					setType('apt');
				} else if (unique.length > 1) {
					setType('cluster');
				} else if (unique.length !== addressList.length) {
					setType('apts');
				}
				setSelectedAsset(data[0].asset._id);
				return;
			}
			setType('apt');
			setSelectedAsset(data[0].asset._id);
		}
	}, [data]);

	useEffect(() => {
		if (markersData) {
			setData(markersData);
		}
	}, [markersData]);

	useEffect(() => {
		if (selectedAsset) {
			let item = data.find((md) => md.asset._id === selectedAsset);
			if (item) {
				setFaults(item.faults);
				setTasks(item.tasks);
			}
			return;
		}
		setFaults(data[0].faults);
	}, [selectedAsset]);

	const handleChange = (event) => {
		setSelectedAsset(event.target.value);
	};

	const handleClick = type => event => {
		setDetailsActive(type)
	}

	return (
		<div className={classes.container}>
			<div className={classes.topContainer}>
			<IconButton onClick={handleClose} className={classes.closeBtn}>
				<ClearRoundedIcon />
			</IconButton>
			{(data.length === 1 || type === 'apts') && (
				<div className={classes.streetName}>
					{data.length === 1
						? getFullAddress(data[0].asset)
						: getShortAddress(data[0].asset)}
				</div>
			)}
			{data.length > 1 && (
				<div className={classes.selectContainer}>
					<FormControl
						variant="outlined"
						className={classes.textInput}
					>
						<Select
							value={selectedAsset}
							onChange={handleChange}
							className={clsx(classes.menu, 
								type === 'apts'
									? classes.menu
									: classes.menuTitle
							)}
							MenuProps={{
								classes: {
									paper: classes.menupaper,
								},
							}}
							classes={{
								outlined: classes.outlinedSelect
							}}
						>
							{data.map((md, i) => {
								return (
									<MenuItem
										className={classes.menuitem}
										value={md.asset._id}
										key={i}
										style={{
											direction:
												lang.code === 'he'
													? 'rtl'
													: 'ltr',
										}}
									>
										{type === 'apts'
											? getUnit(md.asset)
											: type === 'cluster'
											? getFullAddress(md.asset)
											: null}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</div>
			)}
			<div className={classes.pillContainer}>
				<div onClick={handleClick('faults')} className={clsx(classes.openItems, classes.openFaults, detailsActive === 'faults' && classes.tabActive)}>
					<WarningRoundedIcon className={classes.icon}/>
					{`${ faults.length } ${t("mapModule.openFaults")}`}
				</div>
				<div onClick={handleClick('tasks')} className={clsx(classes.openItems, classes.openTasks, detailsActive === 'tasks' && classes.tabActive)}>
					<AssignmentRoundedIcon className={classes.icon}/>
					{`${ tasks.length } ${t("mapModule.todaysTasks")}`}
				</div>
			</div>
			</div>
			
			{
				detailsActive === 'faults' ? 
				faults.length ? (
					<div className={classes.faultContainer}>
						{faults.map((mdf, i) => {
							return (
								<div className={classes.miniFault}>
									<FaultMinified data={mdf} />
								</div>
							);
						})}
					</div>
				) : (
					<div className={classes.noFaults}>
						{t('mapModule.noFaults')}
					</div>
				)
				: 
				tasks.length ? (
					<div className={classes.taskContainer}>
						{tasks.map((mdf, i) => {
							return (
								<div className={classes.miniTask}>
									<TaskMinified data={mdf} asList={true} />
								</div>
							);
						})}
					</div>
				) : (
					<div className={classes.noFaults}>
						{t('mapModule.noTasks')}
					</div>
				)
			}
			
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		background: 'rgba(0,0,0,0.2)',
		[theme.breakpoints.down('sm')]: {
			width: '100vw'
		}
	},
	topContainer: {
		position: 'relative'
	}, 
	title: {
		fontSize: '16px',
		color: 'white',
		display: 'grid',
		borderRadius: '5px',
		padding: '0',
		margin: '60px 0px 10px',
		width: 'fit-content',
		minWidth: '300px',
		alignItems: 'flex-end',
		background: 'rgb(140, 19, 171)',
		borderRadius: '50px',
	},
	streetName: {
		fontSize: '16px',
		color: 'white',
		display: 'grid',
		borderRadius: '5px',
		padding: '7px 40px 7px 20px',
		margin: '60px 10px 5px',
		width: 'fit-content',
		alignItems: 'flex-end',
		background: 'rgb(140, 19, 171)',
		borderRadius: '50px',
	},
	miniFault: {
		height: '150px',
		padding: '10px',
		border: '1px solid rgba(255,255,255,0.2)',
		background: 'rgba(0,0,0,0.0)',
		margin: '10px',
		borderRadius: '5px'
	},
	miniTask: {
		border: '1px solid rgba(255,255,255,0.2)',
		background: 'rgba(0,0,0,0.0)',
		margin: '10px',
		borderRadius: '5px'
	},
	faultContainer: {
		borderTop: '1px solid rgba(255,255,255,0.2)',
		marginTop: '5px',
		height: 'calc(100% - 140px)',
		overflow: 'overlay'
	},
	taskContainer: {
		borderTop: '1px solid rgba(255,255,255,0.2)',
		marginTop: '5px',
		height: 'calc(100% - 140px)',
		overflow: 'overlay'
	},
	menu: {
		color: 'white',
		height: '40px',
		margin: '5px 50px 5px 10px',
		'&:hover': {
			borderColor: 'white',
		},
	},
	menuTitle: {
		color: 'white',
		margin: '60px 50px 0px 10px',
		height: '33px',
		minWidth: '200px',
		background: 'rgb(140, 19, 171)',
		borderRadius: '50px',
		fontSize: '15px',
		padding: '0',
		lineHeight: 2,
		'&:hover': {
			borderColor: 'white',
		},
	},
	menupaper: {
		background: 'rgba(0,0,0,0.3)',
		backdropFilter: 'blur(10px)',
		border: '1px solid rgba(255,255,255,0.2)',
		maxHeight: '200px',
		overflowY: 'auto',
		marginTop: '60px',
		marginRight: '7px',
	},
	menuitem: {
		color: 'white',
	},
	selectContainer: {
		padding: '0px 0'
	},
	textInput: {
		padding: '0px 0',
		background: 'rgba(0,0,0,0.0)',
		fontSize: '16px',
		width: '100%',
		'& input': {
			color: 'white',
			paddingLeft: '20px',
		},
		'& label': {
			color: 'white',
			paddingLeft: '5px',
		},
		'& fieldset': {
			borderColor: 'rgba(255,255,255,0.6)',
			borderRadius: '42px',
		},
	},
	closeBtn: {
		color: 'white',
		margin: '6px',
		position: 'absolute',
		right: 0,
		zIndex: 3,
		'&:hover': {
			background: 'rgba(0,0,0,0.6)',
		},
	},
	noFaults: {
		color: 'white',
		background: 'rgba(0,0,0,0.8)',
		borderRadius: '50px',
		padding: '10px 20px',
		margin: '10px',
		fontSize: '14px',
		width: 'fit-content'
	},
	openItems: {
		
		color: 'white',
		padding: '5px 20px 5px 10px',
		borderRadius: '50px',
		width: 'fit-content',
		display: 'flex',
		alignItems: 'center',
		margin: '0px 10px 5px 0px',
		fontSize: '13px',
		whiteSpace: 'nowrap',
		opacity: 0.7,
		cursor: 'pointer',
		'&:hover': {
			opacity: 1,
			boxShadow: 'inset rgba(0,0,0,0.4) 0 0 3px 1px'
		}
	},
	openFaults: {
		background: '#F03930',
	},
	openTasks: {
		background: '#6540EB',
	},
	icon: {
		marginRight: '7px',
		fontSize: '18px',
		paddingBottom: '2px'
	},
	pillContainer: {
		display: 'flex',
		padding: '5px 10px'
	},
	tabActive: {
		border: '1px solid white',
		opacity: 1
	},
	outlinedSelect: {
		padding: '10px'
	}
}));
