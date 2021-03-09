import React, { useState, useEffect } from 'react';
import { makeStyles, Grid, useMediaQuery, List, ListItem } from '@material-ui/core';
import { FaultMinified } from './FaultMinified';
import { useHistory, useLocation } from 'react-router';
import { useQuery } from '../../reuseables/customHooks/useQuery';
import { FaultView } from './FaultView';
import { useTranslation } from 'react-i18next';
import { StatusTag } from '../../reuseables/StatusTag';
import { getStatusList } from '../../../api/genericApi';
import { Link } from 'react-router-dom';
import { FaultBlock } from './FaultBlock';

export const FaultBlockView = ({ faults }) => {
    
    const history = useHistory();
    const location = useLocation();
    const query = useQuery(location.search);
    const classes = useStyles();
    const downSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const { t, i18n } = useTranslation();
    const [ faultView, setFaultView ] = useState(null);
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
                                    <StatusTag status={s}/>
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

const ItemTypes = {
    FAULT: 'fault'
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