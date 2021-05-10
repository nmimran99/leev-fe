import React, { useContext, useState } from 'react'
import { makeStyles, Grid, ClickAwayListener, Paper, Typography, Fade, useMediaQuery, IconButton, Tooltip, Backdrop, Modal, Snackbar } from '@material-ui/core'
import clsx from 'clsx'
import { UserItem } from '../../user/UserItem'
import { AssetControls } from './AssetControls'
import CategoryOutlinedIcon from '@material-ui/icons/CategoryOutlined';
import VerticalSplitRoundedIcon from '@material-ui/icons/VerticalSplitRounded';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import AssignmentRoundedIcon from '@material-ui/icons/AssignmentRounded';
import DescriptionRoundedIcon from '@material-ui/icons/DescriptionRounded';
import { updateAsset } from '../../../api/assetsApi'
import PeopleOutlineRoundedIcon from '@material-ui/icons/PeopleOutlineRounded';
import BlurOnRoundedIcon from '@material-ui/icons/BlurOnRounded';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router'
import { UpdateOwner } from '../../reuseables/UpdateOwner'
import { UpsertAsset } from './UpsertAsset'
import { SnackbarContext } from '../../../context/SnackbarContext'


export const Asset = ({assetData, order, removeAsset }) => {

    const classes = useStyles();
    const history = useHistory();
    const { t, i18n } = useTranslation();
    const { setSnackbar } = useContext(SnackbarContext);
    const [ controlsVisible, setControlsVisible ] = useState(false);
    const [ editMode, setEditMode ] = useState(false);
    const matches = useMediaQuery(theme => theme.breakpoints.up('sm'));
    const [ data, setData ] = useState(assetData);
    
    
    const toggleEditMode = type => event => {
        if (editMode === type) {
            setEditMode(false)
        } else {
            setEditMode(type)
        }
    }

    const handleUpdate = async (details) => {
        const res = await updateAsset(details);
        if (res.status === 403) {
            setSnackbar(res);
        } else if (res) {
            setData(res.data);
        }
        setEditMode(false);
        
    }

    const handleReferralClick = type => event => {
        history.push(`${type}/?asset=${data._id}`)
    }

    // const updateOwner = (userId) => {
	// 	(task._id, userId)
	// 	.then((res) => {
	// 		if (res.status === 403) {
	// 			setSnackbar(res);
	// 		} else if (res) {
	// 			setTask({
	// 				...task,
	// 				owner: res.owner,
	// 			});
	// 		}
	// 		setChangeOwner(false);
	// 	});
	// };


    return (
        <Fade in={true}>
            <Grid item xs={12} sm={7} md={6} lg={4} xl={4} >
                <ClickAwayListener onClickAway={() => editMode ? setEditMode(false) : null }>
                    <Paper 
                        className={classes.assetContainer} 
                        elevation={9}
                        onMouseEnter={() => setControlsVisible(true)}
                        onMouseLeave={() => setControlsVisible(false)}
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
                                <UserItem user={data.owner} showPhone showName avatarSize={'40px'} size={12}/>
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
                                            {t(`assetsModule.${data.type}`)}
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
                                    <IconButton className={classes.button} onClick={handleReferralClick('tasks')}>
                                        <AssignmentRoundedIcon className={classes.typeIcon}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t("assetsModule.faults")}>
                                    <IconButton className={classes.button} onClick={handleReferralClick('faults')}>
                                        <WarningRoundedIcon className={classes.typeIcon}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t("assetsModule.documents")}>
                                    <IconButton className={classes.button} onClick={handleReferralClick('documents')}>
                                        <DescriptionRoundedIcon className={classes.typeIcon}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={t("assetsModule.users")}>
                                    <IconButton  className={classes.button}>
                                        <PeopleOutlineRoundedIcon className={classes.typeIcon}/>
                                    </IconButton>
                                </Tooltip>
                                                
                            </div>
                        </div>
                        {   
                            editMode === "address" &&
                            <UpsertAsset 
                                assetId={data._id} 
                                handleUpdate={handleUpdate}
                                handleClose={() => setEditMode(false)}
                            />   
                        }
                        {/* {editMode === "owner" && (
                            <UpdateOwner
                                handleClose={() => setEditMode(false)}
                                handleSave={updateOwner}
                                isOpen={editMode === "owner"}
                                currentOwner={asset.owner}
                                title={t('assetsModule.updateOwner')}
                                instructions={t('assetsModule.updateOwnerInstructions')}
                            />
                        )} */}
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
        borderRadius: '5px',
        height: 'auto',
        color: 'white',
        background: 'rgba(255,255,255,0.1)',
        [theme.breakpoints.down('xs')] : {
            margin: '10px 0',
            borderRadius: '0',
            border: '0', 
        } 
    },
    topMain: {
        height: '120px',
        borderRadius: '25px',
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        [theme.breakpoints.down('sm')] : {
            borderRadius: '0',
        } 
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
        padding: '3px 5px 3px',
        borderRadius: '0px 10px 0px 5px',
        boxShadow: '-2px 2px 2px 0 rgb(0 0 0 / 37%)',
        '&:hover' :{
            background: 'black',
            transition: 'background 0.2s ease',
            boxShadow: '0 8px 32px 0 rgb(0 0 0 / 80%)',
        },
         
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