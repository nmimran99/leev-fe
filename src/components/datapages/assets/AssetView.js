import {
	Grid,
	LinearProgress,
	makeStyles,
	useMediaQuery,
} from "@material-ui/core";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import VerticalSplitRoundedIcon from "@material-ui/icons/VerticalSplitRounded";
import clsx from "clsx";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router";
import {
	getAssetExtended,
	getShortAddress,
	updateAsset,
} from "../../../api/assetsApi";
import { getServerError, updateQueryParams } from "../../../api/genericApi";
import { updateLocation } from "../../../api/locationsApi";
import { SnackbarContext } from "../../../context/SnackbarContext";
import { useQuery } from "../../reuseables/customHooks/useQuery";
import { ReturnToPrevios } from "../../reuseables/ReturnToPrevious";
import { UserItem } from "../../user/UserItem";
import { AssetControls } from "./AssetControls";
import { FaultsGrid } from "./tableViews/FaultsGrid";
import { LocationsGrid } from "./tableViews/LocationsGrid";
import { ResidentsGrid } from "./tableViews/ResidentsGrid";
import { SystemsGrid } from "./tableViews/SystemsGrid";
import { TasksGrid } from "./tableViews/TasksGrid";
import { UpsertAsset } from "./UpsertAsset";

const modules = ["systems", "locations", "faults", "tasks", "residents"];

export const AssetView = ({}) => {
	const classes = useStyles();
	const params = useParams();
	const history = useHistory();
	const location = useLocation();
	const query = useQuery(location.search);
	const { t } = useTranslation();
	const { setSnackbar } = useContext(SnackbarContext);
	const matches = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const [isLoading, setIsLoading] = useState(true);
	const [asset, setAsset] = useState(null);
	const [module, setModule] = useState("systems");
	const [editMode, setEditMode] = useState(null);

	useEffect(() => {
		getAssetExtended(params.assetId)
			.then((res) => {
				console.log(res);
				if (!res || [403, 500].includes(res.status)) {
					history.push("/workspace/assets");
					setSnackbar(res || getServerError());
				}
				setAsset(res);
			})
			.finally(() => {
				setIsLoading(false); 
				if (query.tab) return;
				history.replace(`${location.pathname}?tab=systems`);
			});
	}, []);

	const handleUpdate = async (details) => {
		const res = await updateAsset(details);
		if (res.status === 403) {
			setSnackbar(res);
		} else if (res) {
			setAsset({
				...asset,
				...res.data,
			});
		}
		setEditMode(false);
	};

	const toggleEditMode = (type) => (event) => {
		if (editMode === type) {
			setEditMode(false);
		} else {
			setEditMode(type);
		}
	};

	const handleTabChange = (tabName) => (event) => {
		history.push({
			path: location.pathname,
			search: updateQueryParams(
				location.search,
				[{ name: "tab", value: tabName }],
				[]
			),
		});
	};

	const handleUpdateLocation = async (details) => {
		updateLocation(details).then((res) => {
			if ([403, 500].includes(res.status)) {
				setSnackbar(res);
				return;
			}
			history.replace(`${location.pathname}?tab=locations`);
		});
	};

	return isLoading ? (
		<LinearProgress />
	) : (
		<React.Fragment>
			<Grid container justify="center">
				<Grid item xs={12} className={classes.gridItem}></Grid>
				<Grid item xs={12} className={classes.gridItem}>
				
					<div className={classes.controlsContainer}>
						<AssetControls
							removeAsset={() => null}
							toggleEditMode={toggleEditMode}
							data={asset}
						/>
						<ReturnToPrevios />
					</div>
					<div className={classes.addressContainer}>
						<div className={classes.addressMain}>{getShortAddress(asset)}</div>
						<div className={classes.addressSecondary}>
							{`${asset.address.country}, ${asset.address.zipcode}`}
						</div>
					</div>
					<div className={classes.extraDetails}>
						{asset.addInfo.floors ? (
							<div className={clsx(classes.type, classes.floor)}>
								<VerticalSplitRoundedIcon className={classes.typeIcon} />
								<div className={classes.typeDetails}>
									<div className={classes.typeData}>
										{`${asset.addInfo.floors} ${t("assetsModule.floors")}`}
									</div>
								</div>
							</div>
						) : null}
						{asset.addInfo.floor ? (
							<div className={clsx(classes.type, classes.floor)}>
								<VerticalSplitRoundedIcon className={classes.typeIcon} />
								<div className={classes.typeDetails}>
									<div className={classes.typeData}>
										{`${t("assetsModule.floor")} ${asset.addInfo.floor}`}
									</div>
								</div>
							</div>
						) : null}
						{asset.addInfo.unit ? (
							<div className={clsx(classes.type, classes.unit)}>
								<HomeRoundedIcon className={classes.typeIcon} />
								<div className={classes.typeDetails}>
									<div className={classes.typeData}>
										{`${t("assetsModule.unit")} ${asset.addInfo.unit}`}
									</div>
								</div>
							</div>
						) : null}
						{asset.addInfo.units ? (
							<div className={clsx(classes.type, classes.units)}>
								<HomeRoundedIcon className={classes.typeIcon} />
								<div className={classes.typeDetails}>
									<div className={classes.typeData}>
										{`${asset.addInfo.units} ${t("assetsModule.units")}`}
									</div>
								</div>
							</div>
						) : null}
					</div>
				</Grid>
				<Grid item xs={12} className={classes.gridItem}>
					<div className={classes.ownerContainer}>
						<UserItem
							user={asset.owner}
							showTitle
							showPhone
							showName
							avatarSize={matches ? 50 : 70}
							size={matches ? 11 : 13}
						/>
					</div>
				</Grid>
				<Grid item xs={12} className={classes.queryGrid}>
					<div className={classes.querySelector}>
						{modules.map((md, i) => (
							<div
								className={clsx(
									classes.moduleBtn,
									query.tab === md ? classes.active : null
								)}
								onClick={handleTabChange(md)}
								key={i}
							>
								{t(`sideMenu.${md}`)}
							</div>
						))}
					</div>
				</Grid>
				<Grid container className={classes.tableGrid} justify="center">
					<Grid
						item
						xs={12}
						md={10}
						lg={10}
						xl={8}
						className={classes.tableContainer}
					>
						{query.tab === "systems" ? (
							<SystemsGrid assetId={asset._id} />
						) : query.tab === "faults" ? (
							<FaultsGrid assetId={asset._id} />
						) : query.tab === "tasks" ? (
							<TasksGrid assetId={asset._id} />
						) : query.tab === "locations" ? (
							<LocationsGrid
								assetId={asset._id}
								handleUpdateLocation={handleUpdateLocation}
							/>
						) : query.tab === "residents" ? (
							<ResidentsGrid assetId={asset._id} />
						) : null}
					</Grid>
				</Grid>
			</Grid>
			{editMode === "address" && (
				<UpsertAsset
					assetId={asset._id}
					handleUpdate={handleUpdate}
					handleClose={() => setEditMode(false)}
				/>
			)}
		</React.Fragment>
	);
};

