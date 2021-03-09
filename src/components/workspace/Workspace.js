import React, { useState } from 'react'
import { Controls } from '../controls/Controls'
import { makeStyles, Grid, useMediaQuery } from '@material-ui/core'
import { Assets } from '../datapages/assets/Assets'
import { Switch, Route } from 'react-router-dom'
import { Systems } from '../datapages/systems/Systems'
import greyJpg from '../../assets/images/grey.jpg'
import { Faults } from '../datapages/faults/Faults'
import { FaultsContextProvider } from '../../context/FaultsContext'


export const Workspace = ({}) => {

    const classes = useStyles();
    const downSm = useMediaQuery(theme => theme.breakpoints.down('sm'));

    return(
        <React.Fragment>
            <FaultsContextProvider>
                <Grid container 
                    className={classes.mainContainer} 
                    justify='center' 
                    alignItems='flex-start'
                    
                >
                    <Controls />
                    <Grid item xs={12} md={12} lg={11} xl={9} className={classes.mainData} >
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
            </FaultsContextProvider>  
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
        
        overflowY: 'auto',
        [theme.breakpoints.down('sm')]: { 
            '&::-webkit-scrollbar': { 
                display:  'none'
            } 
        }   
    },
    
    mainData: {
        minHeight: '90vh',
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(22px)",
        marginTop: '10px',
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: '5px',
        boxShadow: "rgba(0,0,0,0.4) 0px 0px 3px 2px",
        padding: "0 10px",
        [theme.breakpoints.down('sm')]: {
            border: 'none',
            borderRadius: 0,
            margin: 0,
            padding: 0
        }
       
       
    },
    '@global': {
        '*::-webkit-scrollbar': {
          width: '0.4em'
        },
        '*::-webkit-scrollbar-track': {
          '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.4)',
          borderRadius: '50px'
       
        }
      }
}))