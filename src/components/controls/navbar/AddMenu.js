import React from 'react';
import {
	makeStyles,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Grow,
	ClickAwayListener,
	useMediaQuery,
} from '@material-ui/core';
import AddLocationOutlinedIcon from '@material-ui/icons/AddLocationOutlined';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import QueueIcon from '@material-ui/icons/Queue';
import PostAddIcon from '@material-ui/icons/PostAdd';
import NoteAddOutlinedIcon from '@material-ui/icons/NoteAddOutlined';
import BlurOnRoundedIcon from '@material-ui/icons/BlurOnRounded';
import { useTranslation } from 'react-i18next';

export const AddMenu = ({ toggleAddMenu, toggleAdd }) => {
	const classes = useStyles();
	const { t, i18n } = useTranslation();
	const matches = useMediaQuery((theme) => theme.breakpoints.up('sm'));

	const closeMenu = () => {
		if (matches) {
			toggleAddMenu();
		}
	};

	return (
		<ClickAwayListener onClickAway={closeMenu}>
			<Grow in={true}>
				<div className={classes.addMenuContainer}>
					<List className={classes.list}>
						<ListItem
							button={true}
							className={classes.listItem}
							onClick={toggleAdd('asset')}
						>
							<ListItemIcon className={classes.listItemIcon}>
								<AddLocationOutlinedIcon
									className={classes.icon}
								/>
							</ListItemIcon>
							<ListItemText
								primary={t('createMenu.addAsset')}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
						<ListItem
							button={true}
							className={classes.listItem}
							onClick={toggleAdd('system')}
						>
							<ListItemIcon className={classes.listItemIcon}>
								<BlurOnRoundedIcon className={classes.icon} />
							</ListItemIcon>
							<ListItemText
								primary={t('createMenu.addSystem')}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
						<ListItem button={true} className={classes.listItem}>
							<ListItemIcon className={classes.listItemIcon}>
								<GroupAddIcon />
							</ListItemIcon>
							<ListItemText
								primary={t('createMenu.createUser')}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
						<ListItem
							button={true}
							className={classes.listItem}
							onClick={toggleAdd('task')}
						>
							<ListItemIcon className={classes.listItemIcon}>
								<PostAddIcon />
							</ListItemIcon>
							<ListItemText
								primary={t('createMenu.createTask')}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
						<ListItem
							button={true}
							className={classes.listItem}
							onClick={toggleAdd('fault')}
						>
							<ListItemIcon className={classes.listItemIcon}>
								<QueueIcon />
							</ListItemIcon>
							<ListItemText
								primary={t('createMenu.createFault')}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
						<ListItem
							button={true}
							className={classes.listItem}
							onClick={toggleAdd('document')}
						>
							<ListItemIcon className={classes.listItemIcon}>
								<NoteAddOutlinedIcon />
							</ListItemIcon>
							<ListItemText
								primary={t('createMenu.addDocument')}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
					</List>
				</div>
			</Grow>
		</ClickAwayListener>
	);
};

const useStyles = makeStyles((theme) => ({
	addMenuContainer: {
		zIndex: 2,
		width: '240px',
		background: theme.palette.primary.main,
		border: '1px solid rgba(255,255,255,0.2)',
		backdropFilter: 'blur(10px)',
		boxShadow: 'rgba(0,0,0,0.25) 0px 0px 6px 3px',
		position: 'absolute',
		top: '80px',
		right: '2%',
		borderRadius: '10px',
		[theme.breakpoints.down('sm')]: {
			maxHeight: '70vh',
			overflow: 'scroll',
		},
	},
	list: {
		width: '90%',
		margin: '0px auto',
	},
	listItem: {
		color: 'theme.palette.primary.main',
		margin: '7px auto',
		borderRadius: '10px',
		border: '1px solid rgba(255,255,255,0.2)',
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
		fontSize: '14px',
		color: 'white',
	},
	bottomList: {
		padding: '10px 0',
	},
}));
