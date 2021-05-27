import {
	Grid,
	LinearProgress,
	makeStyles,
	useMediaQuery,
} from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import dateFormat from 'dateformat';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router';
import { getFullAddress } from '../../../api/assetsApi';
import * as faultApi from '../../../api/faultsApi';
import { LanguageContext } from '../../../context/LanguageContext';
import { SnackbarContext } from '../../../context/SnackbarContext';
import { AddRelatedUser } from '../../reuseables/AddRelatedUser';
import { Can } from '../../reuseables/Can';
import { Carousel } from '../../reuseables/Carousel';
import { CommentSection } from '../../reuseables/CommentSection';
import { StatusTag } from '../../reuseables/StatusTag';
import { UpdateOwner } from '../../reuseables/UpdateOwner';
import { UpdateStatus } from '../../reuseables/UpdateStatus';
import { UserList } from '../../reuseables/UserList';
import { UserItem } from '../../user/UserItem';
import { FaultLink } from './FaultLink';
import { FaultViewControls } from './FaultViewControls';
import { UpsertFault } from './UpsertFault';
import BlurOnRoundedIcon from '@material-ui/icons/BlurOnRounded';

export const FaultView = ({ fid, faultData, updateFaultState }) => {
	const history = useHistory();
	const location = useLocation();
	const { t } = useTranslation();
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);
	const { setSnackbar } = useContext(SnackbarContext);
	const downSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));
	const [fault, setFault] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const { faultId } = useParams();
	const [editFault, setEditFault] = useState(null);
	const [changeOwner, setChangeOwner] = useState(false);
	const [addRelatedUserModal, setAddRelatedUserModal] = useState(null);
	const [changeStatus, setChangeStatus] = useState(null);

	useEffect(() => {
		if (fault) {
			setIsLoading(false);
		}
	}, [fault]);

	useEffect(() => {
		if (faultData) {
			setFault(faultData);
			setIsLoading(false);
			return;
		}
		faultApi.getFault(faultId || fid, false).then((res) => {
			if (!res) {
				history.push('/workspace/faults');
			} else if (res.status === 403) {
				setSnackbar(res);
				history.push('/workspace/faults');
			}
			setFault(res);
		});
	}, [faultData, faultId]);

	const updateFaultDetails = (details) => {
		faultApi
			.updateFault(details)
			.then((res) => {
				if (res.status === 403) {
					setSnackbar(res);
				} else if (res) {
					if (
						location.pathname === `/workspace/faults/${res.faultId}`
					) {
						setFault(res);
					} else {
						history.push(`/workspace/faults/${res.faultId}`);
					}
				}
				setEditFault(null);
				return;
			})
			.catch((e) => {
				console.log(e.message);
				history.push(`/workspace/faults`);
			});
	};

	const updateOwner = (userId) => {
		faultApi.updateFaultOwner(fault._id, userId).then((res) => {
			if (res.status === 403) {
				setSnackbar(res);
			} else {
				setFault({
					...fault,
					owner: res.owner,
					relatedUsers: res.relatedUsers,
				});
				if (updateFaultState) {
					updateFaultState(res._id, 'owner', res.owner);
				}
			}
			setChangeOwner(false);
		});
	};

	const removeRelatedUser = async (userId) => {
		const res = await faultApi.removeRelatedUser(fault._id, userId);
		if (res.status === 403) {
			setSnackbar(res);
		} else if (res) {
			setFault({
				...fault,
				relatedUsers: res.relatedUsers,
			});
			if (updateFaultState) {
				updateFaultState(res._id, 'relatedUsers', res.relatedUsers);
			}
		}
	};

	const addRelatedUser = (userId) => async (event) => {
		event.stopPropagation();
		const res = await faultApi.addRelatedUser(fault._id, userId);
		if (res.status === 403) {
			setSnackbar(res);
		} else if (res) {
			setFault({
				...fault,
				relatedUsers: res.relatedUsers,
			});
			if (updateFaultState) {
				updateFaultState(res._id, 'relatedUsers', res.relatedUsers);
			}
		}
		setAddRelatedUserModal(null);
	};

	const handleChangeStatus = async (statusId) => {
		const res = await faultApi.updateFaultStatus(fault._id, statusId);
		if (res.status === 403) {
			setSnackbar(res);
		} else if (res) {
			setFault({
				...fault,
				status: res.status,
			});
			if (updateFaultState) {
				updateFaultState(res._id, 'status', res.status);
			}
		}
		setChangeStatus(null);
	};

	const handleSaveComment = async (faultId, userId, text, image) => {
		const res = await faultApi.saveFaultComment(faultId, userId, text, image);
		if (res.status === 403) {
			setSnackbar(res);
			return Promise.resolve(null);
		} else if (res) {
			if (updateFaultState) {
				updateFaultState(res._id, 'comments', res.comments);
			}
		}
		return Promise.resolve(res);
	};

	const handleUpdateComment = async (faultId, commentId, text) => {
		const res = await faultApi.updateFaultComment(faultId, commentId, text);
		if (res.status === 403) {
			setSnackbar(res);
			return Promise.resolve(null);
		} else if (res) {
			if (updateFaultState) {
				updateFaultState(res._id, 'comments', res.comments);
			}
		}
		return Promise.resolve(res);
	};

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
					<Grid item xs={12} className={classes.controlsGriditem}>
						<div className={classes.faultId}>
							<FaultLink faultId={fault.faultId} size={18} />
						</div>
						<FaultViewControls
							fault={fault}
							editFault={() => setEditFault(fault._id)}
							updateOwner={() => setChangeOwner(true)}
							changeStatus={() => setChangeStatus(true)}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						className={classes.controlsGriditem}
						style={{
							justifyContent: downSm ? 'center' : 'flex-start', cursor: 'pointer'
						}}
						onClick={() => setChangeStatus(true)}
					>
						<StatusTag
							status={fault.status}
							type="fault"
							size={'16px'}
						/>
					</Grid>
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
					<div className={classes.asset}>
						{getFullAddress(fault.asset)}
					</div>
					<div className={classes.system}>
						<BlurOnRoundedIcon
							className={classes.systemIcon}
						/>
						{fault.system.name}
					</div>
					<div className={classes.title}>{fault.title}</div>
					<div className={classes.desc}>
						<div className={classes.openDate}>
							{`${t('faultsModule.createDate')} ${format(
								parseISO(fault.createdAt),
								lang.dateformat
							)}`}
						</div>
						{fault.description}
					</div>
					{Boolean(fault.images.length) && (
						<Carousel
							images={fault.images}
							isOpen={Boolean(fault.images.length)}
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
							user={fault.owner}
							showTitle
							showPhone
							showName
							size={12}
							avatarSize={50}
						/>
					</div>
					<UserList
						users={fault.relatedUsers}
						removeTooltip={t(
							'faultsModule.controls.removeRelatedUser'
						)}
						addTooltip={t('faultsModule.controls.addRelatedUser')}
						placeholder={t('faultsModule.noRelatedUsers')}
						title={t('faultsModule.relatedUsers')}
						handleRemove={removeRelatedUser}
						handleAdd={() => setAddRelatedUserModal(true)}
						module={'faults'}
						owner={fault.owner}
					/>
				</Grid>
				<Grid item xs={12} className={classes.comments}>
					<CommentSection
						parent={fault}
						saveComment={handleSaveComment}
						updateComment={handleUpdateComment}
						module={'faults'}
					/>
				</Grid>
			</Grid>
			{
				changeOwner &&
				<UpdateOwner
					handleClose={() => setChangeOwner(false)}
					handleSave={updateOwner}
					isOpen={changeOwner}
					currentOwner={fault.owner}
					title={t('faultsModule.updateOwner')}
					instructions={t('faultsModule.updateOwnerInstructions')}
				/>
			}
			
			{changeStatus && (
				<UpdateStatus
					handleClose={() => setChangeStatus(false)}
					handleSave={handleChangeStatus}
					isOpen={changeStatus}
					currentStatus={fault.status}
					title={t('faultsModule.changeStatus')}
					instructions={t('faultsModule.changeStatusInstructions')}
					module={'faults'}
				/>
			)}
			{addRelatedUserModal && (
				<AddRelatedUser
					handleClose={() => setAddRelatedUserModal(false)}
					handleSave={addRelatedUser}
					isOpen={addRelatedUserModal}
					followerList={[...fault.relatedUsers, fault.owner]}
					title={t('faultsModule.addRelatedUser')}
					instructions={t('faultsModule.addRelatedUserInstructions')}
				/>
			)}

			{Boolean(editFault) && (
				<UpsertFault
					faultId={editFault}
					handleClose={() => setEditFault(null)}
					handleUpdate={updateFaultDetails}
				/>
			)}
		</React.Fragment>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		overflowY: 'overlay',
		height: '100%',
		[theme.breakpoints.down('sm')]: {
			height: 'auto',
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
		width: 'fit-content',
		padding: '10px 20px',
		borderRadius: '50px',
		boxShadow: 'rgba(0,0,0,0.25) 0 0 5px 2px',
		textAlign: 'center',
		whiteSpace: 'nowrap'
	},
	system: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: 'fit-content',
		color: 'white',
		borderRadius: '50px',
		padding: '10px 20px',
		background: 'rgba(0,0,0,0.3)',
		boxShadow: 'rgba(0,0,0,0.25) 0 0 5px 2px',
		whiteSpace: 'nowrap',
		margin: '10px 0'
	},
	systemIcon: {
		margin: '0 10px 0 0',
		fontSize: '18px',
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
		margin: '10px 0',
	},
	faultId: {
		padding: '10px 0',
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
	relatedUsersList: {
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
		
	},
	status: {
		margin: '10px 0',
	},
}));
