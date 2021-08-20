import {
	Button,
	Grid,
	makeStyles,
	MenuItem,
	Select,
	TextField,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomDatePicker } from "../../reuseables/datepickers/CustomeDatePicker";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import clsx from "clsx";
import { format } from "date-fns";
import { useHistory } from "react-router";
import { LanguageContext } from "../../../context/LanguageContext";

export const ReportOption = ({ reportId, reportName, assets }) => {
	const classes = useStyles();
	const history = useHistory();
	
	const { lang } = useContext(LanguageContext);
	const { t } = useTranslation();
	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const [asset, setAsset] = useState(null);

	const handleStartDateChange = (date) => {
		setFromDate(date);
	};

	const handleEndDateChange = (date) => {
		setToDate(date);
	};

	const handleAssetChange = (e) => {
		setAsset(e.target.value);
	};

	const generateReport = async () => {
		history.push(
			`reports/${reportId}?asset=${asset}&fromDate=${format(
				fromDate,
				"yyyy-MM-dd"
			)}&toDate=${format(toDate, "yyyy-MM-dd")}`
		);
	};

	return (
		<Grid container className={classes.reportItemContainer}>
			<Grid item xs={12} md={3} lg={2} className={classes.reportName}>
				{reportName}
			</Grid>

			<Grid item xs={12} md={6} lg={8} className={classes.datesContainer}>
				<div className={classes.assetContainer}>
					<TextField
						select
						variant={"outlined"}
						value={asset}
						onChange={handleAssetChange}
						className={classes.selectInput}
						SelectProps={{
                            MenuProps: {
                                classes: {
                                    paper: classes.menupaper,
                                },
                            }
						}}
						size={"small"}
                        label={t("reportsModule.asset")}
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
					</TextField>
				</div>
				<div className={clsx(classes.fromDate, classes.date)}>
					<CustomDatePicker
						data={fromDate}
						handleChange={handleStartDateChange}
						label={t("reportsModule.startDate")}
						size={"small"}
						maxDate={toDate || null}
					/>
				</div>
				<div className={clsx(classes.toDate, classes.date)}>
					<CustomDatePicker
						data={toDate}
						handleChange={handleEndDateChange}
						label={t("reportsModule.endDate")}
						size={"small"}
						minDate={fromDate || null}
					/>
				</div>
			</Grid>

			<Grid item xs={12} md={3} lg={2} className={classes.generateReport}>
				<Button
					onClick={generateReport}
					startIcon={<OpenInNewIcon />}
					className={classes.generateBtn}
					disabled={!fromDate || !toDate || !asset}
				>
					{t("reportsModule.generateReport")}
				</Button>
			</Grid>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	reportItemContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "white",
		border: "1px solid rgba(255,255,255,0.2)",
		borderRadius: "10px",
		background: "rgba(255,255,255,0.1)",
		padding: "5px 20px",
		margin: "5px 0",
	},
	reportName: {
		padding: "20px",
		fontSize: "18px",
	},
	datesContainer: {
		display: "flex",
		border: "1px solid rgba(255,255,255,0.2)",
		padding: "10px",
		borderRadius: "10px",
		justifyContent: "center",
		background: "rgba(0,0,0,0.2)",
		flexFlow: "wrap",
	},
	date: {
		padding: "5px 10px",
        width: '200px'
	},
	assetContainer: {
		padding: "5px 10px",
	},
    selectInput: {
        width: '200px'
    },
	generateReport: {
		display: "flex",
		justifyContent: "center",
		padding: "10px 0",
	},
	generateBtn: {
		background: theme.palette.leading,
		width: "fit-content",
		color: "white",
		borderRadius: "50px",
		padding: "5px 30px",
		"&:hover": {
			background: theme.palette.leading,
			color: "white",
		},
		"&:disabled": {
			background: "rgba(0,0,0,0.4)",
			color: "rgba(255,255,255,0.3)",
		},
	},
	menupaper: {
		background: "rgba(255,255,255,0.1)",
		backdropFilter: "blur(10px)",
		height: "200px",
		overflowY: "auto",
		border: "1px solid rgba(255,255,255,0.2)"
	},
	menuitem: {
		color: "white",
		width: "100%",
		"&:hover": {
			background: "rgba(255,255,255,0.1)",
		},
	},
    
}));
