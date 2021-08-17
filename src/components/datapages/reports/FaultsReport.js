import { Button, Grid, makeStyles } from "@material-ui/core";
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import { format, parseISO } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router";
import { getFullAddress } from "../../../api/assetsApi";
import { queryParamsToObject } from "../../../api/genericApi";
import { getReportData, getReportPublic } from "../../../api/reportsApi";
import { LanguageContext } from "../../../context/LanguageContext";
import { AuthContext } from "../../../context/AuthContext";
import { LoadingProgress } from "../../reuseables/LoadingProgress";
import { FaultList } from "./reportItems/FaultList";
import { ItemCounter } from "./reportItems/ItemCounter";
import { MostUsedTags } from "./reportItems/MostUsedTags";
import { SystemLocationGraph } from "./reportItems/SystemLocationGraph";
import { TopUser } from "./reportItems/TopUser";

export const FaultsReport = ({ setUpsert }) => {
	const classes = useStyles();
	const location = useLocation();
	const history = useHistory();
	const params = useParams();
	const { auth } = useContext(AuthContext);
	const { t } = useTranslation();
	const { lang } = useContext(LanguageContext);
	const [ viewMode, setViewMode ] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState(null);

	useEffect(() => {
		prepareData();
	}, []);

	const prepareData = async () => {
		if (params.reportId) {
			setViewMode(true);
			const res = await getReportPublic(params.reportId);
			setData(res);
			setIsLoading(false);
			return;
		}
		if (!location.search) {
			history.push('/workspace/reports')
		}
		let queryParams = queryParamsToObject(location.search);
		let res = await getReportData({ module: "faults", ...queryParams });
		setData(res);
		setIsLoading(false);
	};

	const handleShare = () => {
		setUpsert({
			reportId: 'faultsGeneral',
			parameters: queryParamsToObject(location.search),
			asset: data.asset._id
		})
	}

	return isLoading ? (
		<LoadingProgress />
	) : (
		<Grid container className={classes.mainContainer}>
			<Grid item xs={12} className={classes.headerContainer}>
				<div className={classes.header}>
					{`${t("reportsModule.header")}  ${format(
						parseISO(data.fromDate),
						lang.dateonly
					)} - ${format(parseISO(data.toDate), lang.dateonly)}`}
				</div>
				{
					!viewMode &&
					<Button
						className={classes.distributeBtn}
						onClick={handleShare}
					>
						{t("reportsModule.distributeReport")}
					</Button>
				}
				
			</Grid>
			<Grid item xs={12} className={classes.assetContainer}>
				<div className={classes.asset}>{getFullAddress(data.asset)}</div>
			</Grid>				
			<Grid item xs={12} className={classes.gridContainer}>
				<div className={classes.itemsContainer}>
					<ItemCounter
						itemCount={data.openFaultCount}
						itemLabel={t("reportsModule.faultsOpened")}
						color={"red"}
                        TopIcon={<AddRoundedIcon className={classes.addedIcon}/>}
					/>
					<ItemCounter
						itemCount={data.closedFaultCount}
						itemLabel={t("reportsModule.faultsClosed")}
						color={"green"}
                        TopIcon={<CheckRoundedIcon className={classes.closedIcon}/>}
					/>
				</div>
				{
					!(auth.user.data.isResident || auth.user.data.isOwner) &&
					<div className={classes.topUsersContainer}>
						<div className={classes.topUsersHeader}>
							{t("reportsModule.topUsers")}
						</div>
						{data.mostActiveUsers.map((user, i) => (
							<TopUser
								user={user.user[0]}
								actionCount={user.userActions}
								topUser={i === 0}
							/>
						))}
					</div>
				}
				
			</Grid>
			<Grid container className={classes.gridContainer}>
				<Grid item xs={12} lg={9} className={classes.graphContainer}>
					{data && (
						<SystemLocationGraph data={data.faultsBySystemAndLocation} />
					)}
				</Grid>
				<Grid xs={12} lg={3} className={classes.tagsContainer}>
					<MostUsedTags data={data.mostUsedTags} />
				</Grid>
			</Grid>
            <Grid container className={classes.gridContainer}>
                <FaultList faults={data.closedFaults} />
            </Grid>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	mainContainer: {
		padding: "30px",
		width: "80%",
		[theme.breakpoints.down("md")]: {
			padding: "0px",
			width: "100%",
		},
	},
	assetContainer: {
		borderBottom: "1px solid rgba(255,255,255,0.2)",
		[theme.breakpoints.down("sm")]: {
			marginBottom: "20px",
			background: "rgba(0,0,0,0.4)",
			borderRadius: "0",
		},
	},
	asset: {
		width: "fit-content",
		padding: "20px",
		color: "white",
		fontSize: "20px",
		whiteSpace: 'nowrap',	
		[theme.breakpoints.down("sm")]: {
			fontSize: "16px",
			padding: "10px 20px",
		},
	},
	headerContainer: {
		color: "white",
		padding: "0 20px",
		fontSize: "18px",
		marginTop: "20px",
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		position: 'static',
		[theme.breakpoints.down("sm")]: {
			fontSize: "13px",
			background: "rgba(0,0,0,0.4)",
			padding: "10px 20px",
			marginTop: "0",
			borderRadius: "0",
		},
	},
	itemsContainer: {
		display: "flex",
	},
	gridContainer: {
		display: "flex",
		[theme.breakpoints.down("sm")]: {
			flexWrap: "wrap",
			justifyContent: "center",
            padding: '20px 0'
		},
	},
	topUsersHeader: {
		color: "white",
		fontSize: "14px",
		padding: "5px",
		margin: "10px 5px",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
	},
	topUsersContainer: {
		marginLeft: "auto",
		[theme.breakpoints.down("md")]: {
			margin: "auto",
			width: "100%",
            padding: '15px 10px'
		},
	},
	graphContainer: {
		padding: "10px",
		borderRadius: "10px",
		width: "calc(100% - 80px)",
		[theme.breakpoints.down("md")]: {
			width: "100%",
			display: "flex",
			justifyContent: "center"
		},
	},
	tagsContainer: {
		[theme.breakpoints.down("md")]: {
			padding: "0 10px",
		},
	},
    closedIcon: {
        color: theme.palette.leading,
        fontSize: '60px',
        [theme.breakpoints.down('sm')]: {
            height: '40px',
        }
    },
    addedIcon: {
        color: theme.palette.leading,
        fontSize: '60px',
        [theme.breakpoints.down('sm')]: {
            height: '40px',
        }
    },
	distributeBtn: {
		color: 'white',
		background: theme.palette.leading,
		borderRadius: '50px',
		padding: '5px 20px',
		boxShadow: '0 0 3px 2px rgba(0,0,0,0.25)',
		'&:hover': {
			background: theme.palette.leading,
			boxShadow: '0 0 10px 4px rgba(0,0,0,0.25)',
		},
		[theme.breakpoints.down('sm')]: {
			position: 'absolute',
			zIndex: 5,
			top: '15px',
			right: '10px',
			padding: '3px 15px',
			fontSize: '12px',
			whiteSpace: 'nowrap'		
		}
	}
}));
