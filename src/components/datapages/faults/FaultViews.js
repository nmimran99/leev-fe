import React, { useEffect, useState } from 'react';
import { makeStyles, Grid, LinearProgress, useMediaQuery } from '@material-ui/core';
import { useTranslation } from 'react-i18next'
import { FaultsControls } from './FaultsControls';
import { useHistory, useLocation } from 'react-router';
import { useQuery } from '../../reuseables/customHooks/useQuery';
import { addQueryParam, removeQueryParam } from '../../../api/genericApi';
import { FaultListView } from './FaultListView';
import { getFaults, getFaultsQueryParams, getMinifiedFaults } from '../../../api/faultsApi';

export const FaultViews = () => {


    const history = useHistory();
    const location = useLocation();
    const query = useQuery(location.search);
    const classes = useStyles();
    const downSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const { t, i18n } = useTranslation();
    const [ viewType, setViewType ] = useState(query['viewType'] || 'list');
    const [ isLoading, setIsLoading ] = useState(true);
    const [ faults, setFaults ] = useState([]);

    useEffect(() => {
        if (!isLoading) return;
        getMinifiedFaults(query)
        .then(data => {
            if (data) {
                console.log(data)
                setFaults(data)
            }
        })
        .finally(() => {
            setIsLoading(false)
        })
    }, [isLoading])

    useEffect(() => {
        setIsLoading(true)
    }, [location.search])

    useEffect(() => {
        if (viewType === 'blocks') {
            history.push({
                path: location.pathname,
                search: removeQueryParam(location.search, 'status')
            });
        }
        history.push({
            path: location.pathname,
            search: addQueryParam(location.search, [{ name: 'viewType', value: viewType}] )
        });      
    }, [viewType])
 
    return (
        <Grid container justify={ 'center'} >
            <div className={classes.pageModule}>
                    {t("assetsModule.faults")}
            </div>
            <Grid item xs={12}>
                <FaultsControls 
                    viewType={viewType}
                    setViewType={setViewType}    
                />
            </Grid>
            {
                isLoading ?
                <LinearProgress />
                :
                <Grid item xs={12} 
                    className={classes.faultPresent}
                    style={{ height: downSm ? 'auto' : '700px'}}
                >
                    <FaultListView 
                        faults={faults}
                    />
                </Grid>
            }
            
        </Grid>
        
    )
}

const useStyles = makeStyles(theme => ({
    pageModule: {
        color: 'white',
        padding: '10px 40px',
        fontSize: '18px',
        background: 'rgba(0,0,0,0.6)',
        margin: '0px auto 5px',
        width: '30%',
        textAlign: 'center',
        borderRadius: '0 0 25px 25px',
        lineHeight: '1'
    },
    faultPresent: {
        margin: '20px 10px',
        [theme.breakpoints.down('sm')]: {
            margin: '20px 0',
        }
    }
}))