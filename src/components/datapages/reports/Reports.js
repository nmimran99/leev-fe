import { Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useParams, useRouteMatch } from "react-router";
import { getReportPublic } from "../../../api/reportsApi";
import { FaultsReport } from "./FaultsReport";
import { ReportSelector } from "./ReportSelector";
import { ReportsList } from "./ReportsList";
import { UpsertReport } from "./UpsertReport";

export const Reports = () => {
	
    const classes = useStyles();
    const { t } = useTranslation();
    const { path } = useRouteMatch();
	const [ upsert, setUpsert ] = useState(null)

	return (
		<div>
			<Grid container justify="center">
				<Grid item xs={12} className={classes.moduleContainer}>
					<div className={classes.pageModule}>{t("reportsModule.reports")}</div>
				</Grid>
                <Switch>
                    <Route path={path} exact >
                        <ReportSelector />
						<ReportsList />
                    </Route>
                    <Route path={`${path}/faults/:reportId?`}>
                        <FaultsReport setUpsert={setUpsert} />
                    </Route>
                </Switch>
			</Grid>
			{
				upsert &&
				<UpsertReport 
					data={upsert}
					handleClose={() => setUpsert(null)}
				/>
			}
		</div>
	);
};

const useStyles = makeStyles((theme) => ({

	moduleContainer: {
		position: "sticky",
		top: 0,
		zIndex: 2,
	},
	pageModule: {
		color: "white",
		padding: "10px 40px",
		fontSize: "16px",
		background: "rgba(0,0,0,0.8)",
		boxShadow: "0 0px 2px 1px rgba(255,255,255,0.3)",
		margin: "0px auto 5px",
		width: "30%",
		textAlign: "center",
		borderRadius: "0 0 25px 25px",
		lineHeight: "1",
		[theme.breakpoints.down("sm")]: {
			background: "black",
			width: "100vw",
			padding: "20px 0",
			borderRadius: 0,
			margin: 0,
		},
	},
}));
