import { Button, Icon, List, ListItem, ListItemIcon, ListItemText, makeStyles, useMediaQuery } from '@material-ui/core';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { LanguageContext } from '../../../context/LanguageContext';
import clsx from 'clsx';

const menuOptions = [
    {
        tab: 'profile',
        icon: "https://img.icons8.com/ios-filled/25/4a90e2/name.png"
    },
    {
        tab: 'users',
        icon: "https://img.icons8.com/ios-filled/25/4a90e2/conference-background-selected.png"
    },
    {
        tab: 'residents',
        icon: "https://img.icons8.com/ios-filled/25/4a90e2/person-at-home.png"
    },
    {
        tab: 'permissions',
        icon: "https://img.icons8.com/ios-filled/25/4a90e2/shield.png"
    },
    {
        tab: 'appearance',
        icon: "https://img.icons8.com/ios-filled/25/4a90e2/monitor--v1.png"
    }
]

export const SettingsMenu = ({ active, setActive }) => {
	const classes = useStyles();
	const history = useHistory();
	const location = useLocation();
	const { t } = useTranslation();
    const { lang, setLang } = useContext(LanguageContext);
    const downLg = useMediaQuery((theme) => theme.breakpoints.down('sm'))

	return (
		<List className={classes.menuContainer}>
            {
                menuOptions.map((mo, i) => {
                    return (
                        <ListItem 
                        className={clsx(classes.listItem, active === mo.tab && classes.active)} 
                        button={true}
                        onClick={() => setActive(mo.tab)}
                        >
                        <ListItemIcon className={classes.iconContainer}>
                            <Icon className={classes.icon}>
                                <img src={mo.icon} />
                            </Icon>
                        </ListItemIcon>
                        {
                            !downLg &&
                            <ListItemText className={classes.textContainer}>{t(`settings.${mo.tab}`)}</ListItemText>
                        }
                        
                    </ListItem>
                    )
                })
            }  
		</List>
	);
};

const useStyles = makeStyles((theme) => ({
	menuContainer: {
        width: '100%',
        height: '100%',
        borderRight: '1px solid rgba(255,255,255,0.2)',
        padding: 0,
        [theme.breakpoints.down('xs')]: {
            display: 'flex',
            borderRight: 'unset',
            borderBottom: '1px solid rgba(255,255,255,0.2)',
            height: '50px'
        }
	},
	listItem: {
		display: 'flex',
		alignItems: 'center',
		padding: '15px',
		'&:hover': {
			background: 'rgba(255,255,255,0.1)',
        },
        [theme.breakpoints.down('xs')]: {
            padding: '15px 0',
            justifyContent: 'center'
        }
	},
	iconContainer: {
		width: 'fit-content',
		height: 'fit-content',
		display: 'grid',
		placeItems: 'center',
	},
	icon: {
		width: '25px',
		height: '25px',
	},
	textContainer: {
		color: 'white',
		fontSize: '16px',
	},
	active: {
		background: 'black',
        borderLeft: '3px solid #5B5BFB',
        [theme.breakpoints.down('xs')]: {
            borderLeft: 'unset',
            borderBottom: '3px solid #5B5BFB',
        }
	},
}));
