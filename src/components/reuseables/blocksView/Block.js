import React from "react";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { useDrag } from "react-dnd";

export const Block = ({ children, isEmpty, item }) => {
	const classes = useStyles();
	const [{ isDragging }, drag] = useDrag({
		type: "ITEMBLOCK",
		item: {
			item,
		},
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	});

	if (isEmpty) {
		return (
			<div
				className={clsx(classes.itemContainer, isEmpty && classes.emptyBlock)}
			>
				{children}
			</div>
		);
	}

	return (
		<div
			ref={drag}
			className={clsx(classes.itemContainer, isEmpty && classes.emptyBlock)}
			style={{ opacity: isDragging ? 0.5 : 1 }}
		>
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
