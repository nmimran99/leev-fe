import {
	Avatar,
	Button,
	Grid,
	IconButton,
	makeStyles,
	Tooltip,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import { format, parseISO } from "date-fns";
import dateFormat from "dateformat";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { getFullName } from "../../../api/genericApi";
import { getUserDataById, uploadAvatar } from "../../../api/userApi";
import { AuthContext } from "../../../context/AuthContext";
import { LanguageContext } from "../../../context/LanguageContext";
import { Can } from "../../reuseables/Can";
import { UpsertUser } from "./UpsertUser";

const userData = ["email", "phoneNumber", "birthDate", "employedBy", "status"];
export const UserProfile = () => {
	const classes = useStyles();
	const { t } = useTranslation();
	const { auth, setAuth } = useContext(AuthContext);
	const { lang } = useContext(LanguageContext);
	const [editUser, setEditUser] = useState(null);

	const handleFileUpload = (event) => {
		uploadAvatar(event.target.files[0]).then((res) => {
			if (res.avatar) {
				setAuth({
					...auth,
					user: { ...auth.user, avatar: res.avatar },
				});
			}
		});
	};

	const closeAddEdit = () => {
		setEditUser(false);
	};

	const reloadUserData = async () => {
		let user = await getUserDataById(auth.user._id);
		setAuth({
			...auth, 
			user
		});
	}

	return (
		<React.Fragment>
			<Grid container className={classes.container}>
				<Grid item xs={12} className={classes.avatarContainer}>
					<div className={classes.avDiv}>
						<Avatar src={auth.user.avatar} className={classes.avatar} />
						<Tooltip title={t("users.uploadAvatar")}>
							<IconButton
								component={"label"}
								variant={"contained"}
								className={classes.uploadAvatar}
							>
								<AddIcon className={classes.addIcon} />
								<input
									accepts="image/*"
									type="file"
									onChange={handleFileUpload}
									hidden
								/>
							</IconButton>
						</Tooltip>
					</div>
				</Grid>
				<Grid item xs={12} className={classes.nameContainer}>
					<div className={classes.name}>{getFullName(auth.user)}</div>
					<div className={classes.role}>{auth.user.role.roleName}</div>
				</Grid>
				<Can module="users" action="update" userList={[auth.user._id]}>
					<Grid item xs={12} className={classes.controls}>
						<Button
							startIcon={<EditIcon className={classes.editIcon} />}
							className={classes.editBtn}
							onClick={() => setEditUser(auth.user._id)}
						>
							{t("settings.editUserDetails")}
						</Button>
					</Grid>
				</Can>
				<Grid container className={classes.userData}>
					{userData.map((ud, i) => {
						let val =
							ud === "birthDate"
								? format(parseISO(auth.user.birthDate), lang.dateonly)
								: ud === "status"
								? auth.user.isActive
									? t("users.active")
									: t("users.inactive")
								: auth.user[ud];

						return (
							<Grid item xs={12} xl={6} className={classes.dataRow}>
								<div className={classes.dataLabel}>{t(`users.${ud}`)}</div>
								<div className={classes.dataValue}>{val}</div>
							</Grid>
						);
					})}
				</Grid>
			</Grid>
			{editUser && (
				<UpsertUser
					handleClose={() => closeAddEdit(false)}
					userId={editUser}
					reloadUsers={reloadUserData}
				/>
			)}
		</React.Fragment>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		width: "100%",
		borderLeft: "1px solid rgba(255,255,255,0.2)",
	},
	controls: {
		display: "flex",
		justifyContent: "flex-end",
	},
	avatarContainer: {
		display: "grid",
		placeItems: "center",
		padding: "40px 0 10px",
		height: "fit-content",
		width: "fit-content",
	},
	avatar: {
		height: "150px",
		width: "150px",
		position: "relative",
	},
	nameContainer: {
		height: "fit-content",
		width: "fit-content",
		padding: "10px 0",
		display: "grid",
		placeItems: "center",
	},
	name: {
		color: "white",
		fontSize: "24px",
	},
	role: {
		color: "white",
		fontSize: "16px",
		padding: "5px 0",
	},
	userData: {
		padding: "20px 10px 10px",
	},
	dataRow: {
		padding: "10px 20px",
	},
	dataLabel: {
		color: "white",
		width: "fit-content",
		padding: "5px 20px",
		background: "rgba(0,0,0,0.8)",
		borderRadius: "5px 5px 0 0",
		fontSize: "14px",
	},
	dataValue: {
		color: "white",
		padding: "15px 20px",
		background: "rgba(255,255,255,0.1)",
		borderRadius: "0px 5px 5px 5px",
		fontSize: "16px",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	editBtn: {
		padding: "3px 25px 3px 15px",
		border: "1px solid black",
		background: "black",
		color: "rgba(255,255,255,0.5)",
		borderRadius: "50px",
		margin: "0 30px",
		"&:hover": {
			border: "1px solid white",
			color: "white",
		},
	},
	editIcon: {
		color: "inherit",
		fontSize: "20px",
		padding: "5px",
	},
	uploadAvatar: {
		border: "2px solid rgba(255,255,255,0.5)",
		padding: "4px",
		position: "absolute",
		bottom: 0,
		color: "rgba(255,255,255,0.5)",
		background: "rgba(0,0,0,0.8)",
		"&:hover": {
			background: "black",
			color: "white",
			borderColor: "white",
		},
	},
	avDiv: {
		position: "relative",
	},
	addIcon: {
		fontSize: "24px",
	},
}));
