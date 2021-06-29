import React, { useEffect, useState } from "react";
import { Grid, LinearProgress, makeStyles } from "@material-ui/core";
import {
	getAssets,
	removeAsset as removeAssetDB,
	getFullAddress,
	applyFilters,
} from "../../../api/assetsApi";
import { Asset } from "./Asset";
import { AssetsControls } from "./AssetsControls";
import { AlertDialog } from "../../reuseables/AlertDialog";
import { queryParamsToObject } from "../../../api/genericApi";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "../../reuseables/customHooks/useQuery";

export const AssetsList = () => {
	const location = useLocation();
	const query = useQuery(location.search);
	const classes = useStyles();
	const { t, i18n } = useTranslation();
	const [assets, setAssets] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [alertDialog, setAlertDialog] = useState(null);

	useEffect(() => {
		if (!isLoading) return;
		getAssets(query)
			.then((res) => {
				if (res) {
					return applyFilters(queryParamsToObject(location.search), res);
				}
			})
			.then((data) => {
				if (data) {
					setAssets(data);
				}
			})
			.catch((e) => {
				console.log(e.message);
			})
			.finally(() => setIsLoading(false));
	}, [isLoading]);

	useEffect(() => {
		setIsLoading(true);
	}, [location.search]);

	const removeAsset = (assetId, data) => {
		setAlertDialog({
			handleConfirm: async () => {
				const res = await removeAssetDB(assetId);
				if (res) {
					setAlertDialog(null);
					setIsLoading(true);
				}
			},
			handleCancel: () => setAlertDialog(null),
			text: `${t("assetsModule.deleteConfirmation")} ${getFullAddress(data)}?`,
			title: `${t("assetsModule.deleteAsset")}`,
		});
	};

	return (
		<React.Fragment>
			<Grid container justify="center">
				<Grid item xs={12} className={classes.moduleContainer}>
					<div className={classes.pageModule}>{t("assetsModule.assets")}</div>
				</Grid>
				<Grid item xs={12} md={12}>
					<AssetsControls />
				</Grid>
				<Grid item xs={12} lg={11} xl={10}>
					<Grid container justify="center">
						{isLoading ? (
							<LinearProgress />
						) : (
							assets.map((v, i) => (
								<Asset
									assetData={v}
									key={i}
								/>
							))
						)}
					</Grid>
				</Grid>
			</Grid>
			{Boolean(alertDialog) && (
				<AlertDialog open={Boolean(alertDialog)} alertDialog={alertDialog} />
			)}
		</React.Fragment>
	);
};

const useStyles = makeStyles((theme) => ({
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
		[theme.breakpoints.down('md')]: {
			background: "black",
			width: "100vw",
			padding: "20px 0",
			borderRadius: 0,
			margin: 0
		}
	},
}));
