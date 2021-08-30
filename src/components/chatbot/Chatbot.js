import {
	Button,
	Fade,
	Grid,
	makeStyles,
	Menu,
	MenuItem,
} from "@material-ui/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { getAssetExternal, getFullAddress } from "../../api/assetsApi";
import { authenticate, handleLS } from "../../api/userApi";
import { AuthContext } from "../../context/AuthContext";
import { MessageImage } from "./MessageImage";
import { MessageInput } from "./MessageInput";
import { Messages } from "./Messages";
import { MessageSelector } from "./MessageSelector";
import { MessageBoolean } from "./MessageBoolean";
import * as scenarios from "./Scenrio";
import { LanguageContext } from "../../context/LanguageContext";
import { getLocalization } from "../../api/genericApi";
import i18next from "i18next";

const languages = ["en", "he"];

export const Chatbot = () => {
	const classes = useStyles();
	const { auth, setAuth } = useContext(AuthContext);
	const { lang, setLang } = useContext(LanguageContext);
	const params = useParams();
	const [scenario, setScenario] = useState(scenarios.openFault);
	const [isLoading, setIsLoading] = useState(true);
	const [scenarioStep, setScenarioStep] = useState(null);
	const [messages, setMessages] = useState([]);
	const [mainAsset, setMainAsset] = useState(null);
	const [inputValue, setInputValue] = useState({
		text: "",
		value: "",
		type: "",
	});
	const [systems, setSystems] = useState([]);
	const [locations, setLocations] = useState([]);
	const [optionalValues, setOptionalValues] = useState([]);
	const [vault, setVault] = useState({});
	const [showInput, setShowInput] = useState(null);
	const [langMenu, setLangMenu] = useState(false);
	// const messageContainer = useRef();

	useEffect(() => {
		const checkUserAuthentication = async () => {
			let token = await handleLS("wb_token", "get");
			if (!token) {
				setIsLoading(false);
				return;
			}
			let res = await authenticate(token);
			if (res.auth) {
				setAuth({
					isAuth: res.auth,
					user: res.user,
					token: res.token.token,
					refreshToken: res.token.refreshToken,
				});
				setVault({
					...vault,
					user: res.user,
				});
			}
			setIsLoading(false);
			return;
		};
		checkUserAuthentication();
	}, []);

	useEffect(() => {
		if (!params.assetId) {
			scenario = scenarios.assetNotFound;
		}
		getAssetExternal(params.assetId)
			.then((data) => {
				if (!data.asset || !data.systems) {
					scenario = scenarios.assetNotFound;
				}
				setMainAsset(data.asset);
				setSystems([
					...data.systems.map((s, i) => ({ name: s.name, value: s._id })),
				]);
				setLocations([
					...data.locations.map((l, i) => ({ name: l.name, value: l._id })),
				]);
				return updateScenarioState(data.asset._id, "asset");
			})
			.then(() => {
				setScenarioStep(scenario.questions[0]);
			});
	}, [params]);

	useEffect(() => {
		if (!scenarioStep) return;
		handleScenarioStepChange();
	}, [scenarioStep]);

	const { t } = useTranslation();

	const handleScenarioStepChange = async () => {
		setTimeout(async () => {
			setMessages([
				...messages,
				{ text: scenarioStep.text, isUser: false, type: "string" },
			]);
			if (!scenarioStep.actionRequired) {
				if (isLastStep()) {
					let sc = await scenarios.getNextScenario(scenario, auth);
					setScenario(sc);
					setScenarioStep(null);
					setScenarioStep(sc.questions[0]);
					return;
				}
				if (scenarioStep.submit) {
					await handleSubmit();
				}
				setScenarioStep(scenario.questions[scenarioStep.order + 1]);
			} else {
				setShowInput(scenarioStep.inputType);
			}
		}, 1000);
	};

	const handleInputChange = async (inputVal) => {
		if (!inputVal.value && inputVal.type === "image") {
			setShowInput(null);
			setMessages([
				...messages,
				{ text: inputVal.text, isUser: true, type: inputVal.type },
			]);
			await handleSubmit();
		}
		if (inputVal.type === "boolean") {
			setShowInput(null);
			await updateScenarioState(inputVal.value, scenarioStep.inputField);
			setMessages([
				...messages,
				{ text: inputVal.text, isUser: true, type: inputVal.type },
			]);
			setInputValue({ text: "", value: "", type: "" });
			await handleSubmit();
			return;
		}
		setInputValue(inputVal);
	};

	const handleSendInput = async () => {
		setShowInput(null);
		await updateScenarioState(inputValue.value, scenarioStep.inputField);
		setMessages([
			...messages,
			{ text: inputValue.text, isUser: true, type: inputValue.type },
		]);
		await handleSubmit();
	};

	const nextStep = async () => {
		setInputValue({ text: "", value: "", type: "" });
		if (isLastStep()) {
			let sc = await scenarios.getNextScenario(scenario, auth);
			setScenario(sc);
			setScenarioStep(null);
			setScenarioStep(sc.questions[0]);
			return;
		}
		setScenarioStep(null);
		setScenarioStep(scenario.questions[scenarioStep.order + 1]);
	};

	const handleSubmit = async () => {
		if (!scenarioStep.submit) {
			nextStep();
			return;
		}
		let res = await scenario.submit(vault);
		if (res) {
			setVault({
				...vault,
				...res,
			});
			nextStep();
		}
	};

	const updateScenarioState = (data, field) => {
		return new Promise((resolve, reject) => {
			setScenario((prev) => {
				prev.submitInput(data, field);
				return prev;
			});
			resolve();
		});
	};

	const isLastStep = () => {
		return scenarioStep.order + 1 === scenario.questions.length;
	};

	const getOptions = () => {
		return scenarioStep.inputField === "system" ? systems : locations;
	};

	const changeLanguage = (l) => (event) => {
		setMessages([]);
		setLang(getLocalization(l));
		setLangMenu(false);
	};

	return (
		<div className={classes.gridContainer}>
			<div className={classes.topBar}>
				<div className={classes.addressContainer}>
					<div className={classes.title}>{t("chatbot.title")}</div>
					<div className={classes.address}>
						{mainAsset && getFullAddress(mainAsset)}
					</div>
				</div>
				<Button
					className={classes.changeLanguage}
					onClick={(e) => setLangMenu(e.target)}
				>
					{lang.code ? lang.code.toUpperCase() : ""}
				</Button>
				<Menu
					classes={{
						paper: classes.langMenu,
					}}
					keepMounted
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "right",
					}}
					transformOrigin={{
						vertical: "top",
						horizontal: "right",
					}}
					anchorEl={langMenu}
					keepMounted
					open={Boolean(langMenu)}
					onClose={() => setLangMenu(null)}
				>
					{languages.map((l, i) => (
						<MenuItem
							button
							onClick={changeLanguage(l)}
							className={classes.langItem}
						>
							{l.toUpperCase()}
						</MenuItem>
					))}
				</Menu>
			</div>

			<Messages data={messages} />
			<Grid container className={classes.inputContainer} alignItems="center">
				{showInput === "string" ? (
					<MessageInput
						handleInputChange={handleInputChange}
						handleSendInput={handleSendInput}
						value={inputValue.value}
					/>
				) : showInput === "select" ? (
					<MessageSelector
						value={inputValue.value}
						options={getOptions()}
						handleInputChange={handleInputChange}
						handleSendInput={handleSendInput}
					/>
				) : showInput === "image" ? (
					<MessageImage
						value={inputValue.value || []}
						handleInputChange={handleInputChange}
						handleSendInput={handleSendInput}
					/>
				) : showInput === "boolean" ? (
					<MessageBoolean handleInputChange={handleInputChange} />
				) : null}
			</Grid>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	gridContainer: {
		height: "100%",
		width: "100%",
		display: "flex",
		flexDirection: "column",
		backgroundRepeat: "repeat",
	},
	topBar: {
		display: "flex",
		background: "rgba(0,0,0,0.9)",
		height: "75px",
	},
	addressContainer: {
		width: "100%",
		height: "40px",

		backdropFilter: "blur(5px)",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
		padding: "15px",
	},
	langMenu: {
		background: "rgba(0,0,0,0.8)",
		backdropFilter: "blur(10px)",

		border: "1px solid rgba(255,255,255,0.2)",
	},
	changeLanguage: {
		background: "transparent",
		color: "white",
		borderRadius: "0",
		height: "70px",
	},
	langItem: {
		color: "white",
		width: "100%",
		"&:hover": {
			background: "rgba(255,255,255,0.1)",
		},
	},
	messagesContainer: {
		height: "calc(100% - 120px)",
		width: "100%",
		background: "rgba(0,0,0,0.1)",
	},
	inputContainer: {
		background: "rgba(0,0,0,0.1)",
		backdropFilter: "blur(5px)",
		width: "100%",
		height: "50px",
		padding: "4px 0",
		borderTop: "1px solid rgba(0,0,0,0.1)",
		color: "black",
	},
	topProfile: {
		width: "100%",
		display: "grid",
		placeItems: "center",
	},
	avatar: {
		height: "150px",
		width: "150px",
		margin: "10px",
	},
	"@global": {
		"*::-webkit-scrollbar": {
			width: "0em",
		},
	},
	title: {
		color: "rgba(255,255,255,0.8)",
		fontSize: "14px",
	},
	address: {
		color: "white",
		fontSize: "20px",
	},
}));
