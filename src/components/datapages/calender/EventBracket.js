import React from "react";
import { makeStyles, Grid, useMediaQuery } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const EventBracket = ({ data }) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const matches = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	return (
		<div className={classes.eventBracket}>
			<div className={classes.taskId}>{data.taskId}</div>
			<div className={classes.title}>{data.title}</div>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	eventBracket: {
		background: "#42A5F5",
		borderRadius: "5px",
		margin: "5px 0",
		fontSize: "11px",
		display: "flex",
	},
	taskId: {
		fontSize: "11px",
		whiteSpace: "nowrap",
		padding: "5px 10px",
		background: "black",
		color: "white",
		borderRadius: "5px 0px 0 5px",
	},
	title: {
		padding: "5px",
		color: "white",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
		borderRadius: "0px 5px 5px 0px",
	},
}));
