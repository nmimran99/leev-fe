import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import heLocale from 'date-fns/locale/he';
import React, {useContext} from 'react';
import { LanguageContext } from '../../../context/LanguageContext';

export const CustomDateTimePicker = ({ data, handleChange, label }) => {
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);

	return (
	
			<MuiPickersUtilsProvider utils={DateFnsUtils} locale={heLocale}>
				<DateTimePicker
					format={lang.dateformat}
					label={label}
					value={data || null}
					onChange={handleChange}
					inputVariant={'outlined'}
					className={classes.textField}
					autoOk={true}
					ampm={false}
					disableToolbar={true}
					variant={'inline'}
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
