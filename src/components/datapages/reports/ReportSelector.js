import { Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReportOption } from "./ReportOption";
import AssessmentIcon from '@material-ui/icons/Assessment';
import { LoadingProgress } from "../../reuseables/LoadingProgress";
import { getAssetsSuggestions } from "../../../api/systemsApi";

export const ReportSelector = () => {
	
    const classes = useStyles();
    const { t } = useTranslation();
    const [ isLoading, setIsLoading ] = useState(true);
    const [ assets, setAssets ] = useState([]);

    useEffect(() => {
        prepareData();
    }, [])

    const prepareData = async () => {
        const assets = await getAssetsSuggestions();
        setAssets(assets);
        setIsLoading(false);
    }

	return (
		<Grid container className={classes.reportsListContainer} justify='center'>
            <Grid item xs={12} md={12} lg={10} xl={6}>
                <div className={classes.header}>
                    <AssessmentIcon className={classes.headerIcon}/>
                    <div className={classes.mainMessage}>
                        {t("reportsModule.mainMessage")}
                    </div>
                </div>
            </Grid>
            {
                isLoading ?
                <LoadingProgress /> : 
                <React.Fragment>
                    <Grid item xs={12} xl={10}>
                        <ReportOption reportName={t("reportsModule.faultsReport")} reportId={"faults"} assets={assets} />
                    </Grid>
                </React.Fragment>
                
            }
            
            
        </Grid>
	);
};

const useStyles = makeStyles((theme) => ({
    reportsListContainer: {
        width: '100%',
        padding: '30px'
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.15)',
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '10px',
        margin: '10px auto',
        color: 'rgba(255,255,255,0.8)',
        fontSize: '13px'
    },
    headerIcon: {
        fontSize: '150px',
        color: theme.palette.leading
    }
}));
