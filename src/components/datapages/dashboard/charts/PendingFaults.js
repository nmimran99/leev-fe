import { Grid, makeStyles, useMediaQuery } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../../../context/LanguageContext";
import GaugeChart from "react-gauge-chart";
import clsx from "clsx";
import { StatusTag } from "../../../reuseables/StatusTag";
import { ItemLink } from "../../../reuseables/ItemLink";
import { differenceInMinutes, parseISO } from "date-fns";

export const PendingFaults = ({ pendingFaults }) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const { lang } = useContext(LanguageContext);
	const matches = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const [pfs, setPfs] = useState(pendingFaults);

	useEffect(() => {
		setPfs(pendingFaults);
	}, [pendingFaults]);

	const calculateTimePending = (pf) => {
		let p = differenceInMinutes(new Date(), parseISO(pf.changeStatusDate));
		if (p < 60) {
			return `${p.toFixed(0)} ${t("dates.minutes")}`;
		} else if (p < 2880) {
			return `${(p / 60).toFixed(0)} ${t("dates.hours")}`;
		} else {
			return `${(p / 1440).toFixed(0)} ${t("dates.days")}`;
		}
	};

	return (
		<Grid item xl={6} xs={12} className={classes.mainContainer}>
			<Grid container justify="center" className={classes.container}>
				<Grid item xs={12} className={classes.gridHeader}>
					<div className={classes.header}>
						{t("dashboard.pendingFaults")}
						<div className={classes.statusHeaderContainer}>
							<StatusTag
								status={{ statusId: "pending" }}
								type="fault"
								size={13}
							/>
						</div>
					</div>
				</Grid>
				<Grid item xs={12} className={classes.gridData}>
					{pfs.length ? (
						<Grid container justify="center">
							<Grid
								container
								className={classes.headersContainer}
								justify="center"
							>
								<Grid item xs={4} className={classes.headerGrid}>
									<div className={classes.headerContainer}>
										{t("faultsModule.faultId")}
									</div>
								</Grid>
								<Grid item xs={4} className={classes.headerGrid}>
									<div className={classes.headerContainer}>
										{t("faultsModule.title")}
									</div>
								</Grid>
								<Grid item xs={4} className={classes.headerGrid}>
									<div className={classes.headerContainer}>
										{t("dashboard.timePending")}
									</div>
								</Grid>
							</Grid>

							{pfs.map((pf, i) => (
								<Grid
									container
									className={classes.rowContainer}
									justify="center"
									key={i}
								>
									<Grid item xs={4} className={classes.cellGrid}>
										<div className={classes.cellData}>
											<ItemLink
												itemId={pf.faultData.faultId}
												module={"faults"}
												size={matches ? 13 : 16}
											/>
										</div>
									</Grid>
									<Grid item xs={4} className={classes.cellGrid}>
										<div className={clsx(classes.cellData)}>
											{pf.faultData.title}
										</div>
									</Grid>
									<Grid item xs={4} className={classes.cellGrid}>
										<div className={clsx(classes.cellData)}>
											{calculateTimePending(pf)}
										</div>
									</Grid>
								</Grid>
							))}
						</Grid>
					) : (
						<div className={classes.noData}>
							<img
								src="https://img.icons8.com/ios-filled/100/4a90e2/remove-data.png"
								className={classes.noDataImage}
							/>
							<div className={classes.noDataText}>{t("dashboard.noData")}</div>
							<div className={classes.noDataSecondary}>
								{t("dashboard.noDataSecondary")}
							</div>
						</div>
					)}
				</Grid>
			</Grid>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	mainContainer: {},
	container: {
		padding: "20px 20px",
		height: "400px",
		[theme.breakpoints.down("sm")]: {
			padding: "10px 0",
			height: "auto",
		},
	},
	gridHeader: {
		background: "black",
		color: "white",
		borderRadius: "10px 10px 0 0",
		height: "60px",
		[theme.breakpoints.down("sm")]: {
			borderRadius: 0,
		},
	},
	header: {
		fontSize: "18px",
		padding: "15px 20px 0",
		display: "flex",
		alignItems: "center",
	},
	gridData: {
		background: "rgba(0,0,0,0.2)",
		borderRadius: "0 0 10px 10px",
		height: "calc(100% - 60px)",
		overflow: 'auto',
		[theme.breakpoints.down("sm")]: {
			borderRadius: "0"
		},
	},
	statusHeaderContainer: {
		padding: "0 10px",
	},
	headersContainer: {
		background: "rgba(255,255,255,0.2)",
		borderBottom: "2px solid rgba(255,255,255,0.2)",
		[theme.breakpoints.down("sm")]: {
			background: "#575757",
			position: "sticky",
			top: "60px"
		},
	},
	headerContainer: {
		color: "white",
		textAlign: "center",
		padding: "15px 10px 10px",
		[theme.breakpoints.down("sm")]: {
			fontSize: "13px",
		},
	},
	headerGrid: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	rowContainer: {
		padding: "10px 5px",
		borderBottom: "1px solid rgba(255,255,255,0.1)",
	},
	cellGrid: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	cellData: {
		color: "white",
		width: "fit-content",
		textAlign: "center",
		[theme.breakpoints.down("sm")]: {
			fontSize: "12px",
		},
	},
	noData: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
		marginTop: "35px",
	},
	noDataText: {
		padding: "20px",
		color: "white",
		fontSize: "22px",
	},
	noDataSecondary: {
		padding: "0px 30px",
		fontSize: "14px",
		color: "rgba(255,255,255,0.5)",
	},
}));
