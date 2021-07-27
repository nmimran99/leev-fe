import { IconButton, makeStyles } from "@material-ui/core";
import AssignmentRoundedIcon from "@material-ui/icons/AssignmentRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import clsx from "clsx";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDateString } from "../../../api/calenderApi";
import { LanguageContext } from "../../../context/LanguageContext";
import { TaskMinified } from "../tasks/TaskMinified";
export const EventsViewer = ({ bracketData, handleClose }) => {
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState(bracketData);
	const [tasks, setTasks] = useState([]);
	const [detailsActive, setDetailsActive] = useState("tasks");

	useEffect(() => {
		if (detailsActive === "tasks") {
			setTasks(bracketData.tasks);
		} else {
			setTasks([]);
		}
	}, [data]);

	useEffect(() => {
		if (bracketData) {
			setData(bracketData);
		}
	}, [bracketData]);

	const handleChange = (event) => {};

	const handleClick = (type) => (event) => {};

	return (
		<div className={classes.container}>
			<div className={classes.topContainer}>
				<IconButton onClick={handleClose} className={classes.closeBtn}>
					<ClearRoundedIcon />
				</IconButton>
				<div className={classes.dateContainer}>{getDateString(data.date)}</div>

				<div className={classes.pillContainer}>
					<div
						onClick={handleClick("tasks")}
						className={clsx(
							classes.openItems,
							classes.openFaults,
							detailsActive === "tasks" && classes.tabActive
						)}
					>
						<WarningRoundedIcon className={classes.icon} />
						{`${t("calender.todaysTasks")}`}
					</div>
					<div
						onClick={handleClick("events")}
						className={clsx(
							classes.openItems,
							classes.openTasks,
							detailsActive === "events" && classes.tabActive
						)}
					>
						<AssignmentRoundedIcon className={classes.icon} />
						{`${t("calender.events")}`}
					</div>
				</div>
			</div>

			{detailsActive === "tasks" ? (
				tasks.length ? (
					<div className={classes.faultContainer}>
						{tasks.map((mdf, i) => {
							return (
								<div className={classes.miniFault}>
									<TaskMinified data={mdf} asList={true} />
								</div>
							);
						})}
					</div>
				) : (
					<div className={classes.noFaults}>{t("calender.noTasks")}</div>
				)
			) : null}
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "column",
		background: "rgba(0,0,0,0.2)",
		[theme.breakpoints.down("sm")]: {
			width: "100vw",
		},
	},
	topContainer: {
		position: "relative",
	},
	title: {
		fontSize: "16px",
		color: "white",
		display: "grid",
		borderRadius: "5px",
		padding: "0",
		margin: "60px 0px 10px",
		width: "fit-content",
		minWidth: "300px",
		alignItems: "flex-end",
		background: "rgb(140, 19, 171)",
		borderRadius: "50px",
	},
	streetName: {
		fontSize: "16px",
		color: "white",
		display: "grid",
		borderRadius: "5px",
		padding: "7px 40px 7px 20px",
		margin: "60px 10px 5px",
		width: "fit-content",
		alignItems: "flex-end",
		background: "rgb(140, 19, 171)",
		borderRadius: "50px",
	},
	miniFault: {
		height: "150px",
		padding: "10px",
		border: "1px solid rgba(255,255,255,0.2)",
		background: "rgba(0,0,0,0.0)",
		margin: "10px",
		borderRadius: "5px",
	},
	miniTask: {
		border: "1px solid rgba(255,255,255,0.2)",
		background: "rgba(0,0,0,0.0)",
		margin: "10px",
		borderRadius: "5px",
	},
	faultContainer: {
		borderTop: "1px solid rgba(255,255,255,0.2)",
		marginTop: "5px",
		height: "calc(100% - 140px)",
		overflow: "overlay",
	},
	taskContainer: {
		borderTop: "1px solid rgba(255,255,255,0.2)",
		marginTop: "5px",
		height: "calc(100% - 140px)",
		overflow: "overlay",
	},
	menu: {
		color: "white",
		height: "40px",
		margin: "5px 50px 5px 10px",
		"&:hover": {
			borderColor: "white",
		},
	},
	menuTitle: {
		color: "white",
		margin: "60px 50px 0px 10px",
		height: "33px",
		minWidth: "200px",
		background: "rgb(140, 19, 171)",
		borderRadius: "50px",
		fontSize: "15px",
		padding: "0",
		lineHeight: 2,
		"&:hover": {
			borderColor: "white",
		},
	},
	menupaper: {
		background: "rgba(0,0,0,0.3)",
		backdropFilter: "blur(10px)",
		border: "1px solid rgba(255,255,255,0.2)",
		maxHeight: "200px",
		overflowY: "auto",
		marginTop: "60px",
		marginRight: "7px",
	},
	menuitem: {
		color: "white",
	},
	selectContainer: {
		padding: "0px 0",
	},
	textInput: {
		padding: "0px 0",
		background: "rgba(0,0,0,0.0)",
		fontSize: "16px",
		width: "100%",
		"& input": {
			color: "white",
			paddingLeft: "20px",
		},
		"& label": {
			color: "white",
			paddingLeft: "5px",
		},
		"& fieldset": {
			borderColor: "rgba(255,255,255,0.6)",
			borderRadius: "42px",
		},
	},
	closeBtn: {
		color: "white",
		margin: "6px",
		position: "absolute",
		right: 0,
		zIndex: 3,
		"&:hover": {
			background: "rgba(0,0,0,0.6)",
		},
	},
	noFaults: {
		color: "white",
		background: "rgba(0,0,0,0.8)",
		borderRadius: "50px",
		padding: "10px 20px",
		margin: "10px",
		fontSize: "14px",
		width: "fit-content",
	},
	openItems: {
		color: "white",
		padding: "5px 20px 5px 10px",
		borderRadius: "50px",
		width: "fit-content",
		display: "flex",
		alignItems: "center",
		margin: "0px 10px 5px 0px",
		fontSize: "13px",
		whiteSpace: "nowrap",
		opacity: 0.7,
		cursor: "pointer",
		"&:hover": {
			opacity: 1,
			boxShadow: "inset rgba(0,0,0,0.4) 0 0 3px 1px",
		},
	},
	openFaults: {
		background: "#F03930",
	},
	openTasks: {
		background: "#6540EB",
	},
	icon: {
		marginRight: "7px",
		fontSize: "18px",
		paddingBottom: "2px",
	},
	pillContainer: {
		display: "flex",
		padding: "5px 10px",
	},
	tabActive: {
		border: "1px solid white",
		opacity: 1,
	},
	outlinedSelect: {
		padding: "10px",
	},
	dateContainer: {
		color: "white",
		padding: "20px",
		fontSize: "24px",
		marginTop: "40px",
	},
}));
