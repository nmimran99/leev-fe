import React, { useState, useEffect} from 'react';
import { makeStyles, Grid, useMediaQuery, Collapse, Button, ButtonGroup } from '@material-ui/core';
import { SearchBoxSelect } from '../../reuseables/SearchBoxSelect';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import { SortBy } from '../../reuseables/SortBy';
import { getAssetsSuggestions } from '../../../api/systemsApi';
import { createUserOptions } from '../../../api/userApi';
import { useTranslation } from 'react-i18next';
import { FilterByMultiSelect } from '../../reuseables/FilterByMultiSelect';
import { useHistory, useLocation } from 'react-router';
import { useQuery } from '../../reuseables/customHooks/useQuery';
import { getFullAddress, getAsset } from '../../../api/assetsApi';
import { getFaultsStatusListSuggestions } from '../../../api/faultsApi';
import { getSystemsByAssetOptions } from '../../../api/systemsApi'
import DonutSmallIcon from '@material-ui/icons/DonutSmall';
import FilterListIcon from '@material-ui/icons/FilterList';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import { ClearRounded } from '@material-ui/icons';
import ViewListRoundedIcon from '@material-ui/icons/ViewListRounded';
import ViewWeekRoundedIcon from '@material-ui/icons/ViewWeekRounded';
import clsx from 'clsx'
import { removeQueryParam } from '../../../api/genericApi';



export const FaultsControls = ({ viewType, setViewType }) => {

    const history = useHistory();
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
                } 
            })
        } else {
            setReloadedValue({
                label: '',
                value: null
            });
            history.push({
                path: location.pathname,
                search: removeQueryParam(location.search, 'system')
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
                    <Grid item xs={12} className={classes.gridItem}>
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
                            {
                                query.asset &&
                                <FilterByMultiSelect 
                                optionsFunc={() => getSystemsByAssetOptions(query.asset)}
                                placeholder={t("systemsModule.filterBySystemName")}
                                filterIcon={<DonutSmallIcon className={classes.icon} />}
                                filterField={'system'}
                            />
                            } 
                            {
                            viewType === 'list' &&
                                <FilterByMultiSelect 
                                    optionsFunc={getFaultsStatusListSuggestions}
                                    placeholder={t("faultsModule.filterByStatus")}
                                    filterIcon={<DonutSmallIcon className={classes.icon} />}
                                    filterField={'status'}

                                />
                            }
                    </Grid>
                    
                    <Grid item xs={12}className={classes.gridItem}>
                        <FilterByMultiSelect 
                            optionsFunc={createUserOptions}
                            placeholder={t("faultsModule.filterByFaultOwner")}
                            filterIcon={<PersonRoundedIcon className={classes.icon }/>}
                            filterField={'owner'}
                        />
                        <ButtonGroup
                            className={classes.typeGroup}
                        >
                            <Button
                                className={clsx(classes.modeBtn, classes.listBtn, viewType === 'list' ? classes.modeBtnActive : null)}
                                startIcon={<ViewListRoundedIcon className={classes.icon}/>}
                                onClick={() => setViewType('list')}
                            >
                                {t("faultsModule.listMode")}
                            </Button>
                            <Button
                                className={clsx(classes.modeBtn, classes.blocksBtn, viewType === 'blocks' ? classes.modeBtnActive : null)}
                                startIcon={<ViewWeekRoundedIcon className={classes.icon} />}
                                onClick={() => setViewType('blocks')}
                            >
                                {t("faultsModule.blocksMode")}
                            </Button>
                        </ButtonGroup>
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
    },
    typeGroup: {
        margin: '5px',
        height: '45px'

    },
    modeBtn: {   
        padding: '0 15px 0 5px',
        color: 'white',
        width: 'auto',
        whiteSpace: 'nowrap',
        border: '1px solid rgba(255,255,255,0.2)',
    },
    listBtn: {
        borderRadius: '25px 0 0 25px',
    },
    blocksBtn: {
        borderRadius: '0px 25px 25px 0px',
    },
    modeBtnActive: {
        background: 'rgba(0,0,0,0.6)'
    }

}))