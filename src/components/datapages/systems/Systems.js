import React, { useState, useEffect } from 'react';
import { Button, Grid, LinearProgress, makeStyles, Paper, useMediaQuery } from '@material-ui/core';
import { SystemsControls } from './SystemsControls';
import { useTranslation } from 'react-i18next';
import { useQuery } from '../../reuseables/customHooks/useQuery';
import { useLocation } from 'react-router';
import { queryParamsToObject } from '../../../api/genericApi';
import { getSystemsByAsset } from '../../../api/systemsApi';
import { applyFilters } from '../../../api/systemsApi';
import { System } from './System';
import { SystemsHeader } from './SystemsHeader';
import { UpsertSystem } from './UpsertSystem';

export const Systems = () => {

    const classes = useStyles();
    const location = useLocation();
    const query = useQuery(location.search);
    const downSm = useMediaQuery(theme => theme.breakpoints.down('md'));
    const { t, i18n } = useTranslation();
    const [ systems, setSystems ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
 

    useEffect(() => {
        if (!isLoading) return;    
        let queryParams = queryParamsToObject(location.search);
        if (!queryParams.asset) {
            setIsLoading(false);
            return;
        }
        

        getSystemsByAsset(queryParams.asset)
        .then(data => {
            return applyFilters(queryParams, data);
        })
        .then(data => {
            setSystems(data);     
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [isLoading])

    useEffect(() => {
        setIsLoading(true);
    }, [location.search])


    return(
        <div>
            <Grid container justify='center'>
                <Grid item xs={12}>
                    <div className={classes.pageModule}>
                        {t("assetsModule.systems")}
                    </div>
                </Grid>
                <Grid item xs={12} >
                    <SystemsControls />
                </Grid>
                <Grid container justify='center' >
                    {
                        !query.asset 
                        ?   <div 
                                className={classes.initMessage}>
                                {t("systemsModule.initMessage")}
                            </div>
                        :   isLoading 
                            ?   <LinearProgress />
                            :   
                            <React.Fragment>
                                <SystemsHeader />
                                {
                                    systems.map((system, i) => 
                                        <System systemData={system} key={i} />
                                    )
                                }
                            </React.Fragment>
                            
                    }   
                </Grid>
            </Grid>
        </div>
    )
}

const useStyles = makeStyles(theme => ({
    initMessage: {
        color: 'white',
        padding: '10px 40px',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '50px',
        width: 'fit-content',
        margin: '5px auto',
        textAlign: 'center',
        fontSize: '16px'
    },
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
    }
}))