import { makeStyles, Grid } from '@material-ui/core';
import React, { useState } from 'react';
import { Map } from './Map';
import { MapControls } from './MapControls';
import { MarkerData } from './MarkerData';


export const MapView = () => {

    const classes = useStyles();
    const [ data, setData ] = useState(null);

    return (
         <Grid container justify='center'>
            <Grid container className={classes.mapGridItem}>
                {
                    Boolean(data) &&
                    <Grid xs={3}>
                         <MarkerData />
                    </Grid>
                   
                }
                <Grid xs={data ? 9 : 12}>
                    <Map setData={setData} />
                </Grid>
                
            </Grid>
            {/* <Grid item xs={2} className={classes.gridControls}>
                <MapControls />
            </Grid> */}
         </Grid>

    )
};


const useStyles = makeStyles(theme => ({
    mapGridItem: {
        width: '100%',
        height: '90vh',
        position: 'relative',
        [theme.breakpoints.down('sm')]: {
            height: '90vh'
        }
    },
    gridControls: {
        position: 'absolute',
        zIndex: 2,
        left: 0,
        top: 0
    }
}));