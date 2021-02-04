import React, { useEffect, useState } from 'react'
import { makeStyles, Grid, ClickAwayListener, Paper, Typography, Fade, useMediaQuery, IconButton, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import { UserItem } from '../../user/UserItem'
import { AssetControls } from './AssetControls'
import CategoryOutlinedIcon from '@material-ui/icons/CategoryOutlined';
import VerticalSplitRoundedIcon from '@material-ui/icons/VerticalSplitRounded';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import AssignmentRoundedIcon from '@material-ui/icons/AssignmentRounded';
import DescriptionRoundedIcon from '@material-ui/icons/DescriptionRounded';
import { UpdateAsset } from './UpdateAsset';
import { updateSiteAddress } from '../../../api/assetsApi'
import { UpdateAssetOwner } from './UpdateAssetOwner';
import PeopleOutlineRoundedIcon from '@material-ui/icons/PeopleOutlineRounded';
import BlurOnRoundedIcon from '@material-ui/icons/BlurOnRounded';

const gradients = [
    'linear-gradient(38deg, rgba(170,0,255,0.6194852941176471) 0%, rgba(44,23,238,0.5438550420168067) 100%)',
    
    'linear-gradient(55deg, rgba(0,255,68,0.7931547619047619) 0%, rgba(255,214,0,0.7315301120448179) 100%)',
    'linear-gradient(55deg, rgba(242,0,0,0.6923144257703081) 0%, rgba(250,130,0,0.8239670868347339) 100%)',
    'linear-gradient(55deg, rgba(4,0,255,0.8211659663865546) 0%, rgba(0,255,244,0.7063200280112045) 100%)',
    'linear-gradient(55deg, rgba(73,0,242,0.6923144257703081) 0%, rgba(250,0,249,0.6643032212885154) 100%)',
    
]

export const Asset = ({assetData, order, removeAsset }) => {

    const classes = useStyles();
    const [ controlsVisible, setControlsVisible ] = useState(false);
    const [ editMode, setEditMode ] = useState(false);
    const matches = useMediaQuery(theme => theme.breakpoints.up('sm'));
    const [ data, setData ] = useState(assetData);
    const [ transition, setTransition ] = useState({
        container: {
            transition: 'height 0.3s ease'
        }
    });
    
    useEffect(() => {
        if (editMode){
            setTransition({
                container: {
                    transition: 'height 0.3s ease'
                }
            })  
        } else {
            setTransition({
                container: {    
                    transition: 'height 0.3s ease'
                }
            })
        }
    }, [editMode]);
    

    const toggleControls = () => {
        if(controlsVisible) {
            setControlsVisible(false)
        } else {
            setControlsVisible(true)
        }          
    }

    const toggleEditMode = type => event => {
        if (editMode === type) {
            setEditMode(false)
        } else {
            setEditMode(type)
        }
    }

    const handleUpdate = async (siteId, address, addInfo, type) => {
        const res = await updateSiteAddress(siteId, address, addInfo, type);
        if (res) {
            setEditMode(false);
            setData(res.data);
        }
        
    }


    return (
        <Fade in={true}>
            <Grid item xs={12} sm={7} md={6} lg={4} xl={4} >
                <ClickAwayListener onClickAway={() => editMode ? setEditMode(false) : null }>
                    <Paper 
                        className={classes.assetContainer} 
                        style={{ 
                            background: gradients[order % 4], 
                            height: editMode ? transition.container.height : 'auto', 
                            transition: editMode ? transition.container.transition : 'height 0.3s ease'
                        }} 
                        elevation={6}
                        onMouseEnter={toggleControls}
                        onMouseLeave={toggleControls}
                    >
                        <div className={classes.topMain} >
                            <div className={classes.address}>
                                <Typography className={classes.addMain}>
                                    {`${data.address.street} ${data.address.streetNumber}${data.address.entrance || ''}`}
                                </Typography>
                                <Typography className={classes.addSec}>
                                    {`${data.address.city}`}
                                </Typography>
                                <Typography className={classes.addZip}> 
                                    {`${data.address.zipcode}, ${data.address.country}`}
                                </Typography>
                            </div>
                            <div className={classes.siteOwner}>
                                <UserItem user={data.siteOwner} showPhone avatarSize={'50px'}/>
                            </div>
                            {
                                (controlsVisible || !matches) &&
                                <AssetControls 
                                    removeAsset={() => removeAsset(data._id, data)} 
                                    toggleEditMode={toggleEditMode}/>
                            }
                        </div>
                        <div 
                            className={classes.bottomMain}
                        >
                            <div className={classes.extraDetails}>
                                <div className={classes.type}>
                                    <CategoryOutlinedIcon className={classes.typeIcon}/>
                                    <div className={classes.typeDetails}>
                                        <div className={classes.typeData}>
                                            {data.type}
                                        </div>
                                    </div>
                                </div>
                                {
                                    data.addInfo.floors ? 
                                    <div className={clsx(classes.type, classes.floor)}>
                                        <VerticalSplitRoundedIcon className={classes.typeIcon}/>
                                        <div className={classes.typeDetails}>
                                            <div className={classes.typeData}>
                                                {`${data.addInfo.floors} קומות`}
                                            </div>
                                        </div>
                                    </div>
                                    : null
                                }
                                {
                                    data.addInfo.floor ?
                                    <div className={clsx(classes.type, classes.floor)} >
                                        <VerticalSplitRoundedIcon className={classes.typeIcon}/>
                                        <div className={classes.typeDetails}>
                                            <div className={classes.typeData}>
                                            {`קומה ${data.addInfo.floor}`}
                                            </div>
                                        </div>
                                    </div>
                                    : null
                                }
                                {
                                    data.addInfo.unit ?
                                    <div className={clsx(classes.type, classes.unit)}>
                                        <HomeRoundedIcon className={classes.typeIcon}/>
                                        <div className={classes.typeDetails}>
                                            <div className={classes.typeData}>
                                            {`דירה ${data.addInfo.unit}`}
                                            </div>
                                        </div>
                                    </div>
                                    : null
                                }
                                
                            </div>
                            <div className={clsx(classes.buttonsContainer, Boolean(editMode) && classes.buttonsContainerRound)} >
                                <Tooltip title={`תקלות`}>
                                    <IconButton className={classes.button}>
                                        <WarningRoundedIcon className={classes.typeIcon}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={`משימות`}>
                                    <IconButton className={classes.button}>
                                        <AssignmentRoundedIcon className={classes.typeIcon}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={`מסמכים`}>
                                    <IconButton className={classes.button}>
                                        <DescriptionRoundedIcon className={classes.typeIcon}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={`משתמשים`}>
                                    <IconButton className={classes.button}>
                                        <PeopleOutlineRoundedIcon className={classes.typeIcon}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={`מערכות`}>
                                    <IconButton className={classes.button}>
                                        <BlurOnRoundedIcon className={classes.typeIcon}/>
                                    </IconButton>
                                </Tooltip>                
                            </div>
                        </div>
                    
                        <UpdateAsset 
                            data={data} 
                            open={editMode === 'address'}
                            handleUpdate={handleUpdate}
                            handleCancel={() => setEditMode(false)}
                        />
                        <UpdateAssetOwner 
                            currentOwner={data.siteOwner._id}
                            open={editMode === 'siteOwner'}
                            handleUpdate={handleUpdate}
                            handleCancel={() => setEditMode(false)}
                        />
                   
                    </Paper>
                </ClickAwayListener>
            </Grid>
        </Fade>
        
        
    )

}


const useStyles = makeStyles(theme => ({
    assetContainer: {
        margin: '10px',
        background: 'white',
        borderRadius: '25px',
        height: 'auto',
        color: 'white'
    },
    topMain: {
        height: '120px',
        borderRadius: '25px',
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative'
    },
    address: {
        padding: `${theme.spacing(3)}px 0 0 ${theme.spacing(3)}px`,
         
        maxWidth: '45%'
    },
    addMain: {
        fontSize: '20px',
        lineHeight: 1
    },
    addSec: {
        fontSize: '14px'
    },
    addZip: {
        fontSize: '14px'
    },
    bottomMain: {
        height: 'auto',
        borderRadius: '25px',
        position: 'relative',
        background: 'transparent',
        display: 'grid',
        placeItems: 'center'
    },
    siteOwner: {
        width: '160px',
        height: '50px',
        padding: '7px',
        borderRadius: '0px 25px 0px 30px',
        boxShadow: '0 2px 20px 0 rgb(0 0 0 / 37%)',
        '&:hover' :{
            background: 'black',
            transition: 'background 0.2s ease',
            boxShadow: '0 8px 32px 0 rgb(0 0 0 / 80%)',
        }
    },
    extraDetails: {
        display: 'flex',
        justifyContent: 'center',
        height: '30px',
        borderRadius: '25px',
        background: theme.palette.primary.main,
        width: 'fit-content',
        boxShadow: 'rgba(0,0,0,0.4) 0px 0px 5px 2px'
    },
    type: {
        position: 'relative',
        display: 'flex',
        padding: '5px 10px',
        width: 'fit-content',
        background: 'transparent',
        color: 'white',
        alignItems: 'center'
    },
    typeIcon: {
        fontSize: '20px',
        color: 'white'
    },
    typeData: {
        padding: '0 20px 0 10px',
        lineHeight: 1
    },
    buttonsContainer: {
        width: 'fit-content',
        margin: '10px auto 0',
        height: 'auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        borderRadius: '10px 10px 0 0',
        transition: 'border-radius 0.5s ease',
        background: theme.palette.primary.main,
        boxShadow: 'rgba(0,0,0,0.4) 0px 0px 5px 2px'  
    },
    buttonsContainerRound: {
        borderRadius: '25px',
        transition: 'border-radius 0.5s ease'
    },
    button: {
        '&:hover': {
            background: 'rgba(0,0,0,0.5)',
        }
    },
    
    
}))