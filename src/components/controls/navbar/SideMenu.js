import {
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	makeStyles,
} from "@material-ui/core";
import AssessmentIcon from "@material-ui/icons/Assessment";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import DashboardRoundedIcon from "@material-ui/icons/DashboardRounded";
import DescriptionRoundedIcon from "@material-ui/icons/DescriptionRounded";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import SettingsRoundedIcon from "@material-ui/icons/SettingsRounded";
import SettingsSystemDaydreamIcon from "@material-ui/icons/SettingsSystemDaydream";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import clsx from "clsx";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { clearUserLS, isResident } from "../../../api/userApi";
import { AuthContext } from "../../../context/AuthContext";
import { LanguageContext } from "../../../context/LanguageContext";
import { Can } from "../../reuseables/Can";
import { UserItem } from "../../user/UserItem";

export const SideMenu = ({ toggleMenu, toggleSettings, menuOpen }) => {
	const classes = useStyles();
	const history = useHistory();
	const { t, i18n } = useTranslation();
	const { lang } = useContext(LanguageContext);
	const { auth } = useContext(AuthContext);

	const handleClick = (type) => (event) => {
		if (menuOpen) {
			toggleMenu();
		}
		history.push(`/workspace/${type}`);
	};

	const userLogout = async () => {
		await clearUserLS();
		history.push("/login");
	};

	return (
		<Drawer
			variant="permanent"
			className={clsx(classes.drawer, {
				[classes.drawerOpen]: menuOpen,
				[classes.drawerClose]: !menuOpen,
			})}
			classes={{
				paper: clsx(classes.paperAnchorDockedRight, {
					[classes.drawerOpen]: menuOpen,
					[classes.drawerClose]: !menuOpen,
				}),
			}}
			open={menuOpen}
			direction={lang.code == "he" ? "left" : "right"}
			onClick={null}
		>
			<div className={classes.sidemenuContainer}>
				{menuOpen && (
					<div className={classes.closeBtn}>
						<IconButton onClick={toggleMenu}>
							<ClearRoundedIcon className={classes.icon} />
						</IconButton>
					</div>
				)}
				<div className={classes.userContainer}>
					<UserItem
						showName
						showTitle
						avatarSize={menuOpen ? 60 : 48}
						user={auth.user}
					/>
				</div>
				<List className={classes.list}>
					<Can shouldRender={!auth.user.isAdmin && !isResident(auth.user)}>
						<ListItem
							button={true}
							className={clsx(classes.listItem, classes.dashbordButton)}
							onClick={handleClick("dashboard")}
						>
							<ListItemIcon className={classes.listItemIcon}>
								<DashboardRoundedIcon classes={{ root: classes.iconRoot }} />
							</ListItemIcon>
							<ListItemText
								primary={t("sideMenu.dashboard")}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
					</Can>
					<Can shouldRender={auth.user.isAdmin}>
						<ListItem
							button={true}
							className={classes.listItem}
							onClick={handleClick("clients")}
						>
							<ListItemIcon className={classes.listItemIcon}>
								<SupervisedUserCircleIcon
									classes={{ root: classes.iconRoot }}
								/>
							</ListItemIcon>
							<ListItemText
								primary={t("sideMenu.clients")}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
					</Can>
					<Can
						module="assets"
						action="read"
						shouldRender={!isResident(auth.user)}
					>
						<ListItem
							button={true}
							className={classes.listItem}
							onClick={handleClick("assets")}
						>
							<ListItemIcon className={classes.listItemIcon}>
								<HomeWorkIcon classes={{ root: classes.iconRoot }} />
							</ListItemIcon>
							<ListItemText
								primary={t("sideMenu.assets")}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
					</Can>
					<Can
						module="systems"
						action="read"
						shouldRender={!isResident(auth.user)}
					>
						<ListItem
							button={true}
							className={classes.listItem}
							onClick={handleClick("systems")}
						>
							<ListItemIcon className={classes.listItemIcon}>
								<SettingsSystemDaydreamIcon
									classes={{ root: classes.iconRoot }}
								/>
							</ListItemIcon>
							<ListItemText
								primary={t("sideMenu.systems")}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
					</Can>
					<Can
						module="tasks"
						action="read"
						shouldRender={!isResident(auth.user)}
					>
						<ListItem
							button={true}
							className={classes.listItem}
							onClick={handleClick("tasks")}
						>
							<ListItemIcon className={classes.listItemIcon}>
								<AssignmentTurnedInIcon classes={{ root: classes.iconRoot }} />
							</ListItemIcon>
							<ListItemText
								primary={t("sideMenu.tasks")}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
					</Can>
					<Can module="tasks" action="faults">
						<ListItem
							button={true}
							className={classes.listItem}
							onClick={handleClick("faults")}
						>
							<ListItemIcon className={classes.listItemIcon}>
								<WarningRoundedIcon classes={{ root: classes.iconRoot }} />
							</ListItemIcon>
							<ListItemText
								primary={t("sideMenu.faults")}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
					</Can>
					<Can
						module="documents"
						action="read"
						shouldRender={!isResident(auth.user)}
					>
						<ListItem
							button={true}
							className={classes.listItem}
							onClick={handleClick("documents")}
						>
							<ListItemIcon className={classes.listItemIcon}>
								<DescriptionRoundedIcon classes={{ root: classes.iconRoot }} />
							</ListItemIcon>
							<ListItemText
								primary={t("sideMenu.documents")}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
					</Can>
					<Can module="reports" action="create">
						<ListItem
							button={true}
							className={classes.listItem}
							onClick={handleClick("reports")}
						>
							<ListItemIcon className={classes.listItemIcon}>
								<AssessmentIcon classes={{ root: classes.iconRoot }} />
							</ListItemIcon>
							<ListItemText
								primary={t("sideMenu.reports")}
								className={classes.listItemText}
								disableTypography={true}
							/>
						</ListItem>
					</Can>
				</List>
				<List className={classes.bottomList}>
					<ListItem button={true} onClick={toggleSettings}>
						<ListItemIcon className={classes.listItemIcon}>
							<SettingsRoundedIcon classes={{ root: classes.iconRoot }} />
						</ListItemIcon>
						<ListItemText
							primary={t("sideMenu.settings")}
							className={classes.listItemText}
							disableTypography={true}
						/>
					</ListItem>
					<ListItem button={true} onClick={userLogout}>
						<ListItemIcon className={classes.listItemIcon}>
							<ExitToAppRoundedIcon classes={{ root: classes.iconRoot }} />
						</ListItemIcon>
						<ListItemText
							primary={t("sideMenu.logout")}
							className={classes.listItemText}
							disableTypography={true}
						/>
					</ListItem>
				</List>
			</div>
		</Drawer>
	);
};

