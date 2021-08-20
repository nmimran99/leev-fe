import { Icon, makeStyles } from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";

export const ItemCounter = ({ itemCount, itemLabel, color, TopIcon}) => {
	
    const classes = useStyles();
    const { t } = useTranslation();

	return (
		<div className={classes.countContainer}>
            <Icon className={classes.icon}>
                {TopIcon}
            </Icon>
            <div className={classes.itemsCount}>
                {itemCount}
            </div>
            <div className={classes.itemsLabel} style={{ background: color}}>
                {itemLabel}
            </div>
        </div>
	);
};

const useStyles = makeStyles((theme) => ({
    countContainer: {
        width: '250px',
        height: '250px',
        borderRadius: '10px',
        margin: '20px 10px',
        color: 'white',
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            width: '130px',
            height: '130px',
            margin: 'auto 10px',
        }
    },
    itemsCount: {
        fontSize: '42px',
        margin: '0 auto',
        width: 'fit-content',
        [theme.breakpoints.down('sm')]: {
            fontSize: '22px',
            padding: '10px',
    
        }
    },
    itemsLabel: {
        fontSize: '14px',
        margin: '0 auto',
        width: 'fit-content',
        marginTop: '10px',
        padding: '8px 20px',
        borderRadius: '50px',
        [theme.breakpoints.down('sm')]: {
            padding: '8px 15px',
            lineHeight: '1',
            marginTop: '5px',
            padding: '5px 10px',
            fontSize: '11px',
            width: 'calc(100% - 20px)',
            borderRadius: '0 0 10px 10px',
            textAlign: 'center'
        }
    },
    opened: {
        background: 'green',
        [theme.breakpoints.down('sm')]: {
            background: 'none'
        }
    },
    closed: {
        background: 'red',
        [theme.breakpoints.down('sm')]: {
            background: 'none'
        }
    },
    icon: {
        margin: '0 auto',
        width: 'calc(100% - 40px)',
        height: '60px',
        padding: '20px',
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '10px 10px 0 0',
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
        [theme.breakpoints.down('sm')]: {
            height: '40px',
            padding: '10px 20px',
            marginBottom: '0px',
        }
    }
}));
