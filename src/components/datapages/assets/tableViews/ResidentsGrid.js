import React, { useContext, useEffect, useState } from "react";
import {
	Button,
	Fade,
	Grid,
	LinearProgress,
	makeStyles,
	Slide,
	useMediaQuery,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { getFullName, getServerError, removeQueryParam } from "../../../../api/genericApi";
import { UserItem } from "../../../user/UserItem";
import clsx from "clsx";
import { StatusTag } from "../../../reuseables/StatusTag";
import { ItemLink } from "../../../reuseables/ItemLink";
import { getAssetData } from "../../../../api/assetsApi";
import { useHistory, useLocation } from "react-router";
import { SnackbarContext } from "../../../../context/SnackbarContext";

export const ResidentsGrid = ({ assetId }) => {
	const classes = useStyles();
	const history = useHistory();
	const location = useLocation();
	const { t } = useTranslation();
	const { setSnackbar } = useContext(SnackbarContext);
	const matches = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const [ isLoading, setIsLoading ] = useState(true);
	const [ residents, setResidents ] = useState([]);

    useEffect(() => {
		getAssetData(assetId, 'residents')
		.then(res => {
			if (!res || [403, 500].includes(res.status)) {
				history.push({
					path: location.pathname,
					search: removeQueryParam(location.search, 'tab'),
				});
				setSnackbar(res || getServerError());
			};
			setResidents(res.residents);
		})
		.finally(() => {
			setIsLoading(false)
		})
	}, [])

	return (
        isLoading ? 
        <LinearProgress /> :
		<Grid container justify="center">
			<Grid container className={classes.headersContainer} justify="center">
				<Grid item xs={4}>
					<div className={classes.headerContainer}>
						{t("users.resident")}
					</div>
				</Grid>
				<Grid item xs={4}>
					<div className={classes.headerContainer}>
						{t("locationsModule.locationName")}
					</div>
				</Grid>
				<Grid item xs={4}>
					<div className={classes.headerContainer}>
						{t("users.phoneNumber")}
					</div>
				</Grid>
			</Grid>

			{residents.length
				? residents.map((resident, i) => (
						<Grid
							container
							className={classes.rowContainer}
							justify="center"
							key={i}
						>
							<Grid item xs={4} className={classes.cellGrid}>
								<div className={classes.cellData}>
									<UserItem 
                                        user={resident}
                                        showName
                                        showPhone
                                        avatarSize={matches ? 0 : 40}
                                        size={matches ? 11 : 13}
                                        column={matches}
                                    />
								</div>
							</Grid>
							<Grid item xs={4} className={classes.cellGrid}>
								<div className={clsx(classes.cellData)}>
									{resident.data.location.name}	
								</div>
							</Grid>
							<Grid item xs={4} className={classes.cellGrid}>
								<div className={clsx(classes.cellData)}>
									{t(`general.${resident.data.isOwner}`)}
								</div>
							</Grid>
						</Grid>
				  ))
				: "no rows"}
		</Grid>
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
		justifyContent: "center",
		alignItems: "center",
	},
	cellData: {
		color: "white",
		width: "fit-content",
		textAlign: "center",
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
}));
