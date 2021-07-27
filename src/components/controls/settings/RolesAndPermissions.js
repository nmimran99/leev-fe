import { Grid, IconButton, List, ListItem, makeStyles, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getSuccessMessage } from '../../../api/genericApi';
import { createRole, filterRoles, getRoles, updateRole } from '../../../api/permissionsApi';
import { LanguageContext } from '../../../context/LanguageContext';
import { SnackbarContext } from '../../../context/SnackbarContext';
import { Can } from '../../reuseables/Can';
import { LoadingProgress } from '../../reuseables/LoadingProgress';
import { SearchBox } from '../../reuseables/SearchBox';
import { UpsertRole } from './UpsertRole';

export const RolesAndPermissions = () => {
	const classes = useStyles();
	const { t } = useTranslation();
    const { lang } = useContext(LanguageContext);
	const { setSnackbar } = useContext(SnackbarContext);
    const [ roleList, setRoleList ] = useState([]);
	const [ roles, setRoles ] = useState([]);
    const [ addRole, setAddRole ] = useState(false);
    const [ editRole, setEditRole ] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!isLoading) return;
		getRoles()
			.then((res) => {
                console.log(res)
				if (res.status === 403) {
					setSnackbar(res);
					setIsLoading(false);
				} else if (res) {
					setRoleList(res);
				}
			})
			.finally(() => setIsLoading(false));
	}, [isLoading]);

	useEffect(() => {
		setRoles(roleList);
	}, [roleList]);

	const handleSearch = async (searchText) => {
		if (!searchText) {
			setRoles(roleList);
			return;
		}
		const filtered = await filterRoles(roleList, searchText);
		setRoles(filtered);
	};

	const handleSaveRole = (roleName, permissions) => {
		createRole(roleName, permissions)
		.then((res) => {
			if (res.status === 403) {
				setSnackbar(res);
				return;
			} else if (res) {
				setSnackbar(getSuccessMessage('role', res.roleName, 'created'));
			}
		})
		.finally(() => setIsLoading(true));
    };
    
    const handleUpdateRole = (roleId, roleName, permissions) => {
        updateRole(roleId, roleName, permissions)
        .then(res => {
            if (res.status === 403) {
                setSnackbar(res);
                return;
            } else if (res) {
                setSnackbar(getSuccessMessage('role', res.roleName, 'updated'));
            }
        })
        .finally(() => setIsLoading(true));
    }

    const closeAddEdit = () => {
        setAddRole(false);
        setEditRole(false);
    }

	return isLoading ? (
		<LoadingProgress />
	) : (
		<Grid container className={classes.usersContainer}>
			<Grid item xs={10} className={classes.gridSearch}>
				<SearchBox placeholder={t("roles.filterByName")} filterField={'sss'} returnValue={handleSearch} />
			</Grid>
			<Can module="users" action="create">
				<Grid item xs={2} className={classes.controls}>
					<Tooltip title={t('roles.addRole')}>
						<IconButton className={classes.controlBtn} onClick={() => setAddRole(true)}>
							<AddIcon className={classes.controlIcon} />
						</IconButton>
					</Tooltip>
				</Grid>
			</Can>

			<Grid item xs={12}>
				<List className={classes.userList}>
					{!roles.length ? (
						<div className={classes.noUsersFound}>{t("roles.noRolesFound")}</div>
					) : (
						roles.map((r, i) => (
							<ListItem className={classes.listRow} key={i}>
								<Grid container className={classes.midGrid}>
                                    <Grid item xs={2} className={classes.gridItem}>	
                                        <IconButton 
                                            className={classes.editBtn}
                                            onClick={() => setEditRole(r._id)}    
                                        >
                                            <EditIcon className={classes.editIcon} />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={10} className={classes.gridItem}>
                                        <div className={classes.role}>{r.roleName}</div>
                                    </Grid>
								</Grid>
							</ListItem>
						))
					)}
				</List>
			</Grid>
			{(addRole || editRole) &&
            <UpsertRole
                handleClose={() => closeAddEdit(false)} 
                handleSave={handleSaveRole}
                handleUpdate={handleUpdateRole}
                roleId={editRole} 
            />}
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
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
		padding: '10px',
		color: 'rgba(255,255,255,0.6)'
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
	userList: {
		borderTop: '1px solid rgba(255,255,255,0.2)',
        padding: 0,
		overflowY: 'overlay',
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
		justifyContent: 'fle-xstart',
		alignItems: 'center',
        padding: '0 10px'
	},
	
	role: {
		fontSize: '18px',
		color: 'rgba(255,255,255,0.7)',
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
