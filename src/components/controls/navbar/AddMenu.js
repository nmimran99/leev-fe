import React, { useContext } from 'react';
import {
	makeStyles,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Grow,
	ClickAwayListener,
	useMediaQuery,
	Icon,
	Slide,
	IconButton,
} from '@material-ui/core';
import AddLocationOutlinedIcon from '@material-ui/icons/AddLocationOutlined';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import QueueIcon from '@material-ui/icons/Queue';
import PostAddIcon from '@material-ui/icons/PostAdd';
import NoteAddOutlinedIcon from '@material-ui/icons/NoteAddOutlined';
import BlurOnRoundedIcon from '@material-ui/icons/BlurOnRounded';
import { useTranslation } from 'react-i18next';
import { Can } from '../../reuseables/Can';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import { LanguageContext } from '../../../context/LanguageContext';

export const AddMenu = ({ toggleAddMenu, toggleAdd, addMenuOpen }) => {
	const classes = useStyles();
	const { t, i18n } = useTranslation();
	const { lang } = useContext(LanguageContext);
	const matches = useMediaQuery((theme) => theme.breakpoints.up('sm'));



	return (
		<ClickAwayListener onClickAway={toggleAddMenu}>
			<Slide in={addMenuOpen} direction={lang.code == 'he' ? 'right' : 'left'}>
				<div className={classes.addMenuContainer}>
					<div className={classes.header}>
						<div>{t('createMenu.header')}</div>
						<IconButton onClick={toggleAddMenu}>
							<ClearRoundedIcon className={classes.icon} />
						</IconButton>
					</div>
					<List className={classes.list}>
						<Can module='assets' action='create'>
							<ListItem
								button={true}
								className={classes.listItem}
								onClick={toggleAdd('asset')}
							>
								<ListItemIcon className={classes.listItemIcon}>
									{/* <AddLocationOutlinedIcon
										className={classes.icon}
									/> */}
									<Icon classes={{root: classes.iconRoot}}>
									<img src="https://img.icons8.com/ios-filled/25/4a90e2/warehouse.png"/>
									</Icon>
								</ListItemIcon>
								<ListItemText
									primary={t('createMenu.addAsset')}
									className={classes.listItemText}
									disableTypography={true}
								/>
							</ListItem>
						</Can>
						<Can module='systems' action='create'>
							<ListItem
								button={true}
								className={classes.listItem}
								onClick={toggleAdd('system')}
							>
								<ListItemIcon className={classes.listItemIcon}>
									<Icon classes={{root: classes.iconRoot}}>
										<img src="https://img.icons8.com/ios-filled/25/4a90e2/system-task.png"/>
									</Icon>
								</ListItemIcon>
								<ListItemText
									primary={t('createMenu.addSystem')}
									className={classes.listItemText}
									disableTypography={true}
								/>
							</ListItem>
						</Can>
						<Can module='locations' action='create'>
							<ListItem
								button={true}
								className={classes.listItem}
								onClick={toggleAdd('location')}
							>
								<ListItemIcon className={classes.listItemIcon}>
									<Icon classes={{root: classes.iconRoot}}>
										<img src="https://img.icons8.com/ios-filled/25/4a90e2/google-maps-new.png"/>
									</Icon>
								</ListItemIcon>
								<ListItemText
									primary={t('createMenu.addLocation')}
									className={classes.listItemText}
									disableTypography={true}
								/>
							</ListItem>
						</Can>
						<Can module="tasks" action="create">
							<ListItem
								button={true}
								className={classes.listItem}
								onClick={toggleAdd('task')}
							>
								<ListItemIcon className={classes.listItemIcon}>
									<Icon classes={{root: classes.iconRoot}}>
										<img src="https://img.icons8.com/ios-filled/25/4a90e2/task-completed.png"/>
									</Icon>
								</ListItemIcon>
								<ListItemText
									primary={t('createMenu.createTask')}
									className={classes.listItemText}
									disableTypography={true}
								/>
							</ListItem>
						</Can>

						<Can module="faults" action="create">
							<ListItem
								button={true}
								className={classes.listItem}
								onClick={toggleAdd('fault')}
							>
								<ListItemIcon className={classes.listItemIcon}>
									<Icon classes={{root: classes.iconRoot}}>
										<img src="https://img.icons8.com/pastel-glyph/23/4a90e2/error--v2.png"/>
									</Icon>
								</ListItemIcon>
								<ListItemText
									primary={t('createMenu.createFault')}
									className={classes.listItemText}
									disableTypography={true}
								/>
							</ListItem>
						</Can>
						<Can module='documents' action='create'>
							<ListItem
								button={true}
								className={classes.listItem}
								onClick={toggleAdd('document')}
							>
								<ListItemIcon className={classes.listItemIcon}>
								<Icon classes={{root: classes.iconRoot}}>
										<img src="https://img.icons8.com/pastel-glyph/25/4a90e2/regular-document--v2.png"/>
									</Icon>
								</ListItemIcon>
								<ListItemText
									primary={t('createMenu.addDocument')}
									className={classes.listItemText}
									disableTypography={true}
								/>
							</ListItem>
						</Can>					
					</List>
				</div>
			</Slide>
		</ClickAwayListener>
	);
};

const useStyles = makeStyles((theme) => ({
	addMenuContainer: {
		zIndex: 2,
		width: '280px',
		background: theme.palette.primary.main,
		backdropFilter: 'blur(10px)',
		boxShadow: 'rgba(0,0,0,0.25) 0px 0px 6px 3px',
		position: 'absolute',
		top: '64px',
		right: '0',
		height: '100vh',
		[theme.breakpoints.down('sm')]: {
			height: '100%',
			top: '64px',
			right: 0,
			width: '100vw',
			borderRadius: 0,
			border: 'none',
			padding: 0,
			background: 'rgba(0,0,0,0.5)',
			backdropFilter: 'blur(15px)',
		},
	},
	list: {
		width: '100%',
		padding: '10px 0',
	},
	listItem: {
		color: 'theme.palette.primary.main',
		padding: '10px 20px',
		transition: 'background box-shadow 0.3s ease-in-out',
		'&:hover': {
			background: 'rgba(0,0,0,0.6)',
			transition: 'background box-shadow 0.2s ease-in-out',
			boxShadow: '0 8px 32px 0 rgb(0 0 0 / 80%)'
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
	header: {
		height: '40px',
		color: 'white',
		display: 'flex',
		fontSize: '18px',
		alignItems: 'center',
		borderBottom: '1px solid rgba(255,255,255,0.2)',
		padding: '10px 20px',
		justifyContent: 'space-between',
		borderRadius: '10px 10px 0 0',
	},
	icon: {
		color: 'white',
	},
}));
