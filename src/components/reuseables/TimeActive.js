import React from 'react';
import { makeStyles } from '@material-ui/core';
import { getDatediffString } from '../../api/genericApi';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { useTranslation } from 'react-i18next';

export const TimeActive = ({ createDate }) => {

    const classes = useStyles();
    const { t } = useTranslation();

	return (
        <div className={classes.container}>
            <AccessTimeIcon  className={classes.icon} />
            { `${t(`general.openFor`)} ${getDatediffString(createDate)}` }
        </div>
	);
};

const useStyles = makeStyles(theme => ({
    container: {
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        padding: '7px 30px 7px 10px',
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '50px',
        width: 'fit-content',
        fontSize: '14px',
        whiteSpace: 'nowrap'
    },
    icon: {
        color: 'white',
        margin: '0 10px'
    }
}))