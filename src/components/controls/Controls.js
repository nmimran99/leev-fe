import React, { useState } from 'react'
import { makeStyles, Grid } from '@material-ui/core'
import { Navbar } from './navbar/Navbar'
import { SideMenu } from './navbar/SideMenu'
import { AddMenu } from './navbar/AddMenu'
import { CreateContainer } from '../reuseables/CreateContainer'


export const Controls = () => {

    const [ menuOpen, setMenuOpen ] = useState(false)
    const [ addMenuOpen, setAddMenuOpen ] = useState(false)
    const [ create, setCreate ] = useState(null)
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

    const openCreate = itemType => event => {
        toggleAddMenu();
        setCreate(itemType)
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
                <SideMenu 
                    toggleMenu={toggleMenu}

                />      
            }
            {
                addMenuOpen &&
                <AddMenu 
                    toggleAddMenu={toggleAddMenu}
                    toggleAdd={openCreate}    
                />      
            }
            {
                Boolean(create) &&
                <CreateContainer
                    isOpen={true}
                    handleClose={() => setCreate(null)}
                    itemType={create} 
                />
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