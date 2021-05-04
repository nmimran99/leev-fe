import { Fade, Grid, makeStyles, Slide,  } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export const Message = ({ data }) => {

    const classes = useStyles();
    const { t } = useTranslation();

	return (
        <Slide direction='up' in={Boolean(data)} timeout={500}>
            <Grid container direction={ data.isUser ? 'row' : 'row-reverse'} className={classes.messageContainer} >
                <Grid item xs={8} className={clsx(classes.message, data.isUser ? classes.userMessage : classes.systemMessage)}>
                    <div className={classes.messageText}>
                        {
                            data.text
                        }
                    </div>
                </Grid>
        </Grid>
        </Slide>
		
	);
};

const useStyles = makeStyles((theme) => ({
    message: {
        display: 'flex',
        margin: '3px 5px',
    },
    messageText: {
        color: 'white',
        borderRadius: '100px',
        padding: '10px 20px',
        fontSize: '13px',
        width: 'fit-content',
        minWidth: '50px'
    },
    userMessage: {     
        '&>div': {
            background: 'grey',
        },
        justifyContent: 'flex-start'
    },
    systemMessage: {
        '&>div': {
            background: '#FF6767',
        },      
        justifyContent: 'flex-end'
    }
}));
