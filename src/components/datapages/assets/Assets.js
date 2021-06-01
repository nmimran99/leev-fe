import { Grid } from '@material-ui/core';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { AssetsList } from './AssetsList';
import { AssetView } from './AssetView';




export const Assets = () => {
    
    const { path } = useRouteMatch();


    return (
        <Grid container justify='center'>
            <Switch>
                <Route exact path={path}>
                    <AssetsList />        
                </Route>
                <Route path={`${path}/:assetId`}>
                    <AssetView />
                </Route>
            </Switch>
        </Grid>
        
    )
}
