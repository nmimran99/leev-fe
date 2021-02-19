import axios from 'axios';
import i18next from 'i18next';

export const queryParamsToObject = (search) => {
    if (!search) return {};
    search = search.substring(1);
    
    let decoded = JSON.parse('{"' + decodeURI(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g,'":"')
        .replace(/%2C/g, ',')
        .replace(/%5D/g, ',')
        .replace(/%5B/g, ',') + '"}');
    Object.entries(decoded).forEach(entry => {
        if (entry[1].substring(0, 1) === "[") {
            decoded[entry[0]] = JSON.parse(entry[1])
        }
    });
    return decoded;
}

export const removeQueryParam = (search, paramName) => {
    let params = new URLSearchParams(search);
    params.delete(paramName);
    return params.toString() ? '?' + params.toString() : '';
}

export const addQueryParam = (search, paramList) => {
    let params = new URLSearchParams(search);
    if (!paramList.length) return '?' + params.toString(); 
    paramList.forEach(param => {
        if (param.value instanceof Array ) {
            param.value = JSON.stringify(param.value);
        }
        if (params.get(param.name)) {
            params.set(param.name, param.value)
        } else {
            params.append(param.name, param.value);
        }
    })
    return '?' + params.toString();
}

export const specialStringPurge = (string) => {
    if (!string) return null;
    return string
            .replaceAll('+', ' ')
            .replaceAll(/[&\/\\#,+()$~%.'":*?<>{}]/g,'')
            .replaceAll(' ,', '')
            .replaceAll(',', ' ');
}

export const getLabelsByLanguage = async (lang) => {
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/getLabels`, { lang });
    if (res) {
        console.log(res.data);
        return res.data;
    }
}

export const getFullName = (user) => {
    return `${user.firstName} ${user.lastName}`
}

export const getDatediffString = (fromDate) => {
    let diffInSecs = Math.round((new Date() - new Date(fromDate)) / 1000);
    let diff;
    if (diffInSecs < 60) {
        diff = (diffInSecs).toString();
        return  diff + i18next.t("dates.shortsecond")
    }
    if (diffInSecs > 60 && diffInSecs < 3600) {
        diff = Math.round((diffInSecs / 60)).toString();
        return diff + ' ' + i18next.t("dates.shortminute")
    }
    if (diffInSecs > 3600 && diffInSecs < 86400) {
        diff = Math.round((diffInSecs / 3600)).toString();
        return diff + ' ' + i18next.t("dates.shorthour")
    }
    if (diffInSecs > 86400 && diffInSecs < 604800) {
        diff = Math.round((diffInSecs / 86400)).toString();
        return diff + ' ' + i18next.t("dates.shortday")
    }
    if (diffInSecs > 604800 && diffInSecs < 2629743) {
        diff = Math.round((diffInSecs / 604800)).toString();
        return diff + ' ' + i18next.t("dates.shortweek")
    }
    if (diffInSecs > 2629743 && diffInSecs < 31556926) {
        diff = Math.round((diffInSecs / 2629743)).toString();
        return diff + ' ' + i18next.t("dates.shortmonth")
    }
    if (diffInSecs < 31556926) {
        diff = Math.round((diffInSecs / 31556926)).toString();
        return diff + ' ' + i18next.t("dates.shortyear")
    };
}