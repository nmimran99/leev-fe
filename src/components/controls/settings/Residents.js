import { Avatar, Grid, IconButton, List, ListItem, makeStyles, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFullName } from '../../../api/genericApi';
import { filterUsers, getResidentList } from '../../../api/userApi';
import { AuthContext } from '../../../context/AuthContext';
import { LanguageContext } from '../../../context/LanguageContext';
import { SnackbarContext } from '../../../context/SnackbarContext';
import { Can } from '../../reuseables/Can';
import { LoadingProgress } from '../../reuseables/LoadingProgress';
import { SearchBox } from '../../reuseables/SearchBox';
import { UpsertUser } from './UpsertUser';

export const Residents = () => {
	const classes = useStyles();
	const { t } = useTranslation();
	const { auth, setAuth } = useContext(AuthContext);
	const { lang } = useContext(LanguageContext);
	const { setSnackbar } = useContext(SnackbarContext);
	const [userList, setUserList] = useState([]);
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
    const [addUser, setAddUser] = useState(null);
    const [editUser, setEditUser] = useState(null)

	useEffect(() => {
		if (!isLoading) return;
		getResidentList()
			.then((res) => {
			
				if (res.status === 403) {
					setSnackbar(res);
					setIsLoading(false);
				} else if (res) {
					setUserList(res);
				}
			})
			.finally(() => setIsLoading(false));
	}, [isLoading]);

	useEffect(() => {
		setUsers(userList);
	}, [userList]);

	const handleSearch = async (searchText) => {
		if (!searchText) {
			setUsers(userList);
			return;
		}
		const filtered = await filterUsers(userList, searchText);
		setUsers(filtered);
	};

    const closeAddEdit = () => {
        setAddUser(false);
        setEditUser(false);
    }

	return isLoading ? (
		<LoadingProgress />
	) : (
		<Grid container className={classes.usersContainer}>
			<Grid item xs={10} className={classes.gridSearch}>
				<SearchBox placeholder={t("users.filterByName")} filterField={'sss'} returnValue={handleSearch} />
			</Grid>
			<Can module="users" action="create">
				<Grid item xs={2} className={classes.controls}>
					<Tooltip title={t('users.addUser')}>
						<IconButton className={classes.controlBtn} onClick={() => setAddUser(true)}>
							<AddIcon className={classes.controlIcon} />
						</IconButton>
					</Tooltip>
				</Grid>
			</Can>

			<Grid item xs={12} className={classes.userGrid}>
				<List className={classes.userList}>
					{!users.length ? (
						<div className={classes.noUsersFound}>{t("users.noResidentsFound")}</div>
					) : (
						users.map((u, i) => (
							<ListItem className={classes.listRow} key={i}>
								<Grid container className={classes.midGrid}>
									<Grid item xs={4} sm={4} md={2} className={classes.avatarContainer}>
										<Avatar src={u.avatar} className={classes.avatar} />
									</Grid>
									<Grid item xs={8} sm={8} md={10} className={classes.dataContainer}>
										<Grid container className={classes.rowData} justify="center">
											<Grid item xs={12} sm={12} md={3} className={classes.gridItem}>
												<div className={classes.fullName}>{getFullName(u)}</div>
												<div className={classes.role}>{u.role.roleName}</div>
											</Grid>
											<Grid item xs={12} sm={12} md={3} className={classes.gridItem}>
												<div className={classes.phoneNumber}>{u.phoneNumber}</div>
											</Grid>
											<Grid item xs={12} sm={12} md={6} className={classes.gridItem}>
												<div className={classes.employedBy}>{u.employedBy}</div>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<Can module='users' action='update'>
									<IconButton 
										className={classes.editBtn}
										onClick={() => setEditUser(u._id)}    
									>
										<EditIcon className={classes.editIcon} />
									</IconButton>
								</Can>
                                
							</ListItem>
						))
					)}
				</List>
			</Grid>
			{(addUser || editUser) &&
            <UpsertUser 
                handleClose={() => closeAddEdit(false)} 
                userId={editUser}
				reloadUsers={setIsLoading} 
            />}
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	usersContainer: {
		height: '100%',
		[theme.breakpoints.down('sm')]: {
			height: 'calc(100% - 50px)'
		}
	},
	controls: {
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		padding: '20px 10px',
	},
	controlBtn: {
		border: '1px solid rgba(255,255,255,0.2)',
		margin: '5px',
		padding: '10px',
		color: 'rgba(255,255,255,0.6)',
	},
	editBtn: {
		border: '1px solid rgba(255,255,255,0.2)',
		margin: '5px',
		padding: '10px',
		color: 'rgba(255,255,255,0.6)',
		position: 'absolute',
		left: '5px',
		[theme.breakpoints.down('sm')]: {
			top: '5px',
			left: 'unset',
			right: '5px',
		},
		[theme.breakpoints.down('xs')]: {
			padding: '7px',
		},
	},
	editIcon: {
		fontSize: '20px',
		[theme.breakpoints.down('xs')]: {
			fontSize: '16px',
		},
	},
	controlIcon: {
		fontSize: '24px',
	},
	userGrid: {
		height: '100%'
	},
	userList: {
		borderTop: '1px solid rgba(255,255,255,0.2)',
		height: 'calc(100% - 113px)',
		overflowY: 'overlay'
	},
	listRow: {
		borderBottom: '1px solid rgba(255,255,255,0.2)',
		position: 'relative',
		'&:hover': {
			background: 'rgba(0,0,0,0.7)',
		},
	},
	midGrid: {
		padding: '10px 0',
	},
	dataContainer: {
		display: 'flex',
		alignItems: 'center',
	},
	gridItem: {
		color: 'white',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		[theme.breakpoints.down('xs')]: {
			alignItems: 'flex-start',
			paddingLeft: '10px',
		},
	},
	avatar: {
		height: '50px',
		width: '50px',
		[theme.breakpoints.down('sm')]: {
			height: '80px',
			width: '80px',
		},
	},
	role: {
		fontSize: '14px',
		color: 'rgba(255,255,255,0.7)',
	},
	avatarContainer: {
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		[theme.breakpoints.down('sm')]: {
			padding: '10px',
			justifyContent: 'center',
		},
	},
	phoneNumber: {
		padding: '10px 20px',
		background: 'black',
		borderRadius: '50px',
		margin: '10px 0',
		border: '1px solid rgba(255,255,255,0.2)',
	},
	gridSearch: {
		alignItems: 'center',
		padding: '20px',
	},
	noUsersFound: {
		background: 'black',
		borderRadius: '50px',
		padding: '10px 30px',
		color: 'white',
		width: 'fit-content',
		margin: '10px'
	}
}));
