import { Grid, makeStyles, useMediaQuery } from "@material-ui/core";
import { format, parseISO } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { LanguageContext } from "../../../../context/LanguageContext";
import { StatusTag } from "../../../reuseables/StatusTag";
import { UserItem } from "../../../user/UserItem";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import TransferWithinAStationRoundedIcon from "@material-ui/icons/TransferWithinAStationRounded";
import GroupAddRoundedIcon from "@material-ui/icons/GroupAddRounded";
import AddCommentRoundedIcon from "@material-ui/icons/AddCommentRounded";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { getFullName } from "../../../../api/genericApi";
import AddIcon from "@material-ui/icons/Add";
// import { FaultView } from './FaultView';
// import { FaultViews } from './FaultViews';

export const LastOperations = ({ operations }) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const { lang } = useContext(LanguageContext);
	const [ops, setOps] = useState(operations);
	const matches = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	useEffect(() => {
		setOps(operations);
	}, [operations]);

	return (
		<Grid container justify="center" className={classes.mainContainer}>
			<Grid item xs={12} className={classes.gridHeader}>
				<div className={classes.header}>{t("dashboard.lastOperations")}</div>
			</Grid>
			<Grid item xs={12} className={classes.gridData}>
				{ops.length ? (
					ops.map((op, i) => (
						<Link
							to={`/workspace/${op.itemData.module}/${op.itemData.itemId}`}
							style={{ textDecoration: "none" }}
						>
							<div className={classes.rowContainer} key={i}>
								<div className={classes.typeGrid}>
									<OperationType op={op} />
									<div className={classes.rowTime}>
										{format(parseISO(op.createdAt), lang.dateformat)}
									</div>
								</div>
								<div className={classes.top}>
									{matches ? (
										<div className={classes.textContainer}>
											<span className={classes.mobileActionby}>
												{` ${getFullName(op.actionBy)}`}
											</span>
											{` ${t(
												`dashboard.${op.actionType}`
											).replace("%%itemid%%", op.itemData.itemId)}`}
											<OperationItem op={op} />
										</div>
									) : (
										<React.Fragment>
											<div className={classes.userContainer}>
												<UserItem
													user={op.actionBy}
													showName
													avatarSize={30}
													size={10}
													showTitle={matches ? false : true}
												/>
											</div>
											<div className={classes.operationMade}>
												{t(`dashboard.${op.actionType}`).replace(
													"%%itemid%%",
													op.itemData.itemId
												)}
											</div>
											<div className={classes.operationItem}>
												<OperationItem op={op} />
											</div>
										</React.Fragment>
									)}
								</div>
							</div>
						</Link>
					))
				) : (
					<div className={classes.noData}>
						<img
							src="https://img.icons8.com/ios-filled/100/4a90e2/remove-data.png"
							className={classes.noDataImage}
						/>
						<div className={classes.noDataText}>{t("dashboard.noData")}</div>
						<div className={classes.noDataSecondary}>
							{t("dashboard.noDataSecondary")}
						</div>
					</div>
				)}
			</Grid>
		</Grid>
	);
};

const OperationItem = ({ op }) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const matches = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	if (op.actionType === "statusChange" && op.payload.status) {
		return matches ? (
			t(
				`${op.itemData.module.substr(
					0,
					op.itemData.module.length - 1
				)}sModule.statuses.${op.payload.status.statusId}`
			)
		) : (
			<div className={classes.statusContainer}>
				{
					<StatusTag
						status={op.payload.status}
						type={op.itemData.module.substr(0, op.itemData.module.length - 1)}
						size={matches ? 10 : 12}
					/>
				}
			</div>
		);
	} else if (
		["ownerChange", "relatedUserAdded"].includes(op.actionType) &&
		(op.payload.owner || op.payload.relatedUser)
	) {
		return matches ? (
			<span style={{ fontWidth: '800'}}>
				{` ${getFullName(op.payload.owner || op.payload.relatedUser)}`}
			</span>
			
		) : (
			<div className={classes.userContainer}>
				<UserItem
					user={op.payload.owner || op.payload.relatedUser}
					showName
					showPhone
					size={9}
					avatarSize={matches ? 30 : 40}
				/>
			</div>
		);
	} else if (op.actionType === "detailsUpdate" && op.payload) {
		return null;
	} else if (op.actionType === "addComment" && op.payload.comment) {
		return matches ? (
			<div className={classes.commentContainer}>
				{op.payload.comment.text}
			</div>
		) : (
			<div className={classes.commentContainer}>
				{op.payload.comment.text}
			</div>
		);
	}
	return null;
};

