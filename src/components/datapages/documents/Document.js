import { Grid, IconButton, makeStyles } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { getFullAddress } from "../../../api/assetsApi";
import { getFileTypeName } from "../../../api/documentsApi";
import { ItemLink } from "../../reuseables/ItemLink";
import { UserItem } from "../../user/UserItem";
import { DocumentControls } from "./DocumentControls";
import dateFormat from "dateformat";
import { format, parseISO } from 'date-fns';
import { LanguageContext } from "../../../context/LanguageContext";

export const Document = ({ data, deleteFile, downloadFile, toggleEditMode, previewFile }) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const { lang } = useContext(LanguageContext);

	return (
		<div className={classes.mainContainer}>
			<Grid container className={classes.docContainer}>
				<Grid item xs={9} className={classes.descContainer}>
					<div className={classes.description}>{data.description}</div>
					<div className={classes.docId}>{data.docId}</div>
					<div className={classes.createdAt}>{`${t(
						"general.createDate"
					)} ${format(parseISO(data.createdAt), lang.dateonly)}`}</div>
				</Grid>
				<Grid item xs={3} className={classes.controls}>
					<DocumentControls
						deleteFile={deleteFile(data._id, data.description)}
						downloadFile={() => downloadFile(data.url)}
						editDocument={() => toggleEditMode(data._id)}
						previewFile={() => previewFile(data)}
					/>
				</Grid>
				<Grid item xs={12} className={classes.dataContainer}>
					<Grid container className={classes.relationContainer}>
						<Grid item xs={12} className={classes.gridItem}>
							<div className={classes.relationLabel}>
								{t("documentsModule.upsert.asset")}
							</div>
							<div className={classes.relationData}>
								{data.asset ? getFullAddress(data.asset) : t("general.noData")}
							</div>
						</Grid>
					</Grid>
					<Grid container className={classes.relationContainer}>
						<Grid item xs={6} className={classes.gridItem}>
							<div className={classes.relationLabel}>
								{t("documentsModule.upsert.system")}
							</div>
							<div className={classes.relationData}>
								{data.system ? data.system.name : t("general.noData")}
							</div>
						</Grid>
						<Grid item xs={6} className={classes.gridItem}>
							<div className={classes.relationLabel}>
								{t("documentsModule.upsert.fault")}
							</div>
							<div className={classes.relationData}>
								{data.fault ? (
									<ItemLink itemId={data.fault.faultId} module="faults" />
								) : (
									t("general.noData")
								)}
							</div>
						</Grid>
					</Grid>
					<Grid container className={classes.relationContainer}>
						<Grid item xs={6} className={classes.gridItem}>
							<div className={classes.relationLabel}>
								{t("documentsModule.upsert.task")}
							</div>
							<div className={classes.relationData}>
								{data.task ? data.task.taskId : t("general.noData")}
							</div>
						</Grid>
						<Grid item xs={6} className={classes.gridItem}>
							<div className={classes.relationLabel}>
								{t("documentsModule.upsert.filetype")}
							</div>
							<div className={classes.relationData}>
								{getFileTypeName(data.type)}
							</div>
						</Grid>
					</Grid>
					<Grid container className={classes.relationContainer}>
						<Grid item xs={12} className={classes.gridItem}>
							<div className={classes.relationLabel}>
								{t("documentsModule.upsert.user")}
							</div>
							<div className={classes.relationData}>
								{data.user ? (
									<div className={classes.userContainer}>
										<UserItem
											user={data.user}
											showName
											size={11}
											avatarSize={30}
										/>
									</div>
								) : (
									t("general.noData")
								)}
							</div>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	mainContainer: {
		padding: "10px",
	},
	docContainer: {
		color: "white",
		background: "rgba(0,0,0,0.3)",
		border: "1px solid rgba(255,255,255,0.2)",
		borderRadius: "10px",
		padding: "20px",
	},
	descContainer: {
		fontSize: "16px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
	},
	docId: {
		fontSize: "13px",
		padding: "7px",
	},
	relationContainer: {
		padding: "5px 10px",
		display: "flex",
		justifyContent: "space-between",
		color: "white",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
	},
	gridItem: {
		display: "flex",
		flexDirection: "column",
	},
	relationLabel: {
		padding: "3px 0",
		fontSize: "12px",
		color: "rgba(255,255,255,0.6)",
	},
	relationData: {
		fontSize: "14px",
	},
	controls: {
		display: "flex",
		justifyContent: "flex-end",
		alignItems: "center",
		padding: "10px 0",
	},
	expandIcon: {
		color: "white",
		padding: "10px",
		background: "rgba(0,0,0,0.3)",
		"&:hover": {
			background: "rgba(0,0,0,0.5)",
		},
	},
	icon: {
		fontSize: "18px",
	},
	dataContainer: {
		padding: "10px 10px 20px",
		background: "rgba(0,0,0,0.3)",
		borderRadius: "10px",
		margin: "10px 0 0",
	},
	sideGridItem: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		padding: "10px",
	},
	fileTypeContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		background: "rgba(0,0,0,0.3)",
		borderRadius: "5px",
		padding: "15px 10px",
	},
	fileTypeIcon: {
		fontSize: "48px",
		color: "rgba(255,255,255,0.5)",
	},
	fileTypeData: {
		direction: "rtl",
		color: "rgba(255,255,255,0.8)",
	},
	userContainer: {
		background: "rgba(0,0,0,0.3)",
		borderRadius: "50px",
		padding: "5px 20px 5px 5px",
		width: "fit-content",
	},
	createdAt: {
		fontSize: "12px",
		background: "rgba(0,0,0,0.4)",
		borderRadius: "10px",
		padding: "6px 15px",
		width: "fit-content",
		margin: "5px 0 0 0",
	},
}));
