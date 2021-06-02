import {
	Avatar,
	Button,
	Collapse,
	Grid,
	makeStyles,
	useMediaQuery,
} from "@material-ui/core";
import clsx from "clsx";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { getFullName } from "../../../../api/genericApi";
import { UserItem } from "../../../user/UserItem";
import EditIcon from '@material-ui/icons/Edit';
import { UpsertLocation } from "../../locations/UpsertLocation";
import { updateLocation } from '../../../../api/locationsApi';
import { SnackbarContext } from "../../../../context/SnackbarContext";

export const LocationsGrid = ({ locations, faults, handleUpdateLocation }) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const { setSnackbar } = useContext(SnackbarContext);
	const matches = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const [expanded, setExpanded] = useState(null);

	const [ editLocation, setEditlocation ] = useState(null);

	const handleExpanded = (locationId) => {
		if (expanded === locationId) {
			setExpanded(null);
		} else {
			setExpanded(locationId);
		}
	};

	return (
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
										onClick={() => setEditlocation(location._id)}
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
		{
			Boolean(editLocation) &&
			<UpsertLocation 
				locationId={editLocation}
				handleClose={() => setEditlocation(null)}
				handleUpdate={handleUpdateLocation}
			/>
		}
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
