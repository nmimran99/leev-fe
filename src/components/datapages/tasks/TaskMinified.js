import { Grid, makeStyles, useMediaQuery } from "@material-ui/core";
import BlurOnRoundedIcon from "@material-ui/icons/BlurOnRounded";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getFullAddress } from "../../../api/assetsApi";
import { ItemLink } from "../../reuseables/ItemLink";
import { StatusTag } from "../../reuseables/StatusTag";
import { TimeActive } from "../../reuseables/TimeActive";
import { UserItem } from "../../user/UserItem";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

export const TaskMinified = ({ data, asList }) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const [task, setTask] = useState(data);
	const matches = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	useEffect(() => {
		setTask(data);
	}, [data]);

	return (
		<Link
			to={`/workspace/tasks/${task.taskId}`}
			style={{ textDecoration: "none" }}
		>
			<Grid
				item
				xs={12}
				xl={asList ? 12 : 6}
				className={classes.gridItem}
				style={{ padding: asList || matches ? 0 : "20px" }}
			>
				<Grid
					container
					justify="space-between"
					alignItems="center"
					className={classes.container}
					style={{ background: asList ? "none" : "rgba(0,0,0,0.3)" }}
				>
					{task.asset && (
						<Grid item xs={12}>
							<div className={classes.asset}>{getFullAddress(task.asset)}</div>
						</Grid>
					)}
					{task.system && (
						<Grid item xs={12} className={classes.systemItem}>
							<div className={classes.system}>
								<BlurOnRoundedIcon className={classes.systemIcon} />
								{task.system.name}
							</div>
						</Grid>
					)}
					{!task.asset && (
						<Grid item xs={12}>
							<div className={classes.taskNotLinkedToAsset}>
								<InfoOutlinedIcon className={classes.infoIcon} />
								{t("tasksModule.taskNotLinkedToAsset")}
							</div>
						</Grid>
					)}
					{!task.isRepeatable && (
						<Grid item xs={6} className={classes.statusContainer}>
							<StatusTag status={task.status} type={"task"} />
						</Grid>
					)}

					<Grid item xs={12}>
						<div className={classes.title}>{task.title}</div>
					</Grid>
					<Grid item xs={12}>
						<div className={classes.desc}>{task.description}</div>
					</Grid>
					{!task.isRepeatable && (
						<Grid item xs={12} sm={12}>
							<div className={classes.timeActive}>
								<TimeActive createDate={task.createdAt} />
							</div>
						</Grid>
					)}

					<Grid item xs={12} sm={12}>
						<div className={classes.identifiers}>
							<div className={classes.taskLink}>
								<ItemLink itemId={task.taskId} module={"tasks"} size={16} />
							</div>
							<div className={classes.owner}>
								<UserItem
									user={task.owner}
									showName
									showPhone
									avatarSize={40}
									size={12}
								/>
							</div>
						</div>
					</Grid>
				</Grid>
			</Grid>
		</Link>
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
		padding: "10px",
		margin: "8px 0",
		[theme.breakpoints.down("sm")]: {
			borderWidth: "1px 0",
			borderRadius: "0",
		},
	},
	title: {
		fontSize: "20px",
		color: "white",
		padding: "5px 20px",
	},
	desc: {
		fontSize: "16px",
		color: "white",
		padding: "5px 20px",
		maxWidth: "800px",
	},
	asset: {
		color: "white",
		fontSize: "16px",
		background: "black",
		padding: "10px 20px",
		borderRadius: "5px",
		boxShadow: "rgba(0,0,0,0.25) 0 0 5px 2px",
		textAlign: "center",
	},
	systemItem: {
		display: "flex",
		justifyContent: "center",
	},
	system: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "fit-content",
		color: "white",
		borderRadius: "0 0 50px 50px",
		padding: "5px 80px 5px 60px",
		background: "rgba(0,0,0,0.3)",
		whiteSpace: "nowrap",
	},
	systemIcon: {
		margin: "0 10px",
	},
	identifiers: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "10px 20px",
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
		padding: "30px 20px 10px",
	},
	owner: {
		padding: "10px 30px 10px 10px",
		background: "rgba(0,0,0,0.4)",
		borderRadius: "50px",
	},
	taskLink: {
		padding: "20px",
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
		padding: "20px 10px 0",
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
