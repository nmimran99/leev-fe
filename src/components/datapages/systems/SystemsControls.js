import React, { useState, useEffect } from 'react'
import { Grid, makeStyles, useMediaQuery, Button, Slide } from '@material-ui/core'
import { SortBy } from '../../reuseables/SortBy'
import { SearchBox } from '../../reuseables/SearchBox';
import { FilterBySelect } from '../../reuseables/FilterBySelect';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import { createUserOptions } from '../../../api/userApi';
import { useTranslation } from 'react-i18next';
import { SearchBoxSelect } from '../../reuseables/SearchBoxSelect';
import { getAssetsSuggestions } from '../../../api/systemsApi';
import { getFullAddress, getAsset } from '../../../api/assetsApi';
import { useLocation } from 'react-router';
import { useQuery } from '../../reuseables/customHooks/useQuery';
import FilterListIcon from '@material-ui/icons/FilterList';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import { ClearRounded } from '@material-ui/icons';

const sortOptions = [
    {
        text: 'שם מערכת',
        field: 'systemName'
    },
    {
        text: 'מנהל מערכת',
        field: 'owner'
    },
    {
        text: 'כמות תקלות פתוחות',
        field: 'openFaultsCount'
    },
    
]

export const SystemsControls = () => {
    
    const classes = useStyles();
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const query = useQuery(location.search);
    const downSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const [ reloadedValue, setReloadedValue ] = useState(null);
    const [ collapsed, setCollapsed ] = useState(false);
    
    useEffect(() => {
        if (query.asset) {
            handleReloaded(query.asset)
            .then(data => {
                if (data) {
                    setReloadedValue(data);
                } else {
                    
                }
            })
        } else {
            setReloadedValue({
                label: '',
                value: null
            });
        }
    }, [location.search])

    const handleReloaded = async (assetId) => {
        const res = await getAsset(assetId, false);
        if (res) {
            return {
                label: getFullAddress(res),
                value: res._id
            }
        }
        
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
           { 
			(!downSm || collapsed) &&
			<Slide in={true} direction={'up'} timeout={downSm ? 500  : 0}>
                <Grid container justify='center' className={classes.filtersContainer}>
                    <Grid item xs={12} className={classes.gridItem}>

                        {
                            reloadedValue &&
                            <SearchBoxSelect
                                suggestionsFunc={getAssetsSuggestions}
                                placeholder={t("systemsModule.filterByAsset")}
                                filterField={'asset'}
                                reloadedLabel={reloadedValue.label}
                                reloadedValue={reloadedValue.value}
                            />
                        }  
                        <SearchBox 
                                placeholder={t("systemsModule.filterBySystemName")}
                                filterField={'name'}
                            />
                        </Grid>
                    <Grid xs={11} className={classes.gridItem}>
                        <FilterBySelect 
                            optionsFunc={createUserOptions}
                            placeholder={t("systemsModule.filterBySystemOwner")}
                            filterIcon={<PersonRoundedIcon className={classes.icon }/>}
                            filterField={'owner'}
                        />
                        <SortBy 
                            menuOptions={sortOptions}
                        />
                    </Grid>
                    
                </Grid>
            </Slide>
            }
        </React.Fragment>
    )
}


const useStyles = makeStyles(theme => ({
    filtersContainer: {
        [theme.breakpoints.down('sm')]: {
            position: 'absolute',
            bottom: '0',
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(22px)',
            zIndex: 3,
            padding: '40px 0 155px',
            borderRadius: '30px 30px 0 0',
            boxShadow: '0px -1px 1px 0px rgba(255,255,255,0.2)'
        }
    },
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
        background: 'black',
        color: 'white',
        borderRadius: '50px',
        padding: '5px 25px 5px 3px',
        whiteSpace: 'nowrap',
        margin: '10px 0 0',
        position: 'absolute',
        bottom: '100px',
        zIndex: 4,
        '&:hover': {
            background: 'black'
        }
    },
}))
