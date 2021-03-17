import { Grid, LinearProgress, makeStyles, useMediaQuery } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { getFaults } from '../../../api/faultsApi';
import { updateQueryParams } from '../../../api/genericApi';
import { FaultsContext } from '../../../context/FaultsContext';
import { useQuery } from '../../reuseables/customHooks/useQuery';
import { FaultBlockView } from './FaultBlockView';
import { FaultListView } from './FaultListView';
import { FaultsControls } from './FaultsControls';

export const FaultViews = () => {

    const history = useHistory();
    const location = useLocation();
    const query = useQuery(location.search);
    const classes = useStyles();
    const { t } = useTranslation();
    const { faults, setFaults } = useContext(FaultsContext)
    const [ viewType, setViewType ] = useState(query['viewType'] || 'list');
    const [ isLoading, setIsLoading ] = useState(true);
    

    useEffect(() => {
        if (!isLoading) return;
        getFaults(query)
        .then(data => {
            if (data) {
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
        history.push({
            path: location.pathname,
            search: updateQueryParams(location.search, [{ name: 'viewType', value: viewType}], ['status'] )
        });   
    }, [viewType]);

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
                    style={{ height: 'auto' }}
                >
                    {
                        viewType === 'list' ?
                        <FaultListView 
                            faults={faults}
                        /> :
                        <FaultBlockView 
                            faults={faults}
                        />     
                    }
                    
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