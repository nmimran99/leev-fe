import React, { useEffect, useState } from 'react';
import { makeStyles, Grid, LinearProgress, useMediaQuery } from '@material-ui/core';
import { Route, useHistory, useLocation, useRouteMatch, Switch } from 'react-router';
import { useQuery } from '../../reuseables/customHooks/useQuery';
import { FaultViews } from './FaultViews'
import { FaultView } from './FaultView';



export const Faults = () => {


    const history = useHistory();
    const location = useLocation();
    const query = useQuery(location.search);
    const classes = useStyles();
    const downSm = useMediaQuery(theme => theme.breakpoints.down('sm'));


    const { path, url } = useRouteMatch();


    return (
        <Grid container justify='center'>
            <Switch>
                <Route exact path={path}>
                    <FaultViews />        
                </Route>
                <Route path={`${path}/:faultId`}>
                    <FaultView />
                </Route>
            </Switch>
        </Grid>
        
    )
}

const useStyles = makeStyles(theme => ({

}))