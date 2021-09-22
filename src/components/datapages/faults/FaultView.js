import { Grid, IconButton, makeStyles, useMediaQuery } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import BlurOnRoundedIcon from "@material-ui/icons/BlurOnRounded";
import RoomIcon from "@material-ui/icons/Room";
import clsx from "clsx";
import { format, parseISO } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router";
import { getFullAddress } from "../../../api/assetsApi";
import * as faultApi from "../../../api/faultsApi";
import { generateItemLink } from "../../../api/genericApi";
import { LanguageContext } from "../../../context/LanguageContext";
import { SnackbarContext } from "../../../context/SnackbarContext";
import { UpsertContext } from "../../../context/UpsertContext";
import { AddRelatedUser } from "../../reuseables/AddRelatedUser";
import { Carousel } from "../../reuseables/Carousel";
import { CommentSection } from "../../reuseables/CommentSection";
import { ItemLink } from "../../reuseables/ItemLink";
import { LoadingProgress } from "../../reuseables/LoadingProgress";
import { ReturnToPrevios } from "../../reuseables/ReturnToPrevious";
import { StatusTag } from "../../reuseables/StatusTag";
import { UpdateOwner } from "../../reuseables/UpdateOwner";
import { UpdateStatus } from "../../reuseables/UpdateStatus";
import { UserList } from "../../reuseables/UserList";
import { UserItem } from "../../user/UserItem";
import { FaultLink } from "./FaultLink";
import { FaultViewControls } from "./FaultViewControls";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

