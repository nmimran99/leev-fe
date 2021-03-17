import React, { useEffect, useState } from 'react';
import { makeStyles, Grid, Collapse, TextField, FormControlLabel, Checkbox, IconButton, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';


export const TaskSteps = ({ data,  isUsingSteps, handleChange, isSequential, toggleIsSequential, addStep, removeStep }) => {

    const classes = useStyles();
    const { t, i18n } = useTranslation();
    const [ isSeq, setIsSeq ] = useState(isSequential);
    const [ steps, setSteps ] = useState(data || [{ order: 1, description: ''}]);

    useEffect(() => {
        setSteps(data)
    }, [data]);

    useEffect(() => {
        setIsSeq(isSequential);
    }, [isSequential])

    return (
        <Collapse in={isUsingSteps} >
            <Grid container>
                {/* <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox 
                                checked={isSeq} 
                                onChange={toggleIsSequential}
                                classes={{ root: classes.checkbox, checked: classes.checked}}
                            />
                        }
                        className={classes.isSequential} 
                        label={t("tasksModule.upsert.isSequential")}
                    />
                </Grid> */}
                {
                    steps.map((step, i) => 
                    <Grid container className={classes.textContainer}>
                        <Grid item xs={10}>
                            <TextField
                                variant={"outlined"}
                                label={`${t(`tasksModule.upsert.step`)} ${step.order}`}
                                value={ step.description }
                                onChange={handleChange(i)}
                                className={classes.textField}
                                size={'medium'}
                                multiline={true}
                                helperText={ `${60 - step.description.length} ${t("tasksModule.upsert.titleLimit")}` }
                                inputProps={{
                                    maxLength: 60
                                }}
                                FormHelperTextProps={{
                                    style: { color: 'rgba(255,255,255,0.6)' }
                                }}
                                
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton
                                className={classes.iconBtn}
                                onClick={removeStep(step.order)}
                            >
                                <DeleteOutlineRoundedIcon className={classes.icon} />
                            </IconButton>
                        </Grid>
                    </Grid>
                    ) 
                }
                <Grid item xs={12}>
                    <Button 
                        className={classes.addBtn}
                        startIcon={ <AddIcon className={classes.addIcon} />}
                        onClick={addStep}
                    >
                        {t("tasksModule.upsert.addStep")}
                    </Button>
                </Grid>
            </Grid>
        </Collapse>

    )
} 

const useStyles = makeStyles(theme => ({
    textContainer: {
        padding: '5px',
        display: 'flex',
        alignItems: 'center'
    },
    textField: {
        width: '100%',
        '& fieldset': {
            borderRadius: '5px',
        },  
    },
    isSequential: {
        color: 'white',
        padding: '0px 15px 10px'
    },
    checkbox: {
        color: 'rgba(255,255,255,0.2)',
        '&$checked': {
          color: 'rgba(255,255,255,0.8)',
        },
    },
    checked: {},
    addBtn: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: '16px',
        border: '1px solid rgba(255,255,255,0.6)' ,
        borderRadius: '50px',
        padding: '5px 30px 5px 15px',
        margin: '5px',
        whiteSpace: 'nowrap',
        '&:hover': {
            background: 'rgba(255,255,255,0.8)',
            color: 'rgba(0,0,0,0.8)',

        }   
    },
    iconBtn: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: '16px',
        border: '1px solid rgba(255,255,255,0.6)' ,
        borderRadius: '50px',
        padding: '10px',
        margin: '0 10px 20px',
        '&:hover': {
            background: 'rgba(255,255,255,0.8)',
            color: 'rgba(0,0,0,0.8)',

        }   
    }
}))