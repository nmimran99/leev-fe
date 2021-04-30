import { Button, FormControl, Grid, IconButton, makeStyles, OutlinedInput } from '@material-ui/core';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import clsx from 'clsx';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';

export const MessageImage = ({ value, handleInputChange, handleSendInput, placeholder}) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { lang } = useContext(LanguageContext);

    const handleFileUpload = event => {
        let val = event.target.files;
        console.log(event.target.files)
        handleInputChange({ text: val.length , value: val, type: 'image'});
    }

	return (
		<Grid item xs={12} className={classes.addComment}>
			<Button
                component={'label'}
                variant={'contained'}
                className={classes.uploadBtn}
            >
                { value.length ? `${value.length} ${t("chatbot.imagesSelected")}` : t("chatbot.uploadImages")}
                <input 
                    accepts='image/*'
                    type='file'
                    multiple
                    onChange={handleFileUpload}
                    hidden  
                />
            </Button>
			<IconButton className={classes.postBtn} onClick={handleSendInput}>
				<SendRoundedIcon className={clsx(classes.icon, lang.dir === 'rtl' ? classes.mirror : null)} />
			</IconButton>
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
    uploadBtn: {
        padding: '6px 10px',
        borderRadius: '42px',
        background: 'rgba(255,255,255,0.1)',
        color: 'white',
        width: '100%',
        margin: '0 5px 0 0px',
        '&:hover': {
            boxShadow: 'inset white 0 0 2px 1px',
            background: 'rgba(0,0,0,0.3)'
        }
    },
    postBtn: {
        background: '#3399ff',
		color: 'white',
        padding: '7px',
		margin: ' 0 5px 1px',
		'&:hover': {
			background: 'rgba(0,0,0,0.4)',
		},
	},
	icon: {
        fontSize: '20px',
        color: 'white'
	},
	mirror: {
		transform: 'scaleX(-1)',
	},
}));
