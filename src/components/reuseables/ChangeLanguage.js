import { Button, makeStyles, Menu, MenuItem } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { getLocalization } from "../../api/genericApi";
import { LanguageContext } from "../../context/LanguageContext";

const languages = ["en", "he"];

export const ChangeLanguage = ({ className }) => {

    const classes = useStyles();
    const { lang, setLang } = useContext(LanguageContext);
    const [langMenu, setLangMenu] = useState(false);

    const changeLanguage = (l) => (event) => {
		setLang(getLocalization(l))
		setLangMenu(false);
	};

	return (
		<div className={className}>
			<Button
				className={classes.changeLanguage}
				onClick={(e) => setLangMenu(e.target)}
			>
				{lang.code ? lang.code.toUpperCase() : ""}
			</Button>
			<Menu
				classes={{
					paper: classes.langMenu,
				}}
				keepMounted
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				anchorEl={langMenu}
				keepMounted
				open={Boolean(langMenu)}
				onClose={() => setLangMenu(null)}
			>
				{languages.map((l, i) => (
					<MenuItem
						button
						onClick={changeLanguage(l)}
						className={classes.langItem}
					>
						{l.toUpperCase()}
					</MenuItem>
				))}
			</Menu>
		</div>
	);
};

const useStyles = makeStyles(theme => ({
    langMenu: {
        background: 'transparent',
        backdropFilter: 'blur(10px)',
        
        border: '1px solid rgba(255,255,255,0.2)',

    },
    changeLanguage: {
        background: 'transparent',
        color: 'white',
        borderRadius: '0',
        height: '70px'
    },
    langItem: {
        color: 'white',
        width: '100%',
        '&:hover': {
            background: 'rgba(255,255,255,0.1)'
        }
    },
}))