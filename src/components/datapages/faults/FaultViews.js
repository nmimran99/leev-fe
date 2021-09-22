import { Grid, makeStyles } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import { getFaults, updateFaultStatus } from "../../../api/faultsApi";
import { updateQueryParams } from "../../../api/genericApi";
import { AuthContext } from "../../../context/AuthContext";
import { FaultsContext } from "../../../context/FaultsContext";
import { BlocksView } from "../../reuseables/blocksView/BlocksView";
import { useQuery } from "../../reuseables/customHooks/useQuery";
import { LoadingProgress } from "../../reuseables/LoadingProgress";
import { NoDataFound } from "../../reuseables/NoDataFound";
import { FaultBlock } from "./FaultBlock";
import { FaultBlockView } from "./FaultBlockView";
import { FaultListView } from "./FaultListView";
import { FaultMinified } from "./FaultMinified";
import { FaultsControls } from "./FaultsControls";

export const FaultViews = () => {
	const history = useHistory();
	const location = useLocation();
	const query = useQuery(location.search);
	const classes = useStyles();
	const { auth } = useContext(AuthContext);
	const { t } = useTranslation();
	const { faults, setFaults } = useContext(FaultsContext);
	const [viewType, setViewType] = useState(query["viewType"] || "list");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!isLoading) return;
		let f = query;
		delete f.viewType;
		getFaults(f)
			.then((data) => {
				if (data) {
					setFaults(data);
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [isLoading]);

	useEffect(() => {
		setIsLoading(true);
	}, [location.search]);

	useEffect(() => {
		history.push({
			path: location.pathname,
			search: updateQueryParams(
				location.search,
				[{ name: "viewType", value: viewType }],
				["status"]
			),
		});
	}, [viewType]);

	const handleDrop = async (fault, statusId) => {
		if (fault.status._id == statusId) return;
		const res = await updateFaultStatus(fault._id, statusId);
		setFaults((fs) => {
			return fs.map((f) => {
				if (f._id === fault._id) {
					return res;
				}
				return f;
			});
		});
	};

	return (
		<Grid container justify={"center"}>
			<Grid xs={12} className={classes.moduleContainer}>
				<div className={classes.pageModule}>{t("assetsModule.faults")}</div>
			</Grid>

			<Grid item xs={12}>
				<FaultsControls viewType={viewType} setViewType={setViewType} />
			</Grid>
			{isLoading ? (
				<LoadingProgress />
			) : (
				<Grid
					item
					xs={12}
					className={classes.faultPresent}
					style={{ height: "auto" }}
				>
					{faults.length ? (
						viewType === "list" ? (
							<FaultListView faults={faults} />
						) : (
							<BlocksView
								items={faults}
								module={"faults"}
								ItemBlock={FaultMinified}
								handleDrop={handleDrop}
							/>
						)
					) : (
						<NoDataFound />
					)}
				</Grid>
			)}
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
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
	faultPresent: {
		margin: "10px",
		[theme.breakpoints.down("sm")]: {
			margin: "20px 0",
		},
	},
}));
