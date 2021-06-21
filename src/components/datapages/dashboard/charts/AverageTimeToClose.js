import { Grid, makeStyles, useMediaQuery } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../../../context/LanguageContext";
import GaugeChart from "react-gauge-chart";
import clsx from "clsx";

export const AverageTimeToClose = ({ data }) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const { lang } = useContext(LanguageContext);
	const matches = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    const getLabelText = (p) => {
        if ( p < 60 ) {
            return `${p.toFixed(0)} ${t("dates.minutes")}`
        } else if (p < 2880) {
            return `${(p / 60).toFixed(0)} ${t("dates.hours")}`
        } else {
            return `${(p / 1440).toFixed(0)} ${t("dates.days")}`

        }
    }

    const getPercentaeMarker = (data) => {
        console.log(data)
        console.log(data.avg / (data.max + data.min))
        return data.avg / (data.max + data.min);
    }

	return (
		<Grid item xl={6} xs={12} className={classes.mainContainer}>
			<Grid container justify="center" className={classes.container}>
				<Grid item xs={12} className={classes.gridHeader}>
					<div className={classes.header}>{t("dashboard.avgTimeToClose")}</div>
				</Grid>
				<Grid item xs={12} className={classes.gridData}>
                    {
                        (data.avg) ?
                        <React.Fragment>
                            <div className={classes.gaugeContainer}>
						<GaugeChart
							nrOfLevels={20}
							colors={["#15F800", "#F70000"]}
							arcWidth={0.3}
                            percent={getPercentaeMarker(data)}
							formatTextValue={() => getLabelText(data.avg)}
							cornerRadius={10}
							style={{ width: 375 }}
						/>
					</div>
					<div className={classes.labelsContainer}>           
                        <div className={classes.label}>{getLabelText(data.max)}</div> 
                        <div className={classes.label}>{getLabelText(data.min)}</div>   
					</div>
                    <div className={classes.gaugeText}>
                        {`* ${t("dashboard.gaugeText")}`}
                    </div>
                        </React.Fragment> :
                        <div className={classes.noData}>
                            <img src="https://img.icons8.com/ios-filled/100/4a90e2/remove-data.png" className={classes.noDataImage}/>
                            <div className={classes.noDataText}>
                                {t("dashboard.noData")}
                            </div>
                            <div className={classes.noDataSecondary}>
                                {t("dashboard.noDataSecondary")}
                            </div>
                        </div>
                    }
					
				</Grid>
			</Grid>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	mainContainer: {},
	container: {
		padding: "20px 20px",
		height: "400px",
		[theme.breakpoints.down("sm")]: {
			padding: "10px 0",
		},
	},
	gridHeader: {
		background: "black",
		color: "white",
		borderRadius: "10px 10px 0 0",
		height: "60px",
		[theme.breakpoints.down("sm")]: {
			borderRadius: 0,
		},
	},
	header: {
		fontSize: "18px",
		padding: "20px 20px 0",
	},
	gridData: {
		background: "rgba(0,0,0,0.2)",
		borderRadius: "0 0 10px 10px",
		height: "calc(100% - 60px)",
		display: "flex",
        flexDirection: 'column',
		justifyContent: "center",
		alignItems: "center",
		[theme.breakpoints.down("sm")]: {
			borderRadius: "0",
		},
	},
	gaugeContainer: {
		width: "fit-content",
	},
	gauge: {
		
	},
    labelsContainer: {
        display: 'flex',
        color: 'white',
        width: '265px',
        justifyContent: 'space-between',
        padding: '0 55px'
    },
    label: {
        fontSize: '18px'
    },
    gaugeText: {
        textAlign: 'right',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.5)',
        margin: '10px auto 0px 10px'
    },
    noData: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    noDataText: {
        padding: '20px',
        color: 'white',
        fontSize: '22px'
    },
    noDataSecondary: {
        padding: '0px 30px',
        fontSize: '14px',
        color: 'rgba(255,255,255,0.5)'
    }
}));
