import React, { useState, useEffect} from 'react';
import { makeStyles, Grid, useMediaQuery, Collapse, Button } from '@material-ui/core';
import { SearchBoxSelect } from '../../reuseables/SearchBoxSelect';
import { SearchBox } from '../../reuseables/SearchBox';
import { FilterBySelect } from '../../reuseables/FilterBySelect';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import { SortBy } from '../../reuseables/SortBy';
import { getAssetsSuggestions } from '../../../api/systemsApi';
import { createUserOptions } from '../../../api/userApi';
import { useTranslation } from 'react-i18next';
import { FilterByMultiSelect } from '../../reuseables/FilterByMultiSelect';
import { useLocation } from 'react-router';
import { useQuery } from '../../reuseables/customHooks/useQuery';
import { getFullAddress, getSite } from '../../../api/assetsApi';
import { getFaultsStatusList, getFaultsStatusListSuggestions } from '../../../api/faultsApi';
import DonutSmallIcon from '@material-ui/icons/DonutSmall';
import FilterListIcon from '@material-ui/icons/FilterList';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import { ClearRounded } from '@material-ui/icons';

const sortOptions = [
    {
        text: 'מס"ד תקלה',
        field: 'faultIdentifier'
    },
    {
        text: 'נכס',
        field: 'asset'
    },
    {
        text: 'סטטוס תקלה',
        field: 'faultStatus'
    },
    {
        text: 'ממונה על תקלה',
        field: 'owner'
    }
    
    
]


export const FaultsControls = ({ mode }) => {

    const location = useLocation();
    const query = useQuery(location.search);
    const classes = useStyles();
    const downSm = useMediaQuery(theme => theme.breakpoints.down('md'));
    const { t, i18n } = useTranslation();
    const [ reloadedValue, setReloadedValue ] = useState(null);
    const [ collapsed, setCollapsed ] = useState(!downSm ? true : false);

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
        const res = await getSite(assetId);
        if (res) {
            return {
                label: getFullAddress(res.data),
                value: res.data._id
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
            <Collapse in={collapsed}>
                <Grid container justify='center'>  
                    <Grid item xs={11} sm={8} md={7} lg={4} xl={4} className={classes.gridItem}>
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
                    </Grid>
                    <Grid item xs={11} sm={8} md={7} lg={4} xl={4} className={classes.gridItem}>                  
                        <SearchBox 
                            placeholder={t("systemsModule.filterBySystemName")}
                            filterField={'name'}
                        />
                    </Grid>
                    <Grid xs={11} className={classes.gridItem} >
                        {
                            mode === 'list' &&
                            <FilterByMultiSelect 
                                optionsFunc={getFaultsStatusListSuggestions}
                                placeholder={t("faultsModule.filterByStatus")}
                                filterIcon={<DonutSmallIcon className={classes.icon} />}
                                filterField={'status'}

                            />
                        }
                        <FilterByMultiSelect 
                            optionsFunc={createUserOptions}
                            placeholder={t("faultsModule.filterByFaultOwner")}
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
        alignItems: 'flex-start',
        flexWrap: 'wrap'
    },
    icon: {
        fontSize: '20px',
        marginLeft: '7px',
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