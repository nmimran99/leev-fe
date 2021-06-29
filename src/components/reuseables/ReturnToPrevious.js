import { IconButton, makeStyles } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';
import { useHistory, useLocation } from 'react-router';

export const ReturnToPrevios = () => {
	const classes = useStyles();
    const location = useLocation();
    const history = useHistory();
	const { t } = useTranslation();
    
	return (
      	<IconButton 
            className={classes.button} 
            onClick={() => history.goBack()} 
        >
            <ArrowBackRoundedIcon className={classes.icon} />
        </IconButton>
	);
};

const useStyles = makeStyles((theme) => ({
    button: {
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
