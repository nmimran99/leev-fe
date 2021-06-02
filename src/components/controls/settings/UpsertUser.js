import DateFnsUtils from "@date-io/date-fns";
import {
	Backdrop,
	Button,
	Fade,
	FormControlLabel,
	FormHelperText,
	Grid,
	IconButton,
	LinearProgress,
	makeStyles,
	MenuItem,
	Modal,
	Paper,
	Select,
	Switch,
	TextField,
} from "@material-ui/core";
import { ClearRounded } from "@material-ui/icons";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import clsx from "clsx";
import heLocale from "date-fns/locale/he";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getFullName, getSuccessMessage } from "../../../api/genericApi";
import { getRoles, getRolesSuggestions } from "../../../api/permissionsApi";
import {
	createUser,
	getUserDataById,
	updateUserData,
} from "../../../api/userApi";
import { AuthContext } from "../../../context/AuthContext";
import { LanguageContext } from "../../../context/LanguageContext";
import { SnackbarContext } from "../../../context/SnackbarContext";
import { Can } from "../../reuseables/Can";

export const UpsertUser = ({ handleClose, userId, reloadUsers }) => {
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);
	const { auth } = useContext(AuthContext);
	const { t } = useTranslation();
	const { setSnackbar } = useContext(SnackbarContext);
	const [mode, setMode] = useState(userId ? "update" : "create");
	const [errors, setErrors] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [roles, setRoles] = useState([]);
	const [details, setDetails] = useState({
		tenant: auth.user.tenant,
		email: "",
		firstName: "",
		lastName: "",
		birthDate: null,
		role: null,
		phoneNumber: "",
		employedBy: "",
		data: {
			isResident: false,
			isOwner: false,
		},
		isActive: true,
	});

	useEffect(() => {
		getRoles()
			.then((res) => {
				if (!res || res.status === 403 || res.status === 500) {
					return [];
				}
				return getRolesSuggestions(res);
			})
			.then((data) => {
				setRoles(data || []);
				if (!userId) {
					setIsLoading(false);
					return;
				}
				return getUserDataById(userId);
			})
			.then((res) => {
				if (!res) return;

				setDetails({
					...res,
					role: res.role._id,
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	const validateFields = () => {
		return new Promise((resolve, reject) => {
			let errList = [];
			if (!details.email) {
				errList.push({ field: "email", text: t("errors.isRequired") });
			}
			if (!details.firstName) {
				errList.push({ field: "firstName", text: t("errors.isRequired") });
			}
			if (!details.lastName) {
				errList.push({ field: "lastName", text: t("errors.isRequired") });
			}
			if (!details.phoneNumber) {
				errList.push({ field: "phoneNumber", text: t("errors.isRequired") });
			}
			if (!details.role) {
				errList.push({ field: "role", text: t("errors.isRequired") });
			}

			if (errList.length) {
				setErrors(errList);
				resolve(false);
			}
			resolve(true);
		});
	};

	const handleUserSave = async (details) => {
		const res = await createUser(details);
		if (res.status === 403) {
			setSnackbar(res);
			return;
		} else if (res) {
			setSnackbar(getSuccessMessage("user", getFullName(res), "created"));
		}
	};

	const handleUpdateUser = async (details) => {
		const res = await updateUserData(details);
		if (res.status === 403 || res.status === 405) {
			setSnackbar(res);
			return;
		} else if (res) {
			setSnackbar(getSuccessMessage("user", getFullName(res), "updated"));
		}
	};

	const handleConfirm = () => {
		validateFields()
			.then((res) => {
				if (!res) return;
				if (mode === "update") {
					return handleUpdateUser({ userId, ...details });
				}
				return handleUserSave(details);
			})
			.finally(() => {
				reloadUsers(true);
				handleClose();
			});
	};

	const handleChange = (field) => async (event) => {
		let val = ["isActive", "isResident", "isOwner"].includes(field)
			? event.target.checked
			: event.target.value;
		if (["isResident", "isOwner"].includes(field)) {
			setDetails({
				...details,
				data: {
					...details.data,
					[field]: val,
				},
			});
		} else {
			setDetails({
				...details,
				[field]: val,
			});
		}
		if (errors.length) {
			setErrors(errors.filter((err) => err.field !== field));
		}
	};

	const handleChangeDate = (date) => {
		setDetails({
			...details,
			birthDate: date,
		});
	};

	return isLoading ? (
		<LinearProgress />
	) : (
		<Modal
			open={true}
			onClose={handleClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
			className={classes.modal}
		>
			<Fade in={true}>
				<Grid
					container
					justify="center"
					alignItems="center"
					style={{ outline: "0" }}
				>
					<Grid
						item
						xs={12}
						sm={10}
						md={8}
						lg={8}
						xl={6}
						className={classes.gridCont}
					>
						<Paper
							elevation={6}
							className={classes.paper}
							style={{ direction: lang.dir }}
						>
							<Grid container>
								<Grid item xs={12} className={classes.headerRow}>
									<div className={classes.title}>
										{mode === "update"
											? t("users.upsert.editUserDetails")
											: t("users.upsert.createUser")}
									</div>
									<div className={classes.close}>
										<IconButton
											className={classes.iconBtn}
											onClick={handleClose}
										>
											<ClearRounded className={classes.icon} />
										</IconButton>
									</div>
								</Grid>
								<Grid item xs={12} className={classes.section}>
									<Grid item xs={12}>
										<div className={classes.sectionTitle}>
											{t("users.upsert.generalDetails")}
										</div>
									</Grid>
									<Grid item xs={12} className={classes.fields}>
										<Grid container justify="flex-start">
											<Grid
												item
												xs={12}
												sm={6}
												md={6}
												lg={4}
												xl={4}
												className={classes.textContainer}
											>
												<TextField
													variant={"outlined"}
													label={t(`users.email`)}
													error={
														errors.filter((e) => e.field === `email`).length > 0
													}
													value={details.email}
													onChange={handleChange("email")}
													className={classes.textField}
													size={"medium"}
													helperText={
														errors.filter((e) => e.field === `email`).length >
															0 && t("errors.isRequired")
													}
													inputProps={{
														maxLength: 60,
													}}
													FormHelperTextProps={{
														style: {
															color:
																errors.filter((e) => e.field === `email`)
																	.length > 0 && "rgb(244, 67, 54)",
														},
													}}
												/>
											</Grid>
											<Grid
												item
												xs={12}
												sm={6}
												md={6}
												lg={4}
												xl={4}
												className={classes.textContainer}
											>
												<TextField
													variant={"outlined"}
													label={t(`users.firstName`)}
													error={
														errors.filter((e) => e.field === `firstName`)
															.length > 0
													}
													value={details.firstName}
													onChange={handleChange("firstName")}
													className={classes.textField}
													size={"medium"}
													helperText={
														errors.filter((e) => e.field === `firstName`)
															.length > 0 && t("errors.isRequired")
													}
													inputProps={{
														maxLength: 60,
													}}
													FormHelperTextProps={{
														style: {
															color:
																errors.filter((e) => e.field === `firstName`)
																	.length > 0 && "rgb(244, 67, 54)",
														},
													}}
												/>
											</Grid>
											<Grid
												item
												xs={12}
												sm={6}
												md={6}
												lg={4}
												xl={4}
												className={classes.textContainer}
											>
												<TextField
													variant={"outlined"}
													label={t(`users.lastName`)}
													error={
														errors.filter((e) => e.field === `lastName`)
															.length > 0
													}
													value={details.lastName}
													onChange={handleChange("lastName")}
													className={classes.textField}
													size={"medium"}
													helperText={
														errors.filter((e) => e.field === `lastName`)
															.length > 0 && t("errors.isRequired")
													}
													inputProps={{
														maxLength: 60,
													}}
													FormHelperTextProps={{
														style: {
															color:
																errors.filter((e) => e.field === `lastName`)
																	.length > 0 && "rgb(244, 67, 54)",
														},
													}}
												/>
											</Grid>
											<Grid
												item
												xs={12}
												sm={6}
												md={6}
												lg={4}
												xl={4}
												className={classes.textContainer}
											>
												<TextField
													variant={"outlined"}
													label={t(`users.phoneNumber`)}
													error={
														errors.filter((e) => e.field === `phoneNumber`)
															.length > 0
													}
													value={details.phoneNumber}
													onChange={handleChange("phoneNumber")}
													className={classes.textField}
													size={"medium"}
													helperText={
														errors.filter((e) => e.field === `phoneNumber`)
															.length > 0 && t("errors.isRequired")
													}
													type="tel"
													inputProps={{
														maxLength: 60,
													}}
													FormHelperTextProps={{
														style: {
															color:
																errors.filter((e) => e.field === `phoneNumber`)
																	.length > 0 && "rgb(244, 67, 54)",
														},
													}}
												/>
											</Grid>
											<Grid
												item
												xs={12}
												sm={6}
												md={6}
												lg={4}
												xl={4}
												className={classes.textContainer}
											>
												<MuiPickersUtilsProvider
													utils={DateFnsUtils}
													locale={heLocale}
												>
													<DatePicker
														format="dd/MM/yyyy"
														label={t(`users.birthDate`)}
														value={details.birthDate}
														onChange={handleChangeDate}
														inputVariant={"outlined"}
														className={classes.textField}
														autoOk={true}
														disableFuture={true}
													/>
												</MuiPickersUtilsProvider>
											</Grid>
											<Grid
												item
												xs={12}
												sm={6}
												md={6}
												lg={4}
												xl={4}
												className={classes.textContainer}
											>
												<TextField
													variant={"outlined"}
													label={t(`users.employedBy`)}
													error={
														errors.filter((e) => e.field === `employedBy`)
															.length > 0
													}
													value={details.employedBy}
													onChange={handleChange("employedBy")}
													className={classes.textField}
													size={"medium"}
													helperText={
														errors.filter((e) => e.field === `employedBy`)
															.length > 0 && t("errors.isRequired")
													}
													inputProps={{
														maxLength: 60,
													}}
													FormHelperTextProps={{
														style: {
															color:
																errors.filter((e) => e.field === `employedBy`)
																	.length > 0 && "rgb(244, 67, 54)",
														},
													}}
												/>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<Can module="roles" action="update">
									<Grid item xs={12} sm={6} lg={4} className={classes.section}>
										<Grid item xs={12}>
											<div className={classes.sectionTitle}>
												{t("users.upsert.role")}
											</div>
										</Grid>
										<Grid item xs={12} className={classes.fields}>
											<Grid container justify="flex-start">
												<Grid item xs={12} className={classes.textContainer}>
													<Select
														variant={"outlined"}
														error={
															errors.filter((e) => e.field === `role`).length >
															0
														}
														value={details.role}
														onChange={handleChange(`role`)}
														className={classes.selectInput}
														MenuProps={{
															anchorOrigin: {
																vertical: "bottom",
																horizontal: "center",
															},
															transformOrigin: {
																vertical: "top",
																horizontal: "center",
															},
															getContentAnchorEl: null,
															classes: {
																paper: classes.menupaper,
															},
														}}
													>
														{roles.map((role, i) => (
															<MenuItem
																key={i}
																value={role.value}
																style={{ direction: lang.dir }}
																className={classes.menuitem}
															>
																{role.name}
															</MenuItem>
														))}
													</Select>
													{errors.filter((e) => e.field === "asset").length >
														0 && (
														<FormHelperText
															style={{ color: "#f44336", marginRight: "15px" }}
														>
															{t("errors.isRequired")}
														</FormHelperText>
													)}
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</Can>

								<Can module="roles" action="update">
									<Grid item xs={12} sm={6} lg={4} className={classes.section}>
										<Grid item xs={12}>
											<div className={classes.sectionTitle}>
												{t("users.upsert.activity")}
											</div>
										</Grid>
										<Grid item xs={12} className={classes.fields}>
											<Grid container justify="flex-start">
												<Grid item xs={12} className={classes.textContainer}>
													<FormControlLabel
														className={classes.switchLabel}
														control={
															<Switch
																checked={details.isActive}
																onChange={handleChange("isActive")}
																classes={{
																	switchBase: classes.switchBase,
																	checked: classes.checked,
																	track: classes.track,
																}}
															/>
														}
														label={
															details.isActive
																? t("users.upsert.userActive")
																: t("users.upsert.userInactive")
														}
													/>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</Can>
								<Grid item xs={12} className={classes.section}>
									<Grid item xs={12}>
										<div className={classes.sectionTitle}>
											{t("users.upsert.residency")}
										</div>
									</Grid>
									<Grid item xs={12} className={classes.fields}>
										<Grid container justify="flex-start">
											<Grid item xs={12} className={classes.textContainer}>
												<FormControlLabel
													className={classes.switchLabel}
													control={
														<Switch
															checked={details.data.isResident}
															onChange={handleChange("isResident")}
															classes={{
																switchBase: classes.switchBase,
																checked: classes.checked,
																track: classes.track,
															}}
														/>
													}
													label={
														details.data.isResident
															? t("users.upsert.isResident")
															: t("users.upsert.notResident")
													}
												/>
											</Grid>
											<Grid item xs={12} className={classes.textContainer}>
												<FormControlLabel
													className={classes.switchLabel}
													control={
														<Switch
															checked={details.data.isOwner}
															onChange={handleChange("isOwner")}
															classes={{
																switchBase: classes.switchBase,
																checked: classes.checked,
																track: classes.track,
															}}
														/>
													}
													label={
														details.data.isOwner
															? t("users.upsert.isOwner")
															: t("users.upsert.notOwner")
													}
												/>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} className={classes.controls}>
									<Button
										className={clsx(classes.control, classes.save)}
										onClick={handleConfirm}
									>
										{t("controls.confirm")}
									</Button>
									<Button
										className={clsx(classes.control, classes.cancel)}
										onClick={handleClose}
									>
										{t("controls.cancel")}
									</Button>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</Fade>
		</Modal>
	);
};

const useStyles = makeStyles((theme) => ({
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		backdropFilter: "blur(10px)",
	},

	gridCont: {
		height: "fit-content",
	},
	paper: {
		background: "rgba(0,0,0,0.4)",
		border: "1px solid rgba(255,255,255,0.2)",
		borderRadius: "10px",
		padding: "10px 20px",
		overflowY: "overlay",
		[theme.breakpoints.down("sm")]: {
			height: "81vh",
			top: 0,
			borderRadius: "0",
			border: "0",
			padding: "10px 5px",
		},
		"&:focus": {
			outline: "none",
		},
	},
	headerRow: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
	},
	title: {
		color: "white",
		padding: "20px 10px 10px",
		fontSize: "20px",
		whiteSpace: "nowrap",
	},
	iconBtn: {
		margin: "10px",
		"&:hover": {
			background: "rgba(0,0,0,0.3)",
		},
	},
	icon: {
		color: "white",
		fontSize: "20px",
	},
	section: {
		margin: "10px 5px",
	},
	sectionTitle: {
		color: "white",
		fontSize: "16px",
		padding: "10px 20px",
		width: "fit-content",
		borderRadius: "10px 10px 0 0",
		background: "rgba(0,0,0,0.4)",
		whiteSpace: "nowrap",
	},
	fields: {
		padding: "10px 20px",
		borderRadius: "0px 10px 10px 10px",
		background: "rgba(0,0,0,0.4)",
		[theme.breakpoints.down("sm")]: {
			padding: "10px",
		},
	},
	textContainer: {
		padding: "5px",
	},
	textField: {
		width: "100%",
		"& fieldset": {
			borderRadius: "5px",
		},
	},
	selectInput: {
		width: "100%",
		"& fieldset": {
			borderRadius: "5px",
		},
	},
	menupaper: {
		background: "rgba(0,0,0,0.8)",
		backdropFilter: "blur(10px)",
		height: "200px",
		overflowY: "auto",
		border: "1px solid rgba(255,255,255,0.2)",
		marginRight: "7px",
		marginLeft: "-5px",
	},
	menuitem: {
		color: "white",
		width: "100%",
		"&:hover": {
			background: "rgba(255,255,255,0.1)",
		},
	},
	controls: {
		borderTop: "1px solid rgba(255,255,255,0.2)",
		padding: "10px 0",
		display: "flex",
		justifyContent: "space-between",
	},
	control: {
		width: "30%",
		border: "1px solid rgba(255,255,255,0.5)",
		fontSize: "16px",
		margin: "5px",
		padding: "5px 30px",
		borderRadius: "30px",
		color: "white",
	},
	save: {
		background: "rgba(0,0,0,0.2)",
		"&:hover": {
			background: "black",
		},
		"&:disabled": {
			color: "rgba(255,255,255,0.3)",
		},
	},
	cancel: {
		"&:hover": {
			boxShadow: "inset rgba(255,255,255,0.3) 0 0 2px 1px",
		},
	},
	chips: {
		display: "flex",
		flexWrap: "wrap",
	},
	chip: {
		height: "50px",
		fontSize: "14px",
		borderRadius: "50px",
		display: "flex",
		justifyContent: "flex-start",
		color: "white",
		border: "1px solid rgba(255,255,255,0.2)",
		background: "rgba(0,0,0,0.6)",
		"&:hover": {
			background: "rgba(0,0,0,0.6)",
			boxShadow: "inset lightgrey 0px 0px 1px 1px",
		},
	},
	userCont: {
		height: "fit-content",
		padding: 0,
		margin: 0,
		margin: "5px 0",
	},
	chipsCont: {
		height: "fit-content",
		padding: 0,
		margin: "3px",
		borderRadius: "50px",
		background: "rgba(255,255,255,0.1)",
		boxShadow: "inset rgba(0,0,0,0.5) 0px 0px 2px 1px",
		display: "flex",
		jutifyContent: "space-between",
		alignItems: "center",
	},
	removeIcon: {
		color: "rgba(255,255,255,0.2)",
		padding: "5px",
		marginRight: "5px",
		borderRadius: "50px",
		"&:hover": {
			background: "rgba(0,0,0,0.8)",
			color: "white",
		},
	},
	radioGroup: {
		color: "white",
		display: "flex",
		flexDirection: "row",
		alignitems: "center",
	},
	radioBtn: {
		color: "white",
		padding: "15px",
	},
	filesUploaded: {
		color: "white",
		padding: "0 15px",
	},
	uploadBtn: {
		margin: "9px 0",
		background: "rgba(0,0,0,0.1)",
		color: "white",
		border: "1px solid rgba(255,255,255,0.2)",
		borderRadius: "50px",
		whiteSpace: "nowrap",
		"&:hover": {
			boxShadow: "inset white 0 0 2px 1px",
			background: "rgba(0,0,0,0.3)",
		},
	},
	imageRow: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "10px 5px",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
	},
	previewImage: {
		height: "50px",
		width: "100px",
	},
	removeImageBtn: {
		color: "rgba(255,255,255,0.5)",
		border: "1px solid rgba(255,255,255,0.5)",
		borderRadius: "50px",
		padding: "6px",
		"&:hover": {
			color: "white",
			borderColor: "white",
		},
	},
	uploadedImagesTitle: {
		color: "white",
		padding: "10px 5px",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
	},
	switchLabel: {
		color: "white",
		padding: "10px",
	},
	switchBase: {
		color: "rgba(255,255,255,0.4)",
		"&$checked": {
			color: "rgba(255,255,255,1)",
		},
		"&$checked + $track": {
			backgroundColor: "rgba(255,255,255,0.8)",
		},
	},
	checked: {},
	track: {
		backgroundColor: "rgba(255,255,255,0.4)",
	},
}));
