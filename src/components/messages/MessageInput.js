import {
    FormControl,
    IconButton,
    makeStyles,
    OutlinedInput,
	useMediaQuery
} from "@material-ui/core";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import clsx from "clsx";
import React, { useContext, useState } from "react";
import { EnvContext } from "../../context/EnvContext";
import { LanguageContext } from "../../context/LanguageContext";

export const MessageInput = ({ handleClick }) => {
	const classes = useStyles();
	const downSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
	const { env, setEnv } = useContext(EnvContext);
	const [value, setValue] = useState("");
    const { lang } = useContext(LanguageContext);

    const send = () => {
        if (value) {
            handleClick(value);
            setValue('');
        }
    };

	const toggleInputFocus = () => {
	
		if (!downSm) return;
		if (env.inputFocused) {
			setEnv({
				...env, 
				inputFocused: false
			});
			return;
		}
		setEnv({
			...env, 
			inputFocused: true
		});
	}

	return (
		<React.Fragment>
			<IconButton
				className={classes.postBtn}
				onClick={() => null}
				onClick={send}
			>
				<SendRoundedIcon
					className={clsx(
						classes.icon,
						lang.dir === "rtl" ? classes.mirror : null
					)}
				/>
			</IconButton>
			<FormControl variant="outlined" className={classes.form}>
				<OutlinedInput
					value={value}
					onChange={(event) => setValue(event.target.value)}
					className={classes.textInput}
					onKeyDown={e => e.key === 'Enter' ? send() : null}
					inputProps={{
						onFocus: toggleInputFocus,
						onBlur: toggleInputFocus
					}}
					
				/>
			</FormControl>	
		</React.Fragment>
	);
};

const useStyles = makeStyles((theme) => ({
	mainContainer: {
		height: "100%",
		width: "100%",
	},
	userBar: {
		boxShadow: "0 1px 2px 0px rgba(0,0,0,0.37)",
		padding: "0 20px",
		background: "rgba(0,0,0,0.6)",
		borderRadius: "0 20px 0 0",
		height: "90px",
	},
	messagesContainer: {
		height: "calc(100% - 140px)",
	},
	inputContainer: {
		padding: "0 20px",
		background: "rgba(0,0,0,0.6)",
		borderRadius: "0 0 20px 0",
		height: "50px",
		display: "flex",
		alignItems: "center",
	},
	form: {
		color: "black",
		width: "100%",
		margin: "0 5px 0 0px",
		border: "1px solid rgba(0,0,0,0.2)",
		borderRadius: "42px",
	},
	textInput: {
		padding: "4px 10px",
		borderRadius: "42px",
		color: "white",
		"& input": {
			color: "white",
			width: "80%",
			padding: "4px 10px",
			fontSize: "14px",
		},
		"& label": {
			color: "white",
			paddingLeft: "5px",
		},
		"& fieldset": {
			borderColor: "rgba(255,255,255,0.2)",
			borderRadius: "42px",
		},
	},
	postBtn: {
		background: "#42A5F5",
		color: "white",
		padding: "7px",
		margin: " 0 5px 1px",
	},
	icon: {
		fontSize: "20px",
		color: "white",
	},
}));
