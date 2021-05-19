import {
	ClickAwayListener,
	Icon, IconButton, List,
	ListItem,
	ListItemIcon,
	ListItemText, makeStyles,
	Slide, useMediaQuery
} from '@material-ui/core';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { clearUserLS } from '../../../api/userApi';
import { AuthContext } from '../../../context/AuthContext';
import { LanguageContext } from '../../../context/LanguageContext';
import { NotificationsContext } from '../../../context/NotificationsContext';
import { UserItem } from '../../user/UserItem';

export const SideMenu = ({ toggleMenu, toggleSettings, menuOpen }) => {
	const classes = useStyles();
	const history = useHistory();
	const { t, i18n } = useTranslation();
	const { lang } = useContext(LanguageContext);
	const matches = useMediaQuery((theme) => theme.breakpoints.up('sm'));
	const { auth } = useContext(AuthContext);
	const { setNotfications } = useContext(NotificationsContext);

	const handleClick = (type) => (event) => {
		toggleMenu();
		history.push(`/workspace/${type}`);
	};

	const userLogout = async () => {
		await clearUserLS();
		history.push('/login');
	};

	return (
		<ClickAwayListener onClickAway={toggleMenu}>
			<Slide in={menuOpen} direction={lang.code == 'he' ? 'left' : 'right'}>
				<div className={classes.sidemenuContainer}>
					<div className={classes.closeBtn}>
						<IconButton onClick={toggleMenu}>
							<ClearRoundedIcon className={classes.icon} />
						</IconButton>
					</div>	
					<div className={classes.userContainer}>
						<UserItem showTitle showName user={auth.user} />
					</div>
					<List className={classes.list}>
						<ListItem button={true} className={classes.listItem} onClick={handleClick('assets')}>
							<ListItemIcon className={classes.listItemIcon}>
                                <Icon classes={{root: classes.iconRoot}}>
								<img src="https://img.icons8.com/ios-filled/25/4a90e2/warehouse.png"/>
								</Icon>	
								{/* <BusinessRoundedIcon fontSize={'medium'} className={classes.icon} /> */}
							</ListItemIcon>
							<ListItemText
								primary={t('sideMenu.assets')}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
						<ListItem button={true} className={classes.listItem} onClick={handleClick('systems')}>
							<ListItemIcon className={classes.listItemIcon}>
                            <Icon classes={{root: classes.iconRoot}}>
                            <img src="https://img.icons8.com/ios-filled/25/4a90e2/system-task.png"/>
								</Icon>	
                           
								{/* <BlurOnRoundedIcon fontSize={'medium'} className={classes.icon} /> */}
							</ListItemIcon>
							<ListItemText
								primary={t('sideMenu.systems')}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
						<ListItem button={true} className={classes.listItem} onClick={handleClick('tasks')}>
							<ListItemIcon className={classes.listItemIcon}>
                            <Icon classes={{root: classes.iconRoot}}>
                            <img src="https://img.icons8.com/ios-filled/25/4a90e2/task-completed.png"/>
								</Icon>
								{/* <AssignmentRoundedIcon fontSize={'medium'} /> */}
							</ListItemIcon>
							<ListItemText
								primary={t('sideMenu.myTasks')}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
						<ListItem button={true} className={classes.listItem} onClick={handleClick('repeatableTasks')}>
							<ListItemIcon className={classes.listItemIcon}>
                            <Icon classes={{root: classes.iconRoot}}>
                            <img src="https://img.icons8.com/ios-filled/25/4a90e2/delivery-time.png"/>
								</Icon>
								{/* <AssignmentRoundedIcon fontSize={'medium'} /> */}
							</ListItemIcon>
							<ListItemText
								primary={t('sideMenu.repeatableTasks')}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
						<ListItem button={true} className={classes.listItem} onClick={handleClick('faults')}>
							<ListItemIcon className={classes.listItemIcon}>
                            	<Icon classes={{root: classes.iconRoot}}>
                            		<img src="https://img.icons8.com/pastel-glyph/23/4a90e2/error--v2.png"/>
								</Icon>
                                {/* <WarningRoundedIcon fontSize={'medium'} /> */}
							</ListItemIcon>
							<ListItemText
								primary={t('sideMenu.faults')}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
						<ListItem button={true} className={classes.listItem} onClick={handleClick('documents')}>
							<ListItemIcon className={classes.listItemIcon}>
                            	<Icon classes={{root: classes.iconRoot}}>
                            		<img src="https://img.icons8.com/pastel-glyph/25/4a90e2/regular-document--v2.png"/>
								</Icon>
								{/* <DescriptionRoundedIcon fontSize={'medium'} /> */}
							</ListItemIcon>
							<ListItemText
								primary={t('sideMenu.documents')}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
					</List>
					<List className={classes.bottomList}>
						<ListItem button={true} onClick={toggleSettings}>
							<ListItemIcon className={classes.listItemIcon}>
                            <Icon classes={{root: classes.iconRoot}}>
                            <img src="https://img.icons8.com/ios-filled/25/4a90e2/settings.png"/>
								</Icon>
                            
								{/* <SettingsIcon fontSize={'medium'} /> */}
							</ListItemIcon>
							<ListItemText
								primary={t('sideMenu.settings')}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
						<ListItem button={true} onClick={userLogout}>
							<ListItemIcon className={classes.listItemIcon}>
                            <Icon classes={{root: classes.iconRoot}}>
                            <img src="https://img.icons8.com/ios-filled/25/4a90e2/emergency-exit.png"/>
								</Icon>
								{/* <ExitToAppRoundedIcon fontSize={'medium'} /> */}
							</ListItemIcon>
							<ListItemText
								primary={t('sideMenu.logout')}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
					</List>
				</div>
			</Slide>
		</ClickAwayListener>
	);
};

