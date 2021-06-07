import {
	Avatar,
	Backdrop,
	Button,
	Chip,
	Fade,
	FormHelperText,
	Grid,
	IconButton,
    LinearProgress,
	makeStyles,
	MenuItem,
	Modal,
	Paper,
	Select,
	TextField,
} from "@material-ui/core";
import { ClearRounded } from "@material-ui/icons";
import clsx from "clsx";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getFullName } from "../../../api/genericApi";
import { getAssetsSuggestions } from "../../../api/systemsApi";
import { createUserOptions } from "../../../api/userApi";
import { LanguageContext } from "../../../context/LanguageContext";
import { UserItem } from "../../user/UserItem";
import { checkLocationName, getLocationData } from '../../../api/locationsApi';
import { SnackbarContext } from "../../../context/SnackbarContext";

export const UpsertLocation = ({
	handleClose,
	handleSave,
	handleUpdate,
	locationId
}) => {
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);
	const { t } = useTranslation();
    const { setSnackbar } = useContext(SnackbarContext);
	const [mode, setMode] = useState(handleUpdate ? "update" : "create");
	const [errors, setErrors] = useState([]);
	const [assets, setAssets] = useState([]);
	const [userList, setUserList] = useState([]);
	const [details, setDetails] = useState({
		name: "",
		asset: "",
		relatedUsers: [],
	});
    const [ isLoading, setIsLoading ] = useState(true);

	useEffect(() => {
		createUserOptions()
        .then((data) => {
			setUserList(data);
            return getAssetsSuggestions()
		})
        .then((data) => {
            if (data.length) {
                setAssets(data);
            }
        })
        .then(() => {
            if (!locationId) return;
            getLocationData(locationId)
            .then(res => {
                if (res.status === 403) {
                    setSnackbar(res);
                    handleClose();
                    return;
                }
                console.log(res)
                setDetails({
                    relatedUsers: res.relatedUsers,
                    name: res.name,
                    asset: res.asset
                })
            }) 
        })
        .finally(() => {
            setIsLoading(false)
        })
	}, []);
    
	const validateFields = () => {
		return new Promise((resolve, reject) => {
			let errList = [];
			if (handleUpdate) resolve(true);
			if (!details.asset) {
				errList.push({ field: "asset", text: t("errors.isRequired") });
			}
			if (!details.name) {
				errList.push({ field: "name", text: t("errors.isRequired") });
			}

			if (errList.length) {
				setErrors(errList);
				resolve(false);
			}
            if(errors.length) {
                resolve(false);
            }
			resolve(true);
		});
	};

	const handleConfirm = () => {
		validateFields().then((res) => {
			if (res) {
				if (mode === "update") {
					handleUpdate({ locationId, ...details });
                    handleClose();
					return;
				}
				handleSave({ ...details });
				return;
			}
		});
	};


	const handleChange = (field) => (event) => {
		setDetails({
			...details,
			[field]: event.target.value,
		});
		if (errors.length) {
			setErrors(errors.filter((err) => err.field !== field));
		}
	};

	const handleChangeMultiple = (event) => {
		setDetails({ ...details, relatedUsers: event.target.value });
	};

	const handleLinkedRemove = (realtedUser) => (event) => {
		event.stopPropagation();
		setDetails({
			...details,
			relatedUsers: details.relatedUsers.filter((lu) => lu !== realtedUser),
		});
	};

    const checkName = event => {
        checkLocationName({ asset: details.asset, name: details.name })
        .then((res) => {
            if (res) {
                setErrors([...errors, { field: "name", text: t("errors.nameAlreadyExists") }])
            } else {
                setErrors(errors.filter((err) => err.field !== 'name'));
            }
        })
    }


	return (
        isLoading ? 
        <LinearProgress /> :
		<Modal
			open={true}
			onClose={handleClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 300,
			}}
			className={classes.modal}
		>
			<Fade in={true} timeout={300}>
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
											? t("locationsModule.updateLocationDetails")
											: t("locationsModule.createLocation")}
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
									item
									xs={12}
									sm={6}
									md={6}
									lg={6}
									xl={6}
									className={classes.section}
								>
									<Grid item xs={12}>
										<div className={classes.sectionTitle}>
											{t("locationsModule.owningAsset")}
										</div>
									</Grid>
									<Grid item xs={12} className={classes.fields}>
										<Grid container justify="flex-start">
											<Grid item xs={12} className={classes.textContainer}>
												<Select
													variant={"outlined"}
													error={
														errors.filter((e) => e.field === `asset`).length > 0
													}
													value={details.asset}
													onChange={handleChange(`asset`)}
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
														disablePortal: true,
														classes: {
															paper: classes.menupaper,
														},
													}}
												>
													{assets.map((asset, i) => (
														<MenuItem
															key={i}
															value={asset.value}
															style={{ direction: lang.dir }}
															className={classes.menuitem}
														>
															{asset.text}
														</MenuItem>
													))}
												</Select>
												{errors.filter((e) => e.field === "asset").length >
													0 && (
													<FormHelperText
														style={{
															color: "#f44336",
															marginRight: "15px",
														}}
													>
														{t("errors.isRequired")}
													</FormHelperText>
												)}
											</Grid>
										</Grid>
									</Grid>
								</Grid>
                                <Grid
									item
									xs={12}
									sm={6}
									md={6}
									lg={6}
									xl={6}
									className={classes.section}
								>
									<Grid item xs={12}>
										<div className={classes.sectionTitle}>
											{t("locationsModule.locationName")}
										</div>
									</Grid>
									<Grid item xs={12} className={classes.fields}>
										<Grid container justify="flex-start">
											
											<Grid
												item
												xs={12}
												
												className={classes.textContainer}
											>
												<TextField
													variant={"outlined"}
													value={details.name}
													onChange={handleChange(`name`)}
													className={classes.textField}
													size={"medium"}
                                                    onBlur={checkName}
                                                    error={
														errors.filter((e) => e.field === `name`).length > 0
													}
                                                    helperText={ errors.filter(e => e.field === `name`).length > 0 ? errors.filter(e => e.field === `name`)[0].text: null }
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
									lg={7}
									xl={7}
									className={classes.section}
								>
									<Grid item xs={12}>
										<div className={classes.sectionTitle}>
											{t("locationsModule.relatedUsers")}
										</div>
									</Grid>
									<Grid item xs={12} className={classes.fields}>
										<Grid item xs={12} className={classes.textContainer}>
											<Select
												variant={"outlined"}
												multiple
												value={details.relatedUsers}
												onChange={handleChangeMultiple}
												className={classes.selectInput}
												MenuProps={{
													classes: {
														paper: classes.menupaper,
													},
													anchorOrigin: {
														vertical: "bottom",
														horizontal: "center",
													},
													transformOrigin: {
														vertical: "top",
														horizontal: "center",
													},
													getContentAnchorEl: null,
													disablePortal: true,
													classes: {
														paper: classes.menupaper,
													},
												}}
												renderValue={(selected) => (
													<div className={classes.chips}>
														{
                                                        selected.map((value) => {
															let user = userList.find((f) => f._id === value || f._id === value._id);
															return (
																<div className={classes.chipsCont}>
																	<Chip
																		clickable
																		size={"medium"}
																		avatar={
																			<Avatar
																				style={{
																					height: "40px",
																					width: "40px",
																				}}
																				src={user.avatar}
																				alt={getFullName(user)}
																			/>
																		}
																		label={getFullName(user)}
																		onDelete={handleLinkedRemove(value)}
																		deleteIcon={
																			<ClearRounded
																				className={classes.removeIcon}
																			/>
																		}
																		onMouseDown={(e) => e.stopPropagation()}
																		className={classes.chip}
																	/>
																</div>
															);
														})}
													</div>
												)}
											>
												{userList.map((user, i) => (
													<MenuItem
														key={i}
														value={user.value}
														style={{ direction: lang.dir }}
														className={classes.menuitem}
													>
														<div className={classes.userCont}>
															<UserItem
																showName
																user={user}
																avatarSize={40}
																size={14}
															/>
														</div>
													</MenuItem>
												))}
											</Select>
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
        overflowY: 'overlay',
		"&:focus": {
			outline: "none",
		},
		[theme.breakpoints.down("sm")]: {
            height: '81vh',
			borderRadius: "0",
			top: 0,
			border: "0",
			padding: "10px 5px",
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
		border: "1px solid rgba(255,255,255,0.2)",
		marginRight: "7px",
		marginLeft: "-5px",
		maxHeight: "200px",
		overflowY: "auto",
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
    }
}));
