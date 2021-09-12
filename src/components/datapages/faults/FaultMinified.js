import { Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFullAddress } from "../../../api/assetsApi";
import { ItemLink } from "../../reuseables/ItemLink";
import { StatusTag } from "../../reuseables/StatusTag";
import { UserItem } from "../../user/UserItem";

const LinkWrapper = ({ withLink, faultId, children }) => {
	if (withLink) {
		return (
			<Link
				to={`/workspace/faults/${faultId}`}
				style={{ textDecoration: "none" }}
			>
				{children}
			</Link>
		);
	}
	return <React.Fragment>{children}</React.Fragment>;
};

export const FaultMinified = ({ data, withLink }) => {
	const classes = useStyles();
	const [fault, setFault] = useState(data);

	useEffect(() => {
		setFault(data);
	}, [data]);

	return (
		<LinkWrapper withLink={withLink} faultId={fault.faultId}>
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
						<ItemLink module={"faults"} itemId={fault.faultId} size={13} />
					</Grid>
					<Grid item xs={7} className={classes.status}>
						<StatusTag status={fault.status} type={"fault"} size={12} />
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
		padding: "10px",
	},
	title: {
		color: "white",
		fontSize: "14px",
		padding: "18px 5px",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
	},
	topRow: {
		padding: "5px",
		maxHeight: "60px",
	},
	userData: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-start",
	},
	bottomRow: {},
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
		fontSize: "13px",
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
