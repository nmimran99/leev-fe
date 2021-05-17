import { ClickAwayListener, FormControl, IconButton, makeStyles, Menu, MenuItem, OutlinedInput } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import clsx from 'clsx';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { addQueryParam, removeQueryParam } from '../../api/genericApi';
import { LanguageContext } from '../../context/LanguageContext';
import { useQuery } from './customHooks/useQuery';

export const SearchBoxSelect = ({ placeholder, filterField, suggestionsFunc, reloadedLabel, reloadedValue }) => {
    
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const query = useQuery(location.search);
    const cont = useRef();
    const input = useRef();
    const { lang } = useContext(LanguageContext);
    const [ onFocus, setOnFocus ] = useState(false);
    const [ searchText, setSearchText ] = useState('');
    const [ anchorEl, setAnchorEl ] = useState(null);
    const [ menuOptions, setMenuOptions ] = useState([]);
    const [ value, setValue ] = useState(reloadedValue || null);
    
    useEffect(() => {
        if (Boolean(!searchText)) return;
        const timeOutId = setTimeout(() => handleSearch(searchText), 700);
        return () => clearTimeout(timeOutId);
    }, [searchText])

    useEffect(() => {
        if (value) {
            history.push({
                path: location.pathname,
                search: addQueryParam(location.search, [{ name: filterField, value: value}])
            });
            return;
        } else {
            history.push({
                path: location.pathname,
                search: removeQueryParam(location.search, filterField)
            });
        }
    }, [value])

    const handleChange = event => {
        setSearchText(event.target.value)
    }

    const handleSearch = async searchText => {
        if (searchText) {
            const data = await suggestionsFunc(searchText);
            setMenuOptions(data || []);
            setAnchorEl(input.current)      
        } else {
            history.push({
                path: location.pathname,
                search: removeQueryParam(location.search, filterField)
            });
        }
    }
    
    const getTag = val => {
        let data = menuOptions.find(op => val === op.value);
        return createTag(data)
    }

    const createTag = data => {
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
        setValue(null)
    }

    const handleClick = val => event => {
        setValue(val);
        setAnchorEl(null)
    }

    return (
        <ClickAwayListener onClickAway={() => setOnFocus(false)}>
            <div ref={cont} className={clsx(classes.container , onFocus && classes.focused, Boolean(value) && classes.selected)} xs={11} sm={9} md={8} lg={6}>
                <SearchRoundedIcon className={classes.icon}/>
                {
                    value 
                    ?   query[filterField] === value
                        ?  createTag(reloadedLabel && reloadedValue ? { label: reloadedLabel, value: reloadedValue} : null)
                        :  getTag(value)
                    :
                    <FormControl variant='outlined' className={classes.form}>
                        <OutlinedInput
                            autoFocus={true}
                            inputRef={input}
                            value={ searchText || '' }
                            onChange={handleChange}
                            placeholder={placeholder}
                            className={clsx(classes.searchInput)}
                            onFocus={() => setOnFocus(true)}
                        />
                    </FormControl>
                }
                {
                    Boolean(menuOptions.length) &&
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
                }
            </div>   
        </ClickAwayListener>
    )
}

const useStyles = makeStyles(theme => ({
    container: {
        margin: '5px',
        padding: '0 5px',
        maxWidth: '450px',
        minHeight: '43px',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '50px',
        display: 'flex',
        alignItems: 'center',
        transition: 'box-shadow 0.2s ease-in',
        '&:hover': {
            boxShadow: 'rgba(0,0,0,0.25) 2px 3px 2px 0px',
            transition: 'box-shadow 0.2s ease-in'
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
        '& input': {
            padding: '12.5px 20px 12.5px 5px',
        },
        '& fieldset': {
            border: '0'
        } 
    },
    icon: {
        fontSize: '20px',
        marginRight: '5px',
        color: 'white',
        borderRadius: '50px',
        padding: '6px',
        border: '1px solid rgba(255,255,255,0.2)',
        
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
    tag: {
        padding: '5px 10px',
        borderRadius: '50px',
        boxShadow: 'rgba(0,0,0,0.25) 0px 0px 3px 1px',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        margin: '3px 0'
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
    selected: {
        width: 'fit-content'
    }
}))

