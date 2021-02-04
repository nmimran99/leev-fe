import React, { useState, useEffect } from 'react'
import { makeStyles, Grid, ClickAwayListener, FormControl, OutlinedInput, Button, Menu, MenuItem, IconButton } from '@material-ui/core'
import { useHistory, useLocation } from 'react-router-dom';
import { addQueryParam, specialStringPurge, removeQueryParam } from '../../api/genericApi';
import { useQuery } from './customHooks/useQuery';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import clsx from 'clsx';

export const FilterBySelect = ({ filterField, placeholder, filterIcon, optionsFunc }) => {
    
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const query = useQuery(location.search);
    const [ menuOptions, setMenuOptions] = useState([]);

    useEffect(() => {
        optionsFunc()
        .then(data => {
            setMenuOptions(data)
        }) 
    }, [])

    const [ anchorEl, setAnchorEl ] = useState(null);
    const [ value, setValue ] = useState(query[filterField] || '')
    
    useEffect(() => {
        if (value) {
            history.push({
                path: location.pathname,
                search: addQueryParam(location.search, [{ name: filterField, value }])
            });
            return;
        }
        if (query[filterField]) {
            history.push({
                path: location.pathname,
                search: removeQueryParam(filterField)
            });
        }
        
    }, [value])

    const createTag = val => {
        let data = menuOptions.find(op => val === op.value);
        if (!data) return;
        return (
            <div className={classes.tag}>
                <label className={classes.tagLabel}>
                    { data.label }
                </label>
                <IconButton 
                    className={classes.removeBtn}
                    onClick={removeChoice(data.value)}
                >
                    <CloseRoundedIcon className={classes.tagRemove}/>
                </IconButton>
            </div>
        )
    }

    const removeChoice = value => event => {
        event.stopPropagation();
        setValue('')
    }

    const handleClick = val => event => {
        setValue(val);
        setAnchorEl(null)
    }

    return (
        <React.Fragment>
            {
                Boolean(menuOptions.length) &&
                <Grid container justify='center'>
                    <Grid item className={classes.gridItem}>
                        <Button 
                            className={classes.filterBy}
                            onClick={event => setAnchorEl(event.currentTarget)}
                            startIcon={filterIcon}
                        >
                            { value ? createTag(value) : <label style={{ padding: '0 5px 0 30px', cursor: 'pointer' }}>{placeholder}</label>}
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                            classes={{
                                paper : classes.menu
                            }}
                            keepMounted
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            {
                                menuOptions.map((v,i) => {
                                    return (
                                        <MenuItem
                                            key={i}
                                            onClick={handleClick(v.value)}
                                            className={classes.menuitem}
                                        >
                                            {v.label}
                                        </MenuItem>
                                    )
                                    
                                })
                            }
                        </Menu>
                    </Grid>
                </Grid>
            }          
        </React.Fragment>
    )
}

const useStyles = makeStyles(theme => ({
    gridItem: {
        height: '45px'
    },
    filterBy: {
        color: 'white',
        padding: '0 5px',
        height: '45px',
        border: '1px solid rgba(0,0,0,0.25)',
        borderRadius: '25px',
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        '&:hover': {
            boxShadow: 'rgba(0,0,0,0.25) 2px 3px 2px 0px',
            
        }
    },
    menu: {
        marginTop: '55px',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        color: 'white'
    },
    menuitem: {
        minWidth: '200px'
    },
    container: {
        height: '45px',
        border: '1px solid rgba(0,0,0,0.25)',
        borderRadius: '25px',
        display: 'flex',
        alignItems: 'center',
        '&:hover': {
            boxShadow: 'rgba(0,0,0,0.25) 2px 3px 2px 0px',
            
        }
    },
    focused: {
        border: `2px solid ${theme.palette.primary.main}`
    },
    form: {
        width: '100%',
        
    },
    searchInput: {
        height: '34px',
        width: '98.5%',
        margin: '3px 0.75%',
        borderRadius: '5px 25px 25px 5px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        '& fieldset': {
            border: '0'
        } 
    },
    icon: {
        fontSize: '20px',
        margin: '0 5px',
        color: 'white',
        borderRadius: '50px',
        padding: '6px',
        boxShadow: 'rgba(0,0,0,0.25) 0px 0px 1px 2px',
    },
    tag: {
        padding: '5px 10px',
        borderRadius: '50px',
        // background: 'rgba(0,0,0,0.3)',
        boxShadow: 'rgba(0,0,0,0.25) 0px 0px 3px 1px',
        display: 'flex',
        alignItems: 'center'
    },
    tagLabel: {
        padding: '0 5px'
    },
    removeBtn: {
        padding: '4px'
    },
    tagRemove: {
        fontSize: '16px'
    }
}));
