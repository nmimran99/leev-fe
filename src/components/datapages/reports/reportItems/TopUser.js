import { Avatar, makeStyles } from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { getFullName } from "../../../../api/genericApi";
import clsx from 'clsx';

export const TopUser = ({ user, topUser, actionCount}) => {
	
    const classes = useStyles();
    const { t } = useTranslation();

	return (
		<div className={topUser ? classes.topUserMain : classes.secondaryUserMain}>
            <Avatar className={topUser ? classes.topUserAvatar : classes.secondaryUserAvatar} src={user.avatar} />
            <div className={topUser ? classes.topUserDetails : classes.secondaryUserDetails}>
                <div className={topUser ? classes.topUserName : classes.secondaryUserName}>
                    {getFullName(user)}
                </div>
                <div className={topUser ? classes.topUserCompany : classes.secondaryUserCompany}>
                    {user.employedBy}
                </div>
            </div>
            <div className={topUser ? classes.topUserActions : classes.secondaryUserActions}>
                <div className={topUser ? classes.topUserActionsCount : classes.secondaryUserActionsCount}>
                    {actionCount}
                </div>
                <div className={topUser ? classes.topUserActionsLabel : classes.secondaryUserActionsLabel}>
                    {t("reportsModule.userActions")}
                </div>
            </div>
        </div>
	);
};

const useStyles = makeStyles((theme) => ({
    
    topUserMain: {
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '10px',
        display: 'flex',
        color: 'white',
        padding: '20px 10px',
        width: '340px',
        [theme.breakpoints.down('sm')]: {
            width: 'auto',
            padding: '20px 10px'
        }
    },
    topUserAvatar: {
        height: '60px',
        width: '60px',
    },
    topUserDetails: {
        padding: '10px'
    },
    topUserCompany: {
        fontSize: '12px',
        marginTop: '3px'
    },
    topUserActions: {
        margin: 'auto 10px auto auto',
        height: '50px',
        width: '50px'
    },
    topUserActionsCount: {
        textAlign: 'center',
        fontSize: '22px',
        marginTop: '5px'
    },
    topUserActionsLabel: {
        textAlign: 'center',
        fontSize: '10px'
    },
    secondaryUserMain: {
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '10px',
        display: 'flex',
        color: 'white',
        padding: '0px 20px',
        width: '320px',
        margin: '3px 0',
        [theme.breakpoints.down('sm')]: {
            width: 'auto',
            padding: '0px 10px',
        }
    },
    secondaryUserAvatar: {
        height: '30px',
        width: '30px',
        margin: 'auto 0'
    },
    secondaryUserDetails: {
        padding: '10px'
    },
    secondaryUserName: {
        fontSize: '13px'
    },
    secondaryUserCompany: {
        fontSize: '11px',
        marginTop: '3px'
    },
    secondaryUserActions: {
        margin: 'auto 0 auto auto',
        height: '50px',
        width: '50px',
    },
    secondaryUserActionsCount: {
        textAlign: 'center',
        fontSize: '16px',
        marginTop: '8px'
    },
    secondaryUserActionsLabel: {
        textAlign: 'center',
        fontSize: '10px'
    },
}));
