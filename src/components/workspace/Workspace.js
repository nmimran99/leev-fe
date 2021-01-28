import React, { useState } from 'react'
import { Controls } from '../controls/Controls'
import { makeStyles, Grid } from '@material-ui/core'
import { Assets } from '../datapages/assets/Assets'
import { Switch, Route } from 'react-router-dom'


export const Workspace = ({}) => {

    const classes = useStyles();

    return(
        <React.Fragment>
            <Grid container className={classes.mainContainer} justify={'center'} >
                <Controls />
                <Grid item xs={12} md={9} className={classes.mainData} justify='center'>
                    <Switch>
                        <Route path={'/workspace/assets'}>
                            <Assets />
                        </Route>
                    </Switch>
                </Grid>
            </Grid>
            
            
        </React.Fragment>
        
    )
}

const useStyles = makeStyles(theme => ({
    mainContainer: {
        height: '100%',
        background: theme.palette.primary.light,
        overflowY: 'auto',
    },
    mainData: {
        height: 'calc(90vh - 86px)',
       
    }
}))