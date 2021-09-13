import { Avatar, Grid, makeStyles, useMediaQuery } from "@material-ui/core";
import BlurOnRoundedIcon from "@material-ui/icons/BlurOnRounded";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getFullAddress } from "../../../api/assetsApi";
import { ItemLink } from "../../reuseables/ItemLink";
import { StatusTag } from "../../reuseables/StatusTag";
import { TimeActive } from "../../reuseables/TimeActive";
import clsx from "clsx";

export const TaskMinified = ({ data, asList, asBlock }) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const [task, setTask] = useState(data);
	const matches = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	useEffect(() => {
		setTask(data);
	}, [data]);

	return (
		<Grid
			item
			xs={12}
			lg={asList || asBlock ? 12 : 8}
			xl={asList || asBlock ? 12 : 7}
			className={classes.gridItem}
			style={{ padding: asList || matches ? 0 : "5px" }}
		>
			<Link
				to={`/workspace/tasks/${task.taskId}`}
				style={{ textDecoration: "none" }}
			>
				<Grid
					container
					justify="space-between"
					alignItems="center"
					className={clsx(
						classes.container,
						!asBlock && classes.nonBlockContainer
					)}
				>
					<div className={classes.topRow}>
						<div className={classes.taskLink}>
							<ItemLink itemId={task.taskId} module={"tasks"} size={13} />
						</div>

						<div className={classes.identifiers}>
							{!task.isRepeatable && !asBlock && (
								<div className={classes.statusContainer}>
									<StatusTag status={task.status} type={"task"} />
								</div>
							)}
							<Avatar className={classes.owner} src={task.owner.avatar} />
						</div>
					</div>

					<div className={classes.bottomRow}>
						<div className={classes.titleContainer}>
							<div className={classes.title}>{task.title}</div>
						</div>
						{!asList && !asBlock && (
							<div className={classes.detailsContainer}>
								{task.asset && (
									<div className={classes.asset}>
										{getFullAddress(task.asset)}
									</div>
								)}
								{task.system && (
									<div className={classes.system}>
										<BlurOnRoundedIcon className={classes.systemIcon} />
										{task.system.name}
									</div>
								)}
							</div>
						)}

						{!task.isRepeatable && (
							<div className={classes.timeActive}>
								<TimeActive createDate={task.createdAt} />
							</div>
						)}
					</div>
				</Grid>
			</Link>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	gridItem: {
		[theme.breakpoints.down("md")]: {
			padding: 0,
		},
	},
	container: {
		borderRadius: "5px",
	},
	nonBlockContainer: {
		padding: "5px 10px",
		border: "1px solid rgba(255,255,255,0.2)",
		background: "rgba(0,0,0,0.2)",
		boxShadow: "0 0 3px 1px rgba(0,0,0,0.37)",
		margin: "8px 0",
		[theme.breakpoints.down("sm")]: {
			borderWidth: "1px 0",
			borderRadius: "0",
		},
	},
	topRow: {
		borderBottom: "1px solid rgba(255,255,255,0.2)",
		padding: "5px 0",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		width: "100%",
	},
	bottomRow: {
		display: "flex",
		justifyContent: "space-between",
		width: "100%",
		padding: "10px 0",
		flexWrap: "wrap",
		[theme.breakpoints.down("sm")]: {
			flexDirection: "column",
		},
	},
	titleContainer: {
		width: "100%",
		display: "flex",
		alignItems: "center",
	},
	title: {
		color: "white",
		padding: "5px 20px",
		fontSize: "14px",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
		[theme.breakpoints.down("sm")]: {
			padding: "15px 20px",
			fontSize: "13px",
		},
	},
	desc: {
		fontSize: "16px",
		color: "white",
		padding: "5px 20px",
		maxWidth: "800px",
	},
	detailsContainer: {
		display: "flex",
		placeItems: "center",
		padding: "5px 0",
		[theme.breakpoints.down("sm")]: {
			justifyContent: "center",
			flexWrap: "wrap",
		},
	},
	asset: {
		color: "white",
		fontSize: "13px",
		padding: "8px 20px",
		borderRadius: "5px",
		border: "1px solid white",
		boxShadow: "rgba(0,0,0,0.25) 0 0 5px 2px",
		textAlign: "center",
		margin: "2px 5px",
		whiteSpace: "nowrap",
	},
	systemItem: {
		display: "flex",
		justifyContent: "center",
	},
	system: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "13px",
		height: "fit-content",
		color: "white",
		borderRadius: "5px",
		padding: "8px 20px 8px 5px",
		whiteSpace: "nowrap",
		border: "1px solid white",
		margin: "2px 5px",
		width: "fit-content",
	},
	systemIcon: {
		margin: "0 10px",
		fontSize: "16px",
	},
	identifiers: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "0 5px 5px",
		[theme.breakpoints.down("sm")]: {
			padding: "10px 10px",
		},
	},
	fullname: {
		color: "white",
		margin: "3px",
	},
	avatar: {
		height: "80px",
		width: "80px",
		margin: "5px",
	},
	statusContainer: {
		padding: "5px 20px",
		display: "flex",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	owner: {
		borderRadius: "50px",
		width: "40px",
		height: "40px",
	},
	taskLink: {
		padding: " 5px 20px",
	},
	iconBtn: {
		background: "rgba(0,0,0,0.4)",
		borderRadius: "50px",
		color: "white",
		margin: "0 5px",
		padding: "10px",
		"&:hover": {
			background: "rgba(0,0,0,0.7)",
		},
	},
	icon: {
		fontSize: "20px",
	},
	controls: {
		display: "flex",
		justifyContent: "flex-end",
		alignItems: "center",
		padding: "10px 20px",
	},
	bottom: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
	timeActive: {
		display: "flex",
		justifyContent: "flex-end",
		marginLeft: "auto",
		[theme.breakpoints.down("sm")]: {
			justifyContent: "flex-end",
		},
	},
	taskNotLinkedToAsset: {
		color: "rgba(255,255,255,0.6)",
		fontSize: "12px",
		padding: "5px 20px",
		display: "flex",
		alignItems: "center",
	},
	infoIcon: {
		fontSize: "16px",
		marginRight: "5px",
	},
}));
