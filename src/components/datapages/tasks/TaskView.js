import {
	Grid,
	LinearProgress,
	makeStyles,
	useMediaQuery,
} from '@material-ui/core';
import dateFormat from 'dateformat';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router';
import { getFullAddress } from '../../../api/assetsApi';
import {
	getTask,
	updateTaskOwner,
	updateTaskStatus,
	saveTaskComment,
	updateTaskComment,
	addTaskRelatedUser,
	removeTaskRelatedUser,
	updateTask,
	updateTaskSchedule
} from '../../../api/tasksApi';
import { LanguageContext } from '../../../context/LanguageContext';
import { AddRelatedUser } from '../../reuseables/AddRelatedUser';
import { Carousel } from '../../reuseables/Carousel';
import { CommentSection } from '../../reuseables/CommentSection';
import { ItemLink } from '../../reuseables/ItemLink';
import { StatusTag } from '../../reuseables/StatusTag';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import BlurOnRoundedIcon from '@material-ui/icons/BlurOnRounded';
import { UpdateOwner } from '../../reuseables/UpdateOwner';
import { UpdateStatus } from '../../reuseables/UpdateStatus';
import { UserList } from '../../reuseables/UserList';
import { UserItem } from '../../user/UserItem';
import { UpsertTask } from './UpsertTask';
import { TaskViewControls } from './TaskViewControls';
import { TimeActive } from '../../reuseables/TimeActive';
import { Scheduler } from '../../reuseables/scheduler/Scheduler';
import { SnackbarContext } from '../../../context/SnackbarContext';
import { format, parseISO } from 'date-fns';

