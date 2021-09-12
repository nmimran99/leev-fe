import React from "react";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";

export const Block = ({ children, isEmpty }) => {
	const classes = useStyles();

	return (
		<div className={clsx(classes.itemContainer, isEmpty && classes.emptyBlock)}>
			{children}
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	itemContainer: {
		border: "1px solid rgba(255,255,255,0.2)",
		boxShadow: "0 0 5px 3px rgba(0,0,0,0.37)",
		borderRadius: "7px",
		background: "rgba(0,0,0,0.2)",
		margin: "7px 0",
		minHeight: "150px",
	},
	emptyBlock: {
		boxShadow: "none",
		border: "1px solid rgba(0,0,0,0.2)",
	},
}));
