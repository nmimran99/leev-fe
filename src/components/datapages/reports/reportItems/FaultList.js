import { Grid, Icon, makeStyles } from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { ItemLink } from "../../../reuseables/ItemLink";

export const FaultList = ({ faults }) => {
	const classes = useStyles();
	const { t } = useTranslation();

	return (
		<div className={classes.mainContainer}>
			<div className={classes.header}>{t("reportsModule.closedFaults")}</div>
			<Grid container className={classes.headers}>
				<Grid xs={3} md={2} item className={classes.colHeader}>
					<div className={classes.headerCell}>{t("reportsModule.faultId")}</div>
				</Grid>
				<Grid xs={9} md={10} className={classes.colHeader}>
					<div className={classes.headerCell}>
						{t("reportsModule.faultDesc")}
					</div>
				</Grid>
			</Grid>
			<Grid container className={classes.table}>
				{faults.map((f, i) => {
					return (
						<React.Fragment>
							<Grid xs={3} md={2} item className={classes.gridCell}>
								<div className={classes.faultIdData}>
									<ItemLink itemId={f.faultId} module={"faults"} size={14} />
								</div>
							</Grid>
							<Grid xs={9} md={10} className={classes.gridCell}>
								<div className={classes.faultDescData}>{f.description}</div>
							</Grid>
						</React.Fragment>
					);
				})}
			</Grid>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	mainContainer: {

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
		marginTop: '10px',
		fontSize: '14px',
		[theme.breakpoints.down('sm')]: {
			position: 'sticky',
			top: '55px',
			borderRadius: "0",
		}
	},
    headerCell: {
		padding: '10px 20px',
		[theme.breakpoints.down('sm')]: {
        	padding: '10px'
		}
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
	},
	gridCell: {
		borderTop: "1px solid rgba(255,255,255,0.2)",
		display: "flex",
	},
}));
