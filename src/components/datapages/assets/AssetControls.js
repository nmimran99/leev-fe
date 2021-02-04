import React from 'react'
import { makeStyles, Fade, IconButton, Tooltip } from '@material-ui/core'
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import TransferWithinAStationRoundedIcon from '@material-ui/icons/TransferWithinAStationRounded';


export const AssetControls = ({removeAsset, toggleEditMode}) => {
    
    const classes = useStyles();
    
    return (
        <Fade in={true} timeout={500}>
            <div className={ classes.container}>               
                <Tooltip title='עריכת כתובת'>
                    <IconButton 
                        className={classes.iconbutton}
                        onClick={toggleEditMode('address')}
                    >
                        <EditRoundedIcon className={classes.icon} />
                    </IconButton>
                </Tooltip>
                <Tooltip title='שינוי מנהל בניין'>
                    <IconButton 
                        className={classes.iconbutton}
                        onClick={toggleEditMode('siteOwner')}
                    > 
                        <TransferWithinAStationRoundedIcon className={classes.icon}/>
                    </IconButton>
                </Tooltip>
                <Tooltip title='מחיקת נכס'>
                    <IconButton 
                        className={classes.iconbutton}
                        onClick={removeAsset}    
                    >
                        <DeleteOutlineRoundedIcon className={classes.icon} />
                    </IconButton>
                </Tooltip>
            </div>
        </Fade>
    )
}

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        position: 'absolute',
        right: 0,
        top: '55%',
        
    },
    iconbutton: {
        margin: '7px 5px',
        boxShadow: 'rgba(0,0,0,0.2) 0px 0px 3px 3px ',
        background: theme.palette.primary.main,
        color: 'white',
        padding: '8px'
       
    },
    icon: {
        fontSize: '20px'
    }
}));
