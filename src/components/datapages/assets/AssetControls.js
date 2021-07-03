import {
	IconButton, ListItemIcon, makeStyles, Menu, MenuItem
} from '@material-ui/core';
import AssignmentRoundedIcon from "@material-ui/icons/AssignmentRounded";
import BlurOnRoundedIcon from "@material-ui/icons/BlurOnRounded";
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import DescriptionRoundedIcon from "@material-ui/icons/DescriptionRounded";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import PeopleOutlineRoundedIcon from "@material-ui/icons/PeopleOutlineRounded";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { LanguageContext } from '../../../context/LanguageContext';
import EditRoundedIcon from '@material-ui/icons/EditRounded';

export const AssetControls = ({ data, toggleEditMode }) => {
	const classes = useStyles();
	const history = useHistory();
	const { lang } = useContext(LanguageContext);
	const { t, i18n } = useTranslation();
	const [expanded, setExpanded] = useState(null);


	const openInNewWindow = () => {
		window.open(`${process.env.REACT_APP_FRONTEND_URL}/workspace/assets/${data._id}`);
	};

	const handleExpanded = (event) => {
		if (expanded) {
			setExpanded(null);
		}
		setExpanded(event.currentTarget);
	};

	const handleReferralClick = (type) => (event) => {
		event.stopPropagation();
		if (type === 'residents') {
			history.push(`assets/${data._id}?tab=residents`);
			return;
		}
		history.push(`/workspace/${type}?asset=${data._id}`);
	};

	return (
		<div>
			{
				toggleEditMode && 
				<IconButton className={classes.expandIcon} onClick={toggleEditMode('address')}>
					<EditRoundedIcon className={classes.icon} />
				</IconButton>
			}
			
			<IconButton className={classes.expandIcon} onClick={openInNewWindow}>
				<OpenInNewIcon className={classes.icon} />
			</IconButton>
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
					{t('assetsModule.assetsMenu')}
					<ListItemIcon
						style={{ display: 'flex', justifyContent: 'flex-end' }}
						onClick={() => setExpanded(null)}
						className={classes.close}
					>
						<CloseRoundedIcon className={classes.icon} />
					</ListItemIcon>
				</div>
				<MenuItem
					style={{ direction: lang.code === 'he' ? 'rtl' : 'ltr' }}
					className={classes.menuitem}
					onClick={handleReferralClick('systems')}
				>
					<ListItemIcon
						className={classes.icon}
					>
						<BlurOnRoundedIcon className={classes.typeIcon} />
					</ListItemIcon>
					{t('assetsModule.systems')}
				</MenuItem>
				<MenuItem
					style={{ direction: lang.code === 'he' ? 'rtl' : 'ltr' }}
					className={classes.menuitem}
					onClick={handleReferralClick("tasks")}
				>
					<ListItemIcon
						className={classes.icon}
						
					>
						<AssignmentRoundedIcon className={classes.typeIcon} />
					</ListItemIcon>
					{t('assetsModule.tasks')}
				</MenuItem>
				<MenuItem
					style={{ direction: lang.code === 'he' ? 'rtl' : 'ltr' }}
					className={classes.menuitem}
					onClick={handleReferralClick("faults")}
				>
					<ListItemIcon
						className={classes.icon}
						
					>
						<WarningRoundedIcon className={classes.typeIcon} />
					</ListItemIcon>
					{t('assetsModule.faults')}
				</MenuItem>
				<MenuItem
					style={{ direction: lang.code === 'he' ? 'rtl' : 'ltr' }}
					className={classes.menuitem}
					onClick={handleReferralClick("faults")}
				>
					<ListItemIcon
						className={classes.icon}
						
					>
						<DescriptionRoundedIcon className={classes.typeIcon} />
					</ListItemIcon>
					{t('assetsModule.documents')}
				</MenuItem>
				<MenuItem
					style={{ direction: lang.code === 'he' ? 'rtl' : 'ltr' }}
					className={classes.menuitem}
					onClick={handleReferralClick("residents")}
				>
					<ListItemIcon className={classes.icon}>
						<PeopleOutlineRoundedIcon className={classes.typeIcon} />
					</ListItemIcon>
					{t('assetsModule.residents')}
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
		margin: '0 5px',
		'&:hover': {
			background: 'rgba(0,0,0,0.5)',
		},
	},
	iconBtn: {
		color: 'white',
		marginRight: '20px',
		borderRadius: '0 25px 25px 0',
		fontSize: '14px',
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
		minWidth: '150px',
		color: 'white',
		marginRight: '20px',
		borderRadius: '0 25px 25px 0',
		fontSize: '14px',
		'&:hover': {
			transform: 'scale(1.077)',
		},
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
	typeIcon: {
		fontSize: '18px'
	}
}));
