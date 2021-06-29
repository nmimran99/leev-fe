
import axios from 'axios';
import { addMonths, addWeeks, addYears, eachDayOfInterval, isAfter, isBefore, parseISO, toDate } from 'date-fns';
import { addDays, format } from 'date-fns/esm';
import i18next from 'i18next';
import heLocale from 'date-fns/locale/he';
import deLocale from 'date-fns/locale/de'
import usLocale from 'date-fns/locale/en-US'
import { getDateParts } from './calenderApi';

export const localizations = {
	he: {
		name: 'Hebrew',
        code: 'he',
        dir: 'rtl',
        dateformat: 'dd/MM/yyyy HH:mm',
        dateonly: 'dd/MM/yyyy',
        timeonly: 'HH:mm'
	},
	en: {
		name: 'English',
        code: 'en',
        dir: 'ltr',
        dateformat: 'MM/dd/yyyy p',
        dateonly: 'MM/dd/yyyy',
        timeonly: 'p'
	}
}

export const queryParamsToObject = (search) => {
	if (!search) return {};
	search = search.substring(1);

	let decoded = JSON.parse(
		'{"' +
			decodeURI(search)
				.replace(/"/g, '\\"')
				.replace(/&/g, '","')
				.replace(/=/g, '":"')
				.replace(/%2C/g, ',')
				.replace(/%5D/g, ',')
				.replace(/%5B/g, ',') +
			'"}'
	);
	Object.entries(decoded).forEach((entry) => {
		if (entry[1].substring(0, 1) === '[') {
			decoded[entry[0]] = JSON.parse(entry[1]);
		}
	});
	return decoded;
};

export const removeQueryParam = (search, paramName) => {
	let params = new URLSearchParams(search);
	params.delete(paramName);
	return params.toString() ? '?' + params.toString() : '';
};

export const addQueryParam = (search, paramList) => {
	let params = new URLSearchParams(search);
	if (!paramList.length) return '?' + params.toString();
	paramList.forEach((param) => {
		if (param.value instanceof Array) {
			param.value = JSON.stringify(param.value);
		}
		if (params.get(param.name)) {
			params.set(param.name, param.value);
		} else {
			params.append(param.name, param.value);
		}
	});
	return '?' + params.toString();
};

export const updateQueryParams = (search, add, remove) => {
	let params = new URLSearchParams(search);
	if (remove) {
		remove.forEach((pName) => {
			params.delete(pName);
		});
	}
	if (add) {
		add.forEach((param) => {
			if (param.value instanceof Array) {
				param.value = JSON.stringify(param.value);
			}
			if (params.get(param.name)) {
				params.set(param.name, param.value);
			} else {
				params.append(param.name, param.value);
			}
		});
	}
	return '?' + params.toString();
};

export const specialStringPurge = (string) => {
	if (!string) return null;
	return string
		.replaceAll('+', ' ')
		.replaceAll(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
		.replaceAll(' ,', '')
		.replaceAll(',', ' ');
};

export const getLabelsByLanguage = async (lang) => {
	const res = await axios.post(
		`${process.env.REACT_APP_BACKEND_URL}/users/getLabels`,
		{ lang }
	);
	if (res) {
		return res.data;
	}
};

export const getFullName = (user) => {
	return `${user.firstName} ${user.lastName}`;
};

export const getDatediffString = (fromDate) => {
	let diffInSecs = Math.round((new Date() - new Date(fromDate)) / 1000);
	let diff;
	if (diffInSecs < 60) {
		diff = diffInSecs.toString();
		return diff + ' ' + i18next.t('dates.shortsecond');
	}
	if (diffInSecs > 60 && diffInSecs < 3600) {
		diff = Math.round(diffInSecs / 60).toString();
		return diff + ' ' + i18next.t('dates.shortminute');
	}
	if (diffInSecs > 3600 && diffInSecs < 86400) {
		diff = Math.round(diffInSecs / 3600).toString();
		return diff + ' ' + i18next.t('dates.shorthour');
	}
	if (diffInSecs > 86400 && diffInSecs < 604800) {
		diff = Math.round(diffInSecs / 86400).toString();
		return diff + ' ' + i18next.t('dates.shortday');
	}
	if (diffInSecs > 604800 && diffInSecs < 2629743) {
		diff = Math.round(diffInSecs / 604800).toString();
		return diff + ' ' + i18next.t('dates.shortweek');
	}
	if (diffInSecs > 2629743 && diffInSecs < 31556926) {
		diff = Math.round(diffInSecs / 2629743).toString();
		return diff + ' ' + i18next.t('dates.shortmonth');
	}
	if (diffInSecs < 31556926) {
		diff = Math.round(diffInSecs / 31556926).toString();
		return diff + ' ' + i18next.t('dates.shortyear');
	}
};

export const getStatusList = async (module) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/statuses/getStatusList`,
			{ module }
		);
		if (res) {
			return res.data;
		}
		return [];
	} catch (e) {
		console.log(e.message);
		return null;
	}
};

export const updateArrayStateField = (arr, itemId, fieldName, fieldValue) => {
	return new Promise((resolve, reject) => {
		arr.forEach((t, i) => {
			if (t._id === itemId || i === itemId) {
				t[fieldName] = fieldValue;
			}
		});
		resolve(arr);
	});
};

export const updateStateField = (currState, fieldName, fieldValue) => {
	return new Promise((resolve, reject) => {
		currState[fieldName] = fieldValue;
		resolve(currState);
	});
};

export const getNextIterationDate = (startDate, interval) => {
	let currDate = new Date(startDate);
	let today = new Date();
	let addFunctions = {
		year: addYears,
		month: addMonths,
		week: addWeeks,
		day: addDays
	};

	let dateFunc = addFunctions[interval];

	while(true) {
		if (isBefore(currDate, today)) {
			currDate = dateFunc(currDate, 1);
		} else {
			return currDate;
		}
	}
};


export const getUnauthorizedMessage = () => {
	return { text: i18next.t('errors.unauthorized'), severity: 'error', status: 403 }
};

export const getDeactivateDeniedMessage = () => {
	return { text: i18next.t('errors.cannotDeactivateAssetOwner'), severity: 'error', status: 405 }
};

export const getSuccessMessage = (type, idenitifer, action) => {
	return { text: `${i18next.t("messages.snackMessage.itemOfType")} ${i18next.t(`general.${type}`)} ${i18next.t("messages.snackMessage.withIdentifier")} ${idenitifer} ${i18next.t(`messages.snackMessage.${action}`)} ${i18next.t(`messages.snackMessage.withSuccess`)}`, severity: 'success', status: 200 }
}

export const getServerError = () => {
	return { text: i18next.t('errors.serverError'), severity: 'error', status: 500 }
}

export const getLocalization = (langCode) => {
	return localizations[langCode];
}

export const getLocale = (langCode) => {
	const locales = {
		he: heLocale,
		en: deLocale,
		de: deLocale
	};

	return locales[langCode];
}