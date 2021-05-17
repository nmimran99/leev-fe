import DateFnsUtils from '@date-io/date-fns';
import { Avatar, Backdrop, Button, Chip, Fade, FormControlLabel, FormHelperText, Grid, IconButton, makeStyles, MenuItem, Modal, Paper, Radio, RadioGroup, Select, TextField, useMediaQuery } from '@material-ui/core';
import { ClearRounded } from '@material-ui/icons';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFullName, getLocale } from '../../../api/genericApi';
import { getAssetsSuggestions } from '../../../api/systemsApi';
import { createUserOptions } from '../../../api/userApi';
import { AuthContext } from '../../../context/AuthContext';
import { LanguageContext } from '../../../context/LanguageContext';
import { UserItem } from '../../user/UserItem';




export const UpsertSystem = ({ handleClose, handleSave, handleUpdate, systemId, data }) => {
    const classes = useStyles();
    const { lang } = useContext(LanguageContext);
    const { t } = useTranslation();
    const [ mode, setMode ] = useState(handleUpdate ? 'update' : 'create')
    const [ errors, setErrors ] = useState([]);
    const [ assets, setAssets ] = useState([]);
    const [ userList, setUserList ] = useState([]);
    const [ details, setDetails ] = useState({
        name: '',
        asset: '',
        owner: '',
        relatedUsers: []
    });
    const [ addData, setAddData ] = useState(data || {
        general: {
            location: '',
            manufacturingYear: '',
            SID: '',
        },
        manufacturer: {
            name: '',
            contactName: '',
            email: '',
            phoneNumber: '',
            extension: '', 
        },
        supplier: {
            name: '',
            contactName: '',
            email: '',
            phoneNumber: '',
            extension: '',
        },
        insurance: {
            name: '',
            contanctName: '',
            email: '',
            phoneNumber: '',
            extension: '',
            expiryDate: null,
        },
        warranty: {
            issuer: '',
            expiryDate: null
        }
    })

    const validateFields = () => {
        return new Promise((resolve,reject) => {
            let errList = [];
            if (handleUpdate) resolve(true);
            if (!details.owner) {
                errList.push({ field: 'owner', text: t("errors.isRequired")})
            }
            if (!details.asset) {
                errList.push({ field: 'asset', text: t("errors.isRequired")})
            }
            if (!details.name) {
                errList.push({ field: 'name', text: t("errors.isRequired")})
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

    const handleConfirm = () => {
        validateFields()
        .then(res => {
            if (res) {
                if (mode === 'update') {
                    handleUpdate({system: systemId, data: addData});
                    return;
                }
                handleSave({ ...details, data: addData});
                return;
            };
        })      
    }

    const handleChangeAddData = obj => event => {
        setAddData({
            ...addData,
            [obj.type]: {
                ...addData[obj.type],
                [obj.field]: event.target.value
            }
        })
    };

    const handleChange = field => event => {
        setDetails({
            ...details,
            [field]: event.target.value
        })
        if (errors.length) {
            setErrors(errors.filter(err => err.field !== field))
        }
    }

    const handleChangeMultiple = (event) => {
        setDetails({...details, 
            relatedUsers: event.target.value
        });
    };

    const handleLinkedRemove = (realtedUser) => event => {
        event.stopPropagation();

        setDetails({ ...details, 
            relatedUsers: details.relatedUsers.filter(lu => lu !== realtedUser)
        })
        
    }

    const handleChangeInsuranceExpiry = date => {
        setAddData({
            ...addData,
            insurance: {
                ...addData.insurance,
                expiryDate: date
            }
        })
    }

    const handleChangeWarrantyExpiry = date => {
        setAddData({
            ...addData,
            warranty: {
                ...addData.warranty,
                expiryDate: date
            }
        })
    }
    
    

    return (
        <Modal
            open={true}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 300
            }}
            className={classes.modal}
        >
            <Fade in={true} timeout={300}>
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
                                        {mode === 'update' ? t("systemsModule.updateSystemDetails") : t("systemsModule.createSystem")}
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
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.section}>
                                            <Grid item xs={12}>
                                                <div className={classes.sectionTitle}>
                                                    {t("systemsModule.generalDetails")}
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} className={classes.fields}>
                                                <Grid container justify='flex-start'>
                                                    <Grid item xs={12} className={classes.textContainer}>
                                                        <TextField
                                                            variant={"outlined"}
                                                            label={t(`systemsModule.systemName`)}
                                                            error={ errors.filter(e => e.field === `name`).length > 0 }
                                                            value={ details.name }
                                                            onChange={handleChange('name')}
                                                            className={classes.textField}
                                                            size={'medium'}
                                                            helperText={ errors.filter(e => e.field === `name`).length > 0 ? t("errors.isRequired"): null }
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.section}>
                                            <Grid item xs={12}>
                                                <div className={classes.sectionTitle}>
                                                    {t("systemsModule.owningAsset")}
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
                                                            disablePortal: true,
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
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4}  className={classes.section}>
                                            <Grid item xs={12}>
                                                <div className={classes.sectionTitle}>
                                                    {t("systemsModule.systemOwner")}
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
                                                            disablePortal: true,
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
                                                                            showName
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
                                                {t("systemsModule.relatedUsers")}
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} className={classes.fields}>
                                            <Grid item xs={12} className={classes.textContainer}>
                                            <Select
                                                variant={"outlined"}
                                                multiple
                                                value={details.relatedUsers}
                                                onChange={handleChangeMultiple}
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
                                                                        onDelete={handleLinkedRemove(value)}
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
                                                                        showName
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
                                    </React.Fragment>
                                }
                                <Grid item xs={12} className={classes.section}>
                                    <Grid item xs={4}>
                                        <div 
                                            className={classes.sectionTitle}
                                        >
                                            {t("systemsModule.additionalDetails")}
                                        </div>
                                    </Grid>
                                    <Grid container className={classes.fields}>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            <TextField
                                                variant={"outlined"}
                                                label={t(`systemsModule.location`)}
                                                value={ addData.general.location }
                                                onChange={handleChangeAddData({ type: 'general', field: 'location'})}
                                                className={classes.textField}
                                                size={'medium'}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            <TextField
                                                variant={"outlined"}
                                                label={t(`systemsModule.manufacturingYear`)}
                                                value={ addData.general.manufacturingYear }
                                                onChange={handleChangeAddData({ type: 'general', field: 'manufacturingYear'})}
                                                className={classes.textField}
                                                size={'medium'}

                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            <TextField
                                                variant={"outlined"}
                                                label={t(`systemsModule.SID`)}
                                                value={ addData.general.SID }
                                                onChange={handleChangeAddData({ type: 'general', field: 'SID'})}
                                                className={classes.textField}
                                                size={'medium'}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} className={classes.section}>
                                    <Grid item xs={4}>
                                        <div 
                                            className={classes.sectionTitle}
                                        >
                                            {t("systemsModule.manufacturer")}
                                        </div>
                                    </Grid>
                                    <Grid container className={classes.fields}>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            <TextField
                                                variant={"outlined"}
                                                label={t(`systemsModule.manufacturerDetails.name`)}
                                                value={ addData.manufacturer.name }
                                                onChange={handleChangeAddData({ type: 'manufacturer', field: 'name'})}
                                                className={classes.textField}
                                                size={'medium'}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            <TextField
                                                variant={"outlined"}
                                                label={t(`systemsModule.manufacturerDetails.contactName`)}
                                                value={ addData.manufacturer.contactName }
                                                onChange={handleChangeAddData({ type: 'manufacturer', field: 'contactName'})}
                                                className={classes.textField}
                                                size={'medium'}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            <TextField
                                                variant={"outlined"}
                                                label={t(`systemsModule.manufacturerDetails.email`)}
                                                value={  addData.manufacturer.email }
                                                onChange={handleChangeAddData({ type: 'manufacturer', field: 'email'})}
                                                className={classes.textField}
                                                size={'medium'}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            <TextField
                                                variant={"outlined"}
                                                label={t(`systemsModule.manufacturerDetails.phoneNumber`)}
                                                value={ addData.manufacturer.phoneNumber }
                                                onChange={handleChangeAddData({ type: 'manufacturer', field: 'phoneNumber'})}
                                                className={classes.textField}
                                                size={'medium'}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            <TextField
                                                variant={"outlined"}
                                                label={t(`systemsModule.manufacturerDetails.extension`)}
                                                value={ addData.manufacturer.extension }
                                                onChange={handleChangeAddData({ type: 'manufacturer', field: 'extension'})}
                                                className={classes.textField}
                                                size={'medium'}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} className={classes.section}>
                                    <Grid item xs={4}>
                                        <div 
                                            className={classes.sectionTitle}
                                        >
                                            {t("systemsModule.supplier")}
                                        </div>
                                    </Grid>
                                    <Grid container className={classes.fields}>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            <TextField
                                                variant={"outlined"}
                                                label={t(`systemsModule.supplierDetails.name`)}
                                                value={ addData.supplier.name }
                                                onChange={handleChangeAddData({ type: 'supplier', field: 'name'})}
                                                className={classes.textField}
                                                size={'medium'}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            <TextField
                                                variant={"outlined"}
                                                label={t(`systemsModule.supplierDetails.contactName`)}
                                                value={ addData.supplier.contactName }
                                                onChange={handleChangeAddData({ type: 'supplier', field: 'contactName'})}
                                                className={classes.textField}
                                                size={'medium'}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            <TextField
                                                variant={"outlined"}
                                                label={t(`systemsModule.supplierDetails.email`)}
                                                value={  addData.supplier.email }
                                                onChange={handleChangeAddData({ type: 'supplier', field: 'email'})}
                                                className={classes.textField}
                                                size={'medium'}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            <TextField
                                                variant={"outlined"}
                                                label={t(`systemsModule.supplierDetails.phoneNumber`)}
                                                value={ addData.supplier.phoneNumber }
                                                onChange={handleChangeAddData({ type: 'supplier', field: 'phoneNumber'})}
                                                className={classes.textField}
                                                size={'medium'}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            <TextField
                                                variant={"outlined"}
                                                label={t(`systemsModule.supplierDetails.extension`)}
                                                value={ addData.supplier.extension }
                                                onChange={handleChangeAddData({ type: 'supplier', field: 'extension'})}
                                                className={classes.textField}
                                                size={'medium'}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} className={classes.section}>
                                    <Grid item xs={4}>
                                        <div 
                                            className={classes.sectionTitle}
                                        >
                                            {t("systemsModule.insurance")}
                                        </div>
                                    </Grid>
                                    <Grid container className={classes.fields}>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            <TextField
                                                variant={"outlined"}
                                                label={t(`systemsModule.insuranceDetails.name`)}
                                                value={ addData.insurance.name }
                                                onChange={handleChangeAddData({ type: 'insurance', field: 'name'})}
                                                className={classes.textField}
                                                size={'medium'}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            <TextField
                                                variant={"outlined"}
                                                label={t(`systemsModule.insuranceDetails.contactName`)}
                                                value={ addData.insurance.contactName }
                                                onChange={handleChangeAddData({ type: 'insurance', field: 'contactName'})}
                                                className={classes.textField}
                                                size={'medium'}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            <TextField
                                                variant={"outlined"}
                                                label={t(`systemsModule.insuranceDetails.email`)}
                                                value={  addData.insurance.email }
                                                onChange={handleChangeAddData({ type: 'insurance', field: 'email'})}
                                                className={classes.textField}
                                                size={'medium'}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            <TextField
                                                variant={"outlined"}
                                                label={t(`systemsModule.insuranceDetails.phoneNumber`)}
                                                value={ addData.insurance.phoneNumber }
                                                onChange={handleChangeAddData({ type: 'insurance', field: 'phoneNumber'})}
                                                className={classes.textField}
                                                size={'medium'}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            <TextField
                                                variant={"outlined"}
                                                label={t(`systemsModule.insuranceDetails.extension`)}
                                                value={ addData.insurance.extension }
                                                onChange={handleChangeAddData({ type: 'insurance', field: 'extension'})}
                                                className={classes.textField}
                                                size={'medium'}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            
                                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getLocale(lang.code)}>
                                                <DatePicker
                                                    
                                                    format="dd/MM/yyyy"
                                                    label={t(`systemsModule.insuranceDetails.expiryDate`)}
                                                    value={addData.insurance.expiryDate}
                                                    onChange={handleChangeInsuranceExpiry}
                                                    inputVariant={"outlined"}
                                                    className={classes.textField}
                                                    autoOk={true}
                                                    disablePast={true}
                                                
                                                />
                                            </MuiPickersUtilsProvider>
                                        </Grid>
                                        
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} className={classes.section}>
                                    <Grid item xs={4}>
                                        <div 
                                            className={classes.sectionTitle}
                                        >
                                            {t("systemsModule.warranty")}
                                        </div>
                                    </Grid>
                                    <Grid container className={classes.fields}>
                                        <Grid item xs={12} sm={6} md={6} lg={8} xl={8} className={classes.textContainer}>
                                            <RadioGroup
                                                value={addData.warranty.issuer}
                                                onChange={handleChangeAddData({ type: 'warranty', field: 'issuer'})}
                                                className={classes.radioGroup}
                                            >
                                                <FormControlLabel value='supplier' control={<Radio color={'white'} className={classes.radioBtn}/>} label={t("systemsModule.warrantyDetails.supplier")}/>
                                                <FormControlLabel value='manufacturer' control={<Radio color={'white'} className={classes.radioBtn} />} label={t("systemsModule.warrantyDetails.manufacturer")}/>
                                                <FormControlLabel value='' control={<Radio color={'white'} className={classes.radioBtn} />} label={t("systemsModule.warrantyDetails.nowarranty")}/>
                                            </RadioGroup>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.textContainer}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getLocale(lang.code)}>
                                                <DatePicker
                                                    format="dd/MM/yyyy"
                                                    label={t(`systemsModule.warrantyDetails.expiryDate`)}
                                                    value={addData.warranty.expiryDate}
                                                    onChange={handleChangeWarrantyExpiry}
                                                    inputVariant={"outlined"}
                                                    className={classes.textField}
                                                    autoOk={true}
                                                    disablePast={true}
                                                />
                                            </MuiPickersUtilsProvider>
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
        '&:focus': {
            outline: 'none'
        },
        [theme.breakpoints.down('sm')]: {
            height: '81vh',
            borderRadius: '0',
            top: 0,
            border: '0',
            padding: '10px 5px'
        },
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
        border: '1px solid rgba(255,255,255,0.2)',
        marginRight: '7px',
        marginLeft: '-5px',
        maxHeight: '200px',
        overflowY: 'auto',

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
    }
}))