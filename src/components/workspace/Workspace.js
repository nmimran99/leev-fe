import React, { useState } from 'react'
import { Controls } from '../controls/Controls'
import { makeStyles, Grid } from '@material-ui/core'
import { Assets } from '../datapages/assets/Assets'
import { Switch, Route } from 'react-router-dom'
import { Systems } from '../datapages/systems/Systems'
import greyJpg from '../../assets/images/grey.jpg'
import { Faults } from '../datapages/faults/Faults'


export const Workspace = ({}) => {

    const classes = useStyles();

    return(
        <React.Fragment>
            <Grid container className={classes.mainContainer} justify='center' alignItems='flex-start'>
                <Controls />
                <Grid item xs={12} md={9} className={classes.mainData} >
                    <Switch>
                        <Route path={'/workspace/assets'}>
                            <Assets />
                        </Route>
                        <Route path={'/workspace/systems'}>
                            <Systems />
                        </Route>
                        <Route path={'/workspace/faults'}>
                            <Faults />
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
        background: `url(${greyJpg})`,
        zIndex: 2,
        backgroundRepeat: 'no-reaper',
        backgroundSize: 'cover',
        paddingBottom: '50px',
        overflowY: 'auto',
       
    },
    
    mainData: {
        minHeight: '90vh',
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(22px)",
        marginTop: '10px',
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: '25px',
        boxShadow: "rgba(0,0,0,0.4) 0px 0px 5px 5px",
        padding: "0 10px",
        [theme.breakpoints.down('sm')]: {
            border: 'none',
            borderRadius: 0,
            margin: 0
        }
       
       
    }
}))