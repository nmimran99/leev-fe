import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export const AlertDialog = ({ alertDialoge , open }) => {

  return (
    <Dialog
        open={open}
        onClose={alertDialoge.handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
    <DialogTitle d="alert-dialog-title">
        {alertDialoge.title}
    </DialogTitle>
    <DialogContent>
        <DialogContentText id="alert-dialog-description">
        { alertDialoge.text }
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button onClick={alertDialoge.handleCancel} color="primary">
            { alertDialoge.cancelText || `ביטול` }
        </Button>
        <Button onClick={alertDialoge.handleConfirm} color="primary" autoFocus>
            { alertDialoge.confirmText || `אישור` } 
        </Button>
    </DialogActions>
    </Dialog>

  );
}