const useStyles = makeStyles((theme) => ({
	gridItem: {
		position: "relative",
	},
	controlsContainer: {
		padding: "20px",
		display: "flex",
		justifyContent: "flex-end",
		[theme.breakpoints.down("sm")]: {
			padding: "10px",
		},
	},
	addressContainer: {
		padding: "10px 50px",
		textAlign: "center",
		background: "black",
		color: "white",
		borderRadius: "50px",
		width: "fit-content",
		margin: "10px auto",
		[theme.breakpoints.down("sm")]: {
			fontSize: "16px",
			padding: "3px",
			padding: "10px 30px",
		},
	},
	addressMain: {
		fontSize: "20px",
		padding: "5px",
		whiteSpace: "nowrap",
		[theme.breakpoints.down("sm")]: {
			fontSize: "16px",
			padding: "3px",
		},
	},
	addressSecondary: {
		fontSize: "16px",
		padding: "5px",
		[theme.breakpoints.down("sm")]: {
			fontSize: "13px",
			padding: "3px",
		},
	},
	extraDetails: {
		display: "flex",
		justifyContent: "center",
		height: "30px",
		borderRadius: "25px",
		background: theme.palette.primary.main,
		width: "fit-content",
		boxShadow: "rgba(0,0,0,0.4) 0px 0px 5px 2px",
		margin: "10px auto",
		fontSize: "18px",
		padding: "5px 10px",
		[theme.breakpoints.down("sm")]: {
			fontSize: "14px",
			padding: "3px 10px",
		},
	},
	type: {
		position: "relative",
		display: "flex",
		padding: "5px 10px",
		width: "fit-content",
		background: "transparent",
		color: "white",
		alignItems: "center",
	},
	typeIcon: {
		fontSize: "24px",
		color: "white",
	},
	typeData: {
		padding: "0 10px 0 10px",
		lineHeight: 1,
	},
	ownerContainer: {
		background: "rgba(0,0,0,0.4)",
		width: "fit-content",
		padding: "10px 40px 10px 10px",
		borderRadius: "50px",
		margin: "0 auto",
		[theme.breakpoints.down("sm")]: {
			padding: "7px 30px 7px 7px",
		},
	},
	queryGrid: {
		overflowX: "overlay",
		width: "100%",
		"&::-webkit-scrollbar": {
			display: "none",
		},
		margin: "10px 0",
		[theme.breakpoints.down("sm")]: {
			padding: "0",
		},
	},
	querySelector: {
		display: "flex",
		justifyContent: "center",
		width: "fit-content",
		margin: "0 auto",
		[theme.breakpoints.down("sm")]: {
			border: "solid rgba(255,255,255,0.2)",
			borderWidth: "1px 0",
		},
	},
	moduleBtn: {
		color: "rgba(255,255,255,0.6)",
		background: "rgba(0,0,0,0.4)",
		borderRadius: "50px",
		padding: "10px 30px",
		margin: "3px",
		cursor: "pointer",
		border: "1px solid rgba(255,255,255,0.2)",
		[theme.breakpoints.down("sm")]: {
			fontSize: "13px",
			padding: "8px 20px",
		},
	},
	active: {
		color: "white",
		background: "black",
		border: "2px solid white",
	},
	tableContainer: {
		margin: "20px 0",
		background: "rgba(0,0,0,0.4)",
		borderRadius: "10px",
		[theme.breakpoints.down("sm")]: {
			borderRadius: "0px",
			margin: "0",
		},
	},
}));
