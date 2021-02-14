import React, {  useState } from 'react'
import { makeStyles, InputLabel, OutlinedInput, Button, Typography, Collapse, FormControl, } from '@material-ui/core'
import clsx from 'clsx'




export const UpdateAsset = ({ open, data, handleUpdate, handleCancel }) => {

    const [ values, setValues ] = useState({
        address: data.address || '',
        addInfo: data.addInfo || '',
        type: data.type || ''
    });
    const [ errors, setErrors ] = useState([]);

    const handleChange = req => event => {
        if (req.type === req.field) {
            setValues({
                ...values, 
                [req.field]: event.target.value
            })
        } else {
            setValues({
                ...values,
                [req.type]: {
                    ...values[req.type],
                    [req.field]: event.target.value
                }
            })
        };

    }

    const classes = useStyles();
    return (
        <Collapse in={open}>
            <div className={classes.container}>
                <Typography className={classes.title}>
                    {`עריכת נכס`}
                </Typography>
                <div className={classes.inputs}>
                    <div className={classes.cont}>
                        <FormControl variant='outlined' className={classes.textInput} fullWidth>
                            <InputLabel htmlFor='outlined-input-password' shrink>שם רחוב</InputLabel>
                            <OutlinedInput
                                notched
                                error={ errors.filter(e => e.field === 'street').length > 0 }
                                id='outlined-input-password' 
                                value={ values.address.street }
                                onChange={handleChange({type: 'address', field: 'street'})}
                                labelWidth={60} 
                            />
                        </FormControl>
                    </div>           
                    <div className={classes.cont}>
                        <FormControl variant='outlined' className={classes.textInput}  >
                            <InputLabel htmlFor='outlined-input-password' shrink>מספר רחוב</InputLabel>
                            <OutlinedInput
                                notched
                                error={ errors.filter(e => e.field === 'streetNumber').length > 0 }
                                id='outlined-input-password' 
                                value={ values.address.streetNumber }
                                onChange={handleChange({type: 'address', field: 'streetNumber'})}
                                labelWidth={75}
                            />
                        </FormControl>
                        <FormControl variant='outlined' className={classes.textInput} >
                            <InputLabel htmlFor='outlined-input-password' shrink>כניסה</InputLabel>
                            <OutlinedInput
                                notched
                                error={ errors.filter(e => e.field === 'entrance').length > 0 }
                                id='outlined-input-password'
                                value={ values.address.entrance }
                                onChange={handleChange({type: 'address', field: 'entrance'})}
                                labelWidth={40}
                            />
                        </FormControl>
                        <FormControl variant='outlined' className={clsx(classes.textInput)} >
                            <InputLabel htmlFor='outlined-input-password' shrink>סוג נכס</InputLabel>
                            <OutlinedInput
                                notched
                                error={ errors.filter(e => e.field === 'type').length > 0 }
                                id='outlined-input-password' 
                                value={ values.type }
                                onChange={handleChange({type: 'type', field: 'type'})}
                                labelWidth={55}
                            />
                        </FormControl>
                    </div>
                    <div className={classes.cont}>
                        <FormControl variant='outlined' className={classes.textInput} >
                            <InputLabel htmlFor='outlined-input-password' shrink>עיר</InputLabel>
                            <OutlinedInput
                                notched
                                error={ errors.filter(e => e.field === 'city').length > 0 }
                                id='outlined-input-password' 
                                value={ values.address.city }
                                onChange={handleChange({type: 'address', field: 'city'})}
                                labelWidth={40}
                            />
                        </FormControl>
                        <FormControl variant='outlined' className={classes.textInput} >
                            <InputLabel htmlFor='outlined-input-password' shrink>מיקוד</InputLabel>
                            <OutlinedInput
                                notched
                                error={ errors.filter(e => e.field === 'zipcode').length > 0 }
                                id='outlined-input-password' 
                                value={ values.address.zipcode }
                                onChange={handleChange({type: 'address', field: 'zipcode'})}
                                labelWidth={40}
                            />
                        </FormControl>
                    </div>
                    <div className={classes.cont}>
                        {
                            data.addInfo.floor ?
                            <FormControl variant='outlined' className={classes.textInput}>
                                <InputLabel htmlFor='outlined-input-password' shrink>קומה</InputLabel>
                                <OutlinedInput
                                    notched
                                    error={ errors.filter(e => e.field === 'floor').length > 0 }
                                    id='outlined-input-password' 
                                    value={ values.addInfo.floor }
                                    onChange={handleChange({type: 'addInfo', field: 'floor'})}
                                    labelWidth={40}
                                />
                            </FormControl> :
                            null
                        }
                        {
                            data.addInfo.unit ?
                            <FormControl variant='outlined' className={classes.textInput}>
                                <InputLabel htmlFor='outlined-input-password' shrink>דירה</InputLabel>
                                <OutlinedInput
                                    notched
                                    error={ errors.filter(e => e.field === 'unit').length > 0 }
                                    id='outlined-input-password' 
                                    value={ values.addInfo.unit }
                                    onChange={handleChange({type: 'addInfo', field: 'unit'})}
                                    labelWidth={40}
                                />
                            </FormControl> :
                            null
                        }
                        {
                            data.addInfo.floors ?
                            <FormControl variant='outlined' className={classes.textInput}>
                                <InputLabel htmlFor='outlined-input-password' shrink>קומות</InputLabel>
                                <OutlinedInput
                                    notched
                                    error={ errors.filter(e => e.field === 'floors').length > 0 }
                                    id='outlined-input-password' 
                                    value={ values.addInfo.floors }
                                    onChange={handleChange({type: 'addInfo', field: 'floors'})}
                                    labelWidth={40}
                                />
                            </FormControl> :
                            null
                        }
                    </div>
                    <div className={classes.controls}>
                        <Button
                            className={clsx(classes.control, classes.save)}
                            onClick={() => handleUpdate(data._id, values.address, values.addInfo, values.type)}
                        >
                            שמירה
                        </Button>
                        <Button
                            className={clsx(classes.control, classes.cancel)}
                            onClick={handleCancel}
                        >
                            ביטול
                        </Button>
                    </div>
                    
                    
                         
                </div> 
            </div>
        </Collapse>
        
    )

}

const useStyles = makeStyles(theme => ({
    container: {
        background: 'rgba(0,0,0,0.2)',
        border: '1px solid rgba(255,255,255,0.2)',
        height: '370px',
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
        display: 'flex'
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
    }
}))