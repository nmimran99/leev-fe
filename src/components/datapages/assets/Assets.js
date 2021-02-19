import React, { useEffect, useState } from 'react'
import { Grid, LinearProgress, makeStyles } from '@material-ui/core'
import { getAssets, removeAsset,getFullAddress, applyFilters } from '../../../api/assetsApi'
import { Asset } from './Asset'
import { AssetsControls } from './AssetsControls'
import { AlertDialog } from '../../reuseables/AlertDialoge'
import { queryParamsToObject } from '../../../api/genericApi';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Assets = () => {

    const location = useLocation();
    const classes = useStyles();
    const { t, i18n } = useTranslation();
    const [ assets, setAssets ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ alertDialoge , setAlertDialoge ] = useState(null)

    useEffect(() => {
        if(!isLoading) return;
        getAssets()
        .then(res => {
            if (res) {
                return applyFilters(queryParamsToObject(location.search), res.data)   
            }
        })
        .then(data => {
            if (data) {
                setAssets(data)
            }
        }) 
        .catch(e => {
            console.log(e.message)
        })
        .finally(() => setIsLoading(false))
        
    }, [isLoading])

    useEffect(()=> {
        setIsLoading(true)
    }, [location.search])

    const removeAsset = (assetId, data) => {
        setAlertDialoge({
            handleConfirm: async () => {
                const res = await removeAsset(assetId);
                if (res) {
                    setAlertDialoge(null)
                    setIsLoading(true);
                } else {
                    console.log(res)
                }
            },
            handleCancel: () => setAlertDialoge(null),
            text: `${t("assetsModule.deleteConfirmation")} ${getFullAddress(data)}?`,
            title: `${t("assetsModule.deleteAsset")}`
        })
    }


    return (
        <div>
            <Grid container >
                <Grid item xs={12}>
                    <div className={classes.pageModule}>
                        {t("assetsModule.assets")}
                    </div>
                </Grid>
                <Grid item xs={12} md={12} >
                    <AssetsControls />
                </Grid>
                <Grid container justify='center'>
                    {
                        isLoading ?
                        <LinearProgress /> :
                        assets.map((v,i) => 
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

const useStyles = makeStyles(theme => ({
    pageModule: {
        color: 'white',
        padding: '10px 40px',
        fontSize: '18px',
        background: 'rgba(0,0,0,0.6)',
        margin: '0px auto 5px',
        width: '30%',
        textAlign: 'center',
        borderRadius: '0 0 25px 25px',
        lineHeight: '1'
    }
}))