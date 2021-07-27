import {
	Button, Fade, Grid,
	IconButton, makeStyles, Paper, Slide
} from "@material-ui/core";
import { ClearRounded } from "@material-ui/icons";
import clsx from "clsx";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../context/LanguageContext";

export const ModalContainer = ({
	handleClose,
	title,
	handleConfirm,
	children,
	paperStyles
}) => {
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);
	const { t } = useTranslation();

	return (
		<Fade in={true} timeout={500}>
			<div className={classes.modal}>
				<Slide direction={"up"} in={true} timeout={500}>
					<Grid
						container
						justify="center"
						alignItems="center"
						style={{ outline: "0", height: '100%' }}
					>
						<Grid
							item
							xs={12}
							sm={10}
							md={8}
							lg={8}
							xl={6}
							className={classes.gridCont}
						>
							<Paper
								elevation={6}
								className={classes.paper}
								style={{ direction: lang.dir, ...paperStyles }}

							>
								<div className={classes.headerRow}>
									<div className={classes.title}>{title}</div>
									<div className={classes.close}>
										<IconButton
											className={classes.iconBtn}
											onClick={handleClose}
										>
											<ClearRounded className={classes.icon} />
										</IconButton>
									</div>
								</div>
								<Grid container className={classes.dataContainer} alignItems={'flex-start'}>
									{children}
								</Grid>

								<div className={classes.controls}>
									<Button
										className={clsx(classes.control, classes.save)}
										onClick={handleConfirm}
									>
										{t("controls.confirm")}
									</Button>
									<Button
										className={clsx(classes.control, classes.cancel)}
										onClick={handleClose}
									>
										{t("controls.cancel")}
									</Button>
								</div>
							</Paper>
						</Grid>
					</Grid>
				</Slide>
			</div>
		</Fade>
	);
};

const useStyles = makeStyles((theme) => ({
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		backdropFilter: "blur(40px)",
		position: "fixed",
		background: 'rgba(0,0,0,0.3)',
		top: 0,
		right: 0,
		left: 0,
		bottom: 0,
		width: "100%",
		height: "100%",
		zIndex: 1300,
		"input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button":
			{
				"-webkit-appearance": "none",
				margin: "0",
			},
	},

	gridCont: {
		height: "100%",
		display: 'grid',
		placeItems: 'center',
		[theme.breakpoints.down("sm")]: {
			display: 'block',
		}
	},
	paper: {
		background: "linear-gradient(148deg, rgba(255,255,255,0.45) 0%, rgba(238,238,238,0.35) 50%, rgba(221,221,221,0.25) 100%)",
		border: "1px solid rgba(255,255,255,0.5)",
		borderRadius: "5px",
		padding: "10px 20px",
		height: '70vh',
		[theme.breakpoints.down("sm")]: {
			height: "100%",
			top: 0,
			borderRadius: "0",
			border: "0",
			padding: "10px 5px",
		},
		"&:focus": {
			outline: "none",
		},
	},
	dataContainer: {
		overflowY: "overlay",
		height: "calc(100% - 150px)",
		[theme.breakpoints.down('sm')]: {
			height: "calc(100% - 180px)",
		}
	},
	headerRow: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
		marginBottom: "10px",
		height: "65px",
	},
	title: {
		color: "white",
		padding: "20px 10px 10px",
		fontSize: "20px",
		whiteSpace: "nowrap",
	},
	iconBtn: {
		margin: "10px",
		"&:hover": {
			background: "rgba(0,0,0,0.3)",
		},
	},
	icon: {
		color: "white",
		fontSize: "20px",
	},
	controls: {
		borderTop: "1px solid rgba(255,255,255,0.2)",
		padding: "10px 0",
		display: "flex",
		justifyContent: "space-between",
		height: "60px",
	},
	control: {
		width: "30%",
		border: "1px solid rgba(255,255,255,0.5)",
		fontSize: "16px",
		margin: "5px",
		padding: "5px 30px",
		borderRadius: "5px",
		color: "white",
		[theme.breakpoints.down("sm")]: {
			width: "50%",
		},
	},
	save: {
		background: theme.palette.leading,
		"&:hover": {
			background: theme.palette.leading,
			filter: "brightness(120%)",
		},
		"&:disabled": {
			color: "rgba(255,255,255,0.3)",
		},
	},
	cancel: {
		"&:hover": {
			boxShadow: "inset white 0 0 3px 0px",
		},
	},
}));
