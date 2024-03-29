import { Grid, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useRouteMatch } from "react-router";
import { getAsset, getFullAddress } from "../../../api/assetsApi";
import { getDashboardData } from "../../../api/dashboardApi";
import { removeQueryParam } from "../../../api/genericApi";
import { getAssetsSuggestions } from "../../../api/systemsApi";
import { useQuery } from "../../reuseables/customHooks/useQuery";
import { LoadingProgress } from "../../reuseables/LoadingProgress";
import { SearchBoxSelect } from "../../reuseables/SearchBoxSelect";
import { AverageTimeToClose } from "./charts/AverageTimeToClose";
import { LastOperations } from "./charts/LastOperations";
import { OpenItems } from "./charts/OpenItems";
import { PendingFaults } from "./charts/PendingFaults";
import { UpcomingTasks } from "./charts/UpcomingTasks";

export const Dashboard = () => {
	const { path } = useRouteMatch();
	const history = useHistory();
	const location = useLocation();
	const classes = useStyles();
	const query = useQuery(location.search);
	const { t } = useTranslation();
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [reloadedValue, setReloadedValue] = useState(null);

	useEffect(() => {
		if (query.asset) {
			handleReloaded(query.asset).then((data) => {
				if (data) {
					setReloadedValue(data);
				}
			});
		} else {
			setReloadedValue({
				label: "",
				value: null,
			});
			history.push({
				path: location.pathname,
				search: removeQueryParam(location.search, "asset"),
			});
		}
		setIsLoading(true);
	}, [location.search]);

	useEffect(() => {
		getDashboardData({ asset: query.asset })
			.then((res) => {
				setData(res);
			})
			.finally(() => setIsLoading(false));
	}, [isLoading]);

	const handleReloaded = async (assetId) => {
		const res = await getAsset(assetId, false);
		if (res) {
			return {
				label: getFullAddress(res),
				value: res._id,
			};
		}
	};

	return isLoading ? (
		<LoadingProgress />
	) : (
		<Grid container justify="center">
			<Grid item xs={12} className={classes.moduleContainer}>
				<div className={classes.pageModule}>{t("sideMenu.dashboard")}</div>
			</Grid>
			<Grid
				item
				xs={12}
				className={clsx(classes.griditem, classes.filtersGrid)}
			>
				<SearchBoxSelect
					suggestionsFunc={getAssetsSuggestions}
					placeholder={t("filters.filterByAsset")}
					filterField={"asset"}
					reloadedLabel={reloadedValue.label}
					reloadedValue={reloadedValue.value}
				/>
			</Grid>
			<Grid
				item
				xl={8}
				lg={6}
				xs={12}
				className={clsx(classes.griditem, classes.sideGrid)}
			>
				<Grid container>
					<OpenItems openFaults={data.openFaults} openTasks={data.openTasks} />
					<AverageTimeToClose data={data.avgTimeToClose} />
					<PendingFaults pendingFaults={data.pendingFaults} />
					<UpcomingTasks upcomingTasks={data.upcomingTasks} />
				</Grid>
			</Grid>
			<Grid
				item
				xl={4}
				lg={6}
				xs={12}
				className={clsx(classes.griditem, classes.lastOperations)}
			>
				<LastOperations operations={data.lastOperations} />
			</Grid>

			<Grid
				item
				xs={12}
				className={clsx(classes.griditem, classes.bottomGrid)}
			></Grid>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	filtersGrid: {
		display: "flex",
		justifyContent: "center",
		margin: "20px 0 0",
	},
	moduleContainer: {
		position: "sticky",
		top: 0,
		zIndex: 2,
	},
	pageModule: {
		color: "white",
		padding: "10px 40px",
		fontSize: "16px",
		background: "rgba(0,0,0,0.8)",
		boxShadow: "0 0px 2px 1px rgba(255,255,255,0.3)",
		margin: "0px auto 5px",
		width: "30%",
		textAlign: "center",
		borderRadius: "0 0 25px 25px",
		lineHeight: "1",
		[theme.breakpoints.down("sm")]: {
			background: "black",
			width: "100vw",
			padding: "20px 0",
			borderRadius: 0,
			margin: 0,
		},
	},
}));
