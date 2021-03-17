import { Grid, makeStyles, useMediaQuery } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFullAddress } from '../../../api/assetsApi';
import { StatusTag } from '../../reuseables/StatusTag';
import { UserItem } from '../../user/UserItem';
import { FaultLink } from './FaultLink';

export const FaultMinified = ({ data }) => {
	const classes = useStyles();
	const [minifiedData, setMinifiedData] = useState(data);

	useEffect(() => {
		setMinifiedData(data);
	}, [data]);

	return (
		<Grid container className={classes.container} alignItems="flex-start">
			<Grid
				container
				justify="space-between"
				alignItems="center"
				className={classes.topRow}
			>
				<Grid item xs={12}>
					<div className={classes.asset}>
						{getFullAddress(minifiedData.asset, true)}
					</div>
				</Grid>
			</Grid>
			<Grid xs={12} item className={classes.title}>
				{minifiedData.title}
			</Grid>
			<Grid
				container
				justify="space-between"
				alignItems="center"
				className={classes.bottomRow}
			>
				<Grid item xs={5} className={classes.userData}>
					<UserItem
						size={13}
						avatarSize={40}
						user={minifiedData.owner}
					/>
					<FaultLink faultId={minifiedData.faultId} size={14} />
				</Grid>
				<Grid item xs={7} className={classes.status}>
					<StatusTag status={minifiedData.status} type={'fault'} />
				</Grid>
			</Grid>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		width: '100%',
		height: '100%',
		position: 'relative',
	},
	title: {
		color: 'white',
		fontSize: '16px',
		padding: '15px 5px',
		display: '-webkit-box',
		WebkitLineClamp: '2',
		WebkitBoxOrient: 'vertical',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		height: '60px',
	},
	topRow: {
		padding: '5px',
		maxHeight: '60px',
	},
	userData: {
		padding: '5px 0px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	bottomRow: {
		height: '50px',
	},
	asset: {
		color: 'white',
		borderRadius: '50px',
		background: 'rgba(0,0,0,0.4)',
		padding: '5px 15px',
		border: '1px solid rgba(255,255,255,0.2)',
		boxShadow: 'rgba(0,0,0,0.3) 1px 1px 5px 2px',
		width: 'fit-content',
		textAlign: 'center',
	},
	faultLink: {
		display: 'flex',
		justifyContent: 'flex-end',
		margin: '3px 0',
	},
	status: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
	link: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
}));
