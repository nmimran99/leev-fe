import { Grid, List, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getStatusList } from "../../../api/genericApi";
import { StatusTag } from "../StatusTag";
import { Block } from "./Block";
import { BlockList } from "./BlockList";

export const BlocksView = ({ items, module, ItemBlock, handleDrop }) => {
	const classes = useStyles();
	const [data, setData] = useState([]);
	const [statuses, setStatuses] = useState([]);
	const [blocksData, setBlocksData] = useState({});
	const [fillTo, setFillTo] = useState(0);

	useEffect(() => {
		prepareData();
	}, [data]);

	useEffect(() => {
		setData(items);
	}, [items]);

	const prepareData = async () => {
		const statusList = await getStatusList(module);
		setStatuses(statusList);
		let blocks = await getBlocksByStatus(statusList);
		setBlocksData(blocks);
	};

	const getBlocksByStatus = async (statusList) => {
		let res = {};
		statusList.forEach((s) => {
			let bls = data.filter((item) => item.status.statusId === s.statusId);
			if (bls.length > fillTo) {
				setFillTo(bls.length);
			}
			res[s.statusId] = bls;
		});
		return Promise.resolve(res);
	};

	return (
		<DndProvider backend={HTML5Backend}>
			<div className={classes.container}>
				{Object.entries(blocksData).map((s, i) => {
					return (
						<div className={classes.gridItem} key={i}>
							<div className={classes.block}>
								<div className={classes.blockTitle}>
									<StatusTag
										type={module.slice(0, -1)}
										status={statuses.find((st) => st.statusId === s[0])}
									/>
								</div>
								<BlockList
									fbs={s[1]}
									fillTo={fillTo}
									ItemBlock={ItemBlock}
									listId={statuses.find((st) => st.statusId === s[0])._id}
									handleDrop={handleDrop}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</DndProvider>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		height: "auto",
		display: "flex",
		[theme.breakpoints.down("sm")]: {
			flexDirection: "column",
		},
	},
	gridItem: {
		width: "20%",
		[theme.breakpoints.down("sm")]: {
			minHeight: "0",
			width: "100%",
		},
	},
	blockTitle: {
		padding: "10px",
		border: "1px solid rgba(255,255,255,0.2)",
		background: "rgba(0,0,0,0.3)",
		boxShadow: "0 0 3px 1px rgba(0,0,0,0.37)",
		display: "flex",
		justifyContent: "center",
		borderRadius: "10px",
		margin: "5px",
		[theme.breakpoints.down("sm")]: {},
	},
	block: {
		padding: "0 5px",
	},
	faultContainer: {
		padding: "10px",
		border: "1px solid rgba(255,255,255,0.2)",
		borderRadius: "5px",
		background: "rgba(0,0,0,0.4)",
		margin: "5px 0",
	},
}));
