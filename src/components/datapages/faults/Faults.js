import React, { useEffect, useState } from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next'
import { FaultsControls } from './FaultsControls';
import { useHistory, useLocation } from 'react-router';
import { useQuery } from '../../reuseables/customHooks/useQuery';

export const Faults = () => {


    const history = useHistory();
    const location = useLocation();
    const query = useQuery(location.search);
    const classes = useStyles();
    const { t, i18n } = useTranslation();
    const [ isLoading, setIsLoading ] = useState(false);

    return (
        <Grid container jutify='center' >
            <div className={classes.pageModule}>
                    {t("assetsModule.faults")}
            </div>
            <Grid item xs={12}>
                <FaultsControls mode={'list'}/>
            </Grid>
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
    }
}))