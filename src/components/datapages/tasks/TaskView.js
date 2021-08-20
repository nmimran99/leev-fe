import { Grid, IconButton, makeStyles } from "@material-ui/core";
import BlurOnRoundedIcon from "@material-ui/icons/BlurOnRounded";
import DoneIcon from "@material-ui/icons/Done";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import RoomIcon from "@material-ui/icons/Room";
import clsx from "clsx";
import { format, parseISO } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import { getFullAddress } from "../../../api/assetsApi";
import { getNextIterationDate } from "../../../api/genericApi";
import {
	addTaskRelatedUser,
	completeTaskStep,
	getTask,
	removeTaskRelatedUser,
	saveTaskComment,
	updateTaskComment,
	updateTaskOwner,
	updateTaskSchedule,
	updateTaskStatus,
} from "../../../api/tasksApi";
import { LanguageContext } from "../../../context/LanguageContext";
import { SnackbarContext } from "../../../context/SnackbarContext";
import { UpsertContext } from "../../../context/UpsertContext";
import { AddRelatedUser } from "../../reuseables/AddRelatedUser";
import { Can } from "../../reuseables/Can";
import { Carousel } from "../../reuseables/Carousel";
import { CommentSection } from "../../reuseables/CommentSection";
import { ItemLink } from "../../reuseables/ItemLink";
import { LoadingProgress } from "../../reuseables/LoadingProgress";
import { ReturnToPrevios } from "../../reuseables/ReturnToPrevious";
import { Scheduler } from "../../reuseables/scheduler/Scheduler";
import { StatusTag } from "../../reuseables/StatusTag";
import { TimeActive } from "../../reuseables/TimeActive";
import { UpdateOwner } from "../../reuseables/UpdateOwner";
import { UpdateStatus } from "../../reuseables/UpdateStatus";
import { UserList } from "../../reuseables/UserList";
import { UserItem } from "../../user/UserItem";
import { TaskViewControls } from "./TaskViewControls";

