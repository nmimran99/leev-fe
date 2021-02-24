import heLocale from "date-fns/locale/he";
import React, { useState, useContext, useEffect } from 'react';
import { makeStyles, useMediaQuery, Paper, Grid, Fade, IconButton, Button, TextField, Select, MenuItem, FormHelperText, Chip, Input, Avatar, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../../context/LanguageContext';
import { CheckBox, ClearRounded } from '@material-ui/icons';
import { AuthContext } from '../../../context/AuthContext';
import { createUserOptions } from '../../../api/userApi';
import clsx from 'clsx'
import { UserItem } from '../../user/UserItem';
import { getFullName } from '../../../api/genericApi';
import { createSystemMenuOptions, getAssetsSuggestions, getSystemsByAsset } from '../../../api/systemsApi';




export const UpsertFault = ({ handleClose, handleSave, handleUpdate, faultId, data }) => {
    const classes = useStyles();
    const { lang } = useContext(LanguageContext);
    const { auth } = useContext(AuthContext);
    const downSm = useMediaQuery(theme => theme.breakpoints.down('md'));
    const { t, i18n } = useTranslation();
    const [ mode, setMode ] = useState(handleUpdate ? 'update' : 'create')
    const [ errors, setErrors ] = useState([]);
    const [ faults, setFaults ] = useState([]);
    const [ assets, setAssets ] = useState([]);
    const [ systems, setSystems ] = useState([]);
    const [ userList, setUserList ] = useState([]);
    const [ details, setDetails ] = useState(data || {
        title: '',
        description: '',
        asset: '',
        system: '',
        owner: '',
        following: [],
        createdBy: auth.user._id,
        images: []
    })

    useEffect(() => {
        console.log(details.images)
    }, [details])

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

    useEffect(() => {
        createUserOptions()
        .then(data => {
            setUserList(data);
        })
    }, [])

    useEffect(() => {
        getAssetsSuggestions()
        .then(data => {
            if (data.length){
                setAssets(data);
            }
        })
    }, [])

    const loadSystemOptions = (assetId) => {
        getSystemsByAsset(assetId)
        .then(systems => {
            
            return createSystemMenuOptions(systems)
        })
        .then(data => {
            setSystems(data);
        })
    };

    const handleConfirm = () => {
        validateFields()
        .then(res => {
            console.log(res)
            if (mode === 'update') {
                handleUpdate()
            }
            if (res) {
                console.log(details)
                handleSave(details);
            }
            
        })      
    }

    const handleChange = field => event => {
        setDetails({
            ...details,
            [field]: event.target.value
        })
        if (field === 'asset'){
            if (event.target.value) {
                loadSystemOptions(event.target.value)
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

    const handleChangeMultiple = event => {
        setDetails({...details, 
            following: event.target.value
        });
    };

    const handleFollowingRemove = (followingUser) => event => {
        event.stopPropagation();
        setDetails({ ...details, 
            following: details.following.filter(fu => fu !== followingUser)
        })
        
    }
    
    const handleFileUpload = event => {
        setDetails({
            ...details,
            images: event.target.files
        })
    }

    return (
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
                            {
                                mode === 'create' &&
                                <React.Fragment>
                                     <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.section}>
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
                                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4} className={classes.section}>
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
                                                        helperText={ errors.filter(e => e.field === `title`).length > 0 ? t("errors.isRequired"): null }
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
                                    <Grid item xs={12} sm={6} md={6} lg={7} xl={7} className={classes.section}>
                                    <Grid item xs={12}>
                                        <div className={classes.sectionTitle}>
                                            {t("faultsModule.upsert.followingUsers")}
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} className={classes.fields}>
                                        <Grid item xs={12} className={classes.textContainer}>
                                        <Select
                                            variant={"outlined"}
                                            multiple
                                            value={details.following}
                                            onChange={handleChangeMultiple}
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
                                                disablePortal: true,
                                                classes: {
                                                    paper: classes.menupaper,
                                
                                                }
                                            }}
                                            renderValue={(selected) => (
                                                <div className={classes.chips}>
                                                {
                                                    selected.map((value) => {
                                                        let user = userList.find( f => f._id === value);
                                                        return (
                                                            <div className={classes.chipsCont}>
                                                                <Chip
                                                                    clickable
                                                                    size={'medium'}
                                                                    avatar={<Avatar style={{ height: '40px', width: '40px'}} src={user.avatar} />}
                                                                    label={getFullName(user)}
                                                                    onDelete={handleFollowingRemove(value)}
                                                                    deleteIcon={<ClearRounded className={classes.removeIcon}/>}
                                                                    onMouseDown={e => e.stopPropagation()}
                                                                    className={classes.chip}
                                                                />
                                                            </div>
                                                        )

                                                        
                                                    })
                                                }
                                                </div>
                                            )}
                                
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
                                                                    size={14}
                                                                />
                                                            </div>
                                                            
                                                        </MenuItem>
                                                    )
                                                }
                                            </Select>
                                            
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={6} className={classes.section}>
                                        <Grid item xs={12}>
                                            <div className={classes.sectionTitle}>
                                                {t("faultsModule.upsert.faultImages")}
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
                                                
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </React.Fragment>
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
    )
}


const useStyles = makeStyles(theme => ({
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
            borderRadius: '0',
            border: '0'
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
        overflowY: 'overlay',
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
        background: 'rgba(0,0,0,0.1)',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '50px',
        whiteSpace: 'nowrap',
        '&:hover': {
            boxShadow: 'inset white 0 0 2px 1px',
            background: 'rgba(0,0,0,0.3)'
        }
    }
}))