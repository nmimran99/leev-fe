import React from 'react';
import { makeStyles, Grid, useMediaQuery } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const CalenderHeaderRow = ({}) => {

    const classes = useStyles();
    const { t } = useTranslation();
    const matches = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return (
        <tr className={classes.row}>
            {
                weekDays.map((wd, i) => 
                    <th className={classes.headerCell}>
                        <div className={classes.dayHeader}>
                            {t(`dates.${wd}${matches ? 'short' : ''}`)}
                        </div>
                    </th>
                )
            }
        </tr>   
    )
}

const useStyles = makeStyles(theme => ({
    headerCell: {
        width: '14.28%'
    },
    dayHeader: {
        padding: '15px 10px',
        background: 'rgba(0,0,0,0.6)',
        width: 'auto'
    }
}))