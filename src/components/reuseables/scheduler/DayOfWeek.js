import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const DayOfWeek = ({ day, isChecked, handleClick }) => {
	const classes = useStyles();
	const { t } = useTranslation();

	return (
		<div
			className={clsx(
				classes.day,
				isChecked ? classes.dayChosen : null
			)}
			onClick={handleClick}
		>
			{t(`dates.${day}short`)}
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
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
