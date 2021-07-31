import {
	Avatar,
	Button,
	ClickAwayListener,
	FormControl,
	Grid,
	IconButton,
	makeStyles,
	OutlinedInput,
	useMediaQuery,
} from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import SaveRoundedIcon from "@material-ui/icons/SaveRounded";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import clsx from "clsx";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import { getDatediffString } from "../../api/genericApi";
import { AuthContext } from "../../context/AuthContext";
import { LanguageContext } from "../../context/LanguageContext";
import { Can } from "./Can";
import AddAPhotoRoundedIcon from "@material-ui/icons/AddAPhotoRounded";
import { ClearRounded } from "@material-ui/icons";
import { EnvContext } from "../../context/EnvContext";

export const CommentSection = ({
	parent,
	saveComment,
	updateComment,
	module,
}) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const { lang } = useContext(LanguageContext);
	const { auth } = useContext(AuthContext);
	const { env ,setEnv } = useContext(EnvContext);
	const ctx = useRef(null);
	const [commentList, setCommentList] = useState(parent.comments || []);
	const [parentId, setParentId] = useState(parent._id);
	const [text, setText] = useState("");
	const [textFocused, setTextFocused] = useState(false);
	const [editComment, setEditComment] = useState(null);
	const [numOfComments, setNumOfComments] = useState(3);
	const [commentImage, setCommentImage] = useState(null);

	useEffect(() => {
		setCommentList(parent.comments);
		setParentId(parent._id);
	}, [parent]);

	useEffect(() => {
		if (commentImage && ctx.current) {
			ctx.current.focus();
			ctx.current.scrollIntoView();
		}
	}, [commentImage]);

	const handleChange = (event) => {
		setText(event.target.value);
	};

	const handleSendComment = (event) => {
		event.stopPropagation();
		saveComment(parentId, auth.user._id, text, commentImage)
			.then((data) => {
				if (!data) return;
				setCommentList(data.comments);
			})
			.finally(() => {
				setText("");
				setTextFocused(false);
				setCommentImage(null);
			});
	};

	const handleEditChange = (event) => {
		setEditComment({
			...editComment,
			text: event.target.value,
		});
	};

	const handleUpdateComment = async () => {
		const res = await updateComment(
			parentId,
			editComment._id,
			editComment.text
		);
		setCommentList(res.comments);
		setEditComment(null);
	};

	const handleFileUpload = (event) => {
		setCommentImage(event.target.files[0]);
	};

	const toggleInputFocused = () => {
		if (textFocused) {
			setTextFocused(false);
			setEnv({ ...env, inputFocused: false})
		} else {
			setTextFocused(true);
			setEnv({ ...env, inputFocused: true})
		}
	}

	return (
		<Grid container className={classes.mainContainer}>
			<Grid item xs={12}>
				<div className={classes.title}>{t("comments.title")}</div>
			</Grid>
			{numOfComments < commentList.length && (
				<Grid item xs={12}>
					<Button
						className={classes.showMore}
						onClick={() => setNumOfComments(numOfComments + 3)}
					>
						{t("comments.showMore")}
					</Button>
				</Grid>
			)}
			{ commentList.slice(Math.max(commentList.length - numOfComments, 0)).map((c, i) => (
				<Grid item xs={12} className={clsx(classes.comment)} key={i}>
					<div className={classes.commentContainer}>
						<Avatar
							className={classes.avatar}
							alt={"abc"}
							src={c.user.avatar}
							style={{ height: "50px", width: "50px" }}
						/>
						<div className={classes.data}>
							<div className={classes.commenter}>
								{`${c.user.firstName} ${c.user.lastName}`}
							</div>
							{Boolean(editComment) && editComment._id === c._id ? (
								<div className={classes.editContainer}>
									<FormControl variant="outlined" className={classes.form}>
										<OutlinedInput
											value={editComment.text || ""}
											onChange={handleEditChange}
											placeholder={t("comments.add")}
											className={clsx(
												classes.textInput,
												textFocused ? classes.focused : null
											)}
											onFocus={() => setTextFocused(true)}
											multiline
											classes={{
												inputMultiline: classes.multiLine,
											}}
										/>
									</FormControl>
									<IconButton
										className={classes.save}
										onClick={handleUpdateComment}
									>
										<SaveRoundedIcon className={classes.icon} />
									</IconButton>
									<IconButton
										className={classes.cancel}
										onClick={() => setEditComment(null)}
									>
										<ClearRoundedIcon className={classes.icon} />
									</IconButton>
								</div>
							) : (
								<div className={classes.commentText}>{`${c.text}`}</div>
							)}
							{
								Boolean(c.image) &&
								<div className={classes.commentImage}>
									<img src={c.image} className={classes.cImage}/>
								</div>
							}
						</div>
					</div>
					<div className={classes.commentFooter}>
						{/* <div className={classes.footerField}> 
                                <Button className={classes.footerBtn}> 
                                    {t("comments.reply")}
                                </Button>
                            </div> */}
						{c.user._id == auth.user._id && (
							<div className={classes.footerField}>
								<Button
									className={classes.footerBtn}
									onClick={() => setEditComment(c)}
								>
									{t("comments.edit")}
								</Button>
							</div>
						)}
						<div className={classes.footerField}>
							{` · `}
							<div className={classes.timePassed}>
								{`${getDatediffString(c.createdAt)}`}
							</div>
						</div>
					</div>
				</Grid>
			))}

			<Can
				module={module}
				action={"comment"}
				userList={[...parent.relatedUsers.map((u) => u._id), parent.owner._id]}
			>
				<ClickAwayListener onClickAway={() => setTextFocused(false)}>
					<Grid container>
						{commentImage && (
							<Grid
								item
								xs={12}
								sm={12}
								md={8}
								lg={6}
								xl={6}
								className={classes.imagePreviewContainer}
							>
								<div className={classes.imagePreview}>
									<IconButton
										className={classes.removeImage}
										onClick={() => setCommentImage(null)}
									>
										<ClearRounded className={classes.removeImageIcon} />
									</IconButton>
									<img
										src={URL.createObjectURL(commentImage)}
										className={classes.image}
									/>
								</div>
							</Grid>
						)}

						<Grid
							item
							xs={12}
							sm={12}
							md={8}
							lg={6}
							xl={6}
							className={classes.addComment}
						>
							<FormControl variant="outlined" className={classes.form}>
								<OutlinedInput
									value={text || ""}
									onChange={handleChange}
									placeholder={t("comments.add")}
									className={clsx(
										classes.textInput,
										textFocused ? classes.focused : null
									)}
									onFocus={toggleInputFocused}
									onBlur={toggleInputFocused}
									multiline
									classes={{
										inputMultiline: classes.multiLine,
									}}
									inputRef={ctx}
								/>
							</FormControl>
							<IconButton
								className={classes.addPhotoBtn}
								
								component={"label"}
								variant={"contained"}
							>
								<AddAPhotoRoundedIcon
									className={clsx(
										classes.icon,
										lang.dir === "rtl" ? classes.mirror : null
									)}
									style={{ paddingBottom: "3px" }}
								/>
								<input
									accept="image/*"
									type="file"
									onChange={handleFileUpload}
									hidden
								/>
							</IconButton>
							<IconButton
								className={classes.postBtn}
								onClick={handleSendComment}
							>
								<SendRoundedIcon
									className={clsx(
										classes.icon,
										lang.dir === "rtl" ? classes.mirror : null
									)}
								/>
							</IconButton>
						</Grid>
					</Grid>
				</ClickAwayListener>
			</Can>
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	mainContainer: {
		padding: '10px 30px',
		[theme.breakpoints.down('sm')]: {
			padding: '0',
		}
	},
	title: {
		color: "white",
		fontSize: "20px",
		padding: "20px 30px 10px",
		marginBottom: "10px",
		borderBottom: "1px solid rgba(255,255,255,0.2)",
	},
	addComment: {
		display: "flex",
		alignItems: "center",
		padding: "5px 10px",
		width: "fit-content",
		position: "relative",
	},
	avatar: {
		margin: "0 10px",
	},
	form: {
		color: "white",
		width: "100%",
		borderRadius: "10px",
		padding: "10px",
	},
	textInput: {
		padding: "15px 10px",
		borderRadius: "42px",
		"& input": {
			color: "white",
			width: "80%",
		},
		"& label": {
			color: "white",
			paddingLeft: "5px",
		},
		"& fieldset": {
			borderColor: "rgba(255,255,255,0.6)",
			borderRadius: "42px",
		},
	},
	focused: {
		boxShadow: "rgba(0,0,0,0.25) 2px 3px 2px 0px",
		background: "rgba(0,0,0,0.4)",
	},
	postBtn: {
		color: "white",
		padding: "7px",
		position: "absolute",
		margin: "auto 0",
		right: "25px",
		"&:hover": {
			background: "rgba(0,0,0,0.4)",
		},
	},
	addPhotoBtn: {
		color: "white",
		padding: "7px",
		position: "absolute",
		margin: "auto 0",
		right: "60px",
		"&:hover": {
			background: "rgba(0,0,0,0.4)",
		},
	},
	icon: {
		fontSize: "24px",
	},
	mirror: {
		transform: "scaleX(-1)",
	},
	comment: {
		display: "flex",
		flexDirection: "column",
		margin: "5px 0",
	},
	commentContainer: {
		width: "fit-content",
		display: "flex",
		padding: "10px 30px 10px 0px",
		margin: "0px 10px",
		background: "rgba(0,0,0,0.4)",
		borderRadius: "35px",
	},
	commenter: {
		color: "rgba(255,255,255,0.6)",
		fontSize: "13px",
		padding: "5px",
	},
	commentText: {
		color: "white",
	},
	commentFooter: {
		display: "flex",
		marginLeft: "40px",
		height: "20px",
	},
	footerField: {
		display: "flex",
		alignItems: "center",
		fontSize: "11px",
		color: "rgba(255,255,255,0.4)",
	},
	footerBtn: {
		fontSize: "12px",
		padding: "1px 2px",
		margin: "0px 2px",
		minWidth: "0",
		width: "fit-content",
		color: "rgba(255,255,255,0.4)",
		borderRadius: "50px",
		"&:hover": {
			color: "white",
			textDecoration: "underline",
			boxShadow: "none",
			background: "transparent",
		},
	},
	timePassed: {
		fontSize: "12px",
		padding: "0px 2px",
		margin: "0 2px",
		minWidth: "0",
		width: "fit-content",
		color: "rgba(255,255,255,0.4)",
	},
	multiLine: {
		padding: "0px 20px",
		width: "85%",
		[theme.breakpoints.down("sm")]: {
			width: "70%",
		},
	},
	showMore: {
		margin: "5px 30px",
		color: "white",
		fontSize: "16px",
		padding: "5px",
		"&:hover": {
			boxShadow: "none",
			background: "inherit",
			textDecoration: "underline",
		},
	},
	save: {
		background: green[800],
		padding: "8px",
		margin: "18px 5px",
	},
	cancel: {
		background: red[800],
		padding: "8px",
		margin: "18px 5px",
	},
	editContainer: {
		height: "auto",
		margin: "auto 0",
		width: "100%",
		dispaly: "flex",
		justifyContent: "center",
	},
	imagePreviewContainer: {
		borderBottom: "1px solid rgba(255,255,255,0.2)",
		width: "-webkit-fill-available",
		padding: "10px",
		margin: "10px 30px 0",
	},
	imagePreview: {
		position: "relative",
		width: "fit-content",
	},
	image: {
		width: "100px",
		borderRadius: "10px",
	},
	removeImage: {
		background: "black",
		padding: "4px",
		border: "1px solid white",
		position: "absolute",
		right: "-10px",
		top: "-10px",
	},
	removeImageIcon: {
		color: "white",
		fontSize: "14px",
	},
	commentImage: {
		margin: '10px 0'
	},
	cImage: {
		borderRadius: '10px',
		maxWidth: '300px',
		[theme.breakpoints.down('sm')]: {
			maxWidth: '100%'
		}
	}
}));
