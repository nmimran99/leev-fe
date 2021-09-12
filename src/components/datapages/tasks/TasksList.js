import { Button, Fade, Grid, makeStyles } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { getServerError } from "../../../api/genericApi";
import { getTasks } from "../../../api/tasksApi";
import { AuthContext } from "../../../context/AuthContext";
import { SnackbarContext } from "../../../context/SnackbarContext";
import { useQuery } from "../../reuseables/customHooks/useQuery";
import { LoadingProgress } from "../../reuseables/LoadingProgress";
import { NoDataFound } from "../../reuseables/NoDataFound";
import { TaskMinified } from "./TaskMinified";
import { TasksControls } from "./TasksControls";
import ReplayIcon from "@material-ui/icons/Replay";
import clsx from "clsx";

export const TasksList = ({
	items,
	showRepeatable,
	handleToggleRepeatable,
}) => {
	const classes = useStyles();
	const { t } = useTranslation();

	return (
		<Grid container justify="center">
			<Grid item xl={7} xs={12} className={classes.btnContainer}>
				<Button
					className={clsx(
						classes.toggleRepeatable,
						showRepeatable && classes.toggled
					)}
					onClick={handleToggleRepeatable}
				>
					<ReplayIcon />
					<div className={classes.btnLbl}>
						{t("tasksModule.showRepeatable")}
					</div>
				</Button>
			</Grid>
			<Fade in={items.length}>
				<Grid container className={classes.listContainer}>
					{items.length ? (
						items.map((task, i) => <TaskMinified data={task} key={i} />)
					) : (
						<NoDataFound />
					)}
				</Grid>
			</Fade>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	listContainer: {
		padding: "10px",
		justifyContent: "center",
		[theme.breakpoints.down("sm")]: {
			padding: "10px 0",
		},
	},
	miniTask: {
		background: "rgba(0,0,0,0.6)",
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
	toggleRepeatable: {
		border: "1px solid rgba(255,255,255,0.2)",
		color: "white",
		borderRadius: "50px",
		padding: "5px 20px 5px 10px",
		"&:hover": {
			borderColor: "white",
		},
	},
	btnLbl: {
		padding: "0 10px",
	},
	btnContainer: {
		display: "flex",
		justifyContent: "flex-end",
	},
	toggled: {
		background: "rgba(0,0,0,0.7)",
	},
}));
