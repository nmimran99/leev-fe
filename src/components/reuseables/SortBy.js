import React, { useState, useEffect } from 'react'
import { makeStyles, ButtonGroup, Button, Menu, MenuItem } from '@material-ui/core'
import SortRoundedIcon from '@material-ui/icons/SortRounded';
import ArrowDropUpOutlinedIcon from '@material-ui/icons/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import { useHistory, useLocation } from 'react-router-dom';
import { addQueryParam } from '../../api/genericApi';
import { useQuery } from './customHooks/useQuery';

export const SortBy = ({menuOptions, handleSortChange}) => {
    
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const query = useQuery(location.search);
    const [ values, setValues ] = useState({
        sortBy: query.sortBy || '',
        sortOrder: query.sortOrder || 'asc' 
    })
    const [ anchorEl, setAnchorEl ] = useState(null);
 
    useEffect(() => {
        if (!values.sortBy) return;
        history.push({
            path: location.pathname,
            search: addQueryParam(location.search, [{ name: 'sortBy', value: values.sortBy}, {name: 'sortOrder', value: values.sortOrder}])
        })
    }, [values])

    const handleClick = menuOption => event => {
        setValues({
            ...values, 
            sortBy: menuOption
        })
        setAnchorEl(null);
    }

    const handleChange = () => {
        if (values.sortBy) {
            setValues({
                ...values, 
                sortOrder: values.sortOrder === 'asc' ? 'desc' : 'asc'
            })
        }
    }
    
    const getOptionText = (option) => {
        const result = menuOptions.find( mo => option === mo.field);
        if (result) {
            return result.text
        }
        return 'סדר לפי'
    }
    
    return (
        <React.Fragment>
            <ButtonGroup 
                className={classes.sort}
            >

                <Button 
                    className={classes.sortBy}
                    onClick={event => setAnchorEl(event.currentTarget)}
                    startIcon={<SortRoundedIcon />}
                >
                    {values.sortBy ? getOptionText(values.sortBy) : 'סדר לפי'}
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
                                    onClick={handleClick(v.field)}
                                >
                                    {v.text}
                                </MenuItem>
                            )
                            
                        })
                    }
                </Menu>
                <Button
                    endIcon={ values.sortOrder === 'asc' ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />}
                    onClick={handleChange}
                    className={classes.sortOrder}
                >
                    { `${ values.sortOrder === 'asc' ? `סדר עולה` : `סדר יורד`}`}
                </Button> 
            </ButtonGroup>
            
        </React.Fragment>
    )
}

const useStyles = makeStyles(theme => ({
    sort: {
        height: '45px'
    },
    sortBy: {
        borderRadius: '25px 0 0 25px',
        padding: '0 20px',
        color: 'white',
        width: 'auto',
        whiteSpace: 'nowrap'
    },
    sortOrder: {
        borderRadius: '0px 25px 25px 0px',
        padding: 0,
        color: 'white',
       width: '100px'
    },
    menu: {
        marginTop: '55px',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        color: 'white'
    }
}));
