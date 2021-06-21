import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { grey } from "@material-ui/core/colors";
import {
	Container,
	Grid,
	Box,
	Typography,
	FormControl,
	OutlinedInput,
	InputAdornment,
	InputLabel,
	IconButton,
	Button,
	Link,
	CircularProgress,
	makeStyles,
} from "@material-ui/core";
import { Visibility, VisibilityOff, Error } from "@material-ui/icons";
import colorSplash from "../../assets/images/grey.jpg";
import {
	attemptToSignin,
	handleLS,
	sendRecoveryEmail,
} from "../../api/userApi";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";
import { getLocalization } from "../../api/genericApi";
import { ChangeLanguage } from "../reuseables/ChangeLanguage";

export const PasswordRecovery = () => {
	const classes = useStyles();
	const loginButton = useRef();
	const history = useHistory();
	const { t } = useTranslation();
	const [userEmail, setUserEmail] = useState("");
	const [emailSent, setEmailSent] = useState(false);

	const [errors, setErrors] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (event) => {
		setUserEmail(event.target.value);
		if (errors.length) {
			setErrors([]);
		}
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		let isValid = await validateFields();
		if (isValid) {
			const checkUser = await sendRecoveryEmail(userEmail);
			if (checkUser.status === 404) {
				setErrors([{ field: "userEmail", message: t("errors.emailNotFound") }]);
			} else {
				const { response } = checkUser;
				if (response.includes("OK")) {
					setEmailSent(true);
				}
			}
		}

		setIsLoading(false);
	};

	const validateFields = async () => {
		return new Promise((resolve, reject) => {
			let errs = [];
			if (!userEmail) {
				errs.push({ field: "userEmail", message: t("errors.isRequired") });
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

	return (
		<Grid container alignItems='center' justify="center" className={classes.mainContainer}>
            
			<Grid
				item
				className={classes.loginContainer}
				xl={4}
				lg={4}
				md={6}
				sm={6}
				xs={11}
			>
                <ChangeLanguage className={classes.changeLanguage}/>
				<Box className={classes.bannerContainer} bgcolor="primary.main">
					<img
						src="https://leevstore.blob.core.windows.net/images/leev_logo_transparent.png"
						className={classes.logo}
					/>
				</Box>
				{emailSent ? (
					<React.Fragment>
						<Container component="div" className={classes.instructions}>
							<Typography className={classes.headerText}>
								{`${t("login.emailSentSuccessfully")} ${userEmail}`}
							</Typography>
						</Container>
						<Container component="div" className={classes.submitContainer}>
							<Button
								variant="contained"
								className={classes.submitButton}
								color="primary"
								onClick={() => history.push('/login')}
							>	
									{t("login.backToLogin")}
							</Button>
						</Container>
					</React.Fragment>
				) : (
					<React.Fragment>
						<Container component="div" className={classes.headerContainer}>
							<Typography className={classes.header}>
								{t("login.recoverPassword")}
							</Typography>
						</Container>
						<Container component="div" className={classes.instructions}>
							<Typography className={classes.headerText}>
								{t("login.recoverPasswordText")}
							</Typography>
							<Typography className={classes.headerText}>
								{t("login.recoveryInstructions")}
							</Typography>
						</Container>
						<Container component="div" className={classes.inputsContainer}>
							<FormControl variant="outlined" className={classes.textInput} autoComplete={"off"}>
								<InputLabel htmlFor="outlined-input-email">
									{t("login.email")}
								</InputLabel>
								<OutlinedInput
									error={
										errors.filter((e) => e.field === "userEmail").length > 0
									}
									id="outlined-input-email"
									type="text"
									value={userEmail}
									onChange={handleChange}
									labelWidth={50}
									onKeyDown={checkEnter}
                                    autoComplete={"off"}
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
									t("login.sendEmail")
								)}
							</Button>
						</Container>
					</React.Fragment>
				)}
			</Grid>
		</Grid>
	);
};

const useStyles = makeStyles(theme => ({
	mainContainer: {
		width: "100%",
		height: "100%",
		position: "fixed",
		backgroundImage: `url(${colorSplash})`,
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
		height: "fit-content"
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
        [theme.breakpoints.down('sm')]: {
            borderRadius: "0px",
        }
	},
    changeLanguage: {
        position: 'absolute'
    }
}));
