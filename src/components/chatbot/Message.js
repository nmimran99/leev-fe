import { Fade, Grid, Grow, makeStyles, Slide,  } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { LanguageContext } from '../../context/LanguageContext';

export const Message = ({ data }) => {

    const classes = useStyles();
    const { t } = useTranslation();
    const { lang } = useContext(LanguageContext);

	return (
        <Grow in={Boolean(data)} timeout={500}>
            <Grid container direction={ data.isUser ? 'row' : 'row-reverse'} className={classes.messageContainer} >
                <Grid item xs={8} className={clsx(classes.message, data.isUser ? classes.userMessage : classes.systemMessage)}>
                    <div className={classes.messageText}>
                        {
                            data.isUser ? 
                            data.text :
                            t(data.text)
                        }
                        <div className={classes.time}>
                            {format(new Date(), lang.timeonly)}
                        </div>
                    </div>
                    
                </Grid>
        </Grid>
        </Grow>
		
	);
};

const useStyles = makeStyles((theme) => ({
    message: {
        display: 'flex',
        margin: '3px 5px',
    },
    messageText: {
        color: 'white',
        borderRadius: '5px',
        padding: '10px 20px',
        fontSize: '13px',
        width: 'fit-content',
        minWidth: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    userMessage: {     
        '&>div': {
            background: 'grey',
        },
        justifyContent: 'flex-start'
    },
    systemMessage: {
        '&>div': {
            background: '#42A5F5',
        },      
        justifyContent: 'flex-end'
    },
    time: {
        fontSize: '10px',
        marginTop: '5px',
        color: 'rgba(255,255,255,0.7)'
    }
}));
