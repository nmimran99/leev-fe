import { Button, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const MessageBoolean = ({ handleInputChange}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const handleClick = (text, value) => event => {
        handleInputChange({ text , value, type: 'boolean'});
    }

	return (
		<Grid item xs={12} className={classes.addComment}>
			<Button
                variant={'contained'}
                className={classes.btn}
                onClick={handleClick(t("chatbot.yes"), true)}
            >
                {t("chatbot.yes")}
            </Button>
            <Button
                className={classes.btn}
                variant={'contained'}
                onClick={handleClick(t("chatbot.no"), false)}
            >
                {t("chatbot.no")}
            </Button> 
            
		</Grid>
	);
};

const useStyles = makeStyles((theme) => ({
	addComment: {
		display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'fit-content',
        padding: '0 5px'
	},
    btn: {
        padding: '6px 10px',
        borderRadius: '42px',
        background: 'white',
        color: 'black',
        width: '50%',
        margin: '0 5px 0 0px',
        '&:hover': {
            boxShadow: 'none'
        }
    },
	icon: {
        fontSize: '20px',
        color: 'white'
	},
	mirror: {
		transform: 'scaleX(-1)',
	},
}));
