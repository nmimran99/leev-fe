import { makeStyles } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';

export const NoDataFound = () => {
	const classes = useStyles();
	const { t } = useTranslation();
    
	return (
        <div className={classes.container}>
            <div className={classes.logoContainer}>
            <img src='https://leevstore.blob.core.windows.net/images/leev_logo_round.png'
                className={classes.logo} />
            </div>
            <div className={classes.mainRow}>
                {t("errors.noRows")}
            </div>
            <div className={classes.iconContainer}>
                <FilterListRoundedIcon className={classes.icon} />
            </div>
            <div className={classes.secondaryRow}>
                {t("errors.applyFilter")}
            </div>
        </div>		
	);
};

const useStyles = makeStyles((theme) => ({
    container: {
        margin: '20px auto',
        color: 'white',
        textAlign: 'center',
        background: 'rgba(0,0,0,0.7)',
        borderRadius: '20px',
        boxShadow: '0px 0px 6px 4px rgba(0,0,0,0.2)',
        padding: '30px 60px',
        width: 'fit-content',
        [theme.breakpoints.down('sm')]: {
            background: 'black'
        }
    },
    mainRow: {
        fontSize: '24px'
    },
    iconContainer: {
        display: 'grid',
        placeItems: 'center',
        padding: '20px 0 40px'
    },
    icon: {
        fontSize: '72px',
        color: theme.palette.leading
    },
    secondaryRow: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: '14px',
        width: 'fit-content',
        whiteSpace: 'nowrap'
    },
    logoContainer: {
        padding: '0px 0 20px'
    },
    logo: {
        
        height: '100px',
        width: '100px'
    }
}));
