import React from 'react';
import { makeStyles, Grid, useMediaQuery } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { EventBracket } from './EventBracket';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

export const CalenderRow = ({ brackets, handleBracketClick }) => {

    const classes = useStyles();
    const { t } = useTranslation();
    const matches = useMediaQuery((theme) => theme.breakpoints.down('md'));

    return (
        <tr className={classes.row}>
            {
                brackets.map((b, i) =>
                    <td className={classes.bracketData}  onClick={() => handleBracketClick({ tasks: b.data, date: b.date, parts: b.parts})}>
                        <div className={classes.dataContainer}>
                            <div className={classes.dayOfMonth}>
                                {b.parts.day}
                            </div>
                            <div className={classes.eventsContainer}>
                                {   
                                    matches && b.data.length ?  
                                    <FiberManualRecordIcon className={classes.eventsMarker} /> : 
                                    b.data.slice(0,2).map((e,i) => 
                                        <EventBracket data={e} key={i} />
                                    )
                                }
                            </div>
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
        height: '16.666%'
    },
    dayHeader: {

    },
    bracketData: {
        padding: '10px',
        verticalAlign: 'top',
        width: '100px',
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    },
    dataContainer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    dayOfMonth: {

    },
    eventsMarker: {
       
        fontSize: '12px'
    }
}))