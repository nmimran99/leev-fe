import React, { useEffect, useState } from 'react'
import { makeStyles, Grid, LinearProgress } from '@material-ui/core'
import { getSites, removeSite,getFullAddress } from '../../../api/assetsApi'
import { Asset } from './Asset'
import { AssetsControls } from './AssetsControls'
import { AlertDialog } from '../../reuseables/AlertDialoge'

export const Assets = ({}) => {

    const classes = useStyles();
    const [ sites, setSites ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ alertDialoge , setAlertDialoge ] = useState(null)

    useEffect(() => {
        if(!isLoading) return;
        getSites()
        .then(res => {
            if (res) {
                setSites([...res.data]);
            }
        })
        .catch(e => {
            console.log(e.message)
        })
        setIsLoading(false)
    }, [isLoading])

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
            <Grid container justify='center'  xs={12}>
                <Grid item xs={12} md={10}>
                    <AssetsControls />
                </Grid>
                <Grid container justify='center'  xs={12}>
                    {
                        isLoading ?
                        <LinearProgress /> :
                        sites.map((v,i) => 
                            <Asset 
                                data={v} 
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
    assetPaper: {
        height: '200px'
    }
}))