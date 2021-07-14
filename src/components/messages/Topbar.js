import { IconButton, makeStyles, useMediaQuery } from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";
import PlaylistAddOutlinedIcon from '@material-ui/icons/PlaylistAddOutlined';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

export const Topbar = ({ toggleNewMessage, toggleMessenger}) => {
	const classes = useStyles();
    const downSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const { t } = useTranslation();

	return (
		<div className={classes.mainContainer}>
            <div className={classes.newMessageContainer}>
                <IconButton className={classes.newMessage} onClick={toggleNewMessage}>
                    <PlaylistAddOutlinedIcon  className={classes.icon}/>
                </IconButton>
            </div>
            <div className={classes.title}>
                {t("messenger.messages")}
            </div>
            {
                downSm &&
                <IconButton className={classes.newMessage} onClick={toggleMessenger}>
                    <CloseRoundedIcon  className={classes.icon}/>
                </IconButton>
                
            }
        </div>
	);
};

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        color: 'white',
        alignItems: 'center'
    },
    icon: {
        color: 'rgba(255,255,255,0.8)',
      
    },
    newMessageContainer: {
        padding: '0'
    },
    editChats: {
        fontSize: '14px',
        padding: '0 20px',
        color: 'rgba(255,255,255,0.8)',
        cursor: 'pointer'
    }
}));