export const TaskView = () => {
	const history = useHistory();
	const { t } = useTranslation();
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);
	const { setSnackbar } = useContext(SnackbarContext);
	const { setUpsertData } = useContext(UpsertContext);
	const [task, setTask] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const { taskId } = useParams();
	const [changeOwner, setChangeOwner] = useState(false);
	const [addRelatedUserModal, setAddRelatedUserModal] = useState(null);
	const [changeStatus, setChangeStatus] = useState(null);
	const [scheduling, setScheduling] = useState(null);

	useEffect(() => {
		prepareData();
	}, []);

	const prepareData = async () => {
		const res = await getTask(taskId);
		if (!res) {
			history.push("/workspace/tasks");
		} else if (res.status === 403) {
			setSnackbar(res);
			history.push("/workspace/tasks");
		}
		setTask(res);
		setIsLoading(false);
	};

	const updateOwner = (userId) => {
		updateTaskOwner(task._id, userId).then((res) => {
			if (res.status === 403) {
				setSnackbar(res);
			} else if (res) {
				setTask({
					...task,
					owner: res.owner,
				});
			}
			setChangeOwner(false);
		});
	};

	const removeRelatedUser = async (userId) => {
		const res = await removeTaskRelatedUser(task._id, userId);
		if (res.status === 403) {
			setSnackbar(res);
		} else if (res) {
			setTask({
				...task,
				relatedUsers: res.relatedUsers,
			});
		}
	};

	const addRelatedUser = (userId) => async (event) => {
		event.stopPropagation();
		const res = await addTaskRelatedUser(task._id, userId);
		if (res.status === 403) {
			setSnackbar(res);
		} else if (res) {
			setTask({
				...task,
				relatedUsers: res.relatedUsers,
			});
		}
		setAddRelatedUserModal(null);
	};

	const handleChangeStatus = async (statusId) => {
		const res = await updateTaskStatus(task._id, statusId);
		if (res.status === 403) {
			setSnackbar(res);
		} else if (res) {
			setTask({
				...task,
				status: res.status,
			});
		}
		setChangeStatus(null);
	};

	const handleSaveComment = async (taskId, userId, text, image) => {
		const res = await saveTaskComment(taskId, userId, text, image);
		if (res.status === 403) {
			setSnackbar(res);
			return Promise.resolve(null);
		}
		return Promise.resolve(res);
	};

	const handleUpdateComment = async (taskId, commentId, text) => {
		const res = await updateTaskComment(taskId, commentId, text);
		if (res.status === 403) {
			setSnackbar(res);
			return Promise.resolve(null);
		}
		return Promise.resolve(res);
	};

	const handleUpdateSchedule = async (schedule) => {
		const res = await updateTaskSchedule(task._id, schedule);
		if (res.status === 403) {
			setSnackbar(res);
		} else if (res) {
			setTask({
				...task,
				schedule: res.schedule,
			});
		}
	};

	const handleCompleteStep = (step) => async (event) => {
		const { order, isCompleted } = step;
		const res = await completeTaskStep(task._id, order, !isCompleted);
		if (res.status === 403 || res.status === 500) {
			setSnackbar(res);
			return;
		}
		setTask({
			...task,
			steps: res.steps,
		});
	};

	const toggleEditMode = () => {
		setUpsertData({ itemId: task._id, module: "tasks" });
	};

	return isLoading ? (
		<LoadingProgress />
	) : (
		<React.Fragment>
			<Grid
				container
				className={classes.container}
				justify="space-between"
				alignItems="flex-start"
			>
				<Grid container className={classes.controls}>
					<div className={classes.topHeaderGriditem}>
						<div className={classes.taskId}>
							<ItemLink itemId={task.taskId} module={"tasks"} size={18} />
						</div>
						<ReturnToPrevios />
					</div>

					<Grid item xs={12} className={classes.controlsGriditem}>
						<TaskViewControls
							task={task}
							editTask={toggleEditMode}
							updateOwner={() => setChangeOwner(true)}
							changeStatus={() => setChangeStatus(true)}
							handleScheduler={() => setScheduling(true)}
						/>
					</Grid>
					{!task.isRepeatable ? (
						<Grid
							item
							xs={12}
							className={classes.controlsGriditem}
							onClick={() => setChangeStatus(true)}
							style={{
								justifyContent: "flex-start",
								cursor: "pointer",
							}}
						>
							<StatusTag status={task.status} type="task" size={"16px"} />
						</Grid>
					) : (
						<Grid item xs={12} className={classes.controlsGriditem}>
							<div className={classes.repeatableContainer}>
								<div className={classes.repeatableMark}>
									{t("tasksModule.repeatableTask")}
								</div>
								<div className={classes.repeatableMarkInstructions}>
									{t("tasksModule.repeatableTaskInstructions")}
								</div>
							</div>
						</Grid>
					)}
				</Grid>
				<Grid
					item
					xs={12}
					sm={12}
					md={8}
					lg={8}
					xl={9}
					className={classes.rightContainer}
				>
					<div className={classes.asset}>{getFullAddress(task.asset)}</div>
					<div
						className={clsx(
							classes.system,
							!task.system && classes.notAssigned
						)}
					>
						<BlurOnRoundedIcon className={classes.systemIcon} />
						{task.system ? task.system.name : t("general.noSystemAssigned")}
					</div>
					<div
						className={clsx(
							classes.location,
							!task.location && classes.notAssigned
						)}
					>
						<RoomIcon className={classes.systemIcon} />
						{task.location
							? task.location.name
							: t("general.noLocationAssigned")}
					</div>

					{!task.asset && (
						<Grid item xs={12}>
							<div className={classes.taskNotLinkedToAsset}>
								<InfoOutlinedIcon className={classes.infoIcon} />
								{t("tasksModule.taskNotLinkedToAsset")}
							</div>
						</Grid>
					)}
					<div className={classes.title}>{task.title}</div>
					<div className={classes.desc}>
						<div className={classes.itemDates}>
							<div className={classes.openDate}>
								{`${t("general.createDate")} ${format(
									parseISO(task.createdAt),
									lang.dateformat
								)}`}
							</div>
							{Boolean(task.closedDate) && (
								<div className={classes.closedDate}>
									{`${t("general.closedDate")} ${format(
										parseISO(task.closedDate),
										lang.dateformat
									)}`}
								</div>
							)}
						</div>
						{task.description}
						<div className={classes.timeActive}>
							<TimeActive createDate={task.createdAt} />
						</div>
					</div>
					{task.isRepeatable && Boolean(task.schedule.length) && (
						<div className={classes.taskSchedulesContainer}>
							<div className={classes.schedulesTitle}>
								{t("tasksModule.taskIterations")}
							</div>

							<Grid container className={classes.scheduleContainer}>
								{task.schedule.map((s, i) => (
									<Grid
										item
										xl={3}
										lg={4}
										md={6}
										sm={6}
										xs={12}
										className={classes.schedulesItem}
									>
										<div className={classes.scheduleGridItem}>
											<div className={classes.scheduleTitle}>
												{t("scheduler.startDate")}
											</div>
											<div className={classes.scheduleData}>
												{format(parseISO(s.startDate), lang.dateonly)}
											</div>
										</div>
										<div className={classes.scheduleGridItem}>
											<div className={classes.scheduleTitle}>
												{t("scheduler.repeatEvery")}
											</div>
											<div className={classes.scheduleData}>
												{t(`dates.${s.interval}`)}
											</div>
										</div>
										<div className={classes.scheduleGridItem}>
											<div className={classes.scheduleTitle}>
												{t("scheduler.nextIteration")}
											</div>
											<div className={classes.scheduleData}>
												{format(
													getNextIterationDate(s.startDate, s.interval),
													lang.dateonly
												)}
											</div>
										</div>
									</Grid>
								))}
							</Grid>
						</div>
					)}
					{Boolean(task.steps.length) && (
						<div className={classes.stepsContainer}>
							<div className={classes.stepsTitle}>
								{t("tasksModule.taskSteps")}
							</div>
							{task.steps.map((step, i) => (
								<Grid
									container
									className={classes.stepContainer}
									key={i}
									justify="center"
								>
									<Grid item xs={2} sm={1} className={classes.stepGridItem}>
										<div className={classes.stepOrder}>{step.order}</div>
									</Grid>
									<Grid item xs={8} sm={10} className={classes.stepGridItem}>
										<div className={classes.stepDesc}>{step.description}</div>
									</Grid>
									{!task.isRepeatable && (
										<Can
											module="tasks"
											action="completeSteps"
											userList={[
												...task.relatedUsers.map((u) => u._id),
												task.owner._id,
											]}
										>
											<Grid item xs={2} sm={1} className={classes.stepGridItem}>
												<IconButton
													className={clsx(
														step.isCompleted && classes.stepCompletedTrue,
														classes.stepCompleted
													)}
													onClick={handleCompleteStep(step)}
												>
													<DoneIcon
														className={clsx(
															step.isCompleted && classes.stepCompletedTrueIcon,
															classes.stepCompletedIcon
														)}
													/>
												</IconButton>
											</Grid>
										</Can>
									)}
								</Grid>
							))}
						</div>
					)}
					{Boolean(task.images.length) && (
						<Carousel
							images={task.images}
							isOpen={Boolean(task.images.length)}
							size={300}
						/>
					)}
				</Grid>
				<Grid
					item
					xs={12}
					sm={12}
					md={4}
					lg={3}
					xl={3}
					className={classes.leftContainer}
				>
					<div className={classes.owner}>
						<UserItem
							user={task.owner}
							showTitle
							showPhone
							showName
							size={12}
							avatarSize={50}
						/>
					</div>
					<UserList
						users={task.relatedUsers}
						removeTooltip={t("tasksModule.controls.removeRelatedUser")}
						addTooltip={t("tasksModule.controls.addRelatedUser")}
						placeholder={t("tasksModule.noRelatedUsers")}
						title={t("tasksModule.relatedUsers")}
						handleRemove={removeRelatedUser}
						handleAdd={() => setAddRelatedUserModal(true)}
						module={"tasks"}
						owner={task.owner}
					/>
				</Grid>
				{!task.isRepeatable && (
					<Grid item xs={12} className={classes.comments}>
						<CommentSection
							parent={task}
							saveComment={handleSaveComment}
							updateComment={handleUpdateComment}
							module={"tasks"}
						/>
					</Grid>
				)}
			</Grid>
			{changeOwner && (
				<UpdateOwner
					handleClose={() => setChangeOwner(false)}
					handleSave={updateOwner}
					isOpen={changeOwner}
					currentOwner={task.owner}
					title={t("tasksModule.updateOwner")}
					instructions={t("tasksModule.updateOwnerInstructions")}
				/>
			)}
			{changeStatus && (
				<UpdateStatus
					handleClose={() => setChangeStatus(false)}
					handleSave={handleChangeStatus}
					isOpen={changeStatus}
					currentStatus={task.status}
					title={t("tasksModule.changeStatus")}
					instructions={t("tasksModule.changeStatusInstructions")}
					module={"tasks"}
				/>
			)}
			{addRelatedUserModal && (
				<AddRelatedUser
					handleClose={() => setAddRelatedUserModal(false)}
					handleSave={addRelatedUser}
					isOpen={addRelatedUserModal}
					followerList={[...task.relatedUsers, task.owner]}
					title={t("tasksModule.addRelatedUser")}
					instructions={t("tasksModule.addRelatedUserInstructions")}
				/>
			)}

			{Boolean(scheduling) && (
				<Scheduler
					scData={task.schedule}
					handleClose={() => setScheduling(null)}
					handleSave={handleUpdateSchedule}
				/>
			)}
		</React.Fragment>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		overflowY: "overlay",
		height: "100%",
		[theme.breakpoints.down("sm")]: {
			height: "calc(100% - 64px)",
		},
	},
	rightContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		padding: "0 30px",
		[theme.breakpoints.down("sm")]: {
			alignItems: "center",
			padding: "0 15px",
		},
	},
	asset: {
		color: "white",
		fontSize: "16px",
		background: "black",
		width: "fit-content",
		padding: "10px 20px",
		borderRadius: "50px",
		boxShadow: "rgba(0,0,0,0.25) 0 0 5px 2px",
		textAlign: "center",
		whiteSpace: "nowrap",
	},
	system: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "fit-content",
		color: "white",
		borderRadius: "50px",
		padding: "10px 20px",
		background: "rgba(0,0,0,0.3)",
		whiteSpace: "nowrap",
		margin: "10px 0",
	},
	location: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "fit-content",
		color: "white",
		borderRadius: "50px",
		padding: "10px 20px",
		background: "rgba(255,255,255,0.2)",
		whiteSpace: "nowrap",
		margin: "0px 0",
	},
	systemIcon: {
		margin: "0 10px 0 0",
		fontSize: "18px",
	},
	title: {
		color: "white",
		fontSize: "22px",
		padding: "15px 0",
		alignSelf: "flex-end",
		width: "100%",
		marginTop: "20px",
	},
	desc: {
		background: "rgba(0,0,0,0.4)",
		borderRadius: "10px",
		padding: "20px",
		color: "white",
		width: "90%",
		wordBreak: "break-word",
	},
	leftContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "flex-end",
		padding: "10px 30px",
		[theme.breakpoints.down("sm")]: {
			alignItems: "center",
			padding: "10px 15px",
		},
	},
	owner: {
		background: "rgba(0,0,0,0.4)",
		padding: "5px 30px",
		borderRadius: "10px",
		width: "fit-content",
		height: "70px",
	},
	controls: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "20px 30px 0px 30px",
		[theme.breakpoints.down("sm")]: {
			padding: "20px 15px 0px",
		},
	},
	topHeaderGriditem: {
		display: "flex",
		justifyContent: "space-between",
		margin: "10px 0",
		width: "100%",
		[theme.breakpoints.down("sm")]: {
			border: "1px solid rgba(255,255,255,0.2)",
			background: "black",
			borderRadius: "50px",
			padding: "5px 5px 5px 25px",
		},
	},
	controlsGriditem: {
		display: "flex",
		justifyContent: "flex-end",
		margin: "10px 0",
	},
	taskId: {
		padding: "5px 0",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	linked: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		background: "rgba(0,0,0,0.4)",
		margin: "10px 0",
		borderRadius: "10px",
		padding: "10px 0",
		height: "300px",
	},
	linkedHeader: {
		color: "white",
		fontSize: "16px",
		padding: "5px",
		margin: "0px auto",
		width: "80%",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
	},
	followingList: {
		padding: "5px",
		overflowY: "auto",
	},
	listItem: {
		width: "250px",
		borderRadius: "5px",
		"&:hover": {
			background: "rgba(0,0,0,0.4)",
		},
	},
	removeUser: {
		color: "white",
		"&:hover": {
			background: "rgba(0,0,0,0.3)",
		},
	},
	itemDates: {
		margin: "0 0 20px",
	},
	openDate: {
		color: "white",
		fontSize: "14px",
		padding: "7px 15px",
		background: "rgba(0,0,0,0.4)",
		width: "fit-content",
		borderRadius: "50px",
		[theme.breakpoints.down("sm")]: {
			fontSize: "11px",
			padding: "4px 15px",
		},
	},
	closedDate: {
		color: "white",
		fontSize: "14px",
		margin: "10px 0",
		padding: "7px 15px",
		background: "green",
		width: "fit-content",
		borderRadius: "50px",
		[theme.breakpoints.down("sm")]: {
			fontSize: "11px",
			padding: "4px 15px",
		},
	},
	comments: {
		background: "rgba(0,0,0,0.4)",
	},
	status: {
		margin: "10px 0",
	},
	timeActive: {
		display: "flex",
		justifyContent: "flex-start",
		padding: "20px 0 0",
	},
	stepsContainer: {
		color: "white",
		background: "rgba(0,0,0,0.4)",
		borderRadius: "10px",
		width: "90%",
		margin: "10px 0",
		padding: "10px 20px",
		[theme.breakpoints.down("sm")]: {
			padding: "10px 0",
			width: "100%",
		},
	},
	stepsTitle: {
		borderBottom: "1px solid rgba(255,255,255,0.2)",
		padding: "10px",
		fontSize: "16px",
		marginBottom: "10px",
	},
	stepContainer: {
		padding: "5px",
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-start",
	},
	stepOrder: {
		background: "black",
		height: "40px",
		width: "40px",
		borderRadius: "50px",
		display: "grid",
		placeItems: "center",
		margin: "auto",
		[theme.breakpoints.down("sm")]: {
			fontSize: "14px",
		},
	},
	stepDesc: {
		background: "rgba(0,0,0,0.2)",
		borderRadius: "50px",
		padding: "10px 20px",
		border: "1px solid rgba(255,255,255,0.2)",
		margin: "0 5px",
		width: "-webkit-fill-available",
		[theme.breakpoints.down("sm")]: {
			fontSize: "13px",
		},
	},
	stepCompleted: {
		border: "1px solid rgba(255,255,255,0.2)",
		padding: "6px",
		"&:hover": {
			background: "transparent",
		},
	},
	stepCompletedIcon: {
		color: "rgba(255,255,255,0.2)",
	},
	stepCompletedTrue: {
		background: "green",
		"&:hover": {
			background: "green",
		},
	},
	stepCompletedTrueIcon: {
		color: "white",
	},
	stepGridItem: {
		display: "grid",
		placeItems: "center",
	},
	repeatableContainer: {
		width: "fit-content",
		padding: "10px 30px",
		color: "white",
		background: "rgba(200,50,0,0.7)",
		borderRadius: "5px",
	},
	repeatableMark: {
		fontSize: "20px",
		margin: "5px 0",
	},
	repeatableMarkInstructions: {
		fontSize: "14px",
		color: "rgba(255,255,255,0.7)",
		margin: "5px 0",
	},
	taskSchedulesContainer: {
		background: "rgba(0,0,0,0.4)",
		borderRadius: "10px",
		padding: "10px 20px",
		color: "white",
		width: "90%",
		margin: "10px 0",
	},
	schedulesTitle: {
		fontSize: "20px",
		padding: "10px",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
		marginBottom: "10px",
	},
	scheduleContainer: {
		borderRadius: "10px",
	},
	schedulesItem: {
		border: "1px solid rgba(255,255,255,0.2)",
		borderRadius: "10px",
		padding: "10px 20px",
		margin: "10px",
	},
	scheduleGridItem: {
		padding: "5px",
	},
	scheduleTitle: {
		fontSize: "14px",
		padding: "5px 0",
		color: "rgba(255,255,255,0.6)",
	},
	scheduleData: {
		fontSize: "18px",
	},
	notAssigned: {
		filter: "brightness(60%)",
	},
}));
