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
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router'


export const Asset = ({assetData, order, removeAsset }) => {

    const classes = useStyles();
    const history = useHistory();
    const { t, i18n } = useTranslation();
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

    const handleReferralClick = type => event => {
        history.push(`${type}/?asset=${data._id}`)
    }


    return (
        <Fade in={true}>
            <Grid item xs={12} sm={7} md={6} lg={4} xl={4} >
                <ClickAwayListener onClickAway={() => editMode ? setEditMode(false) : null }>
                    <Paper 
                        className={classes.assetContainer} 
                        style={{ 
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.2)', 
                            height: editMode ? transition.container.height : 'auto', 
                            transition: editMode ? transition.container.transition : 'height 0.3s ease'
                        }} 
                        elevation={9}
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
                            <div className={classes.owner}>
                                <UserItem user={data.owner} showPhone avatarSize={'50px'}/>
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
                                                {`${data.addInfo.floors} ${t("assetsModule.floors")}`}
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
                                            {`${t("assetsModule.floor")} ${data.addInfo.floor}`}
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
                                            {`${t("assetsModule.unit")} ${data.addInfo.unit}`}
                                            </div>
                                        </div>
                                    </div>
                                    : null
                                }
                                {
                                    data.addInfo.units ?
                                    <div className={clsx(classes.type, classes.units)}>
                                        <HomeRoundedIcon className={classes.typeIcon}/>
                                        <div className={classes.typeDetails}>
                                            <div className={classes.typeData}>
                                            {`${data.addInfo.units} ${t("assetsModule.units")}`}
                                            </div>
                                        </div>
                                    </div>
                                    : null
                                }
                                
                            </div>
                            <div className={clsx(classes.buttonsContainer, Boolean(editMode) && classes.buttonsContainerRound)} >
                                <Tooltip title={t("assetsModule.systems")}>
                                    <IconButton 
                                        className={classes.button}
                                        onClick={handleReferralClick('systems')}
                                    >
                                        <BlurOnRoundedIcon className={classes.typeIcon}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t("assetsModule.tasks")}>
                                    <IconButton className={classes.button}>
                                        <AssignmentRoundedIcon className={classes.typeIcon}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t("assetsModule.faults")}>
                                    <IconButton className={classes.button}>
                                        <WarningRoundedIcon className={classes.typeIcon}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t("assetsModule.documents")}>
                                    <IconButton className={classes.button}>
                                        <DescriptionRoundedIcon className={classes.typeIcon}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t("assetsModule.users")}>
                                    <IconButton className={classes.button}>
                                        <PeopleOutlineRoundedIcon className={classes.typeIcon}/>
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
                            currentOwner={data.owner._id}
                            open={editMode === 'owner'}
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
        color: 'white',
        [theme.breakpoints.down('sm')] : {
            margin: '10px 0'
        } 
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
    owner: {
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
        padding: '0 10px 0 10px',
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