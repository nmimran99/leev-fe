import React, {  useContext, useState } from 'react'
import { makeStyles, Grid, Button, Typography, Collapse, TextField, Select, MenuItem, FormHelperText } from '@material-ui/core'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from '../../../context/LanguageContext'




export const UpdateAsset = ({ open, data, handleUpdate, handleCancel }) => {

    const classes = useStyles();
    const { t, i18i } = useTranslation();
    const { lang } = useContext(LanguageContext);
    const [ values, setValues ] = useState({
        address: data.address || '',
        addInfo: data.addInfo || '',
        type: data.type || ''
    });
    const [ errors, setErrors ] = useState([]);
    const [ addInfoContext, setAddInfoContext ] = useState(data.type || 'apartment');

    const handleChange = req => event => {
        if (req.field === 'type') {
            setValues({
                ...values, 
                type: event.target.value,
                addInfo: event.target.value === 'apartment' 
                ? { floor: '', unit: ''} 
                : { floors: '', units: ''}
            });    
            setAddInfoContext(event.target.value);
        } else if (req.type === req.field) {
            setValues({
                ...values, 
                [req.field]: event.target.value
            });
           
        } else {
            setValues({
                ...values,
                [req.type]: {
                    ...values[req.type],
                    [req.field]: event.target.value
                }
            })
        };
        if (errors.length) {
            setErrors(errors.filter(err => err.field !== req.field))
        }

    }

    const validateFields = () => {
        return new Promise((resolve,reject) => {
            let errList = [];
            Object.entries({...values.address, type: values.type}).forEach((entry) => {
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
            console.log(res)
            if (res) {
                handleUpdate(data._id, values.address, values.addInfo, values.type);
                return
            };
        })
    }
    
    return (
        <Collapse in={open}>
            <div className={classes.container}>
                <Typography className={classes.title}>
                    {t("assetsModule.editAsset")}
                </Typography>
                <Grid container justify='flex-start' alignItems='center' className={classes.inputs}>
                    <Grid item xs={12} className={classes.cont}>
                        <TextField
                            variant={"outlined"}
                            label={t("assetsModule.street")}
                            error={ errors.filter(e => e.field === 'street').length > 0 }
                            value={ values.address.street }
                            onChange={handleChange({type: 'address', field: 'street'})}
                            className={classes.textField}
                            size={'medium'}
                            helperText={ errors.filter(e => e.field === `street`).length > 0 ? t("errors.isRequired"): null }
                        />
                    </Grid>           
                    <Grid item xs={6} className={classes.cont}>
                        <TextField
                            variant={"outlined"}
                            label={t("assetsModule.streetNumber")}
                            error={ errors.filter(e => e.field === 'streetNumber').length > 0 }
                            value={ values.address.streetNumber }
                            onChange={handleChange({type: 'address', field: 'streetNumber'})}
                            className={classes.textField}
                            size={'medium'}
                            helperText={ errors.filter(e => e.field === `streetNumber`).length > 0 ? t("errors.isRequired"): null }
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.cont}>
                         <TextField
                            variant={"outlined"}
                            label={t("assetsModule.entrance")}
                            error={ errors.filter(e => e.field === 'entrance').length > 0 }
                            value={ values.address.entrance }
                            onChange={handleChange({type: 'address', field: 'entrance'})}
                            className={classes.textField}
                            size={'medium'}
                            helperText={ errors.filter(e => e.field === `entrance`).length > 0 ? t("errors.isRequired"): null }
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.cont}>
                        <TextField
                            variant={"outlined"}
                            label={t("assetsModule.city")}
                            error={ errors.filter(e => e.field === 'city').length > 0 }
                            value={ values.address.city }
                            onChange={handleChange({type: 'address', field: 'city'})}
                            className={classes.textField}
                            size={'medium'}
                            helperText={ errors.filter(e => e.field === `city`).length > 0 ? t("errors.isRequired"): null }
                        /> 
                    </Grid>
                    <Grid item xs={6} className={classes.cont}>
                        <TextField
                            variant={"outlined"}
                            label={t("assetsModule.zipcode")}
                            error={ errors.filter(e => e.field === 'zipcode').length > 0 }
                            value={ values.address.zipcode }
                            onChange={handleChange({type: 'address', field: 'zipcode'})}
                            className={classes.textField}
                            size={'medium'}
                            helperText={ errors.filter(e => e.field === `zipcode`).length > 0 ? t("errors.isRequired"): null }
                        /> 
                    </Grid>
                    <Grid item xs={12} className={classes.cont}>   
                        <Select
                            variant={"outlined"}
                            error={ errors.filter(e => e.field === `type`).length > 0 }
                            value={ values.type }
                            onChange={handleChange({type: 'type', field: `type`})}
                            className={classes.selectInput}
                            MenuProps={{
                                anchorOrigin: {
                                    vertical: "bottom",
                                    horizontal: "left",
                                  },
                                  transformOrigin: {
                                    vertical: "top",
                                    horizontal: "center",
                                  },
                              
                                disablePortal: true,
                                classes: {
                                    paper: classes.menupaper,
                
                                }
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
                        {
                            addInfoContext === 'apartment' ?
                            <React.Fragment>
                                <Grid item xs={6} className={classes.cont}>
                                    <TextField
                                        variant={"outlined"}
                                        label={t("assetsModule.floor")}
                                        error={ errors.filter(e => e.field === 'floor').length > 0 }
                                        value={ values.addInfo.floor }
                                        onChange={handleChange({type: 'addInfo', field: 'floor'})}
                                        className={classes.textField}
                                        size={'medium'}
                                    />
                                </Grid>
                                <Grid item xs={6} className={classes.cont}>
                                    <TextField
                                        variant={"outlined"}
                                        label={t("assetsModule.unit")}
                                        error={ errors.filter(e => e.field === 'unit').length > 0 }
                                        value={ values.addInfo.unit }
                                        onChange={handleChange({type: 'addInfo', field: 'unit'})}
                                        className={classes.textField}
                                        size={'medium'}
                                    /> 
                                </Grid>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <Grid item xs={6} className={classes.cont}>
                                    <TextField
                                        variant={"outlined"}
                                        label={t("assetsModule.floors")}
                                        error={ errors.filter(e => e.field === 'floors').length > 0 }
                                        value={ values.addInfo.floors }
                                        onChange={handleChange({type: 'addInfo', field: 'floors'})}
                                        className={classes.textField}
                                        size={'medium'}
                                        
                                    />
                                </Grid>
                                <Grid item xs={6} className={classes.cont}>
                                    <TextField
                                        variant={"outlined"}
                                        label={t("assetsModule.units")}
                                        error={ errors.filter(e => e.field === 'units').length > 0 }
                                        value={ values.addInfo.units }
                                        onChange={handleChange({type: 'addInfo', field: 'units'})}
                                        className={classes.textField}
                                        size={'medium'}
                                    />
                                </Grid>
                            </React.Fragment>
                        }
                    <Grid item xs={12} className={classes.controls}>
                        <Button
                            className={clsx(classes.control, classes.save)}
                            onClick={handleConfirm}
                        >
                            {t("controls.save")}
                        </Button>
                        <Button
                            className={clsx(classes.control, classes.cancel)}
                            onClick={handleCancel}
                        >
                            {t("controls.cancel")}
                        </Button>
                    </Grid> 
                </Grid> 
            </div>
        </Collapse>
        
    )

}

const useStyles = makeStyles(theme => ({
    container: {
        background: 'rgba(0,0,0,0.2)',
        border: '1px solid rgba(255,255,255,0.2)',
        
        margin: '10px',
        borderRadius: '19px',
        boxShadow: 'rgba(0,0,0,0.25) 0px 2px 10px 5px',
    },
    title: {
        width: 'auto',
        padding: '5px 20px',
        borderBottom: `1px solid rgba(255,255,255,0.1)`,
        background: 'rgba(0,0,0,0.3)',
        color: theme.palette.textPrimary,
        fontSize: '18px',
        borderRadius: '18px 18px 0 0',
        boxShadow: 'rgba(0,0,0,0.25) 0 2px 4px 1px'
    },
    inputs: {
        padding: '10px',      
    },
    typeContainer: {
        display: 'flex'
    },
    textInput: {
        margin: '5px',
        '& input': {
            color: 'white',
            paddingLeft: '20px',
        },
        '& label': {
            color: 'white',
            paddingLeft: '5px' 
        },
        '& fieldset': {
            borderColor: 'rgba(255,255,255,0.6)',
            borderRadius: '42px',
            
        }
           
    },
    cont: {
        padding: '5px'
    },
    controls: {
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
        marginTop: '15px',
        marginLeft: '-50px',
        marginRight: '-46px'

    },
    menuitem: {
        color: 'white'
    },
}))