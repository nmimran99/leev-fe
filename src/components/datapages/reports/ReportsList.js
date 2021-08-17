import { makeStyles, Grid, useMediaQuery } from "@material-ui/core";
import { format, parseISO, parse } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import { getFullAddress } from "../../../api/assetsApi";
import { getReports } from "../../../api/reportsApi";
import { LanguageContext } from "../../../context/LanguageContext";
import { LoadingProgress } from "../../reuseables/LoadingProgress";
import { UserItem } from "../../user/UserItem";

export const ReportsList = () => {
	const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
	const { t } = useTranslation();
	const { lang } = useContext(LanguageContext);
	const downMd = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const [reports, setReports] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		prepareData();
	}, []);

	const prepareData = async () => {
		const res = await getReports();
		setReports(res);
		setIsLoading(false);
	};

    const handleReportClick = (reportId) => event => {
        history.push(`${location.pathname}/faults/${reportId}`)
    }

	return isLoading ? (
		<LoadingProgress />
	) : (
		<div className={classes.mainContainer}>
			<div className={classes.header}>{t("reportsModule.previousReports")}</div>
			<Grid container className={classes.headers}>
				<Grid lg={4} xs={6} item className={classes.colHeader}>
					<div className={classes.headerCell}>
						{t("reportsModule.reportName")}
					</div>
				</Grid>
				<Grid lg={3} xs={6} item className={classes.colHeader}>
					<div className={classes.headerCell}>{t("reportsModule.asset")}</div>
				</Grid>
				{!downMd && (
					<React.Fragment>
						<Grid lg={1}  item className={classes.colHeader}>
							<div className={classes.headerCell}>
								{t("reportsModule.startDate")}
							</div>
						</Grid>
						<Grid lg={1} item className={classes.colHeader}>
							<div className={classes.headerCell}>
								{t("reportsModule.endDate")}
							</div>
						</Grid>
						<Grid lg={1}  item className={classes.colHeader}>
							<div className={classes.headerCell}>
								{t("reportsModule.createDate")}
							</div>
						</Grid>
						<Grid lg={2} item className={classes.colHeader}>
							<div className={classes.headerCell}>
								{t("reportsModule.createdBy")}
							</div>
						</Grid>
					</React.Fragment>
				)}
			</Grid>
			<Grid container className={classes.table}>
				{reports.map((r, i) => {
					return (
						<Grid container onClick={handleReportClick(r._id)} className={classes.row}>
							<Grid lg={4} xs={6} item className={classes.gridCell}>
								<div className={classes.faultDescData}>{r.name}</div>
							</Grid>
							<Grid lg={3} xs={6} className={classes.gridCell}>
								<div className={classes.faultDescData}>
									{getFullAddress(r.parameters.asset)}
								</div>
							</Grid>
							{!downMd && (
								<React.Fragment>
									<Grid lg={1} item className={classes.gridCell}>
										<div className={classes.faultDescData}>
											{format(
												parse(r.parameters.fromDate, "yyyy-MM-dd", new Date()),
												lang.dateonly
											)}
										</div>
									</Grid>
									<Grid lg={1} item className={classes.gridCell}>
										<div className={classes.faultDescData}>
											{format(
												parse(r.parameters.toDate, "yyyy-MM-dd", new Date()),
												lang.dateonly
											)}
										</div>
									</Grid>
									<Grid lg={1} item className={classes.gridCell}>
										<div className={classes.faultDescData}>
											{format(parseISO(r.createdAt), lang.dateonly)}
										</div>
									</Grid>
									<Grid lg={2} item className={classes.gridCell}>
										<div className={classes.faultDescData}>
											<UserItem
												user={r.createdBy}
												showName
												avatarSize={40}
												size={11}
                                                showCompany
											/>
										</div>
									</Grid>
								</React.Fragment>
							)}
						</Grid>
					);
				})}
			</Grid>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	mainContainer: {
		width: "90%",
        [theme.breakpoints.down('md')]: {
            width: '100%'
        }
	},
	header: {
		color: "rgba(255,255,255,0.8)",
		fontSize: "14px",
		padding: "10px",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
	},
	table: {
		background: "rgba(0,0,0,0.4)",
		borderRadius: "0 0 10px 10px",
	},
	headers: {
		borderBottom: "1px solid rgba(255,255,255,0.5)",
		background: "rgba(0,0,0,0.8)",
		padding: "10px 0",
		borderRadius: "10px 10px 0 0",
		marginTop: "10px",
		fontSize: "14px",
		[theme.breakpoints.down("sm")]: {
			position: "sticky",
			top: "55px",
			borderRadius: "0",
		},
	},
	headerCell: {
		padding: "0 10px",
		display: "flex",
		alignItems: "center",
		height: "100%",
	
	},
	colHeader: {
		color: "rgba(255,255,255,0.8)",
	},
	faultIdData: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		margin: "auto",
	},
	faultDescData: {
		color: "white",
		fontSize: "14px",
		padding: "10px",
        whiteSpace: 'nowrap',
        [theme.breakpoints.down('md')]: {
            fontSize: '12px'
        }
	},
	gridCell: {
		borderTop: "1px solid rgba(255,255,255,0.2)",
		display: "flex",
		alignItems: "center",
        
	},
    row: {
        cursor: 'pointer'
    }
}));
