import { makeStyles, Tooltip, IconButton } from '@material-ui/core';
import React, { useState } from 'react';
import BusinessRoundedIcon from '@material-ui/icons/BusinessRounded';
import AssignmentRoundedIcon from '@material-ui/icons/AssignmentRounded';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import { useTranslation } from 'react-i18next';

export const MapControls = () => {
	const classes = useStyles();
	const { t } = useTranslation();

	return (
		<div className={classes.container}>
			<Tooltip title={t('sideMenu.assets')}>
				<IconButton className={classes.btn}>
					<BusinessRoundedIcon className={classes.icon} />
				</IconButton>
			</Tooltip>
			<Tooltip title={t('sideMenu.faults')}>
				<IconButton className={classes.btn}>
					<WarningRoundedIcon className={classes.icon} />
				</IconButton>
			</Tooltip>
			<Tooltip title={t('sideMenu.tasks')}>
				<IconButton className={classes.btn}>
					<AssignmentRoundedIcon className={classes.icon} />
				</IconButton>
			</Tooltip>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		width: 'fit-content',
		height: 'fit-content',
		display: 'flex',
		flexDirection: 'column',
	},
	btn: {
		background: 'rgba(0,0,0,0.4)',
		padding: '8px',
        margin: '5px',
        '&:hover': {
            background: 'black'
        }
	},
	icon: {
        color: 'white',
        fontSize: '20px'
	},
}));
