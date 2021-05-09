import React from 'react';
import { makeStyles, Grid } from '@material-ui/core';

export const Calender = ({}) => {

    const classes = useStyles();

    return (
        <Grid container className={classes.mainContainer}> 
            
        </Grid>
    )
}

const useStyles = makeStyles(theme => ({
    mainContainer: {

    }
}))