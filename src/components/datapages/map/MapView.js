import { makeStyles, Grid } from '@material-ui/core';
import React, { useState } from 'react';
import { Map } from './Map';
import { MapControls } from './MapControls';
import { MarkerData } from './MarkerData';


export const MapView = () => {

    const classes = useStyles();
    const [ data, setData ] = useState(null);
    const [ listArray, setListArray ] = useState([]);

    return (
         <Grid container justify='center'>
            <Grid container className={classes.mapGridItem}>
                {
                    Boolean(listArray.length) &&
                    <Grid xs={12} sm={6} md={4} lg={3} className={classes.markDataGrid}>
                         <MarkerData markersData={listArray} handleClose={() => setListArray([])} />
                    </Grid>
                   
                }
                <Grid xs={12}>
                    <Map setData={setListArray} />
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
    },
    markDataGrid: {
        position: 'absolute',
        zIndex: 3,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(2px)',
        height: '100%',

    }
}));