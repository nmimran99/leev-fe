import React, { useEffect, useState } from 'react'
import { Grid, LinearProgress } from '@material-ui/core'
import { getSites, removeSite,getFullAddress, applyFilters } from '../../../api/assetsApi'
import { Asset } from './Asset'
import { AssetsControls } from './AssetsControls'
import { AlertDialog } from '../../reuseables/AlertDialoge'
import { queryParamsToObject } from '../../../api/genericApi';
import { useLocation } from 'react-router-dom';

export const Assets = () => {

    const location = useLocation();
    const [ sites, setSites ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ alertDialoge , setAlertDialoge ] = useState(null)

    useEffect(() => {
        if(!isLoading) return;
        getSites()
        .then(res => {
            if (res) {
                return applyFilters(queryParamsToObject(location.search), res.data)   
            }
        })
        .then(data => {
            if (data) {
                setSites(data)
            }
        }) 
        .catch(e => {
            console.log(e.message)
        })
        .finally(() => setIsLoading(false))
        
    }, [isLoading])

    useEffect(()=> {
        if(location.search) {
            setIsLoading(true)
        }
    }, [location.search])

    const removeAsset = (siteId, data) => {
        setAlertDialoge({
            handleConfirm: async () => {
                const res = await removeSite(siteId);
                if (res) {
                    setAlertDialoge(null)
                    setIsLoading(true);
                } else {
                    console.log(res)
                }
            },
            handleCancel: () => setAlertDialoge(null),
            text: `האם אתה בטוח שברצונך למחוק את הנכס שכתובתו ${getFullAddress(data)}?`,
            title: `מחיקת נכס`
        })
    }


    return (
        <div>
            <Grid container >
                <Grid item xs={12} md={12} >
                    <AssetsControls />
                </Grid>
                <Grid container justify='center' >
                    {
                        isLoading ?
                        <LinearProgress /> :
                        sites.map((v,i) => 
                            <Asset 
                                assetData={v} 
                                key={i} 
                                order={i}
                                removeAsset={removeAsset}
                                
                            />
                        )    
                    }
                </Grid>
            </Grid>
            {
                Boolean(alertDialoge) &&
                <AlertDialog 
                    open={Boolean(alertDialoge)}
                    alertDialoge={alertDialoge}
                />
            }
            
        </div>
            
    )
}

