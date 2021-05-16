import React, { useContext, useEffect, useState } from 'react';
import {
	IconButton,
	makeStyles,
	Paper,
	useMediaQuery,
	Tooltip,
	Collapse,
	Grid,
} from '@material-ui/core';
import { UserItem } from '../../user/UserItem';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import TransferWithinAStationRoundedIcon from '@material-ui/icons/TransferWithinAStationRounded';
import { useTranslation } from 'react-i18next';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import AssignmentRoundedIcon from '@material-ui/icons/AssignmentRounded';
import DescriptionRoundedIcon from '@material-ui/icons/DescriptionRounded';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Can } from '../../reuseables/Can';
import { useHistory, useLocation } from 'react-router';
import { addQueryParam } from '../../../api/genericApi';

export const SystemControls = ({
	editName,
	expanded,
	showLinkedUsersToggle,
	toggleEditOwner,
	toggleAdditionalDetails,
	system
}) => {
	
	const classes = useStyles();
	const location = useLocation();
	const history = useHistory();
	const { t, i18n } = useTranslation();
	const downSm = useMediaQuery((theme) => theme.breakpoints.down('md'));

	const handleReferralClick = type => event => {
		history.push(type + addQueryParam(location.search, [{ name: 'asset', value: system.asset._id }, { name: 'system', value: [system._id]}]));
    }

	return (
		<Collapse in={(!downSm && !editName) || expanded}>
			<Grid container className={classes.actionsContainer}>
				<Grid item lg={9}>
					<Grid container className={classes.actions}>
			
						<Grid item lg={2} className={classes.iconItem}>
							<Tooltip title={t('systemsModule.moreDetails')}>
								<IconButton
									className={classes.iconBtn}
									onClick={toggleAdditionalDetails}
								>
									<MoreHorizIcon
										className={classes.userIcon}
									/>
								</IconButton>
							</Tooltip>
						</Grid>
					
						
						<Grid item lg={2} className={classes.iconItem}>
							<Tooltip title={t('systemsModule.showTasks')}>
								<IconButton className={classes.iconBtn} onClick={handleReferralClick('tasks')}>
									<AssignmentRoundedIcon
										className={classes.userIcon}
									/>
								</IconButton>
							</Tooltip>
						</Grid>
						<Grid item lg={2} className={classes.iconItem}>
							<Tooltip title={t('systemsModule.showFaults')} onClick={handleReferralClick('faults')}>
								<IconButton className={classes.iconBtn}>
									<WarningRoundedIcon
										className={classes.userIcon}
									/>
								</IconButton>
							</Tooltip>
						</Grid>
						<Grid item lg={2} className={classes.iconItem}>
							<Tooltip title={t('systemsModule.showDocuments')}onClick={handleReferralClick('documents')}>
								<IconButton className={classes.iconBtn}>
									<DescriptionRoundedIcon
										className={classes.userIcon}
									/>
								</IconButton>
							</Tooltip>
						</Grid>
						<Can module='systems' action='changeOwner' >
						<Grid item lg={2} className={classes.iconItem}> 
							<Tooltip title={t('systemsModule.changeOwner')}>
								<IconButton
									className={classes.iconBtn}
									onClick={toggleEditOwner}
								>
									<TransferWithinAStationRoundedIcon
										className={classes.userIcon}
									/>
								</IconButton>
							</Tooltip>
						</Grid>
						</Can>
						<Grid item lg={2} className={classes.iconItem}>
							<Tooltip title={t('systemsModule.showUsers')}>
								<IconButton
									className={classes.iconBtn}
									onClick={showLinkedUsersToggle}
								>
									<PersonRoundedIcon
										className={classes.userIcon}
									/>
								</IconButton>
							</Tooltip>
						</Grid>
					</Grid>
				</Grid>

				<Grid item lg={3} className={classes.ownerInfo}>
					<UserItem
						user={system.owner}
						avatarSize={40}
						showPhone
						showName
						size={12}
					/>
				</Grid>
			</Grid>
		</Collapse>
	);
};

const useStyles = makeStyles((theme) => ({
	actionsContainer: {
		display: 'flex',
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
        margin: 'auto 0',
        display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
        height: '100%',
		[theme.breakpoints.down('md')]: {
			background: 'rgba(0,0,0,0.4)',
			borderRadius: '50px',
			margin: '10px 0',
			padding: '5px 0',
		},
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
		padding: '5px 20px 5px 10px',
		display: 'grid',
		placeItems: 'center',
		[theme.breakpoints.down('md')]: {
			marginTop: '5px',
			borderRadius: '50px',
			width: '170px',
			padding: '5px 20px 5px 5px',
		},
    },
    iconItem: {
        display: 'flex',
        justifyContent: 'center'
    }
}));
