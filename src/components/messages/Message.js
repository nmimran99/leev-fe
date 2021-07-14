import { Fade, Grid, Grow, makeStyles, Slide } from "@material-ui/core";
import React, { useState, useEffect, useContext } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { format, parseISO } from "date-fns";
import { LanguageContext } from "../../context/LanguageContext";
import { AuthContext } from "../../context/AuthContext";
import DoneIcon from "@material-ui/icons/Done";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import { AutorenewSharp } from "@material-ui/icons";

export const Message = ({ data }) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const { lang } = useContext(LanguageContext);
	const { auth } = useContext(AuthContext);
	const [message, setMessage] = useState({ ...data });

	useEffect(() => {
		setMessage((ms) => {
			ms.read = data.read;
			return { ...data };
		});
	}, [data]);

	return (
		<Grid
			container
			direction={data.from === auth.user._id ? "row" : "row-reverse"}
			className={classes.messageContainer}
		>
			<Grid
				item
				xs={8}
				className={clsx(
					classes.message,
					message.from === auth.user._id
						? classes.userMessage
						: classes.systemMessage
				)}
			>
				<div className={classes.messageText}>
					<div
						className={classes.text}
						style={{ textAlign: lang.dir === "rtl" ? "right" : "left" }}
					>
						{message.data.text}
					</div>
					<div className={classes.time}>
						{message.from === auth.user._id ? (
							<div>
								<DoneAllIcon
									className={message.read ? classes.read : classes.received}
								/>
							</div>
						) : null}
						{format(parseISO(message.createdAt), lang.timeonly)}
					</div>
				</div>
			</Grid>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	message: {
		display: "flex",
		margin: "3px 5px",
	},
	messageText: {
		color: "white",
		borderRadius: "10px",
		padding: "10px 20px",
		fontSize: "15px",
		width: "fit-content",
		minWidth: "50px",
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-end",
	},
	userMessage: {
		"&>div": {
			background: "rgba(0,0,0,0.6)",
		},
		justifyContent: "flex-start",
	},
	systemMessage: {
		"&>div": {
			background: "#42A5F5",
		},
		justifyContent: "flex-end",
	},
	time: {
		fontSize: "11px",
		marginTop: "5px",
		height: "15px",
		color: "rgba(255,255,255,0.7)",
		marginRight: "auto",
		display: "flex",
		alignItems: "flex-end",
	},
	text: {
		width: "100%",
	},
	received: {
		fontSize: "16px",
		padding: "0 3px",
	},
	read: {
		fontSize: "16px",
		padding: "0 3px",
		color: "#42A5F5",
	},
}));