const useStyles = makeStyles((theme) => ({
	userContainer: {
		width: "auto",
		margin: "10px auto",
		paddingLeft: "5px",
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		height: "80px",
	},
	drawer: {
		zIndex: 2,
		width: "300px",
		boxShadow: "rgba(0,0,0,0.25) 0px 0px 6px 3px",
		position: "absolute",
		top: "64px",
		left: "0px",
		height: "calc(100% - 64px)",
		overflowY: "overlay",
	},
	list: {
		width: "100%",
		borderTop: "1px solid rgba(255,255,255,0.3)",
		borderBottom: "1px solid rgba(255,255,255,0.3)",
		margin: "0px",
		padding: "10px 0",
		width: "300px",
		[theme.breakpoints.down("sm")]: {
			width: "100%",
		},
	},
	listItem: {
		color: theme.palette.primary.main,
		margin: "0px",
		borderRadius: "5px",
		transition: "background box-shadow 0.3s ease-in-out",

		"&:hover": {
			background: "rgba(0,0,0,0.6)",
			transition: "background box-shadow 0.2s ease-in-out",
			boxShadow: "0 8px 32px 0 rgb(0 0 0 / 80%)",
		},
	},
	listItemIcon: {
		color: "white",
	},
	listItemText: {
		fontSize: "16px",
		color: "white",
	},
	bottomList: {
		padding: "10px 0",
		height: "auto",
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-end",
	},
	iconRoot: {
		textAlign: "center",
		width: "25px",
		height: "25px",
		display: "grid",
		placeItems: "center",
		color: "#42A5F5",
	},
	closeBtn: {
		position: "absolute",
		right: 0,
		padding: "10px",
	},
	icon: {
		color: "white",
	},
	paperAnchorDockedRight: {
		border: "none",
	},
	drawerOpen: {
		background: "transparent",

		width: "300px",
		background: "rgba(0,0,0,0.3)",
		backdropFilter: "blur(22px)",
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		[theme.breakpoints.down("sm")]: {
			height: "100%",
			overflow: "scroll",
			width: "100vw",
			left: 0,
			border: "none",
			borderRadius: 0,
			paddingBottom: "74px",
			top: 0,
			background: "rgba(0,0,0,0.5)",
			backdropFilter: "blur(15px)",
		},
	},
	drawerClose: {
		background: "transparent",
		background: "rgba(0,0,0,0.3)",
		backdropFilter: "blur(22px)",
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: "hidden",
		width: "60px",
		[theme.breakpoints.down("sm")]: {
			display: "none",
		},
	},
	"@global": {
		"*::-webkit-scrollbar": {
			width: "0em",
			height: "0em",
		},
	},
}));
