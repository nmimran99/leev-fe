import React, { useState, useEffect, useContext } from 'react'
import { makeStyles, ButtonGroup, Button, Menu, MenuItem } from '@material-ui/core'
import SortRoundedIcon from '@material-ui/icons/SortRounded';
import ArrowDropUpOutlinedIcon from '@material-ui/icons/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import { useHistory, useLocation } from 'react-router-dom';
import { addQueryParam } from '../../api/genericApi';
import { useQuery } from './customHooks/useQuery';
import { useTranslation } from 'react-i18next'
import { LanguageContext } from '../../context/LanguageContext';


export const SortBy = ({menuOptions, handleSortChange}) => {
    
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const query = useQuery(location.search);
    const { t, i18n } = useTranslation();
    const { lang } = useContext(LanguageContext);
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
        return t("sort.sortBy")
    }
    
    return (
        <React.Fragment>
            <ButtonGroup 
                className={classes.sort}
            >

                <Button 
                    className={classes.sortBy}
                    onClick={event => setAnchorEl(event.currentTarget)}
                    startIcon={<SortRoundedIcon className={classes.icon}/>}
                >
                    {values.sortBy ? getOptionText(values.sortBy) : `${t("sort.sortBy")}`}
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
                                    style={{ direction: lang.code === 'he' ? 'rtl' : 'ltr'}}
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
                    { `${ values.sortOrder === 'asc' ? `${t("sort.asc")}` : `${t("sort.desc")}`}`}
                </Button> 
            </ButtonGroup>
            
        </React.Fragment>
    )
}

const useStyles = makeStyles(theme => ({
    sort: {
        margin: '5px',
        height: '45px',
        
    },
    sortBy: {
        borderRadius: '25px 0 0 25px',
        padding: '0 15px 0 5px',
        color: 'white',
        width: 'auto',
        whiteSpace: 'nowrap',
        border: '1px solid rgba(255,255,255,0.2)',
    },
    sortOrder: {
        borderRadius: '0px 25px 25px 0px',
        padding: 0,
        color: 'white',
       width: '100px',
       border: '1px solid rgba(255,255,255,0.2)',
    },
    menu: {
        marginTop: '55px',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
        color: 'white'
    },
    icon: {
        fontSize: '20px',
        margin: '0 6px',
        color: 'white',
        borderRadius: '50px',
        padding: '6px',
        border: '1px solid rgba(255,255,255,0.2)',
        
    }
}));
