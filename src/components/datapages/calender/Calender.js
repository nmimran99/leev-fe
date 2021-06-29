import React, { useEffect, useState } from "react";
import { makeStyles, Grid } from "@material-ui/core";
import { getDaysInMonth, getMonth, getYear, format } from "date-fns";
import { getBrackets, getDateString } from "../../../api/calenderApi";
import { getTasks } from "../../../api/tasksApi";
import { CalenderHeaderRow } from "./CalenderHeaderRow";
import { CalenderRow } from "./CalenderRow";
import { useTranslation } from "react-i18next";
import { EventsViewer } from "./EventsViewer";

export const Calender = ({}) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const [current, setCurrent] = useState({
		year: getYear(new Date()),
		month: getMonth(new Date()),
	});
	const [brackets, setBrackets] = useState([]);
	const [bracketData, setBracketData] = useState(null);

	useEffect(() => {
		getTasks({ isRepeatable: true })
			.then((rts) => {
				return getBrackets(current, rts);
			})
			.then((data) => {
				setBrackets(data);
			});
	}, [current]);

	const handleBracketClick = (bracket) => {
		getDateString(bracket.date)
		setBracketData({ ...bracket });
	};

	return (
		<React.Fragment>
			<Grid container className={classes.mainContainer}>
				<Grid item xs={12} className={classes.moduleContainer}>
					<div className={classes.pageModule}>{t("calender.calender")}</div>
				</Grid>
				<Grid item xs={12} className={classes.tableGrid}>
					<table className={classes.bracketsContainer}>
						<thead className={classes.tableHeader}>
							<CalenderHeaderRow />
						</thead>
						<tbody className={classes.tableBody}>
							{brackets.chunk(7).map((c, i) => (
								<CalenderRow
									brackets={c}
									key={i}
									handleBracketClick={handleBracketClick}
								/>
							))}
						</tbody>
					</table>
				</Grid>

				{bracketData && (
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
						lg={3}
						className={classes.markDataGrid}
					>
						<EventsViewer
							bracketData={bracketData}
							handleClose={() => setBracketData(null)}
						/>
					</Grid>
				)}
			</Grid>
		</React.Fragment>
	);
};

const useStyles = makeStyles((theme) => ({
	mainContainer: {
		height: "calc(100vh - 64px)",
		width: "100%",
		position: "relative",
	},
	moduleContainer: {
		position: 'sticky',
		top: 0,
		zIndex: 2
	},
	pageModule: {
		color: "white",
		padding: "10px 40px",
		fontSize: "16px",
		background: "rgba(0,0,0,0.8)",
        boxShadow: '0 0px 2px 1px rgba(255,255,255,0.3)',
		margin: "0px auto 5px",
		width: "30%",
		textAlign: "center",
		borderRadius: "0 0 25px 25px",
		lineHeight: "1", 
		[theme.breakpoints.down('sm')]: {
			background: "black",
			width: "100vw",
			padding: "20px 0",
			borderRadius: 0,
			margin: 0
		}
	},
	tableGrid: {
		display: 'flex',
		justifyContent: 'center'
	},
	bracketsContainer: {
		width: "90vw",
		height: "80vh",
		color: "white",
		tableLayout: "fixed",
	},
	tableBody: {
		background: "rgba(0,0,0,0.4)",
	},
	markDataGrid: {
		position: "absolute",
		zIndex: 3,
		background: "rgba(0,0,0,0.3)",
		backdropFilter: "blur(40px)",
		height: "100%",
	},
}));
