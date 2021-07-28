import { Grid, makeStyles, Portal, Snackbar } from "@material-ui/core";
import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";
import { FaultsContextProvider } from "../../context/FaultsContext";
import { Controls } from "../controls/Controls";
import { Assets } from "../datapages/assets/Assets";
import { Documents } from "../datapages/documents/Documents";
import { Faults } from "../datapages/faults/Faults";
import { Systems } from "../datapages/systems/Systems";
import { Tasks } from "../datapages/tasks/Tasks";
import { NotificationsContextProvider } from "../../context/NotificationsContext";
import { SocketContextProvider } from "../../context/SocketContext";
import { MapView } from "../datapages/map/MapView";
import { SnackbarContext } from "../../context/SnackbarContext";
import { useTranslation } from "react-i18next";
import MuiAlert from "@material-ui/lab/Alert";
import { Settings } from "../controls/settings/Settings";
import { RepeatableTasks } from "../datapages/tasks/RepeatableTasks";
import { Calender } from "../datapages/calender/Calender";
import Alert from "@material-ui/lab/Alert";
import { Dashboard } from "../datapages/dashboard/Dashboard";
import { Clients } from "../datapages/clients/Clients";
import { AuthContext } from "../../context/AuthContext";
import { ConversationsContextProvider } from "../../context/ConversationsContext";
import { UpsertContextProvider } from "../../context/UpsertContext";

export const Workspace = ({}) => {
	const classes = useStyles();
	const { auth } = useContext(AuthContext);
	const { snackbar, setSnackbar } = useContext(SnackbarContext);
	const { t } = useTranslation();

	return (
		<React.Fragment>
			<UpsertContextProvider>
			<FaultsContextProvider>
				<div container className={classes.mainContainer}>
					<SocketContextProvider id={auth.user._id}>
						<ConversationsContextProvider>
							<NotificationsContextProvider>
								<Controls />
							</NotificationsContextProvider>
						</ConversationsContextProvider>
					</SocketContextProvider>
					<div className={classes.mainData}>
						<Switch>
							<Route path={"/workspace/clients"}>
								<Clients />
							</Route>
							<Route path={"/workspace/assets"}>
								<Assets />
							</Route>
							<Route path={"/workspace/systems"}>
								<Systems />
							</Route>
							<Route path={"/workspace/faults"}>
								<Faults />
							</Route>
							<Route path={"/workspace/tasks"}>
								<Tasks />
							</Route>
							<Route path={"/workspace/repeatableTasks"}>
								<RepeatableTasks />
							</Route>
							<Route path={"/workspace/documents"}>
								<Documents />
							</Route>
							<Route path={"/workspace/map"}>
								<MapView />
							</Route>
							<Route path={"/workspace/calender"}>
								<Calender />
							</Route>
							<Route path={"/workspace/dashboard"}>
								<Dashboard />
							</Route>
						</Switch>
					</div>
				</div>
				{Boolean(snackbar) && (
					<Portal>
						<Snackbar
							open={Boolean(snackbar)}
							autoHideDuration={6000}
							onClose={() => setSnackbar(null)}
						>
							<Alert
								onClose={() => setSnackbar(null)}
								severity={snackbar.severity}
								elevation={9}
								variant={"filled"}
								classes={{
									message: classes.message,
								}}
							>
								{snackbar.text}
							</Alert>
						</Snackbar>
					</Portal>
				)}
			</FaultsContextProvider>
			</UpsertContextProvider>
		</React.Fragment>
	);
};

const useStyles = makeStyles((theme) => ({
	mainContainer: {
		height: "100%",
		background: `url(https://leevstore.blob.core.windows.net/images/grey.jpg)`,
		zIndex: 2,
		backgroundRepeat: "no-reaper",
		backgroundSize: "cover",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "flex-start",
		[theme.breakpoints.down("sm")]: {
			"&::-webkit-scrollbar": {
				display: "none",
			},
			flexDirection: "column-reverse",
		},
	},

	mainData: {
		height: "calc(100% - 64px)",
		background: "rgba(0,0,0,0.05)",
		backdropFilter: "blur(40px)",
		boxShadow: "rgba(0,0,0,0.4) 0px 0px 3px 2px",
		overflowY: "overlay",
		width: "calc(100% - 60px)",
		margin: "0 0 0 auto",
		[theme.breakpoints.down("sm")]: {
			border: "none",
			borderRadius: 0,
			margin: 0,
			padding: 0,
			height: "calc(100% - 84px)",
			
			width: "100%",
		},
	},
	"@global": {
		"*::-webkit-scrollbar": {
			width: "0.4em",
		},
		"*::-webkit-scrollbar-track": {
			"-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
		},
		"*::-webkit-scrollbar-thumb": {
			backgroundColor: "rgba(0,0,0,.4)",
			borderRadius: "50px",
		},
	},
	message: {
		padding: "8px 20px",
		dir: "rtl",
	},
}));
