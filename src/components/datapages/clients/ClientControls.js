import {
	IconButton,
	makeStyles,
	Menu,
	MenuItem,
	ListItemIcon,
} from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../../context/LanguageContext";
import { SnackbarContext } from "../../../context/SnackbarContext";
import { Can } from "../../reuseables/Can";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { deleteTenant } from "../../../api/adminApi";
import { AlertDialog } from "../../reuseables/AlertDialog";
import { getSuccessMessage } from "../../../api/genericApi";
import { UpsertClient } from './UpsertClient'

export const ClientControls = ({
    data
}) => {
	const classes = useStyles();
	const { t, i18n } = useTranslation();
	const { lang } = useContext(LanguageContext);
    const { setSnackbar } = useContext(SnackbarContext)
	const [expanded, setExpanded] = useState(null);
    const [ alertDialog, setAlertDialog ] = useState(null);
    const [ editDetails, setEditDetails ] = useState(false);

	const handleExpanded = (event) => {
		if (expanded) {
			setExpanded(null);
		}
		setExpanded(event.currentTarget);
	};

    const deleteClient = () => {
		setAlertDialog({
			handleConfirm: async () => {
				const res = await deleteTenant(data._id);
				if (res) {
					setAlertDialog(null);
                    setSnackbar(getSuccessMessage('client', data.name, 'delete'))
				}
			},
			handleCancel: () => setAlertDialog(null),
			text: `${t("clientsModule.deleteConfirmation")} ${data.name}?`,
			title: `${t("clientsModule.deleteClient")}`,
		});
	};

    const editClient = () => {
        setEditDetails(data._id);
    }

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
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
			>
				<div
					style={{
						direction: lang.code === "he" ? "rtl" : "ltr",
					}}
					className={classes.menuHeader}
				>
					{t("clientsModule.clientMenu")}
					<IconButton
						style={{ display: "flex", justifyContent: "flex-end" }}
						onClick={() => setExpanded(null)}
						className={classes.close}
					>
						<CloseRoundedIcon className={classes.icon} />
					</IconButton>
				</div>
				<MenuItem
					style={{
						direction: lang.code === "he" ? "rtl" : "ltr",
					}}
					className={classes.iconBtn}
					onClick={editClient}
				>
					<ListItemIcon>
						<EditIcon className={classes.icon} />
					</ListItemIcon>
					{t("clientsModule.upsert.editClientDetails")}
				</MenuItem>
				<MenuItem
					style={{
						direction: lang.code === "he" ? "rtl" : "ltr",
					}}
					className={classes.iconBtn}
					onClick={deleteClient}
				>
					<ListItemIcon>
						<DeleteIcon className={classes.icon} />
					</ListItemIcon>
					{t("clientsModule.delete")}
				</MenuItem>
			</Menu>
            {
                Boolean(alertDialog) && 
                <AlertDialog alertDialog={alertDialog} />
            }
            {
                Boolean(editDetails) &&
                <UpsertClient tenantId={data._id} handleClose={() => setEditDetails(null)}/>
            }
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
	},
	expandIcon: {
		color: "white",
		background: "rgba(0,0,0,0.3)",
        padding: '6px',
		"&:hover": {
			background: "rgba(0,0,0,0.5)",
		},
	},
	iconBtn: {
		color: "white",
		marginRight: "20px",
		borderRadius: "0 25px 25px 0",
        padding: '6px',
		"&:hover": {
			transform: "scale(1.077)",
		},
	},
	icon: {
		fontSize: "16px",
		color: "white",
        margin: 'auto'
	},
	menu: {
		background: "rgba(0,0,0,0.7)",
		backdropFilter: "blur(10px)",
		color: "white",
		boxShadow: "rgba(0,0,0,0.4) 0 0 2px 1px",
		borderRadius: "10px",
	},
	menuitem: {
		minWidth: "200px",
	},
	menuHeader: {
		borderBottom: "1px solid rgba(255,255,255,0.2)",
		marginBottom: "10px",
		display: "flex",
		justifyContent: "space-between",
		padding: "5px 10px 5px 20px",
		alignItems: "center",
		outline: "none",
	},
	close: {
		padding: "6px",
		margin: 0,
	},
}));
