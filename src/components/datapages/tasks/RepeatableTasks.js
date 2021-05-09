import { Grid } from '@material-ui/core';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { TasksList } from './TasksList';
import { TaskView } from './TaskView';

export const RepeatableTasks = () => {
    
    const { path } = useRouteMatch();
    

    return (
        <Grid container justify='center'>
            <Switch>
                <Route exact path={path}>
                    <TasksList repeatable={true} />        
                </Route>
                <Route path={`${path}/:taskId`}>
                    <TaskView repeatable />
                </Route>
            </Switch>
        </Grid>
        
    )
}
