
export const queryParamsToObject = (search) => {
    if (!search) return {};
    search = search.substring(1);
    return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
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

