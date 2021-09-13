import { Grid, makeStyles } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import { updateQueryParams } from "../../../api/genericApi";
import { getTasks, updateTaskStatus } from "../../../api/tasksApi";
import { AuthContext } from "../../../context/AuthContext";
import { BlocksView } from "../../reuseables/blocksView/BlocksView";
import { useQuery } from "../../reuseables/customHooks/useQuery";
import { LoadingProgress } from "../../reuseables/LoadingProgress";
import { NoDataFound } from "../../reuseables/NoDataFound";
import { TaskMinified } from "./TaskMinified";
import { TasksControls } from "./TasksControls";
import { TasksList } from "./TasksList";
import { TasksContext } from "../../../context/TasksContext";

export const TaskViews = ({}) => {
	const history = useHistory();
	const location = useLocation();
	const query = useQuery(location.search);
	const classes = useStyles();
	const { auth } = useContext(AuthContext);
	const { t } = useTranslation();
	const { tasks, setTasks } = useContext(TasksContext);
	const [viewType, setViewType] = useState(query["viewType"] || "list");
	const [isLoading, setIsLoading] = useState(true);
	const [showRepeatable, setShowRepeatable] = useState(false);

	useEffect(() => {
		prepareData();
	}, [isLoading]);

	useEffect(() => {
		setIsLoading(true);
	}, [location.search]);

	useEffect(() => {
		if (viewType !== "list") {
			setShowRepeatable(false);
		}
		history.push({
			path: location.pathname,
			search: updateQueryParams(
				location.search,
				[{ name: "viewType", value: viewType }],
				["status"]
			),
		});
	}, [viewType]);

	const prepareData = async () => {
		let f = query;
		delete f.viewType;
		let ts = await getTasks({ ...f, isRepeatable: showRepeatable });
		setTasks(ts);
		setIsLoading(false);
	};

	const handleToggleRepeatable = () => {
		if (showRepeatable) {
			setShowRepeatable(false);
			setIsLoading(true);
			return;
		}
		setShowRepeatable(true);
		setIsLoading(true);
	};

	const handleDrop = async (task, statusId) => {
		if (task.status._id == statusId) return;
		const res = await updateTaskStatus(task._id, statusId);
		setTasks((ts) => {
			return ts.map((t) => {
				if (t._id === task._id) {
					return res;
				}
				return t;
			});
		});
	};

	return (
		<Grid container justify={"center"}>
			<Grid xs={12} className={classes.moduleContainer}>
				<div className={classes.pageModule}>{t("assetsModule.tasks")}</div>
			</Grid>

			<Grid item xs={12}>
				<TasksControls viewType={viewType} setViewType={setViewType} />
			</Grid>
			{isLoading ? (
				<LoadingProgress />
			) : (
				<Grid
					item
					xs={12}
					className={classes.faultPresent}
					style={{ height: "auto" }}
				>
					{tasks.length ? (
						viewType === "list" ? (
							<TasksList
								handleToggleRepeatable={handleToggleRepeatable}
								showRepeatable={showRepeatable}
							/>
						) : (
							<BlocksView
								module={"tasks"}
								ItemBlock={TaskMinified}
								items={tasks}
								handleDrop={handleDrop}
							/>
						)
					) : (
						<NoDataFound />
					)}
				</Grid>
			)}
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	moduleContainer: {
		position: "sticky",
		top: 0,
		zIndex: 2,
	},
	pageModule: {
		color: "white",
		padding: "10px 40px",
		fontSize: "16px",
		background: "rgba(0,0,0,0.8)",
		boxShadow: "0 0px 2px 1px rgba(255,255,255,0.3)",
		margin: "0px auto 5px",
		width: "30%",
		textAlign: "center",
		borderRadius: "0 0 25px 25px",
		lineHeight: "1",
		[theme.breakpoints.down("sm")]: {
			background: "black",
			width: "100vw",
			padding: "20px 0",
			borderRadius: 0,
			margin: 0,
		},
	},
	faultPresent: {
		margin: "20px 10px",
		[theme.breakpoints.down("sm")]: {
			margin: "20px 0",
		},
	},
}));
