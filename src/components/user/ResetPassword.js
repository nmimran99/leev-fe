import {
	Box,
	Button,
	CircularProgress,
	Container,
	FormControl,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	makeStyles,
	OutlinedInput,
	Typography,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { Error, Visibility, VisibilityOff } from "@material-ui/icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { changePassword, verifyResetPasswordHandle } from "../../api/userApi";
import { LanguageContext } from "../../context/LanguageContext";
import { ChangeLanguage } from "../reuseables/ChangeLanguage";

export const ResetPassword = () => {
	const classes = useStyles();
	const loginButton = useRef();
	const location = useLocation();
	const history = useHistory();
	const params = useParams();
	const { t } = useTranslation();
	const { lang } = useContext(LanguageContext);
	const [userId, setUserId] = useState(null);
	const [userEmail, setUserEmail] = useState("");
	const [password, setPassword] = useState(null);
	const [verifyPassword, setVerifyPassword] = useState(null);
	const [showPassword, setShowPassword] = useState(null);
	const [pageError, setPageError] = useState(null);
	const [success, setSuccess] = useState(false);
    const [ redirectCounter , setRedirectCounter ] = useState(5);

	const [errors, setErrors] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!success) return;
        const arr = Array.from(Array(5).keys())
        let i = 4;
        let interval = setInterval(() => {
            setRedirectCounter(arr[i]);
            if (i === 0) {
                clearInterval(interval);
                history.push('/login')
            }
            i--;
        }, 1000);

    }, [success]);

	useEffect(() => {
		if (params.handle == 0) {
			setPageError(true);
			history.replace("/reset/0");
		}
		verifyResetPasswordHandle(params.handle).then((res) => {
			if (res.err) {
				setPageError(true);
				history.replace("/reset/0");
				return;
			}
			history.replace(`/reset/resetnow`);
			setUserId(res.data);
		});
	}, []);

	const handleChange = (field) => (event) => {
		if (field === "password") {
			setPassword(event.target.value);
		} else {
			setVerifyPassword(event.target.value);
		}
		setErrors([]);
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		let isValid = await validateFields();
		if (isValid) {
			const cp = await changePassword(userId, password);
			setSuccess(true);
		}

		setIsLoading(false);
	};

	const validateFields = async () => {
		return new Promise((resolve, reject) => {
			let errs = [];
			if (!password) {
				errs.push({ field: "password", message: t("errors.isRequired") });
			}
			if (!verifyPassword) {
				errs.push({ field: "verifyPassword", message: t("errors.isRequired") });
			}
			if (verifyPassword != password) {
				errs.push({
					field: "verifyPassword",
					message: t("errors.passwordsDontMatch"),
				});
			}
			if (errs.length) {
				setErrors(errs);
				setIsLoading(false);
				reject(false);
			}
			resolve(true);
		});
	};

	const checkEnter = (e) => {
		if (e.keyCode === 13) {
			handleSubmit();
		}
	};

	const handleClickShowPassword = (which) => (event) => {
		if (which === showPassword) {
			setShowPassword(null);
			return;
		}
		setShowPassword(which);
	};

	return (
		<Grid
			container
			alignItems="center"
			justify="center"
			className={classes.mainContainer}
		>
			<Grid
				item
				className={classes.loginContainer}
				xl={4}
				lg={4}
				md={6}
				sm={6}
				xs={11}
			>
				<ChangeLanguage className={classes.changeLanguage} />
				<Box className={classes.bannerContainer} bgcolor="primary.main">
					<img
						src="https://leevstore.blob.core.windows.net/images/leev_logo_transparent.png"
						className={classes.logo}
					/>
				</Box>
				{pageError ? (
					<React.Fragment>
						<Container component="div" className={classes.instructions}>
							<Typography className={classes.headerText}>
								{`${t("login.resetFailed")} ${userEmail}`}
							</Typography>
						</Container>
						<Container component="div" className={classes.submitContainer}>
							<Button
								variant="contained"
								className={classes.submitButton}
								color="primary"
								onClick={() => history.push("/login")}
							>
								{t("login.backToLogin")}
							</Button>
						</Container>
					</React.Fragment>
				) : (
					<React.Fragment>
						<Container component="div" className={classes.headerContainer}>
							<Typography className={classes.header}>
								{t("login.passwordRenewal")}
							</Typography>
						</Container>
						<Container component="div" className={classes.instructions}>
							<Typography className={classes.headerText}>
								{t("login.resetPasswordText")}
							</Typography>
						</Container>
						<Container component="div" className={classes.inputsContainer}>
							<FormControl variant="outlined" className={classes.textInput}>
								<InputLabel htmlFor="outlined-input-password">
									{t("login.newPassword")}
								</InputLabel>
								<OutlinedInput
									error={
										errors.filter((e) => e.field === "password").length > 0
									}
									id="outlined-input-password"
									type={showPassword === "password" ? "text" : "password"}
									value={password}
									onChange={handleChange("password")}
									labelWidth={lang.code === "en" ? 120 : 95}
									onKeyDown={checkEnter}
									onCopy={(e) => e.preventDefault()}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword("password")}
												onMouseDown={(e) => e.preventDefault()}
												edge="end"
											>
												{showPassword === "password" ? (
													<Visibility />
												) : (
													<VisibilityOff />
												)}
											</IconButton>
										</InputAdornment>
									}
								/>
							</FormControl>
						</Container>
						<Container component="div" className={classes.inputsContainer}>
							<FormControl variant="outlined" className={classes.textInput}>
								<InputLabel htmlFor="outlined-input-password">
									{t("login.verifyPassword")}
								</InputLabel>
								<OutlinedInput
									error={
										errors.filter((e) => e.field === "verifyPassword").length >
										0
									}
									id="outlined-input-password"
									type={showPassword === "verifyPassword" ? "text" : "password"}
									value={verifyPassword}
									onChange={handleChange("verifyPassword")}
									labelWidth={lang.code === "en" ? 130 : 95}
									onKeyDown={checkEnter}
									onPaste={(e) => e.preventDefault()}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword("verifyPassword")}
												onMouseDown={(e) => e.preventDefault()}
												edge="end"
											>
												{showPassword === "verifyPassword" ? (
													<Visibility />
												) : (
													<VisibilityOff />
												)}
											</IconButton>
										</InputAdornment>
									}
								/>
							</FormControl>
						</Container>
						{errors.length > 0
							? errors.map((e, i) => {
									return (
										<Container
											component="div"
											className={classes.errorContainer}
											key={i}
										>
											<Error fontSize="inherit" color={"error"} />
											<Typography
												component="span"
												className={classes.error}
												color="error"
											>
												{e.message}
											</Typography>
										</Container>
									);
							  })
							: null}
						<Container component="div" className={classes.submitContainer}>
							{success ? (
								<div className={classes.success}>
									<div className={classes.successMessage}>
										{t("login.passwordChangedSuccessfully")}
									</div>
									<div className={classes.redirectingIn}>
										{`${t("login.redirectingToLogin")} ${redirectCounter} ${t("dates.seconds")}...`}
									</div>
								</div>
							) : (
								<Button
									variant="contained"
									className={classes.submitButton}
									color="primary"
									onClick={handleSubmit}
									disabled={isLoading}
									ref={loginButton}
								>
									{isLoading ? (
										<CircularProgress color={"secondary"} size={30} />
									) : (
										t("login.savePassword")
									)}
								</Button>
							)}
						</Container>
					</React.Fragment>
				)}
			</Grid>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	mainContainer: {
		width: "100%",
		height: "100%",
		position: "fixed",
		backgroundImage: `url(https://leevstore.blob.core.windows.net/images/grey.jpg)`,
		backgroundSize: "cover",
	},
	loginContainer: {
		borderRadius: "10px",
		border: "1px solid rgba(255,255,255,0.18)",
		padding: "0",
		background: "rgba(255, 255, 255, 0.2)",
		boxShadow: "0 8px 32px 0 rgb(0 0 0 / 37%)",
		backdropFilter: "blur(8px)",
		"-webkit-backdrop-filter": "blur( 10px )",
		height: "fit-content",
	},
	bannerContainer: {
		width: "100%",
		borderRadius: "10px 10px 0 0",
		padding: "0",
		display: "grid",
		placeItems: "center",
	},
	banner: {
		color: grey[50],
		fontWeight: 600,
		fontSize: "24px",
		position: "relative",
		margin: "auto",
		fontFamily: "Kaushan",
	},

	headerContainer: {
		width: "100%",
		display: "flex",
		WebkitJustifyContent: "center",
		margin: "40px 0 0 0",
	},
	headerText: {
		textAlign: "center",
		color: "white",
		fontSize: "12px",
	},
	header: {
		fontSize: "24px",
		fontWeight: "300",
		height: "70%",
		color: "white",
	},

	inputsContainer: {
		display: "grid",
		placeItems: "center",
		padding: "0px 14px 0px",
	},
	textInput: {
		width: "80%",
		margin: "5px",
		"& .MuiOutlinedInput-root": {
			"& input": {
				padding: "18.5px 28px",
			},
		},
	},
	submitContainer: {
		display: "grid",
		placeItems: "center",
		padding: "14px 14px",
		marginBottom: "40px",
	},
	submitButton: {
		width: "80%",
		height: "50px",
		margin: "auto",
		position: "relative",
		fontSize: "16px",
		borderRadius: "50px",
	},
	forgotPassContainer: {
		width: "100%",
		padding: "0px 64px 60px",
	},
	forgotPass: {
		fontSize: "14px",
	},
	errorContainer: {
		display: "flex",
		justifyContent: "initial",
		width: "75%",
		padding: "0",
		fontSize: "18px",
	},
	error: {
		marginLeft: "8px",
		fontSize: "12px",
	},
	logo: {
		width: "100px",
		height: "100px",
	},
	logoContainer: {
		display: "flex",
		justifyContent: "center",
		height: "fit-content",
	},
	instructions: {
		margin: "20px auto",
		padding: "15px 30px",
		background: "rgba(0,0,0,0.3)",
		width: "fit-content",
		borderRadius: "5px",
		[theme.breakpoints.down("sm")]: {
			borderRadius: "0px",
		},
	},
	changeLanguage: {
		position: "absolute",
	},
	successMessage: {
		color: "white",
		background: "#01b63A",
		textAlign: "center",
		padding: "10px 30px",
		borderRadius: "5px",
		margin: "10px 0",
	},
	redirectingIn: {
		color: "white",
		background: "rgba(0,0,0,0.5)",
		padding: "5px 10px",
		fontSize: "12px",
		textAlign: "center",
		borderRadius: "50px",
	},
}));
