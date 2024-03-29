import React, { useState, useEffect, useContext } from 'react';
import {
	Backdrop,
	Grid,
	IconButton,
	makeStyles,
	Modal,
	Paper,
	useMediaQuery,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
	updateSystemOwner,
	updateSystemAdditionalData,
} from '../../../api/systemsApi';
import { SystemName } from './SystemName';
import { SystemRelatedUsers } from './SystemRelatedUsers';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@material-ui/icons/ExpandLessRounded';
import { SystemControls } from './SystemControls';
import { SystemAdditionalDetails } from './SystemAdditionalDetails';
import { UpsertSystem } from './UpsertSystem';
import { UpdateOwner } from '../../reuseables/UpdateOwner';
import { SnackbarContext } from '../../../context/SnackbarContext';
import { UpsertContext } from '../../../context/UpsertContext';

export const System = ({ systemData }) => {
	const classes = useStyles();
	const { t, i18n } = useTranslation();
	const { setSnackbar } = useContext(SnackbarContext)
	const { setUpsertData } = useContext(UpsertContext);
	const downSm = useMediaQuery((theme) => theme.breakpoints.down('md'));
	const [data, setData] = useState(systemData);
	const [editOwner, setEditOwner] = useState(false);
	const [editName, setEditName] = useState(false);
	const [expanded, setExpanded] = useState(false);
	const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
	const [showLinkedUsers, setShowLinkedUsers] = useState(false);

	useEffect(() => {
		if (!expanded) {
			setShowAdditionalDetails(null);
		}
	}, [expanded]);

	const toggleEditOwner = () => {
		if (editOwner) {
			setEditOwner(false);
			return;
		}
		setShowLinkedUsers(false);
		setEditOwner(true);
	};

	const updateOwner = async (owner) => {
		const res = await updateSystemOwner(data._id, owner);
		if (res.status === 403) {
			setSnackbar(res)
		} else if (res) {
			setData(res);
			setEditOwner(false);
		}
	};

	const setSystemName = (name) => {
		setData({
			...data,
			name,
		});
	};

	const showAdditionalDetailsToggle = () => {
		if (!showAdditionalDetails) {
			setShowAdditionalDetails(true);
			return;
		}
		setShowAdditionalDetails(false);
	};

	const showLinkedUsersToggle = () => {
		if (!showLinkedUsers) {
			setEditOwner(false);
			setShowLinkedUsers(true);
			return;
		}
		setShowLinkedUsers(false);
	};

	const handleExpand = () => {
		if (expanded) {
			setShowLinkedUsers(false);
			setEditOwner(false);
			setExpanded(false);
			return;
		}
		setExpanded(true);
	};

	const toggleEditMode = () => {
		setUpsertData({ itemId: systemData._id, module: 'systems' })
	};

	return (
		<Grid item xs={12} sm={7} md={8} lg={11} xl={11}>
			<Paper elevation={9} className={classes.paper}>
				<Grid container className={classes.mainRow}>
					<Grid
						item
						lg={4}
						className={classes.semiMainRow}
						onClick={handleExpand}
						style={{
							borderBottom: expanded
								? '1px solid rgba(255,255,255,0.2)'
								: 'none',
						}}
					>
						<SystemName
							systemId={data._id}
							editName={editName}
							setEditName={setEditName}
							setSystemName={setSystemName}
							title={data.name}
						/>
						{downSm && !editName ? (
							<IconButton
								className={classes.expandIcon}
								onClick={handleExpand}
							>
								{!expanded ? (
									<ExpandMoreRoundedIcon
										className={classes.userIcon}
									/>
								) : (
									<ExpandLessRoundedIcon
										className={classes.userIcon}
									/>
								)}
							</IconButton>
						) : null}
					</Grid>
					<Grid item lg={8}>
						<SystemControls
							editName={editName}
							expanded={expanded}
							system={data}
							showLinkedUsersToggle={showLinkedUsersToggle}
							toggleEditOwner={toggleEditOwner}
							toggleAdditionalDetails={showAdditionalDetailsToggle}
						/>
					</Grid>
					
				</Grid>
				<SystemRelatedUsers
					isOpen={showLinkedUsers}
					userList={data.relatedUsers}
					setData={setData}
					systemId={data._id}
					data={data}
				/>
				<UpdateOwner
					isOpen={editOwner}
					currentOwner={data.owner}
					handleSave={updateOwner}
					handleClose={toggleEditOwner}
					title={t('systemsModule.updateSystemOwnerTitle')}
					instructions={t('systemsModule.chooseManagerToUpdate')}
				/>
				<SystemAdditionalDetails
					data={data.data}
					isOpen={showAdditionalDetails}
					systemId={data._id}
					toggleEdit={toggleEditMode}
				/>
			</Paper>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	paper: {
		background: 'rgba(255,255,255,0.1)',
		borderRadius: '5px',
		margin: '4px 5px',
	},
	mainRow: {
		display: 'flex',
		justifyContent: 'space-between',
		widht: 'auto',
		[theme.breakpoints.down('md')]: {
			flexDirection: 'column',
		},
	},
	semiMainRow: {
		display: 'flex',
		width: 'auto',
		justifyContent: 'space-between',
	},
	actionsContainer: {
		display: 'flex',
		width: 'fit-content',
		padding: '5px',
		margin: 'auto 0',
		justifyContent: 'space-between',
		[theme.breakpoints.down('md')]: {
			flexDirection: 'column-reverse',
			alignItems: 'center',
			margin: 'auto',
		},
	},
	actions: {
		margin: 'auto 10px',
		[theme.breakpoints.down('md')]: {
			background: 'rgba(0,0,0,0.4)',
			borderRadius: '50px',
			margin: '10px 0',
			padding: '5px 10px',
		},
	},
	systemName: {
		color: 'white',
		margin: 'auto 20px',
		fontSize: '18px',
		whiteSpace: 'wrap',
		borderRadius: '50px',
		padding: '5px 20px',
	},
	iconBtn: {
		padding: '0px',
		height: 'fit-content',
		width: 'fit-content',
		margin: '0 20px',
		[theme.breakpoints.down('md')]: {
			margin: '5px 10px',
		},
	},
	userIcon: {
		fontSize: '20px',
		color: 'white',
		border: '1px solid rgba(255,255,255,0.2)',
		padding: '8px',
		borderRadius: '50px',
		'&:hover': {
			background: 'rgba(0,0,0,0.2)',
		},
	},
	ownerInfo: {
		height: 'auto',
		width: '150px',
		padding: '5px 20px 5px 10px',
		display: 'grid',
		placeItems: 'center',
		borderRadius: '5px',
		[theme.breakpoints.down('md')]: {
			marginTop: '5px',
			borderRadius: '50px',
			width: '170px',
			padding: '5px 20px 5px 5px',
		},
	},
	editOwner: {
		width: 'auto',
		height: '200px',
		margin: '20px',
		border: '1px solid rgba(255,255,255,0.2)',
		borderRadius: '5px',
	},
}));
