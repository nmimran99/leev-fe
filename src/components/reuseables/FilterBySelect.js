import React, { useState, useEffect, useContext } from 'react'
import { makeStyles, Button, Menu, MenuItem, IconButton } from '@material-ui/core'
import { useHistory, useLocation } from 'react-router-dom';
import { addQueryParam, specialStringPurge, removeQueryParam } from '../../api/genericApi';
import { useQuery } from './customHooks/useQuery';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { LanguageContext } from '../../context/LanguageContext';

export const FilterBySelect = ({ filterField, placeholder, filterIcon, optionsFunc }) => {
    
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const query = useQuery(location.search);
    const { lang } = useContext(LanguageContext);
    const [ menuOptions, setMenuOptions] = useState([]);
    const [ anchorEl, setAnchorEl ] = useState(null);
    const [ value, setValue ] = useState(query[filterField] || '')

    useEffect(() => {
        optionsFunc()
        .then(data => {
            setMenuOptions(data)
        }) 
    }, [])

    useEffect(() => {
        if (value) {
            history.push({
                path: location.pathname,
                search: addQueryParam(location.search, [{ name: filterField, value }])
            });
            return;
        }
        if(query[filterField]) {
            history.push({
                path: location.pathname,
                search: removeQueryParam(location.search, filterField)
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
                    <div item className={classes.select}>
                        <Button 
                            className={classes.filterBy}
                            onClick={event => setAnchorEl(event.currentTarget)}
                            startIcon={filterIcon}
                        >
                            { value ? createTag(value) : <label style={{ padding: '0 15px', cursor: 'pointer' }}>{placeholder}</label>}
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
                                            style={{ direction: lang.code === 'he' ? 'rtl' : 'ltr'}}
                                        >
                                            {v.label}
                                        </MenuItem>
                                    )
                                    
                                })
                            }
                        </Menu>
                    </div>
            }          
        </React.Fragment>
    )
}

const useStyles = makeStyles(theme => ({
    select: {
        margin: '5px',
        height: '45px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    filterBy: {
        textTransform: 'none',
        color: 'white',
        padding: '0 4px',
        height: '45px',
        border: '1px solid rgba(255,255,255,0.2)',
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
        background: 'rgba(0,0,0,0.5)',
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
        border: '1px solid rgba(255,255,255,0.2)',
    },
    tag: {
        padding: '5px 10px',
        borderRadius: '50px',
        border: '1px solid rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center'
    },
    tagLabel: {
        padding: '0 5px'
    },
    removeBtn: {
        padding: '4px',
        color: 'white'
    },
    tagRemove: {
        fontSize: '16px'
    }
}));
