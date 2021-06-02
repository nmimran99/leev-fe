import { Avatar, Backdrop, Button, Chip, Fade, FormHelperText, Grid, IconButton, LinearProgress, makeStyles, MenuItem, Modal, Paper, Select, TextField, useMediaQuery } from '@material-ui/core';
import { ClearRounded, OpenInNewOutlined } from '@material-ui/icons';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFault } from "../../../api/faultsApi";
import { getFullName } from '../../../api/genericApi';
import { createLocationMenuOptions, getLocationsByAsset } from '../../../api/locationsApi';
import { createSystemMenuOptions, getAssetsSuggestions, getSystemsByAsset } from '../../../api/systemsApi';
import { createUserOptions } from '../../../api/userApi';
import { AuthContext } from '../../../context/AuthContext';
import { LanguageContext } from '../../../context/LanguageContext';
import { UserItem } from '../../user/UserItem';




export const UpsertFault = ({ handleClose, handleSave, handleUpdate, faultId}) => {
    const classes = useStyles();
    const { lang } = useContext(LanguageContext);
    const { auth } = useContext(AuthContext);
    const { t } = useTranslation();
    const [ mode, setMode ] = useState(handleUpdate ? 'update' : 'create')
    const [ errors, setErrors ] = useState([]);
    const [ assets, setAssets ] = useState([]);
    const [ systems, setSystems ] = useState([]);
    const [ locations, setLocations ] = useState([]);
    const [ userList, setUserList ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ details, setDetails ] = useState({
        tenant: auth.user.tenant,
        title: '',
        description: '',
        asset: '',
        system: '',
        location: '',
        owner: '',
        relatedUsers: [],
        createdBy: auth.user._id,
        images: [],
        uploadedImages: []
    });

    useEffect(() => {

    }, [details])

    useEffect(() => {
        createUserOptions()
        .then(data => {
            setUserList(data);
            return getAssetsSuggestions()
        })
        .then(data => {
            setAssets(data); 
            if (!faultId) {
                setIsLoading(false);
                return;
            }
            getFault(faultId, true)        
            .then(data => {
                return Promise.all([loadSystemOptions(data.asset), loadLocationOptions(data.asset), Promise.resolve(data)]) 
            })
            .then(res => {
               let data = res[2];
               if (!data) return;
               setDetails({ ...data, images: [], uploadedImages: data.images});
            })
            .finally(() => {
                setIsLoading(false)
            }); 
        }) 
    }, []);


    const validateFields = () => {
        return new Promise((resolve,reject) => {
            let errList = [];
            if (!details.owner) {
                errList.push({ field: 'owner', text: t("errors.isRequired")})
            }
            if (!details.asset) {
                errList.push({ field: 'asset', text: t("errors.isRequired")})
            }
            if (!details.system) {
                errList.push({ field: 'system', text: t("errors.isRequired")})
            }
            if (!details.system) {
                errList.push({ field: 'location', text: t("errors.isRequired")})
            }
            if (!details.title) {
                errList.push({ field: 'title', text: t("errors.isRequired")})
            }
            
            if (errList.length) {
                setErrors(errList);
                resolve(false);
            };
            resolve(true);
        })
    }

    const loadSystemOptions = async (assetId) => {
        return getSystemsByAsset(assetId)
        .then(systems => {
            return createSystemMenuOptions(systems)
        })
        .then(data => {
            setSystems(data);
            return true;
        })
    };

    const loadLocationOptions = async (assetId) => {
        return getLocationsByAsset(assetId)
        .then(locations => {
            console.log(locations)
            return createLocationMenuOptions(locations)
        })
        .then(data => {
            setLocations(data);
            return true;
        })
    }

    const handleConfirm = () => {
        validateFields()
        .then(res => {
            if (!res) return;
            if (mode === 'update') {
                handleUpdate(details)
            } else 
                handleSave(details);
            }
        )      
    }

    const handleChange = field => async event => {
        setDetails({
            ...details,
            [field]: event.target.value
        })
        if (field === 'asset'){
            if (event.target.value) {
                await loadSystemOptions(event.target.value)
                await loadLocationOptions(event.target.value);
            } else {
                setDetails({
                    ...details,
                    system: null
                });
                setSystems([]);
            }
            
        }
        if (errors.length) {
            setErrors(errors.filter(err => err.field !== field))
        }
    }

    const handleFileUpload = event => {
        setDetails({
            ...details,
            images: event.target.files
        })
    }

    const removeImage = i => event => {
        let im = details.uploadedImages;
        im.splice(i, 1);
        setDetails({ ...details, uploadedImages: im})
    }

    return (
        isLoading ? 
        <LinearProgress /> :
        <Modal
            open={true}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500
            }}
            className={classes.modal}
        >
            <Fade in={true}>
                <Grid container justify='center' alignItems='center' style={{ outline: '0'}}>
                    <Grid item xs={12} sm={10} md={8} lg={8} xl={6} className={classes.gridCont}>
                        <Paper
                            elevation={6}
                            className={classes.paper}
                            style={{ direction: lang.dir }}
                        >
                            <Grid container>
                                <Grid item xs={12} className={classes.headerRow}>
                                    <div className={classes.title}>
                                        {mode === 'update' ? t("faultsModule.upsert.updateFaultDetails") : t("faultsModule.upsert.createFault")}
                                    </div>
                                    <div className={classes.close}>
                                        <IconButton
                                            className={classes.iconBtn}
                                            onClick={handleClose}
                                        >
                                            <ClearRounded className={classes.icon}/>
                                        </IconButton>
                                    </div>
                                </Grid>                     
                                <Grid item xs={12} sm={10} md={10} lg={10} xl={10} className={classes.section}>
                                    <Grid item xs={12}>
                                        <div className={classes.sectionTitle}>
                                            {t("faultsModule.upsert.asset")}
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} className={classes.fields}>
                                        <Grid container justify='flex-start'>
                                            <Grid item xs={12} className={classes.textContainer}>
                                            <Select
                                                variant={"outlined"}
                                                error={ errors.filter(e => e.field === `asset`).length > 0 }
                                                value={ details.asset }
                                                onChange={handleChange(`asset`)}
                                                className={classes.selectInput}
                                                MenuProps={{
                                                    anchorOrigin: {
                                                        vertical: "bottom",
                                                        horizontal: "center",
                                                    },
                                                    transformOrigin: {
                                                        vertical: "top",
                                                        horizontal: "center",
                                                    },
                                                    getContentAnchorEl: null,
                                                    classes: {
                                                        paper: classes.menupaper,
                                                
                                                    }
                                                }}
                                                
                                            >
                                                {
                                                    assets.map((asset, i) => 
                                                        <MenuItem 
                                                            key={i}
                                                            value={asset.value}
                                                            style={{ direction: lang.dir }}
                                                            className={classes.menuitem}
                                                        >
                                                            {asset.text}
                                                        </MenuItem>
                                                    )
                                                }
                                            </Select>
                                            {
                                                errors.filter(e => e.field === 'asset').length > 0 &&
                                                <FormHelperText style={{ color: '#f44336', marginRight: '15px'}}>{t("errors.isRequired")}</FormHelperText>
                                            }
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={5} md={5} lg={5} xl={5} className={classes.section}>
                                    <Grid item xs={12}>
                                        <div className={classes.sectionTitle}>
                                            {t("faultsModule.upsert.system")}
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} className={classes.fields}>
                                        <Grid container justify='flex-start'>
                                            <Grid item xs={12} className={classes.textContainer}>
                                            <Select
                                                variant={"outlined"}
                                                error={ errors.filter(e => e.field === `system`).length > 0 }
                                                value={ details.system }
                                                onChange={handleChange(`system`)}
                                                className={classes.selectInput}
                                                MenuProps={{
                                                    anchorOrigin: {
                                                        vertical: "bottom",
                                                        horizontal: "center",
                                                    },
                                                    transformOrigin: {
                                                        vertical: "top",
                                                        horizontal: "center",
                                                    },
                                                    getContentAnchorEl: null,
                                                    classes: {
                                                        paper: classes.menupaper,
                                                
                                                    }
                                                }}
                                                
                                            >
                                                {
                                                    systems.map((system, i) => 
                                                        <MenuItem 
                                                            key={i}
                                                            value={system.value}
                                                            style={{ direction: lang.dir }}
                                                            className={classes.menuitem}
                                                        >
                                                            {system.text}
                                                        </MenuItem>
                                                    )
                                                }
                                            </Select>
                                            {
                                                errors.filter(e => e.field === 'asset').length > 0 &&
                                                <FormHelperText style={{ color: '#f44336', marginRight: '15px'}}>{t("errors.isRequired")}</FormHelperText>
                                            }
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={5} md={5} lg={5} xl={5} className={classes.section}>
                                    <Grid item xs={12}>
                                        <div className={classes.sectionTitle}>
                                            {t("faultsModule.upsert.location")}
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} className={classes.fields}>
                                        <Grid container justify='flex-start'>
                                            <Grid item xs={12} className={classes.textContainer}>
                                            <Select
                                                variant={"outlined"}
                                                error={ errors.filter(e => e.field === `location`).length > 0 }
                                                value={ details.location }
                                                onChange={handleChange(`location`)}
                                                className={classes.selectInput}
                                                MenuProps={{
                                                    anchorOrigin: {
                                                        vertical: "bottom",
                                                        horizontal: "center",
                                                    },
                                                    transformOrigin: {
                                                        vertical: "top",
                                                        horizontal: "center",
                                                    },
                                                    getContentAnchorEl: null,
                                                    classes: {
                                                        paper: classes.menupaper,
                                                
                                                    }
                                                }}
                                                
                                            >
                                                {
                                                    locations.map((location, i) => 
                                                        <MenuItem 
                                                            key={i}
                                                            value={location.value}
                                                            style={{ direction: lang.dir }}
                                                            className={classes.menuitem}
                                                        >
                                                            {location.text}
                                                        </MenuItem>
                                                    )
                                                }
                                            </Select>
                                            {
                                                errors.filter(e => e.field === 'location').length > 0 &&
                                                <FormHelperText style={{ color: '#f44336', marginRight: '15px'}}>{t("errors.isRequired")}</FormHelperText>
                                            }
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} className={classes.section}>
                                    <Grid item xs={12}>
                                        <div className={classes.sectionTitle}>
                                            {t("faultsModule.upsert.generalDetails")}
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} className={classes.fields}>
                                        <Grid container justify='flex-start'>
                                            <Grid item xs={12} className={classes.textContainer}>
                                                <TextField
                                                    variant={"outlined"}
                                                    label={t(`faultsModule.upsert.title`)}
                                                    error={ errors.filter(e => e.field === `title`).length > 0 }
                                                    value={ details.title }
                                                    onChange={handleChange('title')}
                                                    className={classes.textField}
                                                    size={'medium'}
                                                    helperText={ errors.filter(e => e.field === `title`).length > 0 ? t("errors.isRequired") : `${60 - (details.title.length || 0)} ${t("faultsModule.upsert.titleLimit")}` }
                                                    inputProps={{
                                                        maxLength: 60
                                                    }}
                                                    FormHelperTextProps={{
                                                        style: { color: errors.filter(e => e.field === `title`).length > 0 ? 'rgb(244, 67, 54)' : 'rgba(255,255,255,0.6)' }
                                                    }}
                                                    
                                                />
                                            </Grid>
                                            <Grid item xs={12} className={classes.textContainer}>
                                                <TextField
                                                    variant={"outlined"}
                                                    label={t(`faultsModule.upsert.description`)}
                                                    value={ details.description }
                                                    onChange={handleChange('description')}
                                                    className={classes.textField}
                                                    size={'medium'}
                                                    multiline={true}
                                                    rows={7}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={4} xl={4}  className={classes.section}>
                                    <Grid item xs={12}>
                                        <div className={classes.sectionTitle}>
                                            {t("faultsModule.upsert.faultOwner")}
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} className={classes.fields}>
                                        <Grid item xs={12} className={classes.textContainer}>
                                            <Select
                                                variant={"outlined"}
                                                error={ errors.filter(e => e.field === `owner`).length > 0 }
                                                value={ details.owner }
                                                onChange={handleChange(`owner`)}
                                                className={classes.selectInput}
                                                MenuProps={{
                                                    anchorOrigin: {
                                                        vertical: "bottom",
                                                        horizontal: "center",
                                                    },
                                                    transformOrigin: {
                                                        vertical: "top",
                                                        horizontal: "center",
                                                    },
                                                    getContentAnchorEl: null,
                                                    classes: {
                                                        paper: classes.menupaper,
                                                
                                                    }
                                                }}
                                                renderValue={(selected) => {
                                                    let user = userList.find( f => f._id === selected);
                                                    return (
                                                        
                                                            <Chip
                                                                size={'medium'}
                                                                avatar={<Avatar style={{ height: '40px', width: '40px'}} src={user.avatar} />}
                                                                label={getFullName(user)}
                                                                className={classes.chip}
                                                                
                                                            />
                                                    
                                                    )
                                                }}
                                            >
                                                {
                                                    userList.map((user, i) => 
                                                        <MenuItem 
                                                            key={i}
                                                            value={user.value}
                                                            style={{ direction: lang.dir }}
                                                            className={classes.menuitem}
                                                        >
                                                            <div className={classes.userCont}>
                                                                <UserItem
                                                                    user={user}
                                                                    avatarSize={40}
                                                                    size={13}
                                                                    showName
                                                                />
                                                            </div>
                                                            
                                                        </MenuItem>
                                                    )
                                                }
                                            </Select>
                                            {
                                                errors.filter(e => e.field === 'owner').length > 0 &&
                                                <FormHelperText style={{ color: '#f44336', marginRight: '15px'}}>{t("errors.isRequired")}</FormHelperText>
                                            }
                                            
                                        </Grid>
                                    </Grid>
                                </Grid>
                                
                                <Grid item xs={12} md={6} className={classes.section}>
                                            <Grid item xs={12}>
                                                <div className={classes.sectionTitle}>
                                                    {mode === 'create' ? t("faultsModule.upsert.faultImages") : t("faultsModule.upsert.addFaultImages")}
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} className={classes.fields}>
                                                <Grid container justify='flex-start'>
                                                    <Grid item xs={12} className={classes.textContainer}>
                                                        <Button
                                                            component={'label'}
                                                            variant={'contained'}
                                                            className={classes.uploadBtn}
                                                        >
                                                            { t("faultsModule.upsert.uploadImages")}
                                                            <input 
                                                                accepts='image/*'
                                                                type='file'
                                                                multiple
                                                                onChange={handleFileUpload}
                                                                hidden  
                                                            />
                                                        </Button>
                                                        <span className={classes.filesUploaded}>
                                                            {`${details.images.length} ${t("faultsModule.upsert.imagesSelected")}` }
                                                        </span>
                                                    </Grid>
                                                    {
                                                        Boolean(details.uploadedImages.length) &&
                                                        <React.Fragment>
                                                            <Grid item xs={12} className={classes.uploadedImagesTitle}>
                                                                {t("faultsModule.upsert.uploadedImages")}
                                                            </Grid>
                                                            {
                                                                details.uploadedImages.map((image, i) => 
                                                                    <Grid item xs={12} className={classes.imageRow} key={i}>
                                                                        <img src={image} className={classes.previewImage} />
                                                                        <IconButton     
                                                                            onClick={removeImage(i)}
                                                                            className={classes.removeImageBtn}
                                                                        >
                                                                            <DeleteOutlineRoundedIcon className={classes.removeImage}/>
                                                                        </IconButton>
                                                                    </Grid>
                                                                )
                                                            }
                                                        </React.Fragment> 
                                                    } 
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                <Grid item xs={12} className={classes.controls}>
                                    <Button
                                        className={clsx(classes.control, classes.save)}
                                        onClick={handleConfirm}
                                    >
                                        {t("controls.confirm")}
                                    </Button>
                                    <Button
                                        className={clsx(classes.control, classes.cancel)}
                                        onClick={handleClose}
                                    >
                                        {t("controls.cancel")}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
    )
}


