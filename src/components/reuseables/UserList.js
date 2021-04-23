import {
	IconButton,
	List,
	ListItem,
	makeStyles,
	Tooltip,
	useMediaQuery,
} from '@material-ui/core';
import { ClearRounded } from '@material-ui/icons';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFullName } from '../../api/genericApi';
import { UserItem } from '../user/UserItem';
import { AlertDialog } from './AlertDialog';
import { Can } from './Can';

export const UserList = ({
	users,
	handleRemove,
	removeTooltip,
	handleAdd,
	addTooltip,
	title,
	placeholder,
    module,
    owner
}) => {
	const classes = useStyles();
	const downSm = useMediaQuery((theme) => theme.breakpoints.down('md'));
	const { t } = useTranslation();
	const [userList, setUserList] = useState(users || []);
	const [liHover, setLiHover] = useState(null);
	const [alertDialog, setAlertDialog] = useState(null);

	useEffect(() => {
		setUserList(users);
	}, [users]);

	useEffect(() => {
		console.log(alertDialog);
	}, [alertDialog]);

	const toggleHover = (index) => (event) => {
		event.stopPropagation();
		setLiHover(index);
	};

	const removeUser = (user) => (event) => {
		setAlertDialog({
			handleConfirm: async () => {
				const res = await handleRemove(user._id);
				setAlertDialog(null);
			},
			handleCancel: () => setAlertDialog(null),
			text: `${t('general.removeUserConfirmation.part1')} ${getFullName(
				user
			)} ${t('general.removeUserConfirmation.part2')}?`,
			title: `${t('general.removeUserFromFollowing')}`,
		});
	};
	return (
		<div
			className={classes.linked}
			style={{ minWidth: `200px`, width: '100%' }}
		>
			<div className={classes.topRow}>
				<div className={classes.linkedHeader}>{title}</div>
				<Can module={module} action={'changeRelatedUsers'} userList={[...users.map(u => u._id), owner._id]} >
					<Tooltip title={addTooltip}>
						<IconButton
							className={classes.addUser}
							onClick={handleAdd}
						>
							<AddRoundedIcon className={classes.icon} />
						</IconButton>
					</Tooltip>
				</Can>
			</div>

			<List className={classes.followingList}>
				{Boolean(userList.length) ? (
					userList.map((user, i) => (
						<ListItem
							key={i}
							className={classes.listItem}
							onMouseEnter={toggleHover(i)}
							onMouseLeave={() => setLiHover(null)}
						>
							<UserItem
								user={user}
								avatarSize={40}
								size={11}
								showTitle
								showPhone
								showName
							/>
                            <Can module={module} action={'changeRelatedUsers'} userList={[...users.map(u => u._id), owner._id]}>
                                {(liHover === i || downSm) && (
                                    <Tooltip title={removeTooltip}>
                                        <IconButton
                                            className={classes.removeUser}
                                            onClick={removeUser(user)}
                                        >
                                            <ClearRounded
                                                className={classes.icon}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Can>
							
						</ListItem>
					))
				) : (
					<ListItem className={classes.placeholder}>
						{placeholder}
					</ListItem>
				)}
			</List>
			{Boolean(alertDialog) && (
				<AlertDialog
					isOpen={Boolean(alertDialog)}
					alertDialog={alertDialog}
				/>
			)}
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
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
	topRow: {
		margin: '0px auto',
		width: '90%',
		borderBottom: '1px solid rgba(255,255,255,0.2)',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	linkedHeader: {
		color: 'white',
		fontSize: '16px',
		padding: '5px 5px 10px',
	},
	followingList: {
		padding: '5px 0',
		overflowY: 'auto',
	},
	listItem: {
		width: '100%',
		borderRadius: '5px',
		padding: '8px',
		display: 'flex',
		justifyContent: 'space-between',
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
	addUser: {
		color: 'white',
		border: '1px solid rgba(255,255,255,0.2)',
		padding: '5px',
		margin: '0 0 10px 0',
	},
	icon: {
		fontSize: '20px',
	},
	placeholder: {
		background: 'rgba(0,0,0,0.4)',
		borderRadius: '25px',
		color: 'white',
		padding: '10px 20px',
		width: '90%',
		margin: '10px auto',
		fontSize: '13px',
	},
}));
