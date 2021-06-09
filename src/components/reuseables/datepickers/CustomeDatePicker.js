import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import heLocale from 'date-fns/locale/he';
import React, {useContext} from 'react';
import { getLocale } from '../../../api/genericApi';
import { LanguageContext } from '../../../context/LanguageContext';

export const CustomDatePicker = ({ data, handleChange, label, disablePast, isError, helperText }) => {
	const classes = useStyles();
	const { lang } = useContext(LanguageContext);

	return (
	
			<MuiPickersUtilsProvider utils={DateFnsUtils} locale={getLocale(lang.code)}>
				<DatePicker
					format={lang.dateonly}
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
					error={isError}
					helperText={helperText}
				/>
			</MuiPickersUtilsProvider>
	);
};

const useStyles = makeStyles((theme) => ({
	textField: {
		width: '100%',
		'& fieldset': {
			borderRadius: '5px'
		},
	},

}));
