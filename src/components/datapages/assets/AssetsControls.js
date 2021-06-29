import React, { useContext, useState } from 'react'
import { Grid, makeStyles,  useMediaQuery, Slide, Button } from '@material-ui/core'
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
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import { getTenantOptions } from '../../../api/adminApi';
import { AuthContext } from '../../../context/AuthContext';


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
    }
    
]

export const AssetsControls = () => {
    
    const classes = useStyles();
    const { t, i18n } = useTranslation();
    const { auth } = useContext(AuthContext);
    const downSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const [ collapsed, setCollapsed ] = useState(false);
    

    const createUserOptions = async () => {
        const res = await getUserList();
        if ([403, 500].includes(res.status))
            return [];
        let userList = [];
        res.forEach(user => {
            userList.push({ label: `${user.firstName} ${user.lastName}`, value: user._id });
        });
        return userList;
    }


    const createTenantsOptions = async () => {
        const res = await getTenantOptions();
        return res;
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
            <Slide direction={'up'} in={true} timeout={downSm ? 500 : 0}>
                <Grid container justify='center' className={classes.filtersContainer}>
                    <Grid item xs={11} sm={9} md={7} lg={5} xl={4} className={classes.gridItem}>
                        {
                            auth.user.isAdmin && 
                            <FilterBySelect 
                                optionsFunc={createTenantsOptions}
                                placeholder={t("assetsModule.filterByClient")}
                                filterIcon={<PeopleAltIcon className={classes.icon }/>}
                                filterField={'tenant'}
                            />
                        }
                        
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
    }
}))
