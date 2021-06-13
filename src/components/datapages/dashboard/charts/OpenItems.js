import { Grid, makeStyles, useMediaQuery } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../../../context/LanguageContext";
import clsx from "clsx";

export const OpenItems = ({ openFaults, openTasks }) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const { lang } = useContext(LanguageContext);
	const matches = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	return (
		<Grid item xl={6} xs={12} className={classes.mainContainer}>
			<Grid container justify="center" className={classes.container}>
				<ItemsCard items={openFaults} module={"faults"} />
				<ItemsCard items={openTasks} module={"tasks"} />
			</Grid>
		</Grid>
	);
};

const ItemsCard = ({ items, module }) => {
	const classes = useStyles();
	const { t } = useTranslation();

	return (
		<Grid item xs={6} className={classes.cardContainer}>
			<div className={clsx(classes.moduleContainer, classes[module])}>
				<div className={classes.headerContainer}>
					{t(`dashboard.open${module}`)}
				</div>
				<div className={classes.totalContainer}>{items.total}</div>
				<div className={classes.statusesContainer}>
					{items.byStatus.map((bs, i) => (
						<div className={classes.rowContainer}>
							<div className={classes.stName}>
								{t(`${module}Module.statuses.${bs.statusId}`)}
							</div>
							<div className={classes.stCount}>{bs.count}</div>
						</div>
					))}
				</div>
			</div>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	cardContainer: {
		padding: '20px 20px',
        height: '360px',
        color: 'white',
        [theme.breakpoints.down("sm")]: {
			padding: '20px 10px',
            height: '300px'
		},
	},
    moduleContainer: {
        height: '100%',
        borderRadius: '10px',
        padding: '20px'
    },
    faults: {
        background: 'linear-gradient(180deg, hsla(0, 70%, 56%, 1) 0%, hsla(0, 70%, 56%, 0) 100%)',
    },
    tasks: {
        background: 'linear-gradient(180deg, hsla(234, 64%, 61%, 1) 0%, hsla(234, 64%, 61%, 0) 100%)', 
    },
    headerContainer: {
        fontSize: '20px',
        textAlign: 'center',
        padding: '10px',
        [theme.breakpoints.down("sm")]: {
            fontSize: '16px',
		},
    },
    totalContainer: {
        textAlign: 'center',
        fontSize: '36px',
        marginBottom: '20px'
    },
    statusesContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    rowContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 20px',
        width: '90%',
        fontSize: '14px',
        [theme.breakpoints.down("sm")]: {
            fontSize: '12px',
		},
    }
}));
