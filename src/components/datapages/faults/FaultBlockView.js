import { Grid, List, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getStatusList } from "../../../api/genericApi";
import { StatusTag } from "../../reuseables/StatusTag";
import { FaultBlock } from "./FaultBlock";

export const FaultBlockView = ({ faults }) => {
	const classes = useStyles();
	const [faultsData, setFaultsData] = useState([]);
	const [statuses, setStatuses] = useState([]);

	useEffect(() => {
		getStatusList("faults").then((data) => {
			setStatuses(data);
		});
	}, []);

	useEffect(() => {
		setFaultsData(faults);
	}, [faults]);

	const getFaultsByStatus = (status) => {
		return faultsData.filter((f) => f.status.statusId === status);
	};

	const getFaultBlock = (s) => {
		const fbs = getFaultsByStatus(s.statusId);
		if (!fbs.length) return;

		return (
			<List className={classes.blockFaults}>
				{fbs.map((f, i) => (
					<FaultBlock data={f} key={i} />
				))}
			</List>
		);
	};

	return (
		<Grid container className={classes.container}>
			{statuses.map((s, i) => {
				return (
					<Grid item xs={12} lg={3} xl={3} className={classes.gridItem} key={i}>
						<div className={classes.block}>
							<div className={classes.blockTitle}>
								<StatusTag type="fault" status={s} />
							</div>
							{getFaultBlock(s)}
						</div>
					</Grid>
				);
			})}
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		height: "auto",
	},
	gridItem: {
		minHeight: "700px",
		[theme.breakpoints.down("sm")]: {
			minHeight: "0",
		},
	},
	blockTitle: {
		padding: "10px",
		background: "black",
		display: "flex",
		justifyContent: "center",
		borderRadius: "10px",
		margin: "5px 0",
	},
	block: {
		padding: "0 5px",
	},
	blockFaults: {
		borderRadius: "10px",
		margin: "10px 0",
		minHeight: "600px",
		padding: "5px",
		[theme.breakpoints.down("sm")]: {
			minHeight: "0",
		},
	},
	faultContainer: {
		padding: "10px",
		border: "1px solid rgba(255,255,255,0.2)",
		borderRadius: "5px",
		background: "rgba(0,0,0,0.4)",
		margin: "5px 0",
	},
}));
