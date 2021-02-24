import React from 'react';
import { Grid, makeStyles, Paper, useMediaQuery } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export const SystemsHeader = () => {

    const classes = useStyles();
    const downSm = useMediaQuery(theme => theme.breakpoints.down('md'));
    const { t, i18n } = useTranslation();

    return (
        <Grid item xs={ 12 } sm={7} md={8} lg={11} xl={11}>
            <Paper elevation={9} className={classes.headerPaper}>
                <div className={classes.systemName}>
                    {t("systemsModule.systemName")}
                </div>
                {
                    !downSm &&
                    <div className={classes.actionsContainer}>
                        <div className={classes.iconHeader}>
                            {t("systemsModule.moreDetails")}
                        </div>
                        <div className={classes.iconHeader}>
                            {t("systemsModule.tasks")}
                        </div>
                        <div className={classes.iconHeader}>
                            {t("systemsModule.faults")}
                        </div>
                        <div className={classes.iconHeader}>
                            {t("systemsModule.documents")}
                        </div>
                        <div className={classes.iconHeader}>
                            {t("systemsModule.changeManager")}
                        </div>
                        <div className={classes.iconHeader}>
                            {t("systemsModule.users")}
                        </div>      
                        <div className={classes.ownerHeader}>
                            {t("systemsModule.ownerHeader")}
                        </div>
                    </div>
                } 
            </Paper>
        </Grid>                          
    )
}

const useStyles = makeStyles(theme => ({
    headerPaper: {
        height: '45px',
        background: 'rgba(0,0,0,0.7)',
        margin: '5px',
        borderRadius: '5px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px'
    },
    systemName: {
        margin: 'auto 20px',
        whiteSpace: 'nowrap'
    },
    actionsContainer: {
        display: 'flex',
        fontSize: '12px',
        width: '668px',
        justifyContent: 'flex-end'
 
    },
    iconHeader: {
        width: '78px',
        textAlign: 'center',
        margin: 'auto'
    },
    ownerHeader: {
        width: '190px',
        textAlign: 'center',
        margin: 'auto',
        [theme.breakpoints.down('md')]: {
            margin: 'auto 0'
        }
    }

}))