import React, { useState, useContext, useEffect } from "react";
import {
	makeStyles,
	Slide,
	Paper,
	IconButton,
	Backdrop,
	Modal,
} from "@material-ui/core";
import ChevronLeftRoundedIcon from "@material-ui/icons/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@material-ui/icons/ChevronRightRounded";
import clsx from "clsx";
import { LanguageContext } from "../../context/LanguageContext";
import { ClearRounded } from "@material-ui/icons";
import ZoomInRoundedIcon from "@material-ui/icons/ZoomInRounded";
import ZoomOutRoundedIcon from "@material-ui/icons/ZoomOutRounded";
import ZoomOutMapRoundedIcon from "@material-ui/icons/ZoomOutMapRounded";

export const Carousel = ({ images, isOpen, size }) => {
	const classes = useStyles();
	const [slideIn, setSlideIn] = useState(isOpen);
	const [slideDirection, setSlideDirection] = useState("left");
	const [index, setIndex] = useState(0);
	const { lang } = useContext(LanguageContext);
	const [photoViewMode, setPhotoViewMode] = useState(false);
	const [picSize, setPicSize] = useState(size);

	useEffect(() => {
		if (photoViewMode) {
			setPicSize(300);
		}
	}, [photoViewMode]);

	const handleClick = (dir) => (event) => {
		setSlideDirection(dir);
		setSlideIn(false);

		setTimeout(() => {
			setIndex(
				(index - (dir === "left" ? 1 : -1) + images.length) % images.length
			);
			setSlideIn(true);
		}, 100);
	};

	const handleZoom = (up) => {
		if (up) {
			if (picSize === 1300) return;
			setPicSize(picSize + 100);
		} else {
			if (picSize === 300) return;
			setPicSize(picSize - 100);
		}
	};

	const handleClose = () => {
		setPicSize(500);
		setPhotoViewMode(false);
	};

	return (
		<CarouselWrapper
			isModal={photoViewMode}
			wrapper={(children) => (
				<Modal
					open={true}
					onClose={handleClose}
					closeAfterTransition
					BackdropComponent={Backdrop}
					BackdropProps={{
						timeout: 500,
					}}
					className={classes.modal}
				>
					<div className={classes.content}>
						<CarouselControls
							handleZoom={handleZoom}
							picSize={picSize}
							handleClose={handleClose}
						/>
						{children}
					</div>
				</Modal>
			)}
		>
			<div
				className={classes.container}
				style={{ cursor: photoViewMode ? "default" : "pointer" }}
			>
				{images.length > 1 && (
					<IconButton
						className={clsx(classes.arrow, classes.arrowLeft)}
						onClick={handleClick("left")}
						style={{ left: lang.drection === "rtl" ? "97%" : "3%" }}
					>
						<ChevronLeftRoundedIcon className={classes.icon} />
					</IconButton>
				)}

				<CarouselSlide
					image={images[index]}
					size={picSize}
					setPhotoViewMode={setPhotoViewMode}
					photoViewMode={photoViewMode}
				/>
				{images.length > 1 && (
					<IconButton
						className={clsx(classes.arrow, classes.arrowRight)}
						onClick={handleClick("right")}
						style={{ right: lang.drection === "rtl" ? "97%" : "3%" }}
					>
						<ChevronRightRoundedIcon className={classes.icon} />
					</IconButton>
				)}
			</div>
		</CarouselWrapper>
	);
};

const CarouselSlide = ({ image, size, setPhotoViewMode, photoViewMode }) => {
	const classes = useStyles();

	return (
		<Paper
			className={classes.paper}
			elevation={0}
			style={{ height: `${size}px` }}
			onClick={() => setPhotoViewMode(true)}
		>
			<img
				src={image}
				className={photoViewMode ? classes.imageViewMode : classes.image}
			/>
		</Paper>
	);
};

const CarouselControls = ({ handleZoom, picSize, handleClose }) => {
	const classes = useStyles();

	return (
		<div className={classes.controls}>
			<div className={classes.close}>
				<IconButton className={classes.iconBtn} onClick={handleClose}>
					<ClearRounded className={classes.icon} />
				</IconButton>
			</div>

			<div className={classes.zoomControl}>
				<IconButton
					className={classes.iconBtn}
					onClick={() => handleZoom(true)}
					disabled={picSize === 1300}
				>
					<ZoomInRoundedIcon className={classes.icon} />
				</IconButton>
				<IconButton
					className={classes.iconBtn}
					onClick={() => handleZoom(false)}
					disabled={picSize === 300}
				>
					<ZoomOutRoundedIcon className={classes.icon} />
				</IconButton>
				<IconButton className={classes.iconBtn}>
					<ZoomOutMapRoundedIcon className={classes.icon} />
				</IconButton>
			</div>
		</div>
	);
};

const CarouselWrapper = ({ isModal, wrapper, children }) =>
	isModal ? wrapper(children) : children;

const useStyles = makeStyles((theme) => ({
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		backdropFilter: "blur(10px)",
	},
	container: {
		display: "flex",
		position: "relative",
		width: "100%",
		justifyContent: "center",
		outline: "none",
	},
	content: {
		height: "100%",
		width: "100%",
		outline: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	paper: {
		padding: 0,
		margin: 0,
		width: "100%",
		direction: "ltr",
		background: "transparent",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		userSelect: "none",
	},
	image: {
		width: "100%",
		height: "100%",
		objectFit: "cover",
		userSelect: "none",
	},
	imageViewMode: {
		height: "100%",
	},
	arrow: {
		position: "absolute",
		background: "rgba(0,0,0,0.6)",
		color: "white",
		zIndex: 1,
		padding: "5px",
	},
	arrowLeft: {
		top: "50%",
		transform: "translateY(-50%)",
	},
	arrowRight: {
		top: "50%",
		transform: "translateY(-50%)",
	},
	icon: {
		fontSize: "32px",
	},
	iconBtn: {
		background: "rgba(255,255,255,0.6)",
		color: "black",
		padding: "8px",
		"&:hover": {
			background: "rgba(0,0,0,0.8)",
			color: "white",
		},
	},
	controls: {
		display: "flex",
		justifyContent: "space-between",
		position: "absolute",
		top: 0,
		width: "90%",
		padding: "2% 5%",
		zIndex: 1,
	},
	zoomControl: {
		width: "170px",
		display: "flex",
		justifyContent: "space-between",
	},
}));
