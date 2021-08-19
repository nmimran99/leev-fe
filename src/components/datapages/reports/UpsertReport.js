import {
	Backdrop,
	Fade,
	Grid,
	makeStyles,
	Modal,
	Paper,
	IconButton,
	TextField,
	Button,
	CircularProgress,
	Collapse
} from "@material-ui/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../../context/LanguageContext";
import { LoadingProgress } from "../../reuseables/LoadingProgress";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import { distributeReport, generateLink, generateReportLink } from "../../../api/reportsApi";
import { SnackbarContext } from '../../../context/SnackbarContext';
import { getServerError } from "../../../api/genericApi";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import clsx from 'clsx'
import { getResidentList, getUserList } from "../../../api/userApi";
import { UserItem } from "../../user/UserItem";
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';

export const UpsertReport = ({ data, handleClose }) => {
	const classes = useStyles();

	const { lang } = useContext(LanguageContext);
	const { t } = useTranslation();
    const { setSnackbar } = useContext(SnackbarContext)
	const [isLoading, setIsLoading] = useState(true);
	const [name, setName] = useState("");
	const [generating, setGenerating] = useState(null);
    const [ reportId, setReportId ] = useState(null);
	const [ broadcastTo, setBroadcastTo ] = useState('users');
	const [ userList, setUserList ] = useState({ users: [], tenants: []});
	const [ toSend, setToSend ] = useState([]);

	useEffect(() => {
		setIsLoading(false);
	}, []);

	useEffect(() => {
		if (!reportId) return;
		handleGetUsers();
	}, [reportId])

	useEffect(() => {
		setToSend([]);
	}, [broadcastTo])

	const handleChangeName = (e) => {
		setName(e.target.value);
	};

	const handleGenerateLink = async () => {
		setGenerating(true);
		const res = await generateReportLink({ ...data, name });
        if (!res) {
            setSnackbar(getServerError());
            handleClose();
            return;
        }
        setReportId(res);
        setGenerating(false);
	};

    const copyToClipboard = async (e) => {
		if (navigator.clipboard) {
			await navigator.clipboard.writeText(generateLink(reportId));
			setSnackbar({ severity: 'success', text: t("reportsModule.copiedToClipboard") });
			return;
		};
		setSnackbar({ severity: 'error', text: t("reportsModule.linkNotCopied") })
    }

	const toggleBroadcast = (type) => event => {
		setBroadcastTo(type)
	}

	const handleGetUsers = async () => {
		let users = await getUserList();
		let tenants = await getResidentList({ asset: data.asset });
		setUserList({users, tenants})
	}

	const handleToggleToSend = (uid) => event => {
		if (toSend.find(ts => ts === uid)) {
			setToSend(ts => ts.filter(u => u !== uid))
		} else {
			setToSend(ts => [...ts, uid])
		}
	}

	const handleDistribute = (toAll) => async event => {
		let sendList = toSend;
		if (toAll) {
			sendList = userList[broadcastTo].map(u => u._id);
		}
		const res = await distributeReport(reportId, sendList);
	}

	return isLoading ? (
		<LoadingProgress />
	) : (
		<Modal
			open={!isLoading}
			onClose={handleClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
			className={classes.modal}
		>
			<Fade in={!isLoading}>
				<Grid
					container
					justify="center"
					alignItems="center"
					style={{ outline: "0" }}
				>
					<Grid item xs={11} sm={7} md={5} lg={3} xl={3}>
						<Paper
							className={classes.paper}
							style={{ direction: lang.dir }}
							elevation={6}
						>
							<div className={classes.header}>
								<div className={classes.title}>
									{t("reportsModule.shareReport")}
								</div>
								<IconButton className={classes.closeBtn} onClick={handleClose}>
									<ClearRoundedIcon className={classes.icon} />
								</IconButton>
							</div>
							{
								!reportId &&
								<div className={classes.instructions}>
									{t("reportsModule.upsertInstructions")}
								</div>
							}
							
							<div className={classes.nameContainer}>
								{
									!reportId ? 
									<React.Fragment>
										<TextField
											variant={"outlined"}
											label={t(`reportsModule.reportName`)}
											value={name}
											onChange={handleChangeName}
											className={classes.textField}
											size={"medium"}
										/>
										<Button
											className={classes.generateBtn}
											disabled={Boolean(generating || !name || reportId)}
											onClick={handleGenerateLink}
										>
											{generating ? (
												<CircularProgress className={classes.top} size={20} />
											) : (
												t("reportsModule.generateLink")
											)}
										</Button>
									</React.Fragment> :
									<div className={classes.reportName}>
										{name}
									</div>
								}
								
							</div>
                            {
                                <Collapse in={reportId}>
								<div>
									<div className={classes.linkContainer}>
										<div className={classes.link}>
											<input type='text' value={reportId} id={'linkInput'} hidden />
											{generateLink(reportId)}
										</div>
										<IconButton className={classes.copyLink} onClick={copyToClipboard}>
											<FileCopyIcon className={classes.copyIcon} />
										</IconButton>  
									</div>
									<div className={classes.broadcastContainer}>
										<div className={classes.broadcastToggle}>
											<div className={clsx(classes.selectedOption, classes.optionUsers, broadcastTo === 'users' && classes.activeSelected)} onClick={toggleBroadcast('users')}>
												{t("reportsModule.selectedUsers")}
											</div>
											<div className={clsx(classes.selectedOption, classes.optionTenants, broadcastTo === 'tenants' && classes.activeSelected)} onClick={toggleBroadcast('tenants')}>
												{t("reportsModule.selectedTenants")}
											</div>											
										</div>
										<div className={classes.userlist}>
											{
												userList &&
												userList[broadcastTo].map(u => 
													<div className={classes.userContainer} onClick={handleToggleToSend(u._id)}>
														<UserItem 
															user={u}
															avatarSize={40}
															size={11}
															showName
															showTitle
														/>
														<IconButton
															className={clsx(classes.checkBtn, toSend.find(us => us === u._id) && classes.checked)}
															onClick={handleToggleToSend(u._id)}
														>
															<MailOutlineRoundedIcon className={classes.checkIcon} />
														</IconButton>
													</div>
												)
											}
										</div>
									</div>
									<div className={classes.sendBtns}>
										{
											!toSend.length ?
											<Button
											 	className={classes.sendBtn}
												onClick={handleDistribute(true)}
											 >
												{t("reportsModule.sendToAll")}
											 </Button> :
											 <Button 
											 	className={classes.sendBtn} 
												onClick={handleDistribute(false)}
											>
											 	{`${t("reportsModule.sendTo")} ${toSend.length} ${t("reportsModule.selected")}`}
											 </Button>
										}
											 
										</div>
								</div>
                                </Collapse>
                            }
						</Paper>
					</Grid>
				</Grid>
			</Fade>
		</Modal>
	);
};

const useStyles = makeStyles((theme) => ({
	paper: {
		background: "rgba(0,0,0,0.4)",
		border: "1px solid rgba(255,255,255,0.2)",
		padding: "10px",
		borderRadius: "10px",
		"&:focus": {
			outline: "none",
		},
	},
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		backdropFilter: "blur(10px)",
	},
	header: {
		width: "100%",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	title: {
		color: "white",
		fontSize: "18px",
		padding: "5px 10px",
		height: "fit-content",
	},
	closeBtn: {
		fontSize: "20px",
		height: "40px",
		width: "40px",
	},
	icon: {
		color: "white",
		borderRadius: "25px",
		padding: "5px",
		"&:hover": {
			background: "rgba(255,255,255,0.2)",
		},
	},
	instructions: {
		width: "auto",
		color: "rgba(255,255,255,0.6)",
		fontSize: "12px",
		margin: "0px 10px",
	},
	textField: {
		margin: "30px 10px",
		width: "70%",
		"& fieldset": {
			borderRadius: "50px",
		},
	},
	generateBtn: {
		color: "white",
        height: '35px',
        width: '100px',
		background: theme.palette.leading,
		borderRadius: "50px",
		fontSize: "13px",
		boxShadow: "0 0 3px 2px rgba(0,0,0,0.25)",
		"&:hover": {
			background: theme.palette.leading,
			boxShadow: "0 0 10px 4px rgba(0,0,0,0.25)",
		},
        "&:disabled": {
			background: 'transparent',
            color: "rgba(255,255,255,0.6)",
            border: '1px solid rgba(255,255,255,0.2)',
			boxShadow: "0 0 10px 4px rgba(0,0,0,0.25)",
		},
	},
	nameContainer: {
		display: "flex",
		alignItems: "center",
	},
	top: {
		color: "white",
		animationDuration: "550ms",
	},
    linkContainer: {
        color: 'white',
        display: 'flex',
        border: '1px solid rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        borderRadius: '10px',
		margin: '0 auto'
    },
    copyLink: {
        color: 'white',
        width: '40px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '0px 10px 10px 0px',
        '&:hover': {
            background: theme.palette.leading
        }
    },
    copyIcon: {
        fontSize: '14px'
    },
    link: {
        width: 'calc(100% - 40px)',
        color: 'white',
        fontSize: '11px',
        textAlign: 'center',
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		padding: '0 30px'
    },
	broadcastContainer: {
		border: '1px solid rgba(255,255,255,0.2)',
		width: '90%',
		borderRadius: '10px',
		margin: '30px auto 10px'
	},
	broadcastToggle: {
		display: 'flex'
	},
	selectedOption: {
		width: '50%',
		height: '30px',
		color: 'white',
		fontSize: '13px',
		display: 'grid',
		placeItems: 'center',
		cursor: 'pointer'
	},
	optionUsers: {
		borderRadius: '10px 0 0 0px'
	},
	optionTenants: {
		borderRadius: '0 10px 0px 0'
	},
	activeSelected: {
		background: theme.palette.leading
	},
	userlist: {
		overflow: 'overlay',
		height: '200px',
		padding: '10px 20px',
		borderTop: '1px solid rgba(255,255,255,0.2)'
	},

	userContainer: {
		height: '60px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		cursor: 'pointer'
	},
	checkBtn: {
		color: 'rgba(255,255,255,0.2)',
		border: '1px solid rgba(255,255,255,0.2)',
		height: '30px',
		width: '30px',
		'&:hover': {
			borderColor: 'white'
		}
	},
	checkIcon: {
		fontSize: '18px'
	},

	checked: {
		background: theme.palette.leading,
		color: 'white'
	},
	sendBtns: {
		width: '90%',
		display: 'flex',
		justifyContent: 'space-evenly',
		margin: '10px auto'
	},
	sendBtn: {
		width: '80%',
		color: 'white',
		border: '1px solid rgba(255,255,255,0.2)',
		borderRadius: '50px',
		'&:hover': {
			boxShadow: '0 0 3px 1px rgba(255,255,255,0.2) inset'
		},
		'&:disabled': {
			color: 'rgba(255,255,255,0.2)'
		}
	},
	reportName: {
		color: 'white',
		padding: '10px 0',
		width: '90%',
		margin: '40px auto 10px',
		textAlign: 'center',
		borderRadius: '10px',
		border: '1px solid rgba(255,255,255,0.2)',
		background: 'rgba(255,255,255,0.2)'
	}
}));