export const FaultView = ({ fid, faultData, updateFaultState, isPreview }) => {
	const history = useHistory();
	const location = useLocation();
	const { t } = useTranslation();
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);
	const { setSnackbar } = useContext(SnackbarContext);
	const { setUpsertData } = useContext(UpsertContext);
	const downSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const [fault, setFault] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const { faultId } = useParams();
	const [changeOwner, setChangeOwner] = useState(false);
	const [addRelatedUserModal, setAddRelatedUserModal] = useState(null);
	const [changeStatus, setChangeStatus] = useState(null);

	useEffect(() => {
		if (fault) {
			setIsLoading(false);
		}
	}, [fault]);

	useEffect(() => {
		prepareData();
	}, [faultData, faultId]);

	const prepareData = async () => {
		if (faultData) {
			setFault(faultData);
			setIsLoading(false);
			return;
		}
		const res = await faultApi.getFault(faultId || fid, false);
		if (!res) {
			history.push("/workspace/faults");
		} else if (res.status === 403) {
			setSnackbar(res);
			history.push("/workspace/faults");
		}
		setFault(res);
	};

	const updateOwner = async (userId) => {
		const res = await faultApi.updateFaultOwner(fault._id, userId);
		if (res.status === 403) {
			setSnackbar(res);
		} else {
			setFault({
				...fault,
				owner: res.owner,
				relatedUsers: res.relatedUsers,
			});
			if (updateFaultState) {
				updateFaultState(res._id, "owner", res.owner);
			}
		}
		setChangeOwner(false);
	};

	const removeRelatedUser = async (userId) => {
		const res = await faultApi.removeRelatedUser(fault._id, userId);
		if (res.status === 403) {
			setSnackbar(res);
		} else if (res) {
			setFault({
				...fault,
				relatedUsers: res.relatedUsers,
			});
			if (updateFaultState) {
				updateFaultState(res._id, "relatedUsers", res.relatedUsers);
			}
		}
	};

	const addRelatedUser = (userId) => async (event) => {
		event.stopPropagation();
		const res = await faultApi.addRelatedUser(fault._id, userId);
		if (res.status === 403) {
			setSnackbar(res);
		} else if (res) {
			setFault({
				...fault,
				relatedUsers: res.relatedUsers,
			});
			if (updateFaultState) {
				updateFaultState(res._id, "relatedUsers", res.relatedUsers);
			}
		}
		setAddRelatedUserModal(null);
	};

	const handleChangeStatus = async (statusId) => {
		const res = await faultApi.updateFaultStatus(fault._id, statusId);
		if (res.status === 403) {
			setSnackbar(res);
		} else if (res) {
			setFault({
				...fault,
				status: res.status,
				closedDate: res.closedDate,
			});
			if (updateFaultState) {
				updateFaultState(res._id, "status", res.status);
			}
		}
		setChangeStatus(null);
	};

	const handleSaveComment = async (faultId, userId, text, image) => {
		const res = await faultApi.saveFaultComment(faultId, userId, text, image);
		if (res.status === 403) {
			setSnackbar(res);
			return Promise.resolve(null);
		} else if (res) {
			if (updateFaultState) {
				updateFaultState(res._id, "comments", res.comments);
			}
		}
		return Promise.resolve(res);
	};

	const handleUpdateComment = async (faultId, commentId, text) => {
		const res = await faultApi.updateFaultComment(faultId, commentId, text);
		if (res.status === 403) {
			setSnackbar(res);
			return Promise.resolve(null);
		} else if (res) {
			if (updateFaultState) {
				updateFaultState(res._id, "comments", res.comments);
			}
		}
		return Promise.resolve(res);
	};

	const toggleEditMode = (faultId) => (event) => {
		setUpsertData({ itemId: faultId, module: "faults" });
	};

	const handleCreateLink = async () => {
		if (navigator.clipboard) {
			await navigator.clipboard.writeText(
				generateItemLink("faults", fault.faultId)
			);
			setSnackbar({
				severity: "success",
				text: t("reportsModule.copiedToClipboard"),
			});
			return;
		}
		setSnackbar({ severity: "error", text: t("reportsModule.linkNotCopied") });
	};

	return isLoading ? (
		<LoadingProgress />
	) : (
		<React.Fragment>
			<Grid
				container
				className={clsx(
					classes.container,
					isPreview && classes.previewContainer
				)}
				justify="space-between"
				alignItems="flex-start"
			>
				<div className={classes.topHeaderGriditem}>
					<div className={classes.faultId}>
						<ItemLink itemId={fault.faultId} module={"faults"} size={13} />
					</div>
					<div className={classes.statusTagContainer}>
						<div
							className={classes.controlsGriditem}
							onClick={() => setChangeStatus(true)}
							style={{
								justifyContent: "flex-start",
								cursor: "pointer",
							}}
						>
							<StatusTag status={fault.status} type="fault" size={16} />
						</div>
					</div>
					<div className={classes.controls}>
						<div className={classes.control}>
							<FaultViewControls
								fault={fault}
								editFault={toggleEditMode(fault._id)}
								updateOwner={() => setChangeOwner(true)}
								changeStatus={() => setChangeStatus(true)}
								handleCreateLink={handleCreateLink}
							/>
						</div>
						<div className={classes.control}>
							<ReturnToPrevios fontSize={16} size={35} />
						</div>
					</div>
				</div>
				{Boolean(fault.images.length) && (
					<Carousel
						images={fault.images}
						isOpen={Boolean(fault.images.length)}
						size={downSm ? 300 : 500}
					/>
				)}
				<div className={classes.detailsContainer}>
					<div className={clsx(classes.detailPill, classes.asset)}>
						<HomeRoundedIcon className={classes.systemIcon} />
						{getFullAddress(fault.asset)}
					</div>
					<div
						className={clsx(
							classes.detailPill,
							classes.system,
							!fault.system && classes.notAssigned
						)}
					>
						<BlurOnRoundedIcon className={classes.systemIcon} />
						{fault.system ? fault.system.name : t("general.noSystemAssigned")}
					</div>
					<div
						className={clsx(
							classes.detailPill,
							classes.location,
							!fault.location && classes.notAssigned
						)}
					>
						<RoomIcon className={classes.systemIcon} />
						{fault.location
							? fault.location.name
							: t("general.noLocationAssigned")}
					</div>

					{!fault.asset && (
						<Grid item xs={12}>
							<div
								className={clsx(
									classes.detailPill,
									classes.taskNotLinkedToAsset
								)}
							>
								<InfoOutlinedIcon className={classes.infoIcon} />
								{t("tasksModule.taskNotLinkedToAsset")}
							</div>
						</Grid>
					)}
				</div>

				<Grid
					item
					xs={12}
					sm={12}
					md={12}
					lg={8}
					xl={9}
					className={classes.rightContainer}
				>
					<div className={classes.title}>{fault.title}</div>
					<div className={clsx(classes.dataContainer, classes.desc)}>
						{fault.description}
						<div className={classes.tagsContainer}>
							{fault.tags.map((tag) => (
								<div className={classes.tag} key={tag._id}>
									{tag.value}
								</div>
							))}
						</div>
					</div>
					<div className={classes.itemDates}>
						<div className={classes.openDate}>
							{`${t("general.createDate")} ${format(
								parseISO(fault.createdAt),
								lang.dateformat
							)}`}
						</div>
						{Boolean(fault.closedDate) && fault.status.state === "close" && (
							<div className={classes.closedDate}>
								{`${t("general.closedDate")} ${format(
									parseISO(fault.closedDate),
									lang.dateformat
								)}`}
							</div>
						)}
					</div>
				</Grid>
				<Grid
					item
					xs={12}
					sm={12}
					md={12}
					lg={4}
					xl={3}
					className={classes.leftContainer}
				>
					<div className={clsx(classes.owner, classes.dataContainer)}>
						{
							<UserItem
								user={fault.owner || null}
								showTitle
								showPhone
								showName
								size={12}
								avatarSize={50}
							/>
						}
					</div>

					<div className={clsx(classes.userlist, classes.dataContainer)}>
						<UserList
							users={fault.relatedUsers}
							removeTooltip={t("faultsModule.controls.removeRelatedUser")}
							addTooltip={t("faultsModule.controls.addRelatedUser")}
							placeholder={t("faultsModule.noRelatedUsers")}
							title={t("faultsModule.relatedUsers")}
							handleRemove={removeRelatedUser}
							handleAdd={() => setAddRelatedUserModal(true)}
							module={"faults"}
							owner={fault.owner}
						/>
					</div>
				</Grid>
				<Grid item xs={12} className={classes.comments}>
					<CommentSection
						parent={fault}
						saveComment={handleSaveComment}
						updateComment={handleUpdateComment}
						module={"faults"}
					/>
				</Grid>
			</Grid>
			{changeOwner && (
				<UpdateOwner
					handleClose={() => setChangeOwner(false)}
					handleSave={updateOwner}
					isOpen={changeOwner}
					currentOwner={fault.owner}
					title={t("faultsModule.updateOwner")}
					instructions={t("faultsModule.updateOwnerInstructions")}
				/>
			)}

			{changeStatus && (
				<UpdateStatus
					handleClose={() => setChangeStatus(false)}
					handleSave={handleChangeStatus}
					isOpen={changeStatus}
					currentStatus={fault.status}
					title={t("faultsModule.changeStatus")}
					instructions={t("faultsModule.changeStatusInstructions")}
					module={"faults"}
				/>
			)}
			{addRelatedUserModal && (
				<AddRelatedUser
					handleClose={() => setAddRelatedUserModal(false)}
					handleSave={addRelatedUser}
					isOpen={addRelatedUserModal}
					followerList={[...fault.relatedUsers, fault.owner]}
					title={t("faultsModule.addRelatedUser")}
					instructions={t("faultsModule.addRelatedUserInstructions")}
				/>
			)}
		</React.Fragment>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		height: "calc(100% - 40px)",
		overflowY: "overlay",
		border: "solid rgba(255,255,255,0.2)",
		borderWidth: "0 1px",
		boxShadow: "0 0 5px 2px rgb(0 0 0 / 30%)",
		background: "rgba(255,255,255,0.2)",
		position: "relative",
		borderRadius: "8px",
		margin: "20px 0",
		[theme.breakpoints.down("xs")]: {
			border: "none",
			margin: "0",
			borderRadius: "0",
			height: "100%",
		},
	},
	previewContainer: {
		margin: "0",
		height: "100%",
		borderRadius: 0,
		boxShadow: "none",
		background: "rgba(0,0,0,0.2)",
	},
	rightContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		padding: "0 30px",
		[theme.breakpoints.down("sm")]: {
			padding: "0 15px",
		},
	},
	detailsContainer: {
		display: "flex",
		padding: "10px",
		flexWrap: "wrap",
	},
	detailPill: {
		borderRadius: "50px",
		padding: "7px 25px 7px 15px",
		width: "fit-content",
		textAlign: "center",
		whiteSpace: "nowrap",
		fontSize: "13px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		margin: "3px",
	},
	asset: {
		color: "white",
		background: "black",
	},
	system: {
		color: "white",
		background: "rgba(0,0,0,0.3)",
	},
	location: {
		color: "white",
		background: "rgba(0,0,0,0.2)",
	},
	systemIcon: {
		margin: "0 10px 0 0",
		fontSize: "18px",
	},
	userlist: {
		margin: "10px 0",
		[theme.breakpoints.down("sm")]: {
			width: "100%",
			display: "flex",
			justifyContent: "center",
		},
	},
	statusTagContainer: {
		margin: "0 10px",
	},
	title: {
		color: "white",
		fontSize: "22px",
		padding: "15px 0",
		alignSelf: "flex-end",
		width: "100%",
		marginTop: "20px",
	},
	desc: {
		padding: "20px",
		color: "white",
		width: "90%",
		wordBreak: "break-word",
	},
	leftContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "flex-end",
		padding: "10px 30px",
		[theme.breakpoints.down("sm")]: {
			alignItems: "center",
			padding: "10px 15px",
		},
	},
	owner: {
		padding: "5px 30px",
		borderRadius: "10px",
		width: "fit-content",
		height: "70px",
		[theme.breakpoints.down("sm")]: {
			width: "calc(100% - 60px)",
			display: "flex",
			justifyContent: "center",
		},
	},
	controls: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		width: "fit-content",
		marginLeft: "auto",
	},

	dataContainer: {
		background: "rgba(0,0,0,0.2)",
		wordBreak: "break-word",
		borderRadius: "8px",
		border: "1px solid rgba(255,255,255,0.2)",
		boxShadow: "0 0 3px 1px rgb(0 0 0 / 20%)",
	},
	control: {
		margin: "0 5px",
	},
	controlsGriditem: {
		display: "flex",
		justifyContent: "flex-end",
	},
	topHeaderGriditem: {
		display: "flex",
		justifyContent: "flex-start",
		padding: "20px 20px",
		width: "calc(100% - 40px)",
		height: "35px",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
		[theme.breakpoints.down("sm")]: {
			padding: "10px",
			width: "calc(100% - 20px)",
		},
	},
	faultId: {
		padding: "5px 20px",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		background: "rgba(0,0,0,0.6)",
		borderRadius: "50px",
	},
	linked: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		background: "rgba(0,0,0,0.4)",
		margin: "10px 0",
		borderRadius: "10px",
		padding: "10px 0",
		height: "300px",
	},
	linkedHeader: {
		color: "white",
		fontSize: "16px",
		padding: "5px",
		margin: "0px auto",
		width: "80%",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
	},
	relatedUsersList: {
		padding: "5px",
		overflowY: "auto",
	},
	listItem: {
		width: "250px",
		borderRadius: "5px",
		"&:hover": {
			background: "rgba(0,0,0,0.4)",
		},
	},
	removeUser: {
		color: "white",
		"&:hover": {
			background: "rgba(0,0,0,0.3)",
		},
	},
	itemDates: {
		padding: "10px 0",
		display: "flex",
		alignItems: "flex-start",
		[theme.breakpoints.down("sm")]: {
			justifyContent: "space-evenly",
		},
	},
	openDate: {
		color: "white",
		fontSize: "14px",
		padding: "7px 15px",
		background: "rgba(0,0,0,0.4)",
		width: "fit-content",
		borderRadius: "5px",
		height: "fit-content",
		whiteSpace: "nowrap",
		[theme.breakpoints.down("sm")]: {
			fontSize: "11px",
			padding: "4px 15px",
		},
	},
	closedDate: {
		color: "white",
		fontSize: "14px",
		padding: "7px 15px",
		background: "green",
		width: "fit-content",
		borderRadius: "5px",
		height: "fit-content",
		margin: "0 3px",
		whiteSpace: "nowrap",
		[theme.breakpoints.down("sm")]: {
			fontSize: "11px",
			padding: "4px 15px",
		},
	},
	status: {
		margin: "10px 0",
	},
	notAssigned: {
		filter: "brightness(80%)",
	},
	tagsContainer: {
		display: "flex",
		padding: "4px 0",
		width: "fit-content",
		borderRadius: "50px",
		marginTop: "30px",
		flexFlow: "wrap",
	},
	tag: {
		background: "rgba(255,255,255,0.5)",
		borderRadius: "50px",
		padding: "0px 10px",
		display: "grid",
		placeItems: "center",
		fontSize: "12px",
		margin: "4px 3px",
		height: "22px",
		color: "black",
		lineHeight: 1,
	},
	addTag: {
		color: "white",
		borderRadius: "50px",
		fontSize: "11px",
		height: "22px",
		width: "22px",
		border: "1px solid rgba(255,255,255,0.4)",
		padding: 0,
		margin: "4px 3px",
	},
	addTagIcon: {
		fontSize: "16px",
	},
}));
