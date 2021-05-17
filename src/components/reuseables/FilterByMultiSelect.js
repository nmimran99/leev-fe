import { Button, IconButton, makeStyles, Menu, MenuItem } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { addQueryParam, removeQueryParam } from '../../api/genericApi';
import { LanguageContext } from '../../context/LanguageContext';
import { useQuery } from './customHooks/useQuery';

export const FilterByMultiSelect = ({ filterField, placeholder, filterIcon, optionsFunc }) => {
    
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const query = useQuery(location.search);
    const { lang } = useContext(LanguageContext);
    const [ menuOptions, setMenuOptions] = useState([]);
    const [ orgMenuOptions, setOrgMenuOptions ] = useState([])
    const [ anchorEl, setAnchorEl ] = useState(null);
    const [ values, setValues ] = useState( query[filterField] || [])

    useEffect(() => {
        optionsFunc()
        .then(data => {
            setOrgMenuOptions(data);
            if (query[filterField]) {
                data = data.filter(op => query[filterField].indexOf(op.value) === -1 )
            }
            setMenuOptions(data);
            
        }) 
    }, [])

    useEffect(() => {
        if (values.length) {
            
            history.push({
                path: location.pathname,
                search: addQueryParam(location.search, [{ name: filterField, value: values }])
            });
            return;
        }
        if (query[filterField] && !values.length) {
            history.push({
                path: location.pathname,
                search: removeQueryParam(location.search, filterField)
            });
        }
        
    }, [values])

    useEffect(() => {
        if(!menuOptions.length) {
            setAnchorEl(null)
        }
    }, [menuOptions])

    const createTag = (val, key) => {
        let data = orgMenuOptions.find(op => val === op.value);
        if (!data) return;
        return (
            <div className={classes.tag} key={key}>
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
        getMenuOptions(value)
        .then(data => {
            setValues(values => values.filter(val => val !== value ));
            if (!menuOptions.length) {
                setAnchorEl(null)
            }
            setMenuOptions(data)
        });  
    }

    const handleClick = val => event => {
        setValues([...values, val]);
        setMenuOptions(menuOptions => menuOptions.filter( op => op.value !== val));
    }

    const getMenuOptions = (value) => {
        return new Promise((resolve, reject) => {
            let mop = menuOptions;
            mop.push(orgMenuOptions.find( op => op.value === value));
            resolve(mop);
        }) 
    }

    return (
        <React.Fragment>
            {
                Boolean(orgMenuOptions.length) &&
                <div className={classes.select}>
                        <Button 
                            className={classes.filterBy}
                            onClick={event => setAnchorEl(event.currentTarget)}
                            startIcon={filterIcon}
                        >
                            { 
                                values.length 
                                ?   
                                    <div className={classes.selectedContainer}>
                                        {
                                             values.map((val, i ) => createTag(val, i)) 
                                        }
                                    </div>
                               
                                :   <label className={classes.searchLabel} >
                                        {placeholder}
                                    </label>
                            }
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
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        whiteSpace: 'nowrap'
    },
    filterBy: {
        textTransform: 'none',
        color: 'white',
        padding: '0 5px',
        minHeight: '45px',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '25px',
        
        '&:hover': {
            boxShadow: 'rgba(0,0,0,0.25) 2px 3px 2px 0px',
        }
    },
    selectedContainer: {
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        flexWrap: 'wrap',
        width: 'fit-content',
        maxWidth: '400px'
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
        boxShadow: 'rgba(0,0,0,0.25) 2px 3px 2px 0px',
        background: 'rgba(0,0,0,0.1)',
        backdropFilter: 'blur(40px)'
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
        boxShadow: 'rgba(0,0,0,0.25) 0px 0px 3px 1px',
        display: 'flex',
        alignItems: 'center',
        margin: '3px'
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
    },
    searchLabel: {
        padding: '5px 20px 5px 10px', 
        cursor: 'pointer',
        color: 'rgba(255,255,255,0.5)',
        fontSize: '15px' 
    }
}));
