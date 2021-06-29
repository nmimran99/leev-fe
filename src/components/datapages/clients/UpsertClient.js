import {
	Backdrop,
	Button,
	Fade,
	FormControlLabel,
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
import clsx from "clsx";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createTenant, getTenant, updateTenant } from "../../../api/adminApi";
import {
	getFullName,
	getSuccessMessage,
	localizations,
} from "../../../api/genericApi";
import { AuthContext } from "../../../context/AuthContext";
import { LanguageContext } from "../../../context/LanguageContext";
import { SnackbarContext } from "../../../context/SnackbarContext";

export const UpsertClient = ({ handleClose, tenantId }) => {
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);
	const { auth } = useContext(AuthContext);
	const { t } = useTranslation();
	const { setSnackbar } = useContext(SnackbarContext);
	const [mode, setMode] = useState(tenantId ? "update" : "create");
	const [errors, setErrors] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [details, setDetails] = useState({
		name: "",
		contactName: "",
		contactNumber: "",
		lang: "",
		isActive: true,
	});

	useEffect(() => {
		if (!tenantId) setIsLoading(false);
		getTenant(tenantId)
			.then((data) => {
				setDetails({
					name: data.name,
					contactNumber: data.contactNumber,
					contactName: data.contactName,
					lang: data.lang,
					isActive: data.isActive
				});
			})
			.finally(() => setIsLoading(false));
	}, []);

	const validateFields = () => {
		return new Promise((resolve, reject) => {
			let errList = [];
			if (!details.name) {
				errList.push({ field: "name", text: t("errors.isRequired") });
			}
			if (!details.contactName) {
				errList.push({ field: "contactName", text: t("errors.isRequired") });
			}
			if (!details.contactNumber) {
				errList.push({ field: "contactNumber", text: t("errors.isRequired") });
			}
			if (!details.lang) {
				errList.push({ field: "lang", text: t("errors.isRequired") });
			}

			if (errList.length) {
				setErrors(errList);
				resolve(false);
			}
			resolve(true);
		});
	};

	const handleClientSave = async (details) => {
		const res = await createTenant(details);
		if (res.status === 403) {
			setSnackbar(res);
			return;
		} else if (res) {
			setSnackbar(getSuccessMessage("client", res.name, "created"));
		}
	};

	const handleUpdateClient = async (details) => {
		const res = await updateTenant(details);
		if (res.status === 403 || res.status === 405) {
			setSnackbar(res);
			return;
		} else if (res) {
			setSnackbar(getSuccessMessage("client", res.name, "updated"));
		}
	};

	const handleConfirm = () => {
		validateFields()
			.then((res) => {
				if (!res) return;
				if (mode === "update") {
					return handleUpdateClient({ tenantId, ...details });
				}
				return handleClientSave(details);
			})
			.finally(() => {
				handleClose();
			});
	};

	const handleChange = (field) => async (event) => {
		let val = ["isActive"].includes(field)
			? event.target.checked
			: event.target.value;
		setDetails({
			...details,
			[field]: val,
		});
		if (errors.length) {
			setErrors(errors.filter((err) => err.field !== field));
		}
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
											? t("clientsModule.upsert.editClientDetails")
											: t("clientsModule.upsert.createClient")}
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
											{t("clientsModule.upsert.generalDetails")}
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
													label={t(`clientsModule.name`)}
													error={
														errors.filter((e) => e.field === `name`).length > 0
													}
													value={details.name}
													onChange={handleChange("name")}
													className={classes.textField}
													size={"medium"}
													helperText={
														errors.filter((e) => e.field === `name`).length >
															0 && t("errors.isRequired")
													}
													inputProps={{
														maxLength: 60,
													}}
													FormHelperTextProps={{
														style: {
															color:
																errors.filter((e) => e.field === `name`)
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
													label={t(`clientsModule.contactName`)}
													error={
														errors.filter((e) => e.field === `contactName`)
															.length > 0
													}
													value={details.contactName}
													onChange={handleChange("contactName")}
													className={classes.textField}
													size={"medium"}
													helperText={
														errors.filter((e) => e.field === `contactName`)
															.length > 0 && t("errors.isRequired")
													}
													inputProps={{
														maxLength: 60,
													}}
													FormHelperTextProps={{
														style: {
															color:
																errors.filter((e) => e.field === `contactName`)
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
													label={t(`clientsModule.contactNumber`)}
													error={
														errors.filter((e) => e.field === `contactNumber`)
															.length > 0
													}
													type="tel"
													value={details.contactNumber}
													onChange={handleChange("contactNumber")}
													className={classes.textField}
													size={"medium"}
													helperText={
														errors.filter((e) => e.field === `contactNumber`)
															.length > 0 && t("errors.isRequired")
													}
													inputProps={{
														maxLength: 60,
													}}
													FormHelperTextProps={{
														style: {
															color:
																errors.filter(
																	(e) => e.field === `contactNumber`
																).length > 0 && "rgb(244, 67, 54)",
														},
													}}
												/>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<Grid
									item
									xs={12}
									sm={6}
									md={6}
									lg={4}
									xl={4}
									className={classes.section}
								>
									<Grid item xs={12}>
										<div className={classes.sectionTitle}>
											{t("clientsModule.lang")}
										</div>
									</Grid>
									<Grid item xs={12} className={classes.fields}>
										<Grid container justify="flex-start">
											<Grid item xs={12} className={classes.textContainer}>
												<Select
													variant={"outlined"}
													error={
														errors.filter((e) => e.field === `lang`).length > 0
													}
													value={details.lang}
													onChange={handleChange(`lang`)}
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
													{Object.entries(localizations).map((lng, i) => (
														<MenuItem
															key={i}
															value={lng[1].code}
															style={{ direction: lang.dir }}
															className={classes.menuitem}
														>
															{t(`languages.${lng[0]}`)}
														</MenuItem>
													))}
												</Select>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<Grid
									item
									xs={12}
									sm={6}
									md={6}
									lg={4}
									xl={4}
									className={classes.section}
								>
									<Grid item xs={12}>
										<div className={classes.sectionTitle}>
											{t("clientsModule.upsert.isActive")}
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
															? t("clientsModule.upsert.active")
															: t("clientsModule.upsert.inactive")
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
		"input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button":
			{
				"-webkit-appearance": "none",
				margin: "0",
			},
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
		maxHeight: "80vh",
		[theme.breakpoints.down("sm")]: {
			maxHeight: "81vh",
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
