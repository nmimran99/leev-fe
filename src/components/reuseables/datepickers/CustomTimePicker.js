import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core';
import {  MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import heLocale from 'date-fns/locale/he';
import React, {useContext} from 'react';
import { LanguageContext } from '../../../context/LanguageContext';

export const CustomTimePicker = ({ data, handleChange, label }) => {
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);

	return (
	
			<MuiPickersUtilsProvider utils={DateFnsUtils} locale={heLocale}>
				<TimePicker
					format={lang.timeonly}
					label={label}
					value={data || null}
					onChange={handleChange}
					inputVariant={'outlined'}
					className={classes.textField}
					autoOk={true}
					ampm={false}
					variant={'inline'}
					disableToolbar={true}
                    views={["hours", "minutes"]}
				/>
			</MuiPickersUtilsProvider>
	);
};

const useStyles = makeStyles((theme) => ({
	textField: {
		width: '100%',
		'& fieldset': {
			borderRadius: '5px',
		},
	},
	textField: {
		width: '100%',
		'& fieldset': {
			borderRadius: '5px',
		},
	},
}));
