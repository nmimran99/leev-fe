import React, { useState } from 'react';
import { makeStyles, Grid, useMediaQuery, List, ListItem } from '@material-ui/core';
import { FaultMinified } from './FaultMinified';
import { useHistory, useLocation } from 'react-router';
import { useQuery } from '../../reuseables/customHooks/useQuery';
import { addQueryParam } from '../../../api/genericApi';
import { FaultView } from './FaultView';

export const FaultListView = ({ faults }) => {
    
    const history = useHistory();
    const location = useLocation();
    const query = useQuery(location.search);
    const classes = useStyles();
    const downSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const [ faultView, setFaultView ] = useState(null)


    return (
        <Grid container className={classes.main} justify='flex-start'>
            <Grid item xs={12} md={5} lg={3} xl={3} className={classes.faultList}>
                <List className={classes.list}>
                {
                    faults.map((f,i) => 
                        <ListItem 
                            button 
                            className={classes.item}
                            onClick={() => setFaultView(f)}
                        >  
                            <FaultMinified 
                                data={f}
                                key={i}
                            />
                        </ListItem>
                        
                    )
                }
                </List>
            </Grid>
            {
                !downSm &&
                Boolean(faultView) &&
                <Grid item md={7} lg={9} xl={9} className={classes.faultPresenter}>
                    <FaultView fid={faultView.faultId}/>
                </Grid>
            }
            
        </Grid>
    )
}

const useStyles = makeStyles(theme => ({
    main: {
        border: '1px solid rgba(255,255,255,0.2)',
        height: '100%',
        [theme.breakpoints.down('sm')]: {
            border: '0',
        }
    },
    faultList: {
        borderRight: '1px solid rgba(255,255,255,0.2)',
        height: '100%',
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
            display: 'none'
        },
        [theme.breakpoints.down('sm')]: {
            border: '0',
            overflowY: 'unset',
        }
    },
    list: {
        background: 'rgba(0,0,0,0.3)',
        padding: 0,
        overflowY: 'unset'
    },
    item: {
        height:'200px',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        [theme.breakpoints.down('sm')]: {
            margin: '10px 0'
        }
    },
    faultPresenter: {
        background: 'rgba(0,0,0,0.1)',
        height: '100%'
    }
}))