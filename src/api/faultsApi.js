import axios from 'axios'
import i18next from 'i18next';
import { getFullAddress } from './assetsApi';
import { getSystemsByAsset } from './systemsApi';

export const getFaultsStatusList = async () => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/statuses/getStatusList`, { module: 'faults' });
        if (res.status === 200) {
            return res.data;
        }
    } catch (e){
        return e.response;
    } 
}

export const getFaultsStatusListSuggestions = async () => {
    const data = await getFaultsStatusList();
    let statusList = [];
    if (data.statusList.length) { 
        data.statusList.forEach(st => {
            statusList.push({
                label: i18next.t(`faultsModule.statuses.${st.statusId}`),
                value: st.statusId
            })
        });
    }
    return statusList;
}

export const getMinifiedFaults = async (filters) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/faults/getFaults`, { filters });
        if (res) {
            return res.data;
        }
        
        return [];
    } catch (e){
        return e.response;
    }
}


export const getFaults = async (filters) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/faults/getFaults`, { filters });
        if (res) {
            return res.data;
        }
        
        return [];
    } catch (e){
        return e.response;
    }
}

export const getFault = async (faultId) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/faults/getFault`, { faultId });
        if (res) {
            return res.data;
        } 
        return null;
    } catch (e){
        return e.response;
    }
}

export const getSystemsByAssetOptions = async (asset) => {
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/systems/getSystemsOptions`, { asset });
    let options = [];
    if (!res) return [];
    res.data.forEach(t => {
        if (asset) {
            options.push({ label: t.name, value: t._id})
        } else {
            options.push({ label: `${t.name}, ${getFullAddress(t.asset)}`, value: t._id})
        }
        
    });
    return options;
}