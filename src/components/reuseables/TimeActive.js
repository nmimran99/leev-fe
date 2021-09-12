import React from "react";
import { makeStyles } from "@material-ui/core";
import { getDatediffString } from "../../api/genericApi";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import { useTranslation } from "react-i18next";

export const TimeActive = ({ createDate }) => {
	const classes = useStyles();
	const { t } = useTranslation();

	return (
		<div className={classes.container}>
			<AccessTimeIcon className={classes.icon} />
			{`${t(`general.openFor`)} ${getDatediffString(createDate)}`}
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		color: "rgba(255,255,255,0.8)",
		display: "flex",
		alignItems: "center",
		padding: "7px 30px 7px 0px",
		borderRadius: "50px",
		width: "fit-content",
		fontSize: "13px",
		whiteSpace: "nowrap",
	},
	icon: {
		fontSize: "20px",
		color: "white",
		margin: "0 8px",
	},
}));
