import {
	Badge,
	Grid,
	IconButton,
	makeStyles,
	useMediaQuery,
} from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import AppsOutlinedIcon from "@material-ui/icons/AppsOutlined";
import ForumOutlinedIcon from "@material-ui/icons/ForumOutlined";
import MapOutlinedIcon from "@material-ui/icons/MapOutlined";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import { differenceInHours } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { isResident } from "../../../api/userApi";
import { AuthContext } from "../../../context/AuthContext";
import { ConversationsContext } from "../../../context/ConversationsContext";
import { NotificationsContext } from "../../../context/NotificationsContext";
import { Can } from "../../reuseables/Can";

export const Navbar = ({
	toggleMenu,
	toggleAddMenu,
	toggleMapView,
	toggleNotifications,
	toggleCalenderView,
	toggleMessenger,
}) => {
	const classes = useStyles();
	const location = useLocation();
	const matches = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const { notifications } = useContext(NotificationsContext);
	const { conversations } = useContext(ConversationsContext);
	const { t } = useTranslation();
	const { auth } = useContext(AuthContext);
	const [notifCount, setNotifCount] = useState(0);
	const [convCount, setConvCount] = useState(0);
	const [mapActive, setMapActive] = useState(location.pathname.includes("map"));
	const [calenderActive, setCalenderActive] = useState(
		location.pathname.includes("calender")
	);

	useEffect(() => {
		setMapActive(location.pathname.includes("map"));
		setCalenderActive(location.pathname.includes("calender"));
	}, [location]);

	useEffect(() => {
		let count = notifications.filter(
			(n) => differenceInHours(new Date(), new Date(n.createdAt)) < 6 && !n.read
		).length;
		setNotifCount(count);
	}, [notifications]);

	useEffect(() => {
		if (conversations.length) {
			const r = conversations.reduce((totalMessages, c) => {
				if (c.messages.length) {
					let unreadCount = c.messages.filter(
						(m) => m.read === false && m.from !== auth.user._id
					).length;
					return totalMessages + unreadCount;
				}
				return totalMessages;
			}, 0);
			setConvCount(r);
			return;
		}
		setConvCount(0);
	}, [conversations]);

	return (
		<div className={classes.navbar}>
			<Grid
				container
				alignItems="center"
				justify="space-between"
				style={{ height: "64px" }}
			>
				{!matches && (
					<Grid item className={classes.menuGridItem}>
						<IconButton
							aria-label="menu"
							className={classes.iconButton}
							color="inherit"
							onClick={toggleMenu}
						>
							<AppsOutlinedIcon
								className={classes.iconRoot}
								style={{ width: "35px", height: "35px" }}
							/>
						</IconButton>

						<div className={classes.logobox}>Leev</div>
					</Grid>
				)}
				<div className={classes.navbarIconsContainer}>
					<div className={classes.navbarIcons}>
						{matches && (
							<IconButton
								aria-label="menu"
								className={classes.iconButton}
								color="inherit"
								onClick={toggleMenu}
								classes={{ label: classes.iconLabel }}
							>
								<AppsOutlinedIcon className={classes.iconRoot} />
								<div className={classes.bottomLabel}>{t("general.menu")}</div>
							</IconButton>
						)}
						<Badge
							badgeContent={convCount}
							color="secondary"
							classes={{
								badge: classes.badge,
							}}
						>
							<IconButton
								aria-label="messages"
								className={classes.iconButton}
								color={"inherit"}
								onClick={toggleMessenger}
								classes={{ label: classes.iconLabel }}
							>
								<ForumOutlinedIcon className={classes.iconRoot} />
								<div className={classes.bottomLabel}>
									{t("general.messages")}
								</div>
							</IconButton>
						</Badge>
						<Can shouldRender={!isResident(auth.user)}>
							<IconButton
								aria-label="Add"
								className={classes.iconButton}
								color={"inherit"}
								onClick={toggleAddMenu}
								classes={{ label: classes.iconLabel }}
							>
								<AddCircleOutlineOutlinedIcon className={classes.iconRoot} />
								<div className={classes.bottomLabel}>{t("general.create")}</div>
							</IconButton>
						</Can>
						<Can module="map" action="read" shouldRender={!isResident(auth.user)}>
							<IconButton
								aria-label="Map"
								className={classes.iconButton}
								color={"inherit"}
								onClick={toggleMapView}
								disabled={mapActive}
								classes={{ label: classes.iconLabel }}
							>
								<MapOutlinedIcon className={classes.iconRoot} />
								<div className={classes.bottomLabel}>{t("general.map")}</div>
							</IconButton>
						</Can>

						<IconButton
							aria-label="Notifications"
							className={classes.iconButton}
							color="inherit"
							onClick={toggleNotifications}
							classes={{ label: classes.iconLabel }}
						>
							<Badge
								badgeContent={notifCount}
								color="secondary"
								classes={{
									badge: classes.badge,
								}}
							>
								<NotificationsNoneIcon className={classes.iconRoot} />
							</Badge>
							<div className={classes.bottomLabel}>
								{t("general.notifications")}
							</div>
						</IconButton>
					</div>
				</div>
			</Grid>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	logobox: {
		fontSize: "30px",
		color: "white",
		fontFamily: "Kaushan",
		padding: "0 10px 5px",
	},
	navbar: {
		height: "64px",
		padding: "0 8px",
		background: "rgba(0,0,0,0.8)",
		backdropFilter: "blur(8px)",
		boxShadow: "rgba(0,0,0,0.4) 0px 0px 5px 2px",
		[theme.breakpoints.down("sm")]: {
			borderRadius: "0",
			background: "black",
		},
	},
	navbarIconsContainer: {
		[theme.breakpoints.down('sm')]: {
			width: '100%'
		}
	},
	menuGridItem: {
		display: "flex",
		alignItems: "center",
	},
	menuButton: {},
	navbarIcons: {
		display: "flex",
		justifyContent: "space-between",
		width: "auto",
		padding: "0 10px",
		[theme.breakpoints.down("md")]: {
			padding: "0 20px",
		},
		[theme.breakpoints.down("xs")]: {
			padding: "0 10px",
		},
	},
	drawer: {
		height: "calc(100vh - 128px)",
		width: "240px",
		flexShrink: 0,
		whiteSpace: "nowrap",
		marginTop: "128px",
		background: "transparent",
		[theme.breakpoints.down("md")]: {
			width: "60%",
		},
	},
	drawerOpen: {
		height: "calc(100vh - 128px)",
		width: "240px",
		[theme.breakpoints.down("md")]: {
			width: "60%",
		},

		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerClose: {
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: "hidden",
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up("sm")]: {
			width: theme.spacing(9) + 1,
		},
	},
	iconButton: {
		padding: "6px 20px",
	},
	icon: {
		fontSize: "28px",
		padding: "12px",
		borderRadius: "50px",
		[theme.breakpoints.up("md")]: {
			"&:hover": {
				background: "rgba(0,0,0,0.5)",
			},
		},
	},
	badge: {
		border: `1px solid black`,
		top: "6px",
		right: "6px",
	},
	imageIcon: {
		height: "36px",
		width: "36px",
	},
	iconRoot: {
		textAlign: "center",
		width: "30px",
		height: "30px",
		display: "grid",
		placeItems: "center",
		color: "#42A5F5",
		[theme.breakpoints.down("sm")]: {
			width: "25px",
			height: "25px",
		},
	},
	iconLabel: {
		flexDirection: "column",
	},
	bottomLabel: {
		color: "white",
		fontSize: "11px",
		padding: "5px 0 0",
	},
}));
