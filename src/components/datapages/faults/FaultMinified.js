import { Grid, makeStyles, useMediaQuery } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getFullAddress } from "../../../api/assetsApi";
import { StatusTag } from "../../reuseables/StatusTag";
import { UserItem } from "../../user/UserItem";
import { FaultLink } from "./FaultLink";

const LinkWrapper = ({ withLink, faultId, children}) => {
	if (withLink) {
		return (
			<Link
			to={`/workspace/faults/${faultId}`}
			style={{ textDecoration: "none" }}
		>
			{children}
		</Link>
		)
	}
	return (
		<React.Fragment>
			{children}
		</React.Fragment>
	)
}


export const FaultMinified = ({ data, withLink }) => {
	const classes = useStyles();
	const [fault, setFault] = useState(data);

	useEffect(() => {
		setFault(data);
	}, [data]);

	

	return (
			<LinkWrapper withLink={withLink} faultId={fault.faultId} >
				<Grid container className={classes.container} alignItems="flex-start">
				<Grid
					container
					justify="space-between"
					alignItems="center"
					className={classes.topRow}
				>
					<Grid item xs={12}>
						<div className={classes.asset}>
							{getFullAddress(fault.asset, true)}
						</div>
					</Grid>
				</Grid>
				<Grid xs={12} item className={classes.title}>
					{fault.title}
				</Grid>
				<Grid
					container
					justify="space-between"
					alignItems="center"
					className={classes.bottomRow}
				>
					<Grid item xs={5} className={classes.userData}>
						<UserItem size={13} avatarSize={40} user={fault.owner} />
						<FaultLink faultId={fault.faultId} size={14} />
					</Grid>
					<Grid item xs={7} className={classes.status}>
						<StatusTag status={fault.status} type={"fault"} />
					</Grid>
				</Grid>
			</Grid>
			</LinkWrapper>
			
	
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		width: "100%",
		height: "100%",
		position: "relative",
	},
	title: {
		color: "white",
		fontSize: "16px",
		padding: "15px 5px",
		display: "-webkit-box",
		WebkitLineClamp: "2",
		WebkitBoxOrient: "vertical",
		overflow: "hidden",
		textOverflow: "ellipsis",
		height: "60px",
	},
	topRow: {
		padding: "5px",
		maxHeight: "60px",
	},
	userData: {
		padding: "5px 0px",
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-start",
	},
	bottomRow: {
		height: "50px",
	},
	asset: {
		color: "white",
		borderRadius: "50px",
		background: "rgba(0,0,0,0.4)",
		padding: "5px 15px",
		border: "1px solid rgba(255,255,255,0.2)",
		boxShadow: "rgba(0,0,0,0.3) 1px 1px 5px 2px",
		width: "fit-content",
		textAlign: "center",
		whiteSpace: "nowrap",
	},
	faultLink: {
		display: "flex",
		justifyContent: "flex-end",
		margin: "3px 0",
	},
	status: {
		display: "flex",
		justifyContent: "flex-end",
	},
	link: {
		display: "flex",
		justifyContent: "flex-end",
	},
}));
