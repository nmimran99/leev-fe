import React, { useState } from 'react';
import { makeStyles, useMediaQuery, Button, Fade, OutlinedInput, FormControl, InputLabel, ClickAwayListener, IconButton, } from '@material-ui/core';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import { updateSystemName } from '../../../api/systemsApi'

import { useTranslation } from 'react-i18next';

import EditRoundedIcon from '@material-ui/icons/EditRounded';
import { green, red } from '@material-ui/core/colors';

export const SystemName = ({ systemId, editName, setEditName, setSystemName, title }) => {

    const classes = useStyles();
    const { t, i18n } = useTranslation();
    const downSm = useMediaQuery(theme => theme.breakpoints.down('md'));
    const [ textValue, setTextValue ] = useState(title);
    const [ editNameHover, setEditNameHover ] = useState(false);

    const handleChange = event => {
        setTextValue(event.target.value);
    };

    const handleSave = async () => {
         await updateSystemName(systemId, textValue);
         setSystemName(textValue);
         setEditName(false);
    }


    return (
        <React.Fragment>
            {
                editName ?
                <ClickAwayListener onClickAway={() => setEditName(false)}>
                    <div className={classes.editContainer}>
                        <FormControl variant='outlined' className={classes.textInput}>
                            <InputLabel htmlFor='olip' shrink>{t("systemsModule.systemName")}</InputLabel>
                            <OutlinedInput
                                autoFocus
                                notched
                                id='olip' 
                                value={ textValue }
                                onChange={handleChange}
                                labelWidth={75}
                                className={classes.input} 
                            />
                        </FormControl>
                        <IconButton 
                            className={classes.save}
                            onClick={handleSave}
                        >
                            <SaveRoundedIcon className={classes.icon}/>
                        </IconButton>
                        <IconButton 
                            className={classes.cancel}
                            onClick={() => setEditName(false)}
                        >
                            <ClearRoundedIcon className={classes.icon} />
                        </IconButton>
                       </div> 
                </ClickAwayListener>
                
                : 
                <Button 
                    className={classes.systemName}
                    onMouseEnter={() => setEditNameHover(true)}
                    onMouseLeave={() => setEditNameHover(false)}
                    onClick={() => { setEditNameHover(false); setEditName(true)}}
                >
                    { title }
                    {
                        editNameHover &&
                        <Fade in={true} timeout={700}>
                            <EditRoundedIcon style={{ 
                                margin: '0 10px 0 0',
                                fontSize: '16px'
                            }}/>
                        </Fade>
                        
                    }
                </Button>
            }
        </React.Fragment>                    
    )
}

const useStyles = makeStyles(theme => ({
    editContainer: {
        height: 'auto',
        margin: 'auto 0',
        width: '100%',
        dispaly: 'flex',
        justifyContent: 'center'
    },
    systemName: {
        width: 'auto',
        color: 'white',
        margin: 'auto 20px',
        fontSize: '16px',
        whiteSpace: 'wrap',
        borderRadius: '50px',
        padding: '5px 20px',
        textAlign: 'left'
    },
    textInput: {
        width: '65%',
        margin: '15px 5px 15px 10px',
        '& label.Mui-focused': {
            color: 'white',
        },
        '& label': {
            color: 'white'
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'white',
            },
            '&:hover fieldset': {
                borderColor: 'rgba(255,255,255,0.7)',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'rgba(255,255,255,0.7)',
              },
        },
        
    },
    input: {
        color: 'white',
        height: '45px',
        borderRadius: '25px',
        padding: '10px',
        '&:focus': {
            border: '2px solid white'
        }

    },
    icon: {
        color: 'white',
        fontSize: '20px',
        padding: '0px',
        '&hover': {

        }
    },
    save: {
        background: green[800],
        padding: '8px',
        margin: '18px 5px',
        
    },
    cancel: {
        background: red[800],
        padding: '8px',
        margin: '18px 5px',
       
    }
}))