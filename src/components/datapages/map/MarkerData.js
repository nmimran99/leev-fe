import { makeStyles, Grid } from '@material-ui/core';
import React, { useState } from 'react';

export const MarkerData = () => {

    const classes = useStyles();


    return (
        <div className={classes.container}>
            <div>
                
            </div>
        </div>
    )
};


const useStyles = makeStyles(theme => ({
    container: {
        width: '100%',
        height: '100%'
    }
}));