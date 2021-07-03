import { Backdrop, Button, Fade, FormHelperText, Grid, IconButton, LinearProgress, makeStyles, MenuItem, Modal, Paper, Select, TextField, useMediaQuery } from '@material-ui/core';
import { ClearRounded } from '@material-ui/icons';
import clsx from 'clsx';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAsset } from '../../../api/assetsApi';
import { createUserOptions } from '../../../api/userApi';
import { AuthContext } from '../../../context/AuthContext';
import { LanguageContext } from '../../../context/LanguageContext';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';



export const UpsertAsset = ({ handleClose, handleSave, assetId, handleUpdate }) => {
    const classes = useStyles();
    const { lang } = useContext(LanguageContext);
    const { auth } = useContext(AuthContext);
    const previewImageRef = useRef();
    const [ mode, setMode ] = useState(handleUpdate ? 'update' : 'create')
    const { t } = useTranslation();
    const [ errors, setErrors ] = useState([]);
    const [ userList, setUserList ] = useState([]);
    const [ addInfoContext, setAddInfoContext ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ details, setDetails ] = useState({
        tenant: auth.user.tenant,
        address: {
            country: '',
            province: '',
            city: '',
            street: '',
            streetNumber: '',
            entrance: '',
            zipcode: '',
        },
        owner: '',
        type: '',
        addInfo: null,
        createdBy: auth.user._id,
        images: [],
        uploadedImages: [] 
    });

    useEffect(() => {
        createUserOptions()
        .then(data => {
            setUserList(data);
            return Promise.resolve(assetId)
        })
        .then(res => {
            if (!res) {
                setIsLoading(false);
                return;
            }
            getAsset(res, true)
            .then(data => {
                setDetails({...data, images: [], uploadedImages: data.images});
                setIsLoading(false)
            }) 
        })
        
    },[])

 

    const validateFields = () => {
        return new Promise((resolve,reject) => {
            let errList = [];
            Object.entries({...details.address,owner: details.owner, type: details.type}).forEach((entry) => {
                if (['province', 'entrance'].indexOf(entry[0]) !== -1 ) return;
                if (!entry[1]) {
                    errList.push({ field: entry[0], text: t("errors.isRequired")})
                }
            });
            
            if (errList.length) {
                setErrors(errList);
                resolve(false);
            };
            resolve(true);
        })
    }

    const handleConfirm = () => {
        validateFields()
        .then(res => {
            if (!res) return
            if ( mode === 'create') {
                handleSave(details);
            } else {
                
                handleUpdate(details)
            }
            
        })      
    }

    const handleChange = data => event => {
        if (data.type) {
            setDetails({...details, [data.type]: {
                ...details[data.type],
                [data.field]: event.target.value
            }});
        } else if (data.field === 'type') {
            setDetails({
                ...details, 
                type: event.target.value,
                addInfo: event.target.value === 'apartment' 
                ? { floor: '', unit: ''} 
                : { floors: '', units: ''}
            });
            setAddInfoContext(event.target.value);
        } else {
            setDetails({...details, [data.field]: event.target.value}) 
        };
        if (errors.length) {
            setErrors(errors.filter(err => err.field !== data.field))
        }
    }


    const handleFileUpload = event => {
        setDetails({
            ...details,
            images: event.target.files
        })
        previewImageRef.current.src = URL.createObjectURL(event.target.files[0]) 
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
                                        {mode === 'create' ? t("assetsModule.createAsset") : t("assetsModule.editAsset")}
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
                                <Grid item xs={12} className={classes.section}>
                                    <Grid item xs={12}>
                                        <div className={classes.sectionTitle}>
                                            {t("assetsModule.addressDetails")}
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} className={classes.fields}>
                                        <Grid container justify='flex-start'>
                                            {
                                                Object.keys(details.address).map((f,i) =>
                                                <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer} key={i}>
                                                    <TextField
                                                        variant={"outlined"}
                                                        label={t(`assetsModule.${f}`)}
                                                        error={ errors.filter(e => e.field === `${f}`).length > 0 }
                                                        value={ details.address[f] }
                                                        onChange={handleChange({type: 'address', field: `${f}`})}
                                                        className={classes.textField}
                                                        size={'medium'}
                                                        helperText={ errors.filter(e => e.field === `${f}`).length > 0 ? t("errors.isRequired"): null }
                                                    />
                                                </Grid>
                                                )
                                                
                                            }
                                        </Grid>
                                    </Grid>
                                
                                </Grid>
                                <Grid item xs={12} sm={5} className={classes.section}>
                                    <Grid item xs={12}>
                                        <div className={classes.sectionTitle}>
                                            {t("assetsModule.assetType")}
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} className={classes.fields}>
                                        <Grid container justify='flex-start'>
                                            <Grid item xs={12} className={classes.textContainer}>
                                                <Select
                                                    variant={"outlined"}
                                                    error={ errors.filter(e => e.field === `type`).length > 0 }
                                                    value={ details.type }
                                                    onChange={handleChange({type: '', field: `type`})}
                                                    className={classes.selectInput}
                                                    MenuProps={{
                                                        classes: {
                                                            paper: classes.menupaper,
                                    
                                                        },
                                                        anchorOrigin: {
                                                            vertical: "bottom",
                                                            horizontal: "center",
                                                        },
                                                        transformOrigin: {
                                                            vertical: "top",
                                                            horizontal: "center",
                                                        },
                                                        getContentAnchorEl: null,
                                                        disablePortal: true
                                                    }}
                                    
                                                >
                                                    <MenuItem 
                                                        value={'building'}
                                                        style={{ direction: lang.dir }}
                                                        className={classes.menuitem}
                                                    >
                                                        {t("assetsModule.building")}
                                                    </MenuItem>
                                                    <MenuItem 
                                                        value={'apartment'}
                                                        style={{ direction: lang.dir }}
                                                        className={classes.menuitem}
                                                    >
                                                        {t("assetsModule.apartment")}
                                                    </MenuItem>
                                                </Select>
                                                {
                                                    errors.filter(e => e.field === `type`).length > 0 &&
                                                    <FormHelperText style={{ color: '#f44336', marginRight: '15px'}}>{t("errors.isRequired")}</FormHelperText>
                                                }
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={5}  className={classes.section}>
                                    <Grid item xs={12}>
                                        <div className={classes.sectionTitle}>
                                            {t("assetsModule.owner")}
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} className={classes.fields}>
                                        <Grid item xs={12} className={classes.textContainer}>
                                                <Select
                                                    variant={"outlined"}
                                                    error={ errors.filter(e => e.field === `owner`).length > 0 }
                                                    value={ details.owner }
                                                    onChange={handleChange({type: '', field: `owner`})}
                                                    className={classes.selectInput}
                                                    MenuProps={{
                                                        classes: {
                                                            paper: classes.menupaper,
                                                
                                                        },
                                                        anchorOrigin: {
                                                            vertical: "bottom",
                                                            horizontal: "center",
                                                        },
                                                        transformOrigin: {
                                                            vertical: "top",
                                                            horizontal: "center",
                                                        },
                                                        getContentAnchorEl: null,
                                                        disablePortal: true
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
                                                                {user.label}
                                                            </MenuItem>
                                                        )
                                                    }
                                                </Select>
                                                {
                                                    errors.filter(e => e.field === `type`).length > 0 &&
                                                    <FormHelperText style={{ color: '#f44336', marginRight: '15px'}}>{t("errors.isRequired")}</FormHelperText>
                                                }
                                                
                                            </Grid>
                                    </Grid>
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
                                                                onChange={handleFileUpload}
                                                                hidden  
                                                            />
                                                        </Button>
                                                        <span className={classes.filesUploaded}>
                                                            {`${details.images.length} ${t("faultsModule.upsert.imagesSelected")}`}
                                                        </span>
                                                        <img ref={previewImageRef} src='#' className={classes.previewImage} />
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
                                {
                                    (Boolean(addInfoContext) || mode === 'update') &&
                                    <Grid item xs={12} md={6} className={classes.section}>
                                        <Grid item xl={12}>
                                            <div className={classes.sectionTitle}>
                                                {t("assetsModule.additionalDetails")}
                                            </div>
                                        </Grid>
                                        <Grid item xl={12} className={classes.fields}>
                                            <Grid container justify='flex-start'>
                                                {
                                                    Object.keys(details.addInfo).map((f,i) => 
                                                        <Grid item xs={12} sm={6} className={classes.textContainer} key={i}>
                                                            <TextField
                                                                variant={"outlined"}
                                                                label={t(`assetsModule.${f}`)}
                                                                error={ errors.filter(e => e.field === `${f}`).length > 0 }
                                                                value={ details.addInfo[f] }
                                                                onChange={handleChange({type: 'addInfo', field: `${f}`})}
                                                                className={classes.textField}
                                                                size={'medium'}
                                                                InputProps={{
                                                                    classes: {
                                                                        root: classes.rootInput
                                                                    }
                                                                }}
                                                            />
                                                        </Grid>
                                                    ) 
                                                }
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                }
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
        borderBottom: '1px solid rgba(255,255,255,0.2)'
    },
    title: {
        color: 'white',
        padding: '20px 10px 10px',
        fontSize: '20px',
        whiteSpace: 'nowrap'
    },
    iconBtn: {

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
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        marginRight: '7px',
        marginLeft: '-5px',
        maxHeight: '200px',
        overflowY: 'auto',

    },
    menuitem: {
        color: 'white',
        '&:hover':{
            background: 'rgba(255,255,255,0.2)'
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
       
        fontSize: '16px',
        margin: '5px',
        padding: '5px 30px',
        borderRadius: '30px',
        color: 'white',
       
    },
    save: {
        background: 'rgba(0,0,0,0.2)', 
        border: '1px solid rgba(255,255,255,0.5)',
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
        height: '80px',
        width: 'auto',
        borderRadius: '5px',
        margin: '0 10px'
        
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
    },
}))