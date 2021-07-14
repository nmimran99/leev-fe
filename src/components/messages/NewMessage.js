import { IconButton, makeStyles, OutlinedInput, Slide } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { filterUsers, getUserList } from "../../api/userApi";
import { UserItem } from "../user/UserItem";
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import { ClearRounded } from "@material-ui/icons";
import { AuthContext } from "../../context/AuthContext";

export const NewMessage = ({ toggleNewMessage, open, startNewConversation }) => {
	const classes = useStyles();
    const { t } = useTranslation();
    const { auth } = useContext(AuthContext);
    const [ orgUsers, setOrgUsers ] = useState([]);
    const [ userList, setUserList ] = useState([]);
    const [ searchValue, setSearchValue ] = useState('');

    useEffect(() => {
        prepareData();
    }, []);

    const prepareData = async () => {
        let users = await getUserList();
        if(users.length) {
            users = users.filter(u => u._id !== auth.user._id);
            setUserList(users);
            setOrgUsers(users);
        }
    }

    useEffect(() => {
        setUserList(orgUsers)
        if (!searchValue) {
            return;
        };
        filterUsers(orgUsers, searchValue)
        .then(uc => setUserList(uc))
    }, [searchValue])


	return (
	
            <Slide direction={'up'} timeout={300} in={open}>
				<div className={classes.mainContainer}>
                    <div className={classes.closeBtn}>
                        <IconButton
                            className={classes.iconBtn}
                            onClick={toggleNewMessage}
                        >
                            <ClearRounded className={classes.icon} />
                        </IconButton>
                    </div>
                    <div className={classes.header}>
                        {t("messenger.newMessage")}
                    </div>
                    <div className={classes.userSearch}>
                        <OutlinedInput
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                            className={classes.textInput}
                            startAdornment={<SearchRoundedIcon  className={classes.searchIcon} />}
                            placeholder={t('messenger.searchUser')}
                        />
                    </div>
                    <div className={classes.users}>
                        {
                            userList.length &&
                            userList.map((u,i) => 
                                <div className={classes.userRow} onClick={() => startNewConversation(u._id)}>
                                    <UserItem user={u} avatarSize={50} size={13} showName showTitle/>
                                </div>
                            )
                        }
                    </div>
                </div>
                </Slide>

	);
};

const useStyles = makeStyles((theme) => ({
	mainContainer: {
		height: "100%",
		width: "100%",
		position: "absolute",
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(22px)',
		top: "0",
		borderRadius: "30px 0px 0 0"
	},
    header: {
        color: 'rgba(255,255,255,0.8)',
        height: '50px',
        fontSize: '18px',
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(0,0,0,0.5)',
        padding: '0 10px'
    },
    userSearch: {
        height: '70px',
        boxShadow: '0 1px 2px 1px rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    users: {
        height: 'calc(100% - 120px)',
        overflow: 'auto'
    },
    userRow: {
        padding: '10px 30px',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        cursor: 'pointer'
    },
    textInput: {
		padding: "4px 10px",
        width: '90%',
		color: "white",
		"& input": {
			color: "white",
			padding: "4px 10px",
			fontSize: "14px",
		},
		"& label": {
			color: "white",
			paddingLeft: "5px",
		},
		"& fieldset": {
			borderColor: "rgba(255,255,255,0.2)",
			borderRadius: "8px",
		},
	},
    closeBtn: {
        position: 'absolute',
        top: 0,
        right: 0
    },
    iconBtn: {
		margin: "2px",
		"&:hover": {
			background: "rgba(0,0,0,0.3)",
		},
	},
	icon: {
		color: "white",
		fontSize: "22px",
	},
}));
