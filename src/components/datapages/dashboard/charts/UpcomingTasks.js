import { Grid, makeStyles, useMediaQuery } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../../../context/LanguageContext";
import GaugeChart from "react-gauge-chart";
import clsx from "clsx";
import { StatusTag } from "../../../reuseables/StatusTag";
import { ItemLink } from "../../../reuseables/ItemLink";
import { differenceInMinutes, format, parseISO } from "date-fns";

export const UpcomingTasks = ({ upcomingTasks }) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const { lang } = useContext(LanguageContext);
	const matches = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	return (
		<Grid item xl={6} xs={12} className={classes.mainContainer}>
			<Grid container justify="center" className={classes.container}>
				<Grid item xs={12} className={classes.gridHeader}>
					<div className={classes.header}>{t("dashboard.upcomingTasks")}</div>
				</Grid>
				<Grid item xs={12} className={classes.gridData}>
					{upcomingTasks.length ? (
						<Grid container justify="center">
							<Grid
								container
								className={classes.headersContainer}
								justify="center"
							>
								<Grid item xs={4} className={classes.headerGrid}>
									<div className={classes.headerContainer}>
										{t("tasksModule.taskId")}
									</div>
								</Grid>
								<Grid item xs={4} className={classes.headerGrid}>
									<div className={classes.headerContainer}>
										{t("tasksModule.title")}
									</div>
								</Grid>
								<Grid item xs={4} className={classes.headerGrid}>
									<div className={classes.headerContainer}>
										{t("scheduler.nextIteration")}
									</div>
								</Grid>
							</Grid>

							{upcomingTasks.map((ut, i) => (
								<Grid
									container
									className={classes.rowContainer}
									justify="center"
									key={i}
								>
									<Grid item xs={4} className={classes.cellGrid}>
										<div className={classes.cellData}>
											<ItemLink
												itemId={ut.data.taskId}
												module={"tasks"}
												size={matches ? 13 : 16}
											/>
										</div>
									</Grid>
									<Grid item xs={4} className={classes.cellGrid}>
										<div className={clsx(classes.cellData)}>
											{ut.data.title}
										</div>
									</Grid>
									<Grid item xs={4} className={classes.cellGrid}>
										<div className={clsx(classes.cellData)}>
											{format(parseISO(ut.date), lang.dateonly)}
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
			position: "sticky",
			top: "0px",
		},
	},
	header: {
		fontSize: "18px",
		padding: "20px 20px 0",
	},
	gridData: {
		background: "rgba(0,0,0,0.2)",
		borderRadius: "0 0 10px 10px",
		height: "calc(100% - 60px)",
		[theme.breakpoints.down("sm")]: {
			borderRadius: "0",
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
			top: '60px',
		}
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
        marginTop: '35px'
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
