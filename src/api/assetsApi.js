import axios from 'axios';

export const getSite = async (siteId) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/getSite`, { siteId });
        if (res.status === 200) {
            return res;
        }
    } catch (e){
        return e.response;
    } 
};

export const getSites = async () => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/getSites`);
        if (res.status === 200) {
            return res;
        }
    } catch (e){
        return e.response;
    } 
};

export const removeSite = async (siteId) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/removeSite`, { siteId });
        if (res.status === 200) {
            return res;
        }
    } catch (e){
        return e.response;
    } 
}

export const getFullAddress = (data) => {
    return `${data.address.street} ${data.address.streetNumber}${data.address.entrance || ''}, ${data.address.city}`
}