const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)'   
    },
    
    gridCont: {
        height: 'fit-content'
    },
    paper: {
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '10px',
        padding: '10px 20px',
        overflowY: 'overlay',
        height: '80vh',
        [theme.breakpoints.down('sm')]: {
            height: '81vh',
            top: 0,
            borderRadius: '0',
            border: '0',
            padding: '10px 5px'
        },
        '&:focus': {
            outline: 'none'
        }
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',      
        borderBottom: '1px solid rgba(255,255,255,0.2)',
    },
    title: {
        color: 'white',
        padding: '20px 10px 10px',
        fontSize: '20px',
        whiteSpace: 'nowrap'
    },
    iconBtn: {
        margin: '10px',
        '&:hover': {
            background: 'rgba(0,0,0,0.3)'
        }
    },
    icon: {
        color: 'white',
        fontSize: '20px'
    },
    section: {
        margin: '10px 5px',
        
    },
    sectionTitle: {
        color: 'white',
        fontSize: '16px',
        padding: '10px 20px',
        width: 'fit-content',
        borderRadius: '10px 10px 0 0',
        background: 'rgba(0,0,0,0.4)',
        whiteSpace: 'nowrap'
    },
    fields: {
        padding: '10px 20px',
        borderRadius: '0px 10px 10px 10px',
        background: 'rgba(0,0,0,0.4)',
        [theme.breakpoints.down('sm')]: {
            padding: '10px',
        }
    },
    textContainer: {
        padding: '5px',
    },
    textField: {
        width: '100%',
        '& fieldset': {
            borderRadius: '5px',
        },  
    },
    selectInput: {
        width: '100%',
        '& fieldset': {
            borderRadius: '5px',
        }   
    },
    menupaper: {
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        height: '200px',
        overflowY: 'auto',
        border: '1px solid rgba(255,255,255,0.2)',
        marginRight: '7px',
        marginLeft: '-5px'

    },
    menuitem: {
        color: 'white',
        width: '100%',
        '&:hover': {
            background: 'rgba(255,255,255,0.1)'
        }
    },
    controls: {
        borderTop: '1px solid rgba(255,255,255,0.2)',
        padding: '10px 0',
        display: 'flex',
        justifyContent: 'space-between'
    },
    control: {
        width: '30%',
        border: '1px solid rgba(255,255,255,0.5)',
        fontSize: '16px',
        margin: '5px',
        padding: '5px 30px',
        borderRadius: '30px',
        color: 'white',
       
    },
    save: {
        background: 'rgba(0,0,0,0.2)', 
        '&:hover': {
            background: 'black'
        },
        '&:disabled': {
            color: 'rgba(255,255,255,0.3)'
        }
    },
    cancel: {
        '&:hover': { 
            boxShadow: 'inset rgba(255,255,255,0.3) 0 0 2px 1px'
        }
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    chip: {
        height: '50px',
        fontSize: '14px',
        borderRadius: '50px',
        display: 'flex',
        justifyContent: 'flex-start',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(0,0,0,0.6)',
        '&:hover': {
            background: 'rgba(0,0,0,0.6)',
            boxShadow: 'inset lightgrey 0px 0px 1px 1px'
        } 
    },
    userCont: {
        height: 'fit-content',
        padding: 0,
        margin: 0,
        margin: '5px 0',
        
    },
    chipsCont: {
        height: 'fit-content',
        padding: 0,
        margin: '3px',
        borderRadius: '50px',
        background: 'rgba(255,255,255,0.1)',
        boxShadow: 'inset rgba(0,0,0,0.5) 0px 0px 2px 1px',
        display: 'flex',
        jutifyContent: 'space-between',
        alignItems: 'center',
        
    },
    removeIcon: {
        color: 'rgba(255,255,255,0.2)',
        padding: '5px',
        marginRight: '5px',
        borderRadius: '50px',
        '&:hover': {
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
        }
    },
    radioGroup: {
        color: 'white',
        display: 'flex',
        flexDirection: 'row',
        alignitems: 'center',
        
    },
    radioBtn: {
        color: 'white',
        padding: '15px'
    },
    filesUploaded: {
        color: 'white',
        padding: '0 15px'
    },
    uploadBtn: {
        margin: '9px 0',
        background: 'rgba(0,0,0,0.1)',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '50px',
        whiteSpace: 'nowrap',
        '&:hover': {
            boxShadow: 'inset white 0 0 2px 1px',
            background: 'rgba(0,0,0,0.3)'
        }
    },
    imageRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 5px',
        borderBottom: '1px solid rgba(255,255,255,0.2)'
    },
    previewImage: {
        height: '50px',
        width: '100px'
    },
    removeImageBtn: {
        color: 'rgba(255,255,255,0.5)',
        border: '1px solid rgba(255,255,255,0.5)',
        borderRadius: '50px',
        padding: '6px',
        '&:hover': {
            color: 'white',
            borderColor: 'white'
        }
    },
    uploadedImagesTitle: {
        color: 'white',
        padding: '10px 5px',
        borderBottom: '1px solid rgba(255,255,255,0.2)'
    }
}))