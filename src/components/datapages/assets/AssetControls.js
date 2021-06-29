import { IconButton, makeStyles, Tooltip } from '@material-ui/core';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Can } from '../../reuseables/Can';

export const AssetControls = ({ removeAsset, toggleEditMode }) => {
	const classes = useStyles();
	const { t, i18n } = useTranslation();

	return (
			<div className={classes.container}>	
				<Can module='assets' action='update'>
					<Tooltip title={t('assetsModule.editAsset')}>
						<IconButton
							className={classes.iconbutton}
							onClick={toggleEditMode('address')}
						>
							<EditRoundedIcon className={classes.icon} />
						</IconButton>
					</Tooltip>
				</Can>
			</div>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		display: 'flex'
	},
	iconbutton: {
		background: 'rgba(0,0,0,0.7)',
        color: 'white',
        width: '40px',
        height: '40px',
        [theme.breakpoints.down('sm')]: {
            border: '1px solid rgba(255,255,255,0.2)'
        }
	},
	icon: {
		fontSize: '18px',
		color: 'white',
	},
}));
