import {
	Button,
	Slide,
	Grid,
	makeStyles,
	useMediaQuery,
} from '@material-ui/core';
import { ClearRounded } from '@material-ui/icons';
import BlurOnRoundedIcon from '@material-ui/icons/BlurOnRounded';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import FilterListIcon from '@material-ui/icons/FilterList';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { getAsset, getFullAddress } from '../../../api/assetsApi';
import { removeQueryParam } from '../../../api/genericApi';
import {
	getAssetsSuggestions,
	getSystemsByAssetOptions,
} from '../../../api/systemsApi';
import { getTasksStatusListSuggestions } from '../../../api/tasksApi';
import { createUserOptions } from '../../../api/userApi';
import { useQuery } from '../../reuseables/customHooks/useQuery';
import { FilterByMultiSelect } from '../../reuseables/FilterByMultiSelect';
import { SearchBoxSelect } from '../../reuseables/SearchBoxSelect';

export const TasksControls = () => {
	const history = useHistory();
	const location = useLocation();
	const query = useQuery(location.search);
	const classes = useStyles();
	const downSm = useMediaQuery((theme) => theme.breakpoints.down('md'));
	const { t, i18n } = useTranslation();
	const [reloadedValue, setReloadedValue] = useState(null);
	const [collapsed, setCollapsed] = useState(false);

	useEffect(() => {
		if (query.asset) {
			handleReloaded(query.asset).then((data) => {
				if (data) {
					setReloadedValue(data);
				}
			});
		} else {
			setReloadedValue({
				label: '',
				value: null,
			});
			history.push({
				path: location.pathname,
				search: removeQueryParam(location.search, 'system'),
			});
		}
	}, [location.search]);

	const handleReloaded = async (assetId) => {
		const res = await getAsset(assetId, false);
		if (res) {
			return {
				label: getFullAddress(res),
				value: res._id,
			};
		}
	};

	const toggleCollapse = () => {
		if (collapsed) {
			setCollapsed(false);
			return;
		}
		setCollapsed(true);
	};

	return (
		<React.Fragment>
			{downSm && (
				<Grid container justify="center">
					<Grid item xs={12} className={classes.gridItem}>
						<Button
							className={classes.sortandfilter}
							startIcon={
								<FilterListIcon className={classes.icon} />
							}
							endIcon={
								collapsed ? (
									<ClearRounded />
								) : (
									<ExpandMoreRoundedIcon />
								)
							}
							onClick={toggleCollapse}
						>
							{t(
								`tasksModule.${
									collapsed ? 'hide' : 'show'
								}Filters`
							)}
						</Button>
					</Grid>
				</Grid>
			)}
			{
				(!downSm || collapsed) &&
				<Slide in={true} direction={'up'} timeout={downSm ? 500 : 0}>
				<Grid container justify="center" className={classes.filtersContainer}>
					<Grid item xs={12} className={classes.gridItem}>
						{reloadedValue && (
							<SearchBoxSelect
								suggestionsFunc={getAssetsSuggestions}
								placeholder={t('systemsModule.filterByAsset')}
								filterField={'asset'}
								reloadedLabel={reloadedValue.label}
								reloadedValue={reloadedValue.value}
							/>
						)}
						{query.asset && (
							<FilterByMultiSelect
								optionsFunc={() =>
									getSystemsByAssetOptions(query.asset)
								}
								placeholder={t(
									'systemsModule.filterBySystemName'
								)}
								filterIcon={
									<BlurOnRoundedIcon
										className={classes.icon}
									/>
								}
								filterField={'system'}
							/>
						)}
						<FilterByMultiSelect
							optionsFunc={getTasksStatusListSuggestions}
							placeholder={t('tasksModule.filterByStatus')}
							filterIcon={
								<DoubleArrowIcon className={classes.icon} />
							}
							filterField={'status'}
						/>
					</Grid>

					<Grid item xs={12} className={classes.gridItem}>
						<FilterByMultiSelect
							optionsFunc={createUserOptions}
							placeholder={t('tasksModule.filterByTaskOwner')}
							filterIcon={
								<PersonRoundedIcon className={classes.icon} />
							}
							filterField={'owner'}
						/>
					</Grid>
				</Grid>
			</Slide>
			}
			
		</React.Fragment>
	);
};

const useStyles = makeStyles((theme) => ({
	filtersContainer: {
        [theme.breakpoints.down('sm')]: {
            position: 'absolute',
            bottom: '0',
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(22px)',
            zIndex: 3,
            padding: '40px 0 155px',
            borderRadius: '30px 30px 0 0',
            boxShadow: '0px -1px 1px 0px rgba(255,255,255,0.2)'
        }
    },
	gridItem: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex-start',
		flexWrap: 'wrap',
	},
	icon: {
		fontSize: '20px',
		marginLeft: '4px',
		color: 'white',
		borderRadius: '50px',
		padding: '6px',
		border: '1px solid rgba(255,255,255,0.2)',
	},
	sortandfilter: {
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'black',
        color: 'white',
        borderRadius: '50px',
        padding: '5px 25px 5px 3px',
        whiteSpace: 'nowrap',
        margin: '10px 0 0',
        position: 'absolute',
        bottom: '100px',
        zIndex: 4,
        '&:hover': {
            background: 'black'
        }
    },
	typeGroup: {
		margin: '5px',
		height: '45px',
	},
	modeBtn: {
		padding: '0 15px 0 5px',
		color: 'white',
		width: 'auto',
		whiteSpace: 'nowrap',
		border: '1px solid rgba(255,255,255,0.2)',
	},
	listBtn: {
		borderRadius: '25px 0 0 25px',
	},
	blocksBtn: {
		borderRadius: '0px 25px 25px 0px',
	},
	modeBtnActive: {
		background: 'rgba(0,0,0,0.6)',
	},
}));
