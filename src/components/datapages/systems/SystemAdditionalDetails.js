import {
	Collapse,
	Grid,
	IconButton,
	makeStyles,
	useMediaQuery,
} from "@material-ui/core";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../../context/LanguageContext";
import { LoadingProgress } from "../../reuseables/LoadingProgress";

export const SystemAdditionalDetails = ({
	data,
	isOpen,
	systemId,
	toggleEdit,
}) => {
	const classes = useStyles();
	const downSm = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const { lang } = useContext(LanguageContext);
	const [systemData, setSystemData] = useState(null);
	const { t, i18n } = useTranslation();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		setSystemData(data);
		setIsLoading(false);
	}, [data]);

	return isLoading ? (
		<LoadingProgress />
	) : (
		<Collapse in={isOpen}>
			<div className={classes.container}>
				<Grid container justify={"center"} className={classes.grid} spacing={2}>
					<Grid container className={classes.gridItem}>
						<Grid item xs={12} className={classes.headerRow}>
							<div className={classes.title}>
								{t("systemsModule.additionalDetails")}
							</div>
							<IconButton className={classes.iconBtn} onClick={toggleEdit}>
								<EditRoundedIcon className={classes.icon} />
							</IconButton>
						</Grid>
						<Grid item md={6} lg={3} xl={4} className={classes.fieldContainer}>
							<div className={classes.label}>{t("systemsModule.location")}</div>
							<div className={classes.fieldData}>
								{systemData.general.location || t("general.noData")}
							</div>
						</Grid>
						<Grid
							item
							xs={12}
							sm={12}
							md={6}
							lg={3}
							xl={4}
							className={classes.fieldContainer}
						>
							<div className={classes.label}>
								{t("systemsModule.manufacturingYear")}
							</div>
							<div className={classes.fieldData}>
								{systemData.general.manufacturingYear || t("general.noData")}
							</div>
						</Grid>
						<Grid
							item
							xs={12}
							sm={12}
							md={6}
							lg={3}
							xl={4}
							className={classes.fieldContainer}
						>
							<div className={classes.label}>{t("systemsModule.SID")}</div>
							<div className={classes.fieldData}>
								{systemData.general.SID || t("general.noData")}
							</div>
						</Grid>
						<Grid
							item
							xs={12}
							sm={12}
							md={6}
							lg={3}
							xl={4}
							className={classes.fieldContainer}
						>
							<div className={classes.label}>
								{t("systemsModule.warrantyDetails.issuer")}
							</div>
							<div className={classes.fieldData}>
								{t(
									`systemsModule.warrantyDetails.${
										systemData.warranty.issuer || "nowarranty"
									}`
								)}
							</div>
						</Grid>
						<Grid
							item
							xs={12}
							sm={12}
							md={6}
							lg={3}
							xl={4}
							className={classes.fieldContainer}
						>
							<div className={classes.label}>
								{t("systemsModule.warrantyDetails.expiryDate")}
							</div>
							<div className={classes.fieldData}>
								{systemData.warranty.expiryDate
									? format(
											new Date(systemData.warranty.expiryDate),
											lang.dateformat
									  )
									: t("systemsModule.warrantyDetails.nowarranty")}
							</div>
						</Grid>
					</Grid>
					<Grid item xs={12} lg={4} xl={4} className={classes.gridItem}>
						<div className={classes.card}>
							<div className={classes.cardTitle}>
								{t("systemsModule.manufacturer")}
							</div>
							<div className={classes.cardRow}>
								<div className={classes.rowLabel}>
									{t("systemsModule.manufacturerDetails.name")}
								</div>
								<div className={classes.rowData}>
									{systemData.manufacturer.name || t("general.noData")}
								</div>
							</div>
							<div className={classes.cardRow}>
								<div className={classes.rowLabel}>
									{t("systemsModule.manufacturerDetails.contactName")}
								</div>
								<div className={classes.rowData}>
									{systemData.manufacturer.contactName || t("general.noData")}
								</div>
							</div>
							<div className={classes.cardRow}>
								<div className={classes.rowLabel}>
									{t("systemsModule.manufacturerDetails.email")}
								</div>
								<div className={classes.rowData}>
									{systemData.manufacturer.email || t("general.noData")}
								</div>
							</div>
							<div className={classes.cardRow}>
								<div className={classes.rowLabel}>
									{t("systemsModule.manufacturerDetails.phoneNumber")}
								</div>
								<div className={classes.rowData}>
									{systemData.manufacturer.phoneNumber || t("general.noData")}
								</div>
							</div>
							<div className={classes.cardRow}>
								<div className={classes.rowLabel}>
									{t("systemsModule.manufacturerDetails.extension")}
								</div>
								<div className={classes.rowData}>
									{systemData.manufacturer.extension || t("general.noData")}
								</div>
							</div>
						</div>
					</Grid>
					<Grid item xs={12} lg={4} xl={4} className={classes.gridItem}>
						<div className={classes.card}>
							<div className={classes.cardTitle}>
								{t("systemsModule.supplier")}
							</div>
							<div className={classes.cardRow}>
								<div className={classes.rowLabel}>
									{t("systemsModule.supplierDetails.name")}
								</div>
								<div className={classes.rowData}>
									{systemData.supplier.name || t("general.noData")}
								</div>
							</div>
							<div className={classes.cardRow}>
								<div className={classes.rowLabel}>
									{t("systemsModule.supplierDetails.contactName")}
								</div>
								<div className={classes.rowData}>
									{systemData.supplier.contactName || t("general.noData")}
								</div>
							</div>
							<div className={classes.cardRow}>
								<div className={classes.rowLabel}>
									{t("systemsModule.supplierDetails.email")}
								</div>
								<div className={classes.rowData}>
									{systemData.supplier.email || t("general.noData")}
								</div>
							</div>
							<div className={classes.cardRow}>
								<div className={classes.rowLabel}>
									{t("systemsModule.supplierDetails.phoneNumber")}
								</div>
								<div className={classes.rowData}>
									{systemData.supplier.phoneNumber || t("general.noData")}
								</div>
							</div>
							<div className={classes.cardRow}>
								<div className={classes.rowLabel}>
									{t("systemsModule.supplierDetails.extension")}
								</div>
								<div className={classes.rowData}>
									{systemData.supplier.extension || t("general.noData")}
								</div>
							</div>
						</div>
					</Grid>
					<Grid item xs={12} lg={4} xl={4} className={classes.gridItem}>
						<div className={classes.card}>
							<div className={classes.cardTitle}>
								{t("systemsModule.insurance")}
							</div>
							<div className={classes.cardRow}>
								<div className={classes.rowLabel}>
									{t("systemsModule.insuranceDetails.name")}
								</div>
								<div className={classes.rowData}>
									{systemData.insurance.name || t("general.noData")}
								</div>
							</div>
							<div className={classes.cardRow}>
								<div className={classes.rowLabel}>
									{t("systemsModule.insuranceDetails.contactName")}
								</div>
								<div className={classes.rowData}>
									{systemData.insurance.contactName || t("general.noData")}
								</div>
							</div>
							<div className={classes.cardRow}>
								<div className={classes.rowLabel}>
									{t("systemsModule.insuranceDetails.email")}
								</div>
								<div className={classes.rowData}>
									{systemData.insurance.email || t("general.noData")}
								</div>
							</div>
							<div className={classes.cardRow}>
								<div className={classes.rowLabel}>
									{t("systemsModule.insuranceDetails.phoneNumber")}
								</div>
								<div className={classes.rowData}>
									{systemData.insurance.phoneNumber || t("general.noData")}
								</div>
							</div>
							<div className={classes.cardRow}>
								<div className={classes.rowLabel}>
									{t("systemsModule.insuranceDetails.extension")}
								</div>
								<div className={classes.rowData}>
									{systemData.insurance.extension || t("general.noData")}
								</div>
							</div>
						</div>
					</Grid>
				</Grid>
			</div>
		</Collapse>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		border: "1px solid rgba(255,255,255,0.2)",
		background: "rgba(0,0,0,0.4)",
		borderRadius: "5px",
		margin: "10px",
		padding: "10px",
	},
	grid: {
		padding: "10px",
	},
	gridItem: {
		display: "flex",
		margin: "10px 0",
	},
	fieldContainer: {
		padding: "10px",
		margin: "15px 0",
		height: "60px",
	},
	label: {
		padding: "5px 10px",
		borderRadius: "5px 5px 0px 0",
		background: "rgba(0,0,0,0.3)",
		color: "white",
		width: "fit-content",
		fontSize: "13px",
	},
	fieldData: {
		padding: "15px 20px",
		width: "200px",
		border: "1px solid rgba(255,255,255,0.2)",
		borderRadius: "0 5px 5px 5px",
		color: "white",
	},
	card: {
		margin: "10px 0px",
		border: "1px solid rgba(255,255,255,0.2)",
		borderRadius: "5px",
		padding: "10px",
		width: "100%",
	},
	cardTitle: {
		color: "white",
		fontSize: "20px",
		padding: "10px",
		background: "rgba(0,0,0,0.3)",
		borderRadius: "5px",
	},
	cardRow: {
		padding: "10px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		color: "white",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
	},
	rowLabel: {
		padding: "3px 0",
		fontSize: "14px",
		color: "rgba(255,255,255,0.6)",
	},
	rowData: {
		fontSize: "16px",
	},
	headerRow: {
		color: "white",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "0px 10px 10px 10px",
		fontSize: "20px",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
	},
	iconBtn: {
		border: "1px solid rgba(255,255,255,0.2)",
		"&:hover": {
			background: "rgba(0,0,0,0.3)",
		},
	},
	icon: {
		color: "white",
		fontSize: "20px",
	},
}));
