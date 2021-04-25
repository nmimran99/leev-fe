import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { addQueryParam, removeQueryParam, queryParamsToObject, specialStringPurge} from '../../api/genericApi';
import { OutlinedInput, FormControl, makeStyles, Grid, ClickAwayListener } from '@material-ui/core'
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import { useQuery } from './customHooks/useQuery';
import clsx from 'clsx';

export const SearchBox = ({ placeholder, filterField, returnValue }) => {
    
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const query = useQuery(location.search);
    const [ onFocus, setOnFocus ] = useState(false);
    const [ searchText, setSearchText ] = useState(specialStringPurge(query[filterField]) || '');
    
    useEffect(() => {
        if (Boolean(searchText) && searchText === specialStringPurge(query[filterField])) return;
        const timeOutId = setTimeout(() => handleSearch(searchText), 700);
        return () => clearTimeout(timeOutId);
    }, [searchText])

    const handleChange = event => {
        setSearchText(event.target.value)
    }

    const handleSearch = searchText => {
        if (returnValue) {
            returnValue(searchText);
            return;
       }
        if (searchText) {
            history.push({
                path: location.pathname,
                search: addQueryParam(location.search, [{ name: filterField, value: searchText}])
            });
            return; 
        }
        history.push({
            path: location.pathname,
            search: removeQueryParam(location.search, filterField)
        });
        
    }

    return (
        <ClickAwayListener onClickAway={() => setOnFocus(false)}>
            <div className={clsx(classes.container , onFocus && classes.focused)} xs={11} sm={9} md={8} lg={6}>
                    <SearchRoundedIcon className={classes.icon}/>
                    <FormControl variant='outlined' className={classes.form}>
                        <OutlinedInput
                            value={ searchText || '' }
                            onChange={handleChange}
                            placeholder={placeholder}
                            className={clsx(classes.searchInput)}
                            onFocus={() => setOnFocus(true)}
                        />
                    </FormControl>
            </div>
        </ClickAwayListener>
    )
}

const useStyles = makeStyles(theme => ({
    container: {
        margin: '5px',
        height: '45px',
        maxWidth: '450px',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '25px',
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
            padding: '12.5px 14px',
        },
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
        
    }
}))

