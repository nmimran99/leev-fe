import React, { useState, useContext, useEffect } from 'react';
import { Grid, makeStyles, Paper, FormControl, IconButton, useMediaQuery, Fade, Modal, Backdrop,Select, MenuItem, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import { LanguageContext } from '../../../context/LanguageContext';
import { getUserList } from '../../../api/userApi';
import clsx from 'clsx'



export const AddRelatedUser = ({ handleClose, handleSave, isOpen, relatedUsers }) => {

    const classes = useStyles();
    const { lang } = useContext(LanguageContext);
    const downSm = useMediaQuery(theme => theme.breakpoints.down('md'));
    const { t, i18n } = useTranslation();
    const [ userList, setUserList ] = useState([]);
    const [ selectedUser, setSelectedUser ] = useState(null)
    
    useEffect(() => {
        getUserList()
        .then(data => {
            let ul = relatedUsers.map(l => l._id);
            setUserList(data.filter(u => ul.indexOf(u._id) === -1 ));
        })
    }, [])

    const handleChange = event => {
        setSelectedUser(event.target.value)
    }


    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500
            }}
            className={classes.modal}
        >
            <Fade in={isOpen}>
                <Grid container justify='center' alignItems='center' style={{ outline: '0'}}>
                    <Grid item xl={3}>
                        <Paper 
                            className={classes.paper} 
                            style={{ direction: lang.dir }}
                            elevation={6}    
                        >
                            <div className={classes.header}>
                                <div className={classes.title}>
                                    {t("systemsModule.addRelatedUserTitle")}
                                </div>
                                <IconButton className={classes.closeBtn} onClick={handleClose}>
                                    <ClearRoundedIcon className={classes.icon}/>
                                </IconButton>  
                            </div>
                            <div className={classes.instructions}>
                                {t("systemsModule.chooseUserToAdd")}
                            </div>
                            <FormControl variant='outlined' className={classes.textInput} >
                                <Select
                                    value={selectedUser}
                                    onChange={handleChange}
                                    className={classes.menu}
                                    MenuProps={{
                                        classes: {
                                            paper: classes.menupaper,
                                        }
                                    }}
                                >
                                    {
                                        userList.map( (user, i) => {
                                            return (
                                                <MenuItem
                                                    className={classes.menuitem}
                                                    value={user._id} 
                                                    key={i}
                                                    style={{ direction: lang.code === 'he' ? 'rtl' : 'ltr'}}
                                                >
                                                    {`${user.firstName} ${user.lastName}`}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <div className={classes.controls}>
                                <Button
                                    className={clsx(classes.control, classes.save)}
                                    onClick={() => handleSave(selectedUser)}
                                    disabled={!selectedUser}
                                >
                                    {t("alert.confirm")}
                                </Button>
                                <Button
                                    className={clsx(classes.control, classes.cancel)}
                                    onClick={handleClose}
                                >
                                    {t("alert.cancel")}
                                </Button>
                            </div>
                        </Paper>
                    </Grid>
                    
                </Grid> 
                
            </Fade>
        </Modal>
    )
}


const useStyles = makeStyles(theme => ({
    paper: {
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.2)',
        padding: '10px',
        borderRadius: '10px',
        '&:focus': {
            outline: 'none'
        }
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)'   
    },
    header: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        color: 'white',
        fontSize: '18px',
        padding: '5px 10px',
        height: 'fit-content'
    },
    closeBtn: {
        fontSize: '20px',
        height: '40px',
        width: '40px'
    },
    icon: {
        color: 'white',
        borderRadius: '25px',
        padding: '5px',
        '&:hover': {
            background: 'rgba(255,255,255,0.2)'
        }
    },
    instructions: {
        width: 'auto',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '12px',
        margin: '0px 10px'
    },
    menu: {
        color: 'white',
        '&:hover': {
            borderColor: 'white'
        }
    },
    menupaper: {
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
        maxHeight: '200px',
        overflowY: 'auto',
    },
    menuitem: {
        color: 'white'
    },
    textInput: {
        margin: '20px 5px',
        width: '300px',
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
            borderRadius: '42px'
        }    
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
        border: '0px solid grey',
        '&:hover': {
            borderWidth: '1px'
        }
    }
}))