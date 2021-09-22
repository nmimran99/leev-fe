import { IconButton, makeStyles } from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";
import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";
import { useHistory, useLocation } from "react-router";

export const ReturnToPrevios = ({ fontSize, size }) => {
	const classes = useStyles();
	const location = useLocation();
	const history = useHistory();
	const { t } = useTranslation();

	return (
		<IconButton
			className={classes.button}
			onClick={() => history.goBack()}
			style={{
				width: `${size}px` || "40px",
				height: `${size}px` || "40px",
			}}
		>
			<ArrowBackRoundedIcon
				className={classes.icon}
				style={{
					fontSize: fontSize || "16px",
				}}
			/>
		</IconButton>
	);
};

const useStyles = makeStyles((theme) => ({
	button: {
		background: "rgba(0,0,0,0.7)",
		color: "white",
		padding: "12px",
		margin: "0",
		"&:hover": {
			background: "rgba(0,0,0,0.8)",
		},
		[theme.breakpoints.down("sm")]: {
			border: "1px solid rgba(255,255,255,0.2)",
		},
	},
	icon: {
		color: "white",
	},
}));
