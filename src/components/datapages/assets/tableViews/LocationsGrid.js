import {
	Avatar,
	Button,
	Collapse,
	Grid,
	LinearProgress,
	makeStyles,
	useMediaQuery
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import clsx from "clsx";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import { getAssetData } from "../../../../api/assetsApi";
import { getFullName, getServerError, removeQueryParam } from "../../../../api/genericApi";
import { SnackbarContext } from "../../../../context/SnackbarContext";
import { UpsertContext } from "../../../../context/UpsertContext";
import { UserItem } from "../../../user/UserItem";


export const LocationsGrid = ({ assetId, handleUpdateLocation }) => {
	const classes = useStyles();
	const history = useHistory();
	const location = useLocation();
	const { t } = useTranslation();
	const { setSnackbar } = useContext(SnackbarContext);
	const { setUpsertData } = useContext(UpsertContext);
	const matches = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const [ isLoading, setIsLoading ] = useState(true);
	const [ locations, setLocations ] = useState([]);
	const [ faults, setFaults ] = useState([]);
	const [expanded, setExpanded] = useState(null);

	useEffect(() => {
		prepareData();
	}, [])
	
	const prepareData = async () => {
		const res = await getAssetData(assetId, 'locations')
		if (!res || [403, 500].includes(res.status)) {
			history.push({
				path: location.pathname,
				search: removeQueryParam(location.search, 'tab'),
			});
			setSnackbar(res || getServerError());
		};
		setLocations(res.locations);
		setFaults(res.faults);
		setIsLoading(false)
	}

	const handleExpanded = (locationId) => {
		if (expanded === locationId) {
			setExpanded(null);
		} else {
			setExpanded(locationId);
		}
	};

	const toggleEditMode = (lcoationId) => event => {
		setUpsertData({ itemId: lcoationId, module: 'locations' })
	}
	return (
		isLoading ? 
		<LinearProgress /> :
		<React.Fragment>
		<Grid container justify="center">
			<Grid container className={classes.headersContainer} justify="center">
				<Grid item xs={4}>
					<div className={classes.headerContainer}>
						{t("locationsModule.locationName")}
					</div>
				</Grid>
				<Grid item xs={4}>
					<div className={classes.headerContainer}>
						{t("locationsModule.relatedUsers")}
					</div>
				</Grid>
				<Grid item xs={4}>
					<div className={classes.headerContainer}>
						{t("locationsModule.openFaults")}
					</div>
				</Grid>
			</Grid>

			{locations.length
				? locations.map((location, i) => (
						<Grid
							container
							className={classes.rowContainer}
							justify="center"
							key={i}
						>
							<Grid item xs={4} className={classes.cellGrid}>
								<div className={classes.cellData}>
									<Button
										endIcon={<EditIcon className={classes.editIcon} />}
										className={classes.editBtn}
										onClick={toggleEditMode(location._id)}
									>
										{location.name}
									</Button>
								</div>
								
							</Grid>
							<Grid item xs={4} className={classes.cellGrid}>
								<div className={clsx(classes.cellData)}>
									<div
										className={classes.relatedUsersContainer}
										onClick={() => handleExpanded(location._id)}
									>
										{location.relatedUsers.map((ru, i) => (
											<Avatar
												alt={getFullName(ru)}
												src={ru.avatar}
												className={classes.ruavatar}
												style={{
													left: `${20 * i}px`,
													width: matches ? "30px" : "40px",
													height: matches ? "30px" : "40px",
												}}
											/>
										))}
									</div>
								</div>
							</Grid>
							<Grid item xs={4} className={classes.cellGrid}>
								<div className={clsx(classes.cellData, classes.openFaults)}>
									{`${faults.reduce(
										(val, f) => (f.location == location._id ? val + 1 : val),
										0
									)} ${t("mapModule.openFaults")}`}
								</div>
							</Grid>

							<Collapse in={expanded === location._id}>
								<Grid item xs={12} className={classes.relatedUsersList}>
									{location.relatedUsers.map((rl, i) => (
										<div className={classes.relatedUser}>
											<UserItem
												user={rl}
												showName
												showTitle
												showPhone
												avatarSize={matches ? 40 : 60}
												size={matches ? 11 : 13}
											/>
										</div>
									))}
								</Grid>
							</Collapse>
						</Grid>
				  ))
				: "no rows"}
		</Grid>
		</React.Fragment>
		
	);
};

const useStyles = makeStyles((theme) => ({
	headersContainer: {
		background: "black",
		borderBottom: "2px solid rgba(255,255,255,0.2)",
		position: "sticky",
		borderRadius: "10px 10px 0 0",
		top: 0,
		[theme.breakpoints.down("sm")]: {
			borderRadius: "0px",
		},
	},
	headerContainer: {
		color: "white",
		textAlign: "center",
		padding: "15px 10px 10px",
		[theme.breakpoints.down("sm")]: {
			fontSize: "13px",
		},
	},
	rowContainer: {
		padding: "5px",
		borderBottom: "1px solid rgba(255,255,255,0.1)",
	},
	cellGrid: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	cellData: {
		color: "white",
		width: "fit-content",
		textAlign: "center",
		position: "relative",
		[theme.breakpoints.down("sm")]: {
			fontSize: "12px",
		},
	},
	userContainer: {
		minWidth: "150px",
		[theme.breakpoints.down("sm")]: {
			minWidth: "fit-content",
		},
	},
	openFaults: {
		background: "#e53935",
		padding: "5px 10px",
		display: "grid",
		placeItems: "center",
		borderRadius: "50px",
		fontSize: "14px",
		[theme.breakpoints.down("sm")]: {
			fontSize: "11px",
		},
	},
	relatedUsersContainer: {
		display: "flex",
		justifyContent: "center",
		position: "relative",
		width: "fit-content",
		transform: "translateX(25%)",
	},
	ruavatar: {
		position: "relative",
		border: "1px solid rgba(255,255,255,0.4)",
	},
	relatedUsersList: {
		display: "flex",
		background: "rgba(0,0,0,0.4)",
		borderRadius: "10px",
		margin: "5px 0",
		flexFlow: "wrap",
		padding: "10px 0",
	},
	relatedUser: {
		padding: "10px 20px",
	},
	editBtn: {
		color: 'white',
		fontSize: '16px',
		width: '100%',
		'&:hover': {
			boxShadow: 'none',
			background: 'transparent'
		},
		[theme.breakpoints.down('sm')]: {
			fontSize: '13px',
		}
	},
	editIcon: {
		fontSize: '16px'
	}
}));
