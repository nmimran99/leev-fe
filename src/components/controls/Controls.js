import React, { useState } from 'react'
import { makeStyles, Grid } from '@material-ui/core'
import { Navbar } from './navbar/Navbar'
import { SideMenu } from './navbar/SideMenu'
import { AddMenu } from './navbar/AddMenu'


export const Controls = () => {

    const [ menuOpen, setMenuOpen ] = useState(false)
    const [ addMenuOpen, setAddMenuOpen ] = useState(false)
    const classes = useStyles();

    const toggleMenu = () => {
        if(menuOpen) {
            setMenuOpen(false)
        } else {
            setMenuOpen(true)
        }      
    }

    const toggleAddMenu = () => {
        if(addMenuOpen) {
            setAddMenuOpen(false)
        } else {
            setAddMenuOpen(true)
        }  
    }

    return (
        <React.Fragment>
            <Grid container className={classes.controlsContainer} justify='center'>
                <Grid item xs={11} md={11}>
                    <Navbar 
                        toggleMenu={toggleMenu} 
                        menuOpen={menuOpen}
                        toggleAddMenu={toggleAddMenu}
                    />
                </Grid>
            </Grid>
            {
                menuOpen &&
                <SideMenu toggleMenu={toggleMenu}/>      
            }
            {
                addMenuOpen &&
                <AddMenu toggleAddMenu={toggleAddMenu}/>      
            }
        </React.Fragment>
        
        
    )
}

const useStyles = makeStyles(theme => ({
    controlsContainer: {
        zIndex: 2,
        height: '64px'
    }
}))