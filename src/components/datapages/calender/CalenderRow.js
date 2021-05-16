import React from 'react';
import { makeStyles, Grid, useMediaQuery } from '@material-ui/core';
import { useTranslation } from 'react-i18next';


export const CalenderRow = ({ brackets }) => {

    const classes = useStyles();
    const { t } = useTranslation();
    const matches = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return (
        <tr className={classes.row}>
            {
                brackets.map((b, i) =>
                    <td className={classes.bracketData}>
                        <div className={classes.dayOfMonth}>
                            {b.parts.day}
                        </div>
                        
                    </td>
                )
            }
        </tr>   
    )
}

const useStyles = makeStyles(theme => ({
    row: {
        padding: '10px',
        width: '14.28%',
        height: '10%'
    },
    dayHeader: {

    },
    bracketData: {
        padding: '10px',
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center',
            verticalAlign: 'top',

        }
    },
    dayOfMonth: {

    }
}))