import {
	Backdrop,
	Button,
	Fade,
	Grid,
	IconButton,
	makeStyles,
	Modal,
	Paper,
	TextField
} from "@material-ui/core";
import { ClearRounded } from "@material-ui/icons";
import clsx from "clsx";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getServerError } from "../../../api/genericApi";
import {
	getInitialPermissionsObject,
	getRole
} from "../../../api/permissionsApi";
import { AuthContext } from "../../../context/AuthContext";
import { LanguageContext } from "../../../context/LanguageContext";
import { SnackbarContext } from "../../../context/SnackbarContext";
import { LoadingProgress } from "../../reuseables/LoadingProgress";
import { Permission } from "./Permission";

export const UpsertRole = ({
	handleClose,
	handleSave,
	handleUpdate,
	roleId,
}) => {
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);
	const { auth } = useContext(AuthContext);
	const { t } = useTranslation();
	const { setSnackbar } = useContext(SnackbarContext);
	const [mode, setMode] = useState(roleId ? "update" : "create");
	const [errors, setErrors] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [permissions, setPermissions] = useState(getInitialPermissionsObject());
	const [roleName, setRoleName] = useState("");

	useEffect(() => {
		if (!roleId) {
			setIsLoading(false);
			return;
		}
		getRole(roleId)
			.then((res) => {
				if (!res || res.status === 500) {
					setSnackbar(getServerError());
					handleClose();
				} else if (res.status === 403) {
					setSnackbar(res);
					handleClose();
				}
				setPermissions(res.permissions);
				setRoleName(res.roleName);
			})
			.finally(() => setIsLoading(false));
	}, []);

	useEffect(() => {
		console.log(permissions);
	}, [permissions]);

	const validateFields = () => {
		return new Promise((resolve, reject) => {
			let errList = [];
			if (!roleName) {
				errList.push({ field: "roleName", text: t("errors.isRequired") });
			}

			if (errList.length) {
				setErrors(errList);
				resolve(false);
			}
			resolve(true);
		});
	};

	const handleConfirm = () => {
		validateFields()
			.then((res) => {
				if (!res) throw "";
				if (mode === "update") {
					handleUpdate(roleId, roleName, permissions);
					return;
				}
				handleSave(roleName, permissions);
			})
			.then(handleClose)
			.catch(() => {
				return;
			});
	};

	const handleSliderChange = (module, field, value) => {
		console.log(module, field, value);
		setPermissions((prevState) => {
			return prevState.map((r) => {
				if (r.module === module) {
					r[field] = value;
				}
				return r;
			});
		});
	};

	return isLoading ? (
		<LoadingProgress />
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
											? t("roles.upsert.editPermissions")
											: t("roles.upsert.createRole")}
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
								<Grid
									container
									className={classes.permissionList}
									justify="flex-start"
								>
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
														label={t(`roles.roleName`)}
														error={
															errors.filter((e) => e.field === `roleName`)
																.length > 0
														}
														value={roleName}
														onChange={(e) => setRoleName(e.target.value)}
														className={classes.textField}
														helperText={
															errors.filter((e) => e.field === `roleName`)
																.length > 0 && t("errors.isRequired")
														}
														FormHelperTextProps={{
															style: {
																color:
																	errors.filter((e) => e.field === `roleName`)
																		.length > 0 && "rgb(244, 67, 54)",
															},
														}}
														inputProps={{
															maxLength: 60,
														}}
													/>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
									{permissions.map((r, i) => (
										<Grid item xs={12} className={classes.section}>
											<Grid item xs={12}>
												<div className={classes.sectionTitle}>
													{t(`roles.${r.module}`)}
												</div>
											</Grid>
											<Grid item xs={12} className={classes.fields}>
												<Grid container justify="flex-start">
													<Grid item xs={12} className={classes.textContainer}>
														{Object.keys(r).map((rp) => {
															if (rp === "module") return;
															const isBoolean = ["create", "delete"].includes(
																rp
															);
															return (
																<Permission
																	isBoolean={isBoolean}
																	module={r["module"]}
																	text={rp}
																	value={r[rp]}
																	handleValueChange={handleSliderChange}
																/>
															);
														})}
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									))}
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
	permissionList: {
		height: "calc(80vh - 138px)",
		overflowY: "overlay",
		padding: "10px ",
		[theme.breakpoints.down("sm")]: {
			padding: "10px 0px",
			height: "calc(81vh - 138px)",
		},
	},
	paper: {
		background: "rgba(0,0,0,0.1)",
		border: "1px solid rgba(255,255,255,0.2)",
		borderRadius: "10px",
		padding: "10px 20px",
		height: "80vh",
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
		height: "64px",
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
		fontSize: "24px",
	},
	section: {
		margin: "10px 5px",
		padding: "10px 10px 50px",
		borderBottom: "1px solid rgba(255,255,255,0.6)",
	},
	sectionTitle: {
		color: "white",
		fontSize: "20px",
		padding: "10px 20px",
		width: "fit-content",
		borderRadius: "10px 10px 0 0",
		background: "rgba(0,0,0,0.2)",
		whiteSpace: "nowrap",
		[theme.breakpoints.down("sm")]: {
			fontSize: "24px",
		},
	},
	fields: {
		padding: "10px 20px",
		borderRadius: "0px 10px 10px 10px",
		background: "rgba(0,0,0,0.4)",
		[theme.breakpoints.down("sm")]: {
			padding: "10px 0",
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
		height: "000px",
		overflowY: "auto",
		border: "1px solid rgba(055,055,055,0.0)",
		marginRight: "7px",
		marginLeft: "-5px",
	},
	menuitem: {
		color: "white",
		width: "100%",
		"&:hover": {
			background: "rgba(055,055,055,0.1)",
		},
	},
	controls: {
		borderTop: "1px solid rgba(255,255,255,0.2)",
		padding: "12px 0",
		display: "flex",
		justifyContent: "space-between",
		height: "74px",
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
		background: "rgba(0,0,0,0.0)",
		"&:hover": {
			background: "black",
		},
		"&:disabled": {
			color: "rgba(255,255,255,0.3)",
		},
	},
	cancel: {
		"&:hover": {
			boxShadow: "inset rgba(255,255,255,0.3) 0 0 0px 1px",
		},
	},
}));
