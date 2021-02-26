import { ImageSearch } from '@material-ui/icons';
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

export const getFault = async (faultId, plain) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/faults/getFault`, { faultId, plain: plain });
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

export const createNewFault = async details => {
    let formData = new FormData();
    Object.entries(details).forEach(f => {
        if (f[0] === 'images') {
            for (let i = 0; i < details.images.length; i++) {
                formData.append("images", details.images[i]);
              }
        } else {
            formData.append(f[0], f[1])
        }
    });
    let config = {
        headers: {
            'Content-Type': `multipart/form-data`
        }
    }
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/faults/createFault`, formData, config); 
        if (res) {
            return res.data
        };
    } catch(e) {
        console.log(e)
        return e.message
    }
}

export const updateFault = async (details) => {
    let formData = new FormData();
    Object.entries(details).forEach(f => {
        if (f[0] === 'images') {
            for (let i = 0; i < details.images.length; i++) {
                formData.append("images", details.images[i]);
              }
        } else {
            formData.append(f[0], f[1])
        }
    });
    let config = {
        headers: {
            'Content-Type': `multipart/form-data`
        }
    }
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/faults/updateFaultData`, formData, config); 
        if (res) {
            return res.data
        };
    } catch(e) {
        console.log(e)
        return e.message
    }

}

export const updateFaultOwner = async (faultId, userId) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/faults/updateFaultOwner`, { faultId, userId });
        if (res) {
            return res.data;
        } 
        return null;
    } catch (e){
        return e.response;
    }
}