const OperationType = ({ op }) => {
	const { t } = useTranslation();
	const classes = useStyles();

	return (
		<div className={classes.typeContainer}>
			{op.actionType === "statusChange" ? (
				<DoubleArrowIcon className={classes.typeIcon} />
			) : op.actionType === "ownerChange" ? (
				<TransferWithinAStationRoundedIcon className={classes.typeIcon} />
			) : op.actionType === "relatedUserAdded" ? (
				<GroupAddRoundedIcon className={classes.typeIcon} />
			) : op.actionType === "addComment" ? (
				<AddCommentRoundedIcon className={classes.typeIcon} />
			) : op.actionType === "detailsUpdate" ? (
				<EditRoundedIcon className={classes.typeIcon} />
			) : op.actionType === "itemCreated" ? (
				<AddIcon className={classes.typeIcon} />
			) : null}
			{t(`dashboard.actionTypes.${op.actionType}`)}
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	mainContainer: {
		height: "800px",
		padding: "20px 20px",
        [theme.breakpoints.only("lg")]: {
			height: "80vh",
            position: 'sticky',
            top: '98px',
            width: '50vw',
		    padding: "20px 20px",
		},
		[theme.breakpoints.down("sm")]: {
			padding: "10px 0",
			height: "auto"
		},
	},
	gridHeader: {
		background: "black",
		color: "white",
		borderRadius: "10px 10px 0 0",
		height: "60px",
		[theme.breakpoints.down("sm")]: {
			borderRadius: 0,
			position: "sticky",
			top: '58px'
		},
	},
	header: {
		fontSize: "18px",
		padding: "20px 20px 0"
	},
	gridData: {
		background: "rgba(0,0,0,0.2)",
		borderRadius: "0 0 10px 10px",
		height: "calc(100% - 60px)",
		overflow: "auto",
		"&::-webkit-scrollbar": {
			width: "0em",
		},
		[theme.breakpoints.down("sm")]: {
			overflow: "hidden",
		},
	},
	rowContainer: {
		padding: "10px 10px 10px",
		borderBottom: "1px solid rgba(0,0,0,0.3)",
	},
	top: {
		display: "flex",
	},
	userContainer: {
		background: "rgba(0,0,0,0.3)",
		borderRadius: "50px",
		padding: "5px 20px 5px 5px",
		height: 'fit-content',
		[theme.breakpoints.down("sm")]: {
			padding: "5px 20px 5px 5px",
		},
	},
	operationMade: {
		fontSize: "13px",
		color: "white",
		display: "flex",
		justifyContent: "center",
		textAlign: "center",
		alignItems: "center",
		padding: "10px",
		whiteSpace: "nowrap",
		[theme.breakpoints.down("sm")]: {
			fontSize: "11px",
		},
	},
	operationItem: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	commentContainer: {
		fontSize: "13px",
		color: "white",
		background: "rgba(0,0,0,0.7)",
		padding: "7px 20px",
		borderRadius: "5px",
		width: 'fit-content',
		margin: '5px'
	},
	rowTime: {
		textAlign: "right",
		color: "rgba(255,255,255,0.4)",
		fontSize: "12px",
	},
	typeGrid: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: "10px",
	},
	typeContainer: {
		display: "flex",
		alignItems: "center",
		color: "white",
		borderRadius: "50px",
		border: "1px solid rgba(255,255,255,0.2)",
		fontSize: "11px",
		width: "fit-content",
		padding: "3px 20px 3px 5px",
	},
	typeIcon: {
		borderRadius: "50px",
		border: "1px solid rgba(255,255,255,0.2)",
		fontSize: "14px",
		padding: "3px",
		marginRight: "5px",
	},
	textContainer: {
		color: "white",
		fontSize: "13px",
	},
	noData: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
		marginTop: "35px",
	},
	noDataText: {
		padding: "20px",
		color: "white",
		fontSize: "22px",
	},
	noDataSecondary: {
		padding: "0px 30px",
		fontSize: "14px",
		color: "rgba(255,255,255,0.5)",
	},
	mobileActionby: {
		fontWeight: '600',

	}
}));