const useStyles = makeStyles((theme) => ({
	userContainer: {
		width: 'fit-content',
		padding: '10px 20px',
		margin: '40px 0 10px'
	},
	sidemenuContainer: {
		zIndex: 2,
		width: '300px',
		background: 'rgba(0,0,0,0.4)',
		backdropFilter: 'blur(22px)',
		boxShadow: 'rgba(0,0,0,0.25) 0px 0px 6px 3px',
		position: 'absolute',
		top: '64px',
		left: '0px',
		height: 'calc(100% - 64px)',
		overflowY: 'overlay',
		[theme.breakpoints.down('sm')]: {
			height: 'calc(100% - 64px)',
			overflow: 'scroll',
			width: '100vw',
			left: 0,
			border: 'none',
			borderRadius: 0,
			top: '64px',
			background: 'rgba(0,0,0,0.5)',
			backdropFilter: 'blur(15px)',
		},
	},
	list: {
		width: '100%',
		borderTop: '1px solid rgba(255,255,255,0.3)',
		borderBottom: '1px solid rgba(255,255,255,0.3)',
		margin: '0px auto',
		padding: '10px 0',
	},
	listItem: {
		color: 'theme.palette.primary.main',
		margin: '0px auto',
		borderRadius: '5px',
		transition: 'background box-shadow 0.3s ease-in-out',
		'&:hover': {
			background: 'rgba(0,0,0,0.6)',
			transition: 'background box-shadow 0.2s ease-in-out',
			boxShadow: '0 8px 32px 0 rgb(0 0 0 / 80%)',
		},
	},
	listItemIcon: {
		color: 'white',
	},
	listItemText: {
		fontSize: '16px',
		color: 'white',
	},
	bottomList: {
		padding: '10px 0',
    },
    iconRoot: {
		textAlign: 'center',
		width: '50px',
		height: '35px',
		display: 'grid',
		placeItems: 'center'
	},
	closeBtn: {
		position: 'absolute',
		right: 0,
		padding: '10px'
	},
	icon: {
		color: 'white',
	},
}));
