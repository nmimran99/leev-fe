import { Button, makeStyles, useTheme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import Chart from "react-apexcharts";
import { LoadingProgress } from "../../../reuseables/LoadingProgress";
import {
	getLocationData,
	getSystemData,
} from "../../../../api/reportsApi";

export const SystemLocationGraph = ({ data }) => {
	const classes = useStyles();
	const { t } = useTranslation();
    const theme = useTheme();
	const [mode, setMode] = useState(["system"]);
	const [chartState, setChartState] = useState(null);

	useEffect(() => {
		prepareData();
	}, [mode, data]);

	const prepareData = async () => {
		let csData = await getCsData(data);
		let cs = {
			series: [
				{
					data: csData.series,
				},
			],
			options: {
				chart: {
					height: 320,
					type: "bar",
                    animations: {
                        enabled: false,
                    },
                    toolbar: {
                        show: false
                    },
				},
                colors: [theme.palette.leading],
				plotOptions: {
					bar: {
						columnWidth: "50%",
					},
				},
				dataLabels: {
					enabled: true,
                    
				},
				legend: {
					show: false,
				},
				xaxis: {
					categories: csData.labels,
                    position: 'bottom',
					labels: {
                        show: true,
                        rotate: 30,
                        rotateAlways: false,
						style: {
							fontSize: "11px",
                            textAlign: 'center',
                            colors: '#FFF',
                            cssClass: classes.labels,
						},
					},
				},
                yaxis: {
                    labels: {
                        show: false
                    }
                },
                tooltip: {
                    enabled: false
                }
			},
		};
		setChartState(cs);
	};
	const toggle = (toggleTo) => (event) => {
		setMode([toggleTo]);
	};

	const getCsData = async (d) => {
		if (mode.includes("system")) {
			// if (mode.includes("location")) {
			// 	return await getCombinationData(d.byCombination);
			// }
			return await getSystemData(d.bySystem);
		}
		return await getLocationData(d.byLocation);
	};

	return (
		<div className={classes.mainContainer}>
             <div className={classes.chartHeader}>
                    {t("reportsModule.chartHeader")}
                </div> 
			<div className={classes.buttonsContainer}>
               
				<Button
					className={clsx(
						classes.toggler,
						mode.includes("system") && classes.active
					)}
					onClick={toggle("system")}
				>
					{t("reportsModule.system")}
				</Button>
				<Button
					className={clsx(
						classes.toggler,
						mode.includes("location") && classes.active
					)}
					onClick={toggle("location")}
				>
					{t("reportsModule.location")}
				</Button>
			</div>
			<div className={classes.graphContainer}>
				{!chartState ? (
					<LoadingProgress />
				) : (
					<Chart
						options={chartState.options}
						series={chartState.series}
						type="bar"
						width={'100%'}
						height={260}
					/>
				)}
			</div>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	mainContainer: {
		height: "340px",
		width: "inherit",
        background: 'rgba(0,0,0,0.4)',
        padding: '20px',
        borderRadius: '10px',
        [theme.breakpoints.down('sm')]: {
            padding: '0 10px',
            overflow: 'visible'
        }
	},
	toggler: {
		background: "rgba(255,255,255,0.1)",
		borderRadius: "50px",
		padding: "5px 30px",
		margin: "0 5px",
		color: "rgba(255,255,255,0.6)",
		"&:hover": {
			background: "rgba(0,0,0,0.4)",
		},
        [theme.breakpoints.down('sm')]: {
            fontSize: '13px',
            padding: "3px 30px",
            margin: '0 20px'
        }
	},
	active: {
		background: theme.palette.leading,
        color: 'white'
	},
    labels: {
        
    },
    buttonsContainer: {
        display: 'flex',
        color: 'white',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            
        }
    },
    chartHeader: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: '12px',
        padding: '10px'
    },
    graphContainer: {
        width: '100%'
    }
}));
