import React, { useState } from 'react'
import { Grid, makeStyles,  useMediaQuery, Collapse, Button } from '@material-ui/core'
import { SortBy } from '../../reuseables/SortBy'
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import { SearchBox } from '../../reuseables/SearchBox';
import { FilterBySelect } from '../../reuseables/FilterBySelect';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import { getUserList } from '../../../api/userApi';
import { FilterByMultiSelect } from '../../reuseables/FilterByMultiSelect';
import { useTranslation } from 'react-i18next';
import FilterListIcon from '@material-ui/icons/FilterList';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import { ClearRounded } from '@material-ui/icons';


const sortOptions = [
    {
        text: 'כתובת',
        field: 'street'
    },
    {
        text: 'עיר',
        field: 'city'
    },
    {
        text: 'מנהל בניין',
        field: 'owner'
    },
    {
        text: 'כמות משימות פתוחות',
        field: 'openTasksCount'
    },
    {
        text: 'כמות תקלות פתוחות',
        field: 'openFaultsCount'
    },
    
]

export const AssetsControls = ({ components }) => {
    
    const classes = useStyles();
    const { t, i18n } = useTranslation();
    const downSm = useMediaQuery(theme => theme.breakpoints.down('md'));
    const [ collapsed, setCollapsed ] = useState(!downSm ? true : false);
    

    const createUserOptions = () => {
        return getUserList()
        .then(data => {
            let userList = [];
            data.forEach(user => {
                userList.push({label: `${user.firstName} ${user.lastName}`, value: user._id })
            });
            return userList;
        })
    }

    const toggleCollapse = () => {
        if (collapsed) {
            setCollapsed(false);
            return;
        }
        setCollapsed(true)
    }

    return (
        <React.Fragment>
            {
                downSm &&
                <Grid container justify='center'>
                    <Grid item xs={11} className={classes.gridItem}>
                        <Button
                        className={classes.sortandfilter}
                        startIcon={<FilterListIcon className={classes.icon} />}
                        endIcon={collapsed ? <ClearRounded /> : <ExpandMoreRoundedIcon />}
                        onClick={toggleCollapse}
                    >
                        {t(`faultsModule.${ collapsed ? 'hide' : 'show'}Filters`)}
                    </Button>
                    </Grid>
                </Grid>
                    
            }
            <Collapse in={collapsed}>
                <Grid container justify='center' >
                    <Grid item xs={11} sm={9} md={7} lg={5} xl={4} className={classes.gridItem}>
                        <SearchBox 
                            placeholder={t("assetsModule.filterByCityOrAddress")}
                            filterField={'searchText'}
                        />
                    </Grid>
                    <Grid item xs={11} className={classes.gridItem}>         
                        <FilterBySelect 
                            optionsFunc={createUserOptions}
                            placeholder={t("assetsModule.filterByAssetOwner")}
                            filterIcon={<PersonRoundedIcon className={classes.icon }/>}
                            filterField={'owner'}
                        
                        />
                    
                        <SortBy 
                            menuOptions={sortOptions}
                        />   
                    </Grid>  
                </Grid>
            </Collapse>
        </React.Fragment>
    )
}


const useStyles = makeStyles(them => ({
    gridItem: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    icon: {
        fontSize: '20px',
        marginLeft: '4px',
        color: 'white',
        borderRadius: '50px',
        padding: '6px',
        border: '1px solid rgba(255,255,255,0.2)',
    },
    sortandfilter: {
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        borderRadius: '50px',
        padding: '5px 25px 5px 3px',
        whiteSpace: 'nowrap',
        '&:hover': {
            background: 'black'
        }
    }
}))
