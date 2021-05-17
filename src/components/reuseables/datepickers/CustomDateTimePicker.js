import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import React, {useContext} from 'react';
import { getLocale } from '../../../api/genericApi';
import { LanguageContext } from '../../../context/LanguageContext';

export const CustomDateTimePicker = ({ data, handleChange, label, disablePast }) => {
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);


	return (
	
			<MuiPickersUtilsProvider utils={DateFnsUtils} locale={getLocale(lang.code)}>
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
					disablePast={disablePast}
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
