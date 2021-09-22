import {
	IconButton,
	makeStyles,
	Menu,
	MenuItem,
	ListItemIcon,
} from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import TransferWithinAStationRoundedIcon from "@material-ui/icons/TransferWithinAStationRounded";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../../context/LanguageContext";
import { Can } from "../../reuseables/Can";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import LinkIcon from "@material-ui/icons/Link";

export const FaultViewControls = ({
	fault,
	editFault,
	updateOwner,
	changeStatus,
	handleCreateLink,
}) => {
	const classes = useStyles();
	const { t, i18n } = useTranslation();
	const { lang } = useContext(LanguageContext);
	const [data, setData] = useState(fault);
	const [expanded, setExpanded] = useState(null);

	useEffect(() => {
		setData(fault);
	}, [fault]);

	const openInNewWindow = () => {
		window.open(
			`${process.env.REACT_APP_FRONTEND_URL}/workspace/faults/${fault.faultId}`
		);
	};

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
					{t("tasksModule.controls.taskMenu")}
					<IconButton
						style={{ display: "flex", justifyContent: "flex-end" }}
						onClick={() => setExpanded(null)}
						className={classes.close}
					>
						<CloseRoundedIcon className={classes.icon} />
					</IconButton>
				</div>
				<MenuItem
					style={{ direction: lang.code === "he" ? "rtl" : "ltr" }}
					className={classes.iconBtn}
					onClick={openInNewWindow}
				>
					<ListItemIcon>
						<OpenInNewIcon className={classes.icon} />
					</ListItemIcon>
					{t("general.openInNew")}
				</MenuItem>
				<Can
					module="faults"
					action="update"
					userList={[...data.relatedUsers.map((u) => u._id), data.owner._id]}
				>
					<MenuItem
						style={{
							direction: lang.code === "he" ? "rtl" : "ltr",
						}}
						className={classes.iconBtn}
						onClick={editFault}
					>
						<ListItemIcon>
							<CreateIcon className={classes.icon} />
						</ListItemIcon>
						{t("faultsModule.controls.editDetails")}
					</MenuItem>
				</Can>

				<Can
					module="faults"
					action="changeOwner"
					userList={[...data.relatedUsers.map((u) => u._id), data.owner._id]}
				>
					<MenuItem
						style={{
							direction: lang.code === "he" ? "rtl" : "ltr",
						}}
						className={classes.iconBtn}
						onClick={updateOwner}
					>
						<ListItemIcon>
							<TransferWithinAStationRoundedIcon className={classes.icon} />
						</ListItemIcon>
						{t("faultsModule.controls.changeOwner")}
					</MenuItem>
				</Can>
				<Can
					module="faults"
					action="changeStatus"
					userList={[...data.relatedUsers.map((u) => u._id), data.owner._id]}
				>
					<MenuItem
						style={{
							direction: lang.code === "he" ? "rtl" : "ltr",
						}}
						className={classes.iconBtn}
						onClick={changeStatus}
					>
						<ListItemIcon>
							<DoubleArrowIcon className={classes.icon} />
						</ListItemIcon>
						{t("faultsModule.controls.changeStatus")}
					</MenuItem>
				</Can>
				<MenuItem
					style={{
						direction: lang.code === "he" ? "rtl" : "ltr",
					}}
					className={classes.iconBtn}
					onClick={handleCreateLink}
				>
					<ListItemIcon>
						<LinkIcon className={classes.icon} />
					</ListItemIcon>
					{t("faultsModule.controls.createLink")}
				</MenuItem>
			</Menu>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
	},
	expandIcon: {
		color: "white",
		background: "rgba(0,0,0,0.6)",
		height: "35px",
		width: "35px",
		"&:hover": {
			background: "rgba(0,0,0,0.8)",
		},
	},
	iconBtn: {
		color: "white",
		marginRight: "20px",
		borderRadius: "0 25px 25px 0",
		"&:hover": {
			transform: "scale(1.077)",
		},
	},
	icon: {
		fontSize: "20px",
		color: "white",
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
