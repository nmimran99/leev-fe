import React, { useState } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import { SortBy } from '../../reuseables/SortBy'
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import { SearchBox } from '../../reuseables/SearchBox';
import { FilterBySelect } from '../../reuseables/FilterBySelect';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import { getUserList } from '../../../api/userApi';


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
        field: 'siteOwner'
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

export const AssetsControls = () => {
    
    const classes = useStyles();

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

    return (
        <div>
            <Grid container justify='center' >
                <Grid item xs={12} className={classes.gridItem}>
                    <SearchBox 
                        placeholder={'סנן לפי כתובת או עיר'}
                    />
                </Grid>
                <Grid item xs={12} >
                    <Grid container justify='center'>
                        <Grid item xs={8} sm={4} md={6} lg={3} xl={2} className={classes.gridItem}>  
                            <FilterBySelect 
                                optionsFunc={createUserOptions}
                                placeholder={'סנן לפי מנהל בניין'}
                                filterIcon={<AccountCircleRoundedIcon className={classes.icon }/>}
                                filterField={'siteOwner'}
                            
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={3} xl={2} className={classes.gridItem}> 
                            <SortBy 
                                menuOptions={sortOptions}
                            />
                        </Grid>
                        
                    </Grid>
                </Grid>
                
            </Grid>
        </div>
        
    )
}


const useStyles = makeStyles(them => ({
    gridItem: {
        margin: '5px',
        display: 'flex',
        justifyContent: 'center',
    },
    icon: {
        fontSize: '20px',
        margin: '0 5px',
        color: 'white',
        borderRadius: '50px',
        padding: '6px',
        boxShadow: 'rgba(0,0,0,0.25) 0px 0px 1px 2px',
    }
}))
