import React, { useState, useContext } from 'react';
import { Grid, makeStyles, Collapse, Tooltip, IconButton, useMediaQuery, Fade } from '@material-ui/core';
import { UserItem } from '../../user/UserItem';
import { getFullName } from '../../../api/genericApi';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import { useTranslation } from 'react-i18next';
import { AlertDialog } from '../../reuseables/AlertDialog';
import { addUser, removeSystemUser } from '../../../api/systemsApi';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import { AddRelatedUser } from './AddRelatedUser';
import { Can } from '../../reuseables/Can';
import { SnackbarContext } from '../../../context/SnackbarContext';

export const SystemRelatedUsers = ({ userList, data, setData, systemId, isOpen }) => {
	const classes = useStyles();
    const downSm = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const { setSnackbar } = useContext(SnackbarContext);
	const [relatedUsers, setRelatedUsers] = useState(userList || []);
	const [showControls, setShowControls] = useState(null);
	const [showAddRelatedUser, setShowAddRelatedUser] = useState(false);
	const [alertDialog, setAlertDialog] = useState(null);
	const { t, i18n } = useTranslation();

	const confirmRemove = (relatedUser) => (event) => {
		event.stopPropagation();
		let toRemove = relatedUsers.find((user) => user._id === relatedUser._id);
		setAlertDialog({
			text: `${t('systemsModule.userRemoveConfirmText')} ${getFullName(toRemove)}?`,
			title: t('systemsModule.userRemoveConfirmTitle'),
			handleConfirm: async () => {
				const res = await removeSystemUser(systemId, relatedUser._id);
				if (res.status === 403) {
                    setSnackbar(res)
                } else if (res) {
					setData(res);
					setAlertDialog(null);
					setRelatedUsers([]);
					setRelatedUsers(res.relatedUsers);
				}
			},
			handleCancel: () => setAlertDialog(null),
		});
	};

	const handleAddRelatedUser = () => {
		if (showAddRelatedUser) {
			setShowAddRelatedUser(false);
			return;
		}
		setShowAddRelatedUser(true);
	};

	const handleAddLinekdUser = async (userId) => {
		const res = await addUser(systemId, userId);
		if (res.status === 403) {
			setSnackbar(res)
		} else if (res) {
			setData(res);
			setRelatedUsers(res.relatedUsers);
			setShowAddRelatedUser(false);
		}
	};

	return (
		<Collapse in={isOpen}>
			<div className={classes.linkedusers}>
				<Grid container justify="flex-start" className={classes.container} alignItems="center">
					<Grid item xs={12} className={classes.titleContainer}>
						<div className={classes.title}>{t('systemsModule.assignedUsers')}</div>
						<Can
							module="systems"
                            action="changeRelatedUsers"
							userList={[...data.relatedUsers.map((u) => u._id), data.owner]}
						>
							<IconButton className={classes.addBtn} onClick={handleAddRelatedUser}>
								<AddRoundedIcon className={classes.icon} />
							</IconButton>

							{showAddRelatedUser && (
								<AddRelatedUser
									isOpen={showAddRelatedUser}
									handleClose={handleAddRelatedUser}
									relatedUsers={relatedUsers}
									handleSave={handleAddLinekdUser}
								/>
							)}
						</Can>
					</Grid>
					{relatedUsers.length ? (
						relatedUsers.map((relatedUser, i) => {
							return (
								<Grid item xs={12} sm={7} md={6} lg={3} className={classes.gridItem}>
									<div
										className={classes.userCont}
										onMouseEnter={() => setShowControls(i)}
										onMouseLeave={() => setShowControls(null)}
										key={i}
									>
										<UserItem
											user={relatedUser}
											showTitle
											showPhone
											showName
											avatarSize={'50px'}
											size={12}
										/>
										<Can
											module="systems"
											action="changeRelatedUsers"
											userList={[...data.relatedUsers.map((u) => u._id), data.owner]}
										>
											<Fade in={showControls === i || downSm}>
												<Tooltip title={t('systemsModule.removeUser')}>
													<IconButton
														className={classes.removeuser}
														onClick={confirmRemove(relatedUser)}
													>
														<ClearRoundedIcon className={classes.icon} />
													</IconButton>
												</Tooltip>
											</Fade>
										</Can>
									</div>
								</Grid>
							);
						})
					) : (
						<div className={classes.noUsers}>{t('systemsModule.noUsersAssigned')}</div>
					)}
					{Boolean(alertDialog) && <AlertDialog alertDialog={alertDialog} open={Boolean(alertDialog)} />}
				</Grid>
			</div>
		</Collapse>
	);
};

const useStyles = makeStyles((theme) => ({
	linkedusers: {
		width: 'auto',
		margin: '10px',
		borderRadius: '25px',
		background: 'rgba(0,0,0,0.1)',
		boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.2)',
	},
	container: {
		width: 'auto',
		padding: '5px',
		background: 'rgba(0,0,0,0.4)',
		borderRadius: '5px',
		border: '1px solid rgba(255,255,255,0.2)',
	},
	gridItem: {
		borderRadius: '10px',
		padding: '5px 10px',
		margin: '5px',
		'&:hover': {
			background: 'rgba(0,0,0,0.5)',
			boxShadow: '-0px 0px 5px 2px rgba(0,0,0,0.2)',
		},
	},
	titleContainer: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottom: '1px solid rgba(255,255,255,0.2)',
		margin: '0 10px',
		padding: '5px 5px 10px',
	},
	addBtn: {
		fontSize: '20px',
		color: 'white',
		border: '1px solid rgba(255,255,255,0.2)',
		padding: '2px',
		borderRadius: '50px',
		'&:hover': {
			background: 'rgba(0,0,0,0.2)',
		},
	},
	cell: {
		color: 'white',
		textAlign: 'center',
	},
	userCont: {
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between',
		padding: '5px 10px',
		position: 'relative',
	},
	removeuser: {
		padding: '4px',
		margin: 'auto 4px',
		height: '50%',
		'&:hover': {
			background: 'rgba(255,255,255,0.1)',
		},
	},
	icon: {
		fontSize: '20px',
		color: 'white',
		padding: '8px',
	},
	title: {
		color: 'white',
		fontSize: '16px',
	},
	noUsers: {
		margin: '10px',
		padding: '0px 0 15px',
		color: 'white',
		fontSize: '14px',
		background: 'rgba(0,0,0,0.4)',
		padding: '10px 20px',
		borderRadius: '25px',
	},
}));
