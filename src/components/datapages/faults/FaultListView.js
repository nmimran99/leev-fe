import {
	Grid,
	List,
	ListItem,
	makeStyles,
	useMediaQuery,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { FaultsContext } from "../../../context/FaultsContext";
import { useQuery } from "../../reuseables/customHooks/useQuery";
import { FaultMinified } from "./FaultMinified";
import { FaultView } from "./FaultView";

export const FaultListView = ({ faults }) => {
	const location = useLocation();
	const classes = useStyles();
	const downSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const { setFaults } = useContext(FaultsContext);
	const [faultView, setFaultView] = useState(faults.length ? faults[0] : null);
	const [faultsData, setFaultsData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setFaultsData(faults);
		setIsLoading(false);
	}, [faults]);

	const updateFaultState = (faultId, field, data) => {
		setIsLoading(true);
		let faultIndex = faultsData.findIndex((f) => f._id === faultId);
		if (!faultIndex && faultIndex !== 0) return;
		let lf = [...faultsData];
		lf[faultIndex][field] = data;
		setFaults(lf);
		setIsLoading(false);
	};

	return (
		<Grid container className={classes.main} justify="flex-start">
			<Grid item xs={12} md={5} lg={3} xl={3} className={classes.faultList}>
				<List className={classes.list}>
					{isLoading
						? null
						: faultsData.map((f, i) => (
								<ListItem
									button
									className={classes.item}
									onClick={() => setFaultView(f)}
								>
									<FaultMinified data={f} key={i} />
								</ListItem>
						  ))}
				</List>
			</Grid>
			{!downSm && Boolean(faultView) && (
				<Grid item md={7} lg={9} xl={9} className={classes.faultPresenter}>
					<FaultView
						fid={faultView.faultId}
						updateFaultState={updateFaultState}
						faultData={faultView}
					/>
				</Grid>
			)}
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	main: {
		border: "1px solid rgba(255,255,255,0.2)",
		height: "70vh",
		[theme.breakpoints.down("sm")]: {
			border: "0",
			height: "auto",
		},
	},
	faultList: {
		borderRight: "1px solid rgba(255,255,255,0.2)",
		height: "100%",
		overflowY: "scroll",
		"&::-webkit-scrollbar": {
			display: "none",
		},
		[theme.breakpoints.down("sm")]: {
			border: "0",
			overflowY: "unset",
		},
	},
	list: {
		background: "rgba(0,0,0,0.4)",
		padding: 0,
		overflowY: "unset",
	},
	item: {
		height: "180px",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
		[theme.breakpoints.down("sm")]: {
			margin: "10px 0",
		},
	},
	faultPresenter: {
		background: "rgba(0,0,0,0.1)",
		height: "100%",
	},
}));
