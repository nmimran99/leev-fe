import React from "react";
import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import HourglassEmptyRoundedIcon from "@material-ui/icons/HourglassEmptyRounded";
import CachedIcon from "@material-ui/icons/Cached";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import clsx from "clsx";
import { blue, green, red, yellow } from "@material-ui/core/colors";
import SlowMotionVideoIcon from "@material-ui/icons/SlowMotionVideo";

export const StatusTag = ({ status, type, size }) => {
	const classes = useStyles();
	const { t, i18n } = useTranslation();

	return (
		<div
			className={clsx(classes.statusTag, classes[status.statusId])}
			style={{ fontSize: size || "14px" }}
		>
			{status.statusId === "ready" ? (
				<PlayCircleOutlineIcon className={classes.icon} />
			) : status.statusId === "inProgress" ? (
				<CachedIcon className={classes.icon} />
			) : status.statusId === "pending" ? (
				<HourglassEmptyRoundedIcon
					className={classes.icon}
					className={classes.icon}
				/>
			) : status.statusId === "awaitingApproval" ? (
				<SlowMotionVideoIcon
					className={classes.icon}
					className={classes.icon}
				/>
			) : status.statusId === "closed" ? (
				<CheckCircleOutlineRoundedIcon className={classes.icon} />
			) : null}
			<div className={classes.title}>
				{t(`${type}sModule.statuses.${status.statusId}`)}
			</div>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	statusTag: {
		display: "flex",
		alignItems: "center",
		width: "fit-content",
		padding: "2px 5px",
		borderRadius: "25px",
		whiteSpace: "nowrap",
	},
	title: {
		padding: "5px 10px 5px 0px",
	},
	ready: {
		background: red[600],
		color: "white",
	},
	inProgress: {
		background: yellow[500],
		color: "black",
	},
	pending: {
		background: "rgba(255,255,255,0.4)",
		color: "black",
	},
	awaitingApproval: {
		background: blue[500],
		color: "white",
	},
	closed: {
		background: green[800],
		color: "white",
	},
	icon: {
		fontSize: "20px",
		padding: "0 5px 0 0px",
	},
}));
