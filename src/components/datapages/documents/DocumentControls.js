import {
	IconButton,
	ListItemIcon,
	makeStyles,
	Menu,
	MenuItem,
} from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import CreateIcon from '@material-ui/icons/Create';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import GetAppIcon from '@material-ui/icons/GetApp';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../../context/LanguageContext';

export const DocumentControls = ({
	editDocument,
	downloadFile,
	deleteFile,
}) => {
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);
	const { t } = useTranslation();
	const [expanded, setExpanded] = useState(null);

	const handleExpanded = (event) => {
		if (expanded) {
			setExpanded(null);
		}
		setExpanded(event.currentTarget);
	};

	return (
		<div>
			<IconButton className={classes.expandIcon} onClick={handleExpanded}>
				<MoreVertIcon className={classes.icon} />
			</IconButton>
			<Menu
				onClick={() => setExpanded(null)}
				className={classes.container}
				anchorEl={expanded}
				open={Boolean(expanded)}
				onClose={() => setExpanded(null)}
				classes={{
					paper: classes.menu,
				}}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
			>
				<div
					style={{
						direction: lang.code === 'he' ? 'rtl' : 'ltr',
					}}
					className={classes.menuHeader}
				>
					{t('documentsModule.controls.documentMenu')}
					<IconButton
						style={{ display: 'flex', justifyContent: 'flex-end' }}
						onClick={() => setExpanded(null)}
						className={classes.close}
					>
						<CloseRoundedIcon className={classes.icon} />
					</IconButton>
				</div>
				<MenuItem
					style={{ direction: lang.code === 'he' ? 'rtl' : 'ltr' }}
					className={classes.iconBtn}
					onClick={editDocument}
				>
					<ListItemIcon>
						<CreateIcon className={classes.icon} />
					</ListItemIcon>
					{t('documentsModule.controls.editDetails')}
				</MenuItem>

				<MenuItem
					style={{ direction: lang.code === 'he' ? 'rtl' : 'ltr' }}
					className={classes.iconBtn}
					onClick={downloadFile}
				>
					<ListItemIcon>
						<GetAppIcon className={classes.icon} />
					</ListItemIcon>
					{t('documentsModule.controls.downloadFile')}
				</MenuItem>

				<MenuItem
					style={{ direction: lang.code === 'he' ? 'rtl' : 'ltr' }}
					className={classes.iconBtn}
					onClick={deleteFile}
				>
					<ListItemIcon>
						<DeleteOutlineRoundedIcon className={classes.icon} />
					</ListItemIcon>
					{t('documentsModule.controls.deleteFile')}
				</MenuItem>
			</Menu>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		display: 'flex',
	},
	expandIcon: {
		color: 'white',
		background: 'rgba(0,0,0,0.3)',
		'&:hover': {
			background: 'rgba(0,0,0,0.5)',
		},
	},
	iconBtn: {
		color: 'white',
		marginRight: '20px',
		borderRadius: '0 25px 25px 0',
		'&:hover': {
			transform: 'scale(1.077)',
		},
	},
	icon: {
		fontSize: '20px',
		color: 'white',
	},
	menu: {
		background: 'rgba(0,0,0,0.7)',
		backdropFilter: 'blur(10px)',
		color: 'white',
		boxShadow: 'rgba(0,0,0,0.4) 0 0 2px 1px',
		borderRadius: '10px',
	},
	menuitem: {
		minWidth: '200px',
	},
	menuHeader: {
		borderBottom: '1px solid rgba(255,255,255,0.2)',
		marginBottom: '10px',
		display: 'flex',
		justifyContent: 'space-between',
		padding: '5px 10px 5px 20px',
		alignItems: 'center',
		outline: 'none',
	},
	close: {
		padding: '6px',
		margin: 0,
	},
}));
