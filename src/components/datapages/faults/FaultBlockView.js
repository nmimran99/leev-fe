import { Grid, List, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { getStatusList } from '../../../api/genericApi';
import { StatusTag } from '../../reuseables/StatusTag';
import { FaultBlock } from './FaultBlock';

export const FaultBlockView = ({ faults }) => {
    
    const classes = useStyles();
    const [ faultsData, setFaultsData ] = useState([]);
    const [ statuses, setStatuses ] = useState([]);

    useEffect(() => {
        getStatusList('faults')
        .then(data => {
            setStatuses(data)
        })
    }, [])

    useEffect(() => {
        setFaultsData(faults);
    }, [faults])

    const getFaultsByStatus = status => {
        return faultsData.filter(f => f.status.statusId === status)
    }

    return ( 
        <Grid container className={classes.container}>
            {
                statuses.map((s,i) => {
                    return (
                        <Grid item xs={12} lg={3} xl={3} className={classes.gridItem} key={i}>                     
                            <div className={classes.block}>
                                <div className={classes.blockTitle}>
                                    <StatusTag type='fault' status={s}/>
                                </div>
                                
                                <List className={classes.blockFaults} >
                                    { 
                                    getFaultsByStatus(s.statusId).map((f,i) => 
                                        <FaultBlock data={f} key={i} />
                                    )}
                                </List>
                                
                            </div>
                        </Grid>
                    )     
                })
            }      
        </Grid>
    )
}


const useStyles = makeStyles(theme => ({
   container: {
        height: 'auto'
   },
   gridItem: {
       minHeight: '700px'
   },
   blockTitle: {
       padding: '10px',
       background: 'rgba(0,0,0,0.4)',
       display: 'flex',
       justifyContent: 'center',
       borderRadius: '10px'
   },
   block: {
       padding: '0 5px',

   },
   blockFaults: {
       border: '1px solid rgba(255,255,255,0.2)',
       borderRadius: '10px',
       margin: '10px 0',
       minHeight: '600px',
       padding: '5px'
   },
   faultContainer: {
    padding: '10px',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '7px',
    background: 'rgba(0,0,0,0.4)',
    margin : '5px 0'
   }
}))