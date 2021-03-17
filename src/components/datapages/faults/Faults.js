import { Grid } from '@material-ui/core';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { FaultView } from './FaultView';
import { FaultViews } from './FaultViews';



export const Faults = () => {
    
    const { path } = useRouteMatch();


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
