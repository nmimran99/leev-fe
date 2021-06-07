import { FormControl, Grid, IconButton, makeStyles, OutlinedInput } from '@material-ui/core';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import clsx from 'clsx';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';

export const MessageInput = ({ value, handleInputChange, handleSendInput, placeholder}) => {
	const classes = useStyles();
    const { lang } = useContext(LanguageContext);

    const handleChange = event => {
        let val = event.target.value;
        handleInputChange({ text: val, value: val, type: 'string'});
    }

	return (
		<Grid item xs={12} className={classes.addComment}>
			<FormControl variant="outlined" className={classes.form}>
				<OutlinedInput
					value={value}
					onChange={handleChange}
					placeholder={placeholder}
					className={clsx(classes.textInput)}
					classes={{
						inputMultiline: classes.multiLine,
					}}
				/>
			</FormControl>
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
	form: {
		color: 'black',
        width: '100%',
        margin: '0 5px 0 0px',
		border: '1px solid rgba(0,0,0,0.1)',
		borderRadius: '42px',
		background: 'white'
	},
	textInput: {
        padding: '4px 10px',
        borderRadius: '42px',
        
		'& input': {
			color: 'black',
			width: '80%',
            padding: '4px 10px',
            fontSize: '14px'
		},
		'& label': {
			color: 'white',
			paddingLeft: '5px',
		},
		'& fieldset': {
			borderColor: 'rgba(255,255,255,0.2)',
			borderRadius: '42px',
		},
	},
	postBtn: {
        background: '#42A5F5',
		color: 'white',
        padding: '7px',
		margin: ' 0 5px 1px'
	},
	icon: {
        fontSize: '20px',
        color: 'white'
	},
	mirror: {
		transform: 'scaleX(-1)',
	},
}));
