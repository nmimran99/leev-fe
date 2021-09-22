import { List, makeStyles } from "@material-ui/core";
import React from "react";
import { useDrop } from "react-dnd";
import { Block } from "./Block";

export const BlockList = ({ fbs, ItemBlock, fillTo, listId, handleDrop }) => {
	const classes = useStyles();
	const [{ isOver }, drop] = useDrop({
		accept: "ITEMBLOCK",
		drop: (item, monitor) => handleDrop(item.item, listId),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	});

	return (
		<List
			className={classes.blockFaults}
			ref={drop}
			style={{ background: isOver ? "rgba(0,0,0,0.2)" : null }}
		>
			{fbs.map((f, i) => (
				<Block item={f}>
					<ItemBlock data={f} key={i} asBlock />
				</Block>
			))}
			{fbs.length < fillTo &&
				[...Array(fillTo - fbs.length).keys()].map((b) => (
					<Block isEmpty></Block>
				))}
		</List>
	);
};

const useStyles = makeStyles((theme) => ({
	blockFaults: {
		borderRadius: "10px",
		padding: "5px",
		[theme.breakpoints.down("sm")]: {
			minHeight: "0",
		},
	},
}));