export const TaskView = () => {
	const history = useHistory();
	const location = useLocation();
	const { t } = useTranslation();
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);
	const { setSnackbar } = useContext(SnackbarContext);
	const downSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));
	const [task, setTask] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const { taskId } = useParams();
	const [editTask, setEditTask] = useState(null);
	const [changeOwner, setChangeOwner] = useState(false);
	const [addRelatedUserModal, setAddRelatedUserModal] = useState(null);
    const [changeStatus, setChangeStatus] = useState(null);
    const [ scheduling, setScheduling ] = useState(null)

	useEffect(() => {
		getTask(taskId)
		.then((res) => {
			if (!res) {
				history.push('/workspace/tasks');
			} else if (res.status === 403) {
				setSnackbar(res);
				history.push('/workspace/tasks');
			}
			setTask(res);
		})
		.finally(() => {
			setIsLoading(false);
		});
	}, []);

	const updateTaskDetails = (details) => {
		updateTask(details)
			.then((res) => {
				if (res.status === 403) {
					setSnackbar(res);
				} else if (res) {
					if (location.pathname === `/workspace/tasks/${res.taskId}`) {
						setTask(res);
					} else {
						history.push(`/workspace/tasks/${res.taskId}`);
					}
				}
				setEditTask(null);
				return;
			})
			.catch((e) => {
				console.log(e.message);
				history.push(`/workspace/tasks`);
			});
	};

	const updateOwner = (userId) => {
		updateTaskOwner(task._id, userId)
		.then((res) => {
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

	const handleSaveComment = async (taskId, userId, text) => {
		const res = await saveTaskComment(taskId, userId, text);
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
				schedule: res.schedule
			})
		}
	}
	return isLoading ? (
		<LinearProgress />
	) : (
		<React.Fragment>
			<Grid
				container
				className={classes.container}
				justify="space-between"
				alignItems="flex-start"
			>
				<Grid container className={classes.controls}>
					{task.asset && (
						<Grid item xs={12}>
							<div className={classes.asset}>
								{getFullAddress(task.asset)}
							</div>
						</Grid>
					)}
					{task.system && (
						<Grid item xs={12} className={classes.systemItem}>
							<div className={classes.system}>
								<BlurOnRoundedIcon
									className={classes.systemIcon}
								/>
								{task.system.name}
							</div>
						</Grid>
					)}
					{!task.asset && (
						<Grid item xs={12}>
							<div className={classes.taskNotLinkedToAsset}>
								<InfoOutlinedIcon
									className={classes.infoIcon}
								/>
								{t('tasksModule.taskNotLinkedToAsset')}
							</div>
						</Grid>
					)}
					<Grid item xs={12} className={classes.controlsGriditem}>
						<div className={classes.taskId}>
							<ItemLink
								itemId={task.taskId}
								module={'tasks'}
								size={18}
							/>
						</div>
						<TaskViewControls
							task={task}
							editTask={() => setEditTask(task._id)}
							updateOwner={() => setChangeOwner(true)}
                            changeStatus={() => setChangeStatus(true)}
                            handleScheduler={() => setScheduling(true)}
						/>
					</Grid>
					{
						!task.isRepeatable ?
						<Grid item xs={12} className={classes.controlsGriditem}>
							<StatusTag
								status={task.status}
								type="task"
								size={'16px'}
							/>
						</Grid> :
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
					}
					
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
					<div className={classes.title}>{task.title}</div>
					<div className={classes.desc}>
						<div className={classes.openDate}>
							{`${t('general.createDate')} ${format(
								parseISO(task.createdAt),
								lang.dateformat
							)}`}
						</div>
						{task.description}
						<div className={classes.timeActive}>
							<TimeActive createDate={task.createdAt} />
						</div>
					</div>
					{Boolean(task.steps.length) && (

						<div className={classes.stepsContainer}>
							<div className={classes.stepsTitle}>
								{t('tasksModule.taskSteps')}
							</div>
							{task.steps.map((step, i) => (
								<Grid
									container
									className={classes.stepContainer}
									key={i}
								>
									<Grid item xs={2} xl={1}>
										<div className={classes.stepOrder}>
											{step.order}
										</div>
									</Grid>
									<Grid item xs={10} xl={11}>
										<div className={classes.stepDesc}>
											{step.description}
										</div>
									</Grid>
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
						removeTooltip={t(
							'tasksModule.controls.removeRelatedUser'
						)}
						addTooltip={t('tasksModule.controls.addRelatedUser')}
						placeholder={t('tasksModule.noRelatedUsers')}
						title={t('tasksModule.relatedUsers')}
						handleRemove={removeRelatedUser}
						handleAdd={() => setAddRelatedUserModal(true)}
						module={'tasks'}
						owner={task.owner}
					/>
				</Grid>
				{
					!task.isRepeatable &&
					<Grid item xs={12} className={classes.comments}>
						<CommentSection
							parent={task}
							saveComment={handleSaveComment}
							updateComment={handleUpdateComment}
							module={'tasks'}
						/>
					</Grid>
				}
				
			</Grid>
			{changeOwner && (
				<UpdateOwner
					handleClose={() => setChangeOwner(false)}
					handleSave={updateOwner}
					isOpen={changeOwner}
					currentOwner={task.owner}
					title={t('tasksModule.updateOwner')}
					instructions={t('tasksModule.updateOwnerInstructions')}
				/>
			)}
			{changeStatus && (
				<UpdateStatus
					handleClose={() => setChangeStatus(false)}
					handleSave={handleChangeStatus}
					isOpen={changeStatus}
					currentStatus={task.status}
					title={t('tasksModule.changeStatus')}
					instructions={t('tasksModule.changeStatusInstructions')}
					module={'tasks'}
				/>
			)}
			{addRelatedUserModal && (
				<AddRelatedUser
					handleClose={() => setAddRelatedUserModal(false)}
					handleSave={addRelatedUser}
					isOpen={addRelatedUserModal}
					followerList={[...task.relatedUsers, task.owner]}
					title={t('tasksModule.addRelatedUser')}
					instructions={t('tasksModule.addRelatedUserInstructions')}
				/>
			)}
			{Boolean(editTask) && (
				<UpsertTask
					taskId={editTask}
					handleClose={() => setEditTask(null)}
					handleUpdate={updateTaskDetails}
				/>
			)}
            {
                Boolean(scheduling) &&
                <Scheduler 
                    scData={task.schedule}
					handleClose={() => setScheduling(null)}
					handleSave={handleUpdateSchedule}
                />
            }
		</React.Fragment>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		overflowY: 'overlay',
		height: '100%',
		[theme.breakpoints.down('sm')]: {
			height: 'calc(100% - 64px)',
		},
	},
	rightContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		padding: '0 30px',
		[theme.breakpoints.down('sm')]: {
			alignItems: 'center',
			padding: '0 15px',
		},
	},
	asset: {
		color: 'white',
		fontSize: '16px',
		background: 'black',
		padding: '10px 20px',
		borderRadius: '5px',
		boxShadow: 'rgba(0,0,0,0.25) 0 0 5px 2px',
		textAlign: 'center',
	},
	systemItem: {
		display: 'flex',
		justifyContent: 'center',
	},
	system: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: 'fit-content',
		color: 'white',
		borderRadius: '0 0 50px 50px',
		padding: '5px 80px 5px 60px',
		background: 'rgba(0,0,0,0.3)',
		whiteSpace: 'nowrap',
	},
	systemIcon: {
		margin: '0 10px',
	},
	title: {
		color: 'white',
		fontSize: '22px',
		padding: '15px 0',
		alignSelf: 'flex-end',
		width: '100%',
	},
	desc: {
		background: 'rgba(0,0,0,0.4)',
		borderRadius: '10px',
		padding: '20px',
		color: 'white',
		width: '90%',
		wordBreak: 'break-word',
	},
	leftContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-end',
		padding: '10px 30px',
		[theme.breakpoints.down('sm')]: {
			alignItems: 'center',
			padding: '10px 15px',
		},
	},
	owner: {
		background: 'rgba(0,0,0,0.4)',
		padding: '5px 30px',
		borderRadius: '10px',
		width: 'fit-content',
		height: '70px',
	},
	controls: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '20px 30px 0px 30px',
		[theme.breakpoints.down('sm')]: {
			padding: '20px 15px 0px',
		},
	},
	controlsGriditem: {
		display: 'flex',
		justifyContent: 'space-between',
		margin: '20px 0 0px',
	},
	taskId: {
		padding: '5px 0',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	linked: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		background: 'rgba(0,0,0,0.4)',
		margin: '10px 0',
		borderRadius: '10px',
		padding: '10px 0',
		height: '300px',
	},
	linkedHeader: {
		color: 'white',
		fontSize: '16px',
		padding: '5px',
		margin: '0px auto',
		width: '80%',
		borderBottom: '1px solid rgba(255,255,255,0.2)',
	},
	followingList: {
		padding: '5px',
		overflowY: 'auto',
	},
	listItem: {
		width: '250px',
		borderRadius: '5px',
		'&:hover': {
			background: 'rgba(0,0,0,0.4)',
		},
	},
	removeUser: {
		color: 'white',
		'&:hover': {
			background: 'rgba(0,0,0,0.3)',
		},
	},
	openDate: {
		color: 'white',
		fontSize: '14px',
		margin: '0 0 15px 0px',
		padding: '7px 15px',
		background: 'rgba(0,0,0,0.4)',
		width: 'fit-content',
		borderRadius: '50px',
	},
	comments: {
		background: 'rgba(0,0,0,0.4)',
		margin: '20px 30px',
		borderRadius: '10px',
		[theme.breakpoints.down('sm')]: {
			margin: '20px 0px',
		},
	},
	status: {
		margin: '10px 0',
	},
	timeActive: {
		display: 'flex',
		justifyContent: 'flex-start',
		padding: '20px 0 0',
	},
	stepsContainer: {
		color: 'white',
		background: 'rgba(0,0,0,0.4)',
		borderRadius: '10px',
		width: '90%',
		margin: '10px 0',
		padding: '10px 20px',
	},
	stepsTitle: {
		borderBottom: '1px solid rgba(255,255,255,0.2)',
		padding: '10px',
		fontSize: '16px',
		marginBottom: '10px',
	},
	stepContainer: {
		padding: '5px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	stepOrder: {
		background: 'black',
		height: '40px',
		width: '40px',
		borderRadius: '50px',
		display: 'grid',
		placeItems: 'center',
		margin: 'auto',
	},
	stepDesc: {
		background: 'rgba(0,0,0,0.2)',
		borderRadius: '50px',
		padding: '10px 20px',
		border: '1px solid rgba(255,255,255,0.2)',
		margin: '0 5px',
		[theme.breakpoints.down('sm')]: {
			fontSize: '13px',
		},
	},
	repeatableContainer : {
		width: 'fit-content',
		padding: '10px 30px',
		color: 'white',
		background: 'rgba(200,50,0,0.7)',
		borderRadius: '5px'
	},
	repeatableMark: {
		fontSize: '20px',
		margin: '5px 0'
	},
	repeatableMarkInstructions: {
		fontSize: '14px',
		color: 'rgba(255,255,255,0.7)',
		margin: '5px 0'
	}
}));
