import {
	makeStyles,
	Tooltip,
	IconButton,
	Grid,
	useMediaQuery,
	ClickAwayListener,
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import BusinessRoundedIcon from '@material-ui/icons/BusinessRounded';
import AssignmentRoundedIcon from '@material-ui/icons/AssignmentRounded';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import { useTranslation } from 'react-i18next';
import { SearchBoxSelect } from '../../reuseables/SearchBoxSelect';
import { getAssetsSuggestions } from '../../../api/systemsApi';
import { useLocation } from 'react-router';
import { useQuery } from '../../reuseables/customHooks/useQuery';
import { getAsset, getFullAddress } from '../../../api/assetsApi';
import { createUserOptions } from '../../../api/userApi';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import { FilterBySelect } from '../../reuseables/FilterBySelect';
import { getFaultsStatusListSuggestions } from '../../../api/faultsApi';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import { FilterByMultiSelect } from '../../reuseables/FilterByMultiSelect';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';

export const MapControls = ({}) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const location = useLocation();
	const matches = useMediaQuery((theme) => theme.breakpoints.down('md'));
	const query = useQuery(location.search);
	const [reloadedValue, setReloadedValue] = useState(null);
	const [expanded, setExpanded] = useState(false);

	useEffect(() => {
		if (query.asset) {
			handleReloaded(query.asset).then((data) => {
				if (data) {
					setReloadedValue(data);
				} else {
				}
			});
		} else {
			setReloadedValue({
				label: '',
				value: null,
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

	const handleClickFilter = () => {
		if (expanded) {
			setExpanded(false);
			return;
		}
		setExpanded(true);
	};

	return matches && !expanded ? (
		<IconButton className={classes.filterBtn} onClick={handleClickFilter}>
			<FilterListRoundedIcon className={classes.icon} />
		</IconButton>
	) : (
		<MobileWrappar handleClickFilter={handleClickFilter}>
			<Grid container className={classes.container}>
				{matches && expanded && (
					<Grid item xs={12} className={classes.controls}>
						<div className={classes.title}>
							{t("mapModule.filters")}
						</div>
						<IconButton onClick={handleClickFilter} className={classes.expandedBtn}>
							<ClearRoundedIcon className={classes.icon}/>
						</IconButton>
					</Grid>
				)}
				{reloadedValue && (
					<Grid item className={classes.filterContainer}>
						<SearchBoxSelect
							suggestionsFunc={getAssetsSuggestions}
							placeholder={t('filters.filterByAsset')}
							filterField={'asset'}
							reloadedLabel={reloadedValue.label}
							reloadedValue={reloadedValue.value}
						/>
					</Grid>
				)}
				<Grid item className={classes.filterContainer}>
					<FilterBySelect
						optionsFunc={createUserOptions}
						placeholder={t('filters.filterByUser')}
						filterIcon={
							<PersonRoundedIcon className={classes.icon} />
						}
						filterField={'owner'}
					/>
				</Grid>
				{/* <Grid item classNam={classes.filterContainer}>
					<FilterByMultiSelect
						optionsFunc={getFaultsStatusListSuggestions}
						placeholder={t('filters.filterByStatus')}
						filterIcon={
							<DoubleArrowIcon className={classes.icon} />
						}
						filterField={'status'}
					/>
				</Grid> */}
			</Grid>
		</MobileWrappar>
	);
};

const MobileWrappar = ({ children, handleClickFilter }) => {
	const matches = useMediaQuery((theme) => theme.breakpoints.up('md'));

	return matches ? (
		<div>{children}</div>
	) : (
		<ClickAwayListener onClickAway={handleClickFilter}>
			{children}
		</ClickAwayListener>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		width: 'fit-content',
		height: 'fit-content',
		display: 'flex',
		background: 'rgba(0,0,0,0.2)',
		borderRadius: '50px',
		margin: '10px',
		backdropFilter: 'blur(5px)',
		border: '1px solid rgba(255,255,255,0.2)',
		position: 'relative',
		boxShadow: 'rgba(0,0,0,0.4) 0 0 5px 2px',
		[theme.breakpoints.down('md')]: {
			borderRadius: '0px',
			margin: '0px',
			padding: '10px',
			border: 0
		},
	},
	btn: {
		background: 'rgba(0,0,0,0.4)',
		padding: '8px',
		margin: '5px',
		'&:hover': {
			background: 'black',
		},
	},
	icon: {
		fontSize: '24px',
		marginLeft: '4px',
		color: 'white',
		borderRadius: '50px',
		padding: '6px',
		border: '1px solid rgba(255,255,255,0.2)',
	},
	controls: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottom: '1px solid rgba(255,255,255,0.2)',
		paddingBottom: '10px',
		marginBottom: '10px'
	},
	filterContainer: {
		justifySelf: 'center'
	},
	expandedBtn: {
		padding: '2px'
	},
	title: {
		color: 'white',
		fontSize: '20px',
		padding: '0 10px'
	}
}));
