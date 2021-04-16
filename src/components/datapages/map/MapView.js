import { makeStyles, Grid, useMediaQuery, IconButton } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Map } from './Map';
import { MapControls } from './MapControls';
import { MarkerData } from './MarkerData';
import { Mapbox } from './Mapbox';
import { getMapData, getMapFilters } from '../../../api/mapApi';
import { useLocation } from 'react-router';
import { useQuery } from '../../reuseables/customHooks/useQuery';


export const MapView = () => {

    const classes = useStyles();
    const location = useLocation();
    const query = useQuery(location.search);
    const [ data, setData ] = useState(null);
    const [ listArray, setListArray ] = useState([]);
    
    useEffect(() => {
        getMapFilters(query)
        .then(filters => {
            fetchMapData(filters);
        });	
	}, [location.search]);

	const fetchMapData = async (filters) => {
		const res = await getMapData(filters);
		setData(res);
    };
    
    return (
         <Grid container justify='center'>
            <Grid container className={classes.mapGridItem}>
                {
                    Boolean(listArray.length) &&
                    <Grid xs={12} sm={6} md={4} lg={3} className={classes.markDataGrid}>
                         <MarkerData markersData={listArray} handleClose={() => setListArray([])} />
                    </Grid>
                   
                }
                {
                    data &&
                    <Grid xs={12}>
                        <Mapbox data={data} setData={setListArray} />
                    </Grid>
                }
            </Grid>
            <Grid item xs={12} className={classes.gridControls}>                  
                <MapControls />
            </Grid>
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
        right: 0,
        top: 0,

    },
    markDataGrid: {
        position: 'absolute',
        zIndex: 3,
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(40px)',
        height: '100%',
    },
    filterBtn: {
        color: 'white',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '50px',
        padding: '10px',
        margin: '10px',
        boxShadow: 'inset rgba(0,0,0,0.4) 0 0 10px 2px'
    },
    icon: {
        fontSize: '28px'
    }
}));