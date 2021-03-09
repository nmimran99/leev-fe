import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { LanguageContext } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

export const AlertDialog = ({ alertDialog , open }) => {

        const classes = useStyles();
        const { lang } = useContext(LanguageContext);
        const { t, i18n } = useTranslation();
  return (
    <Dialog
        open={true}
        onClose={alertDialog.handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ direction: lang.dir}}
        classes={{
            root: classes.root, 
            paper: classes.paper,
            container: classes.container
        }}
        BackdropProps={{
            timeout: 500,
            classes: {
                root: classes.root
            }
        }}
    >
    <DialogTitle id="alert-dialog-title" style={{ direction: lang.dir}} className={classes.title}>
        {alertDialog.title}
    </DialogTitle>
    <DialogContent>
        <DialogContentText id="alert-dialog-description" style={{ direction: lang.dir}} className={classes.text}>
        { alertDialog.text }
        </DialogContentText>
    </DialogContent>
    <DialogActions className={classes.controls}>
        <Button
            className={clsx(classes.control, classes.save)}
            onClick={alertDialog.handleConfirm}
        >
            { alertDialog.confirmText || t("alert.confirm") }
        </Button>
        <Button
            className={clsx(classes.control, classes.cancel)}
            onClick={alertDialog.handleCancel}
        >
            { alertDialog.cancelText || t("alert.cancel") }
        </Button>
    </DialogActions>
    </Dialog>

  );
}

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    container: {
        backdropFilter: 'blur(10px)',
    },
    paper: {
        width: 'auto',
        padding: '5px',
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.2)',
        color: 'white'
    },
    text: {
        color: 'white'
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
        }
    },
    cancel: {
        border: '0px solid grey',
        '&:hover': {
            borderWidth: '1px'
        }
    }
}))