import axios from 'axios';
import i18next from 'i18next';
import { getFullAddress } from './assetsApi';


export const getFaultsStatusList = async () => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/statuses/getStatusList`, { module: 'faults' });
        if (res.status === 200) {
            return res.data;
        }
    } catch(e) {
        console.log(e)
        return null;
    }
}

export const getFaultsStatusListSuggestions = async () => {
    const data = await getFaultsStatusList();
    let statusList = [];
    console.log(data)
    if (data.length) { 
        data.forEach(st => {
            statusList.push({
                label: i18next.t(`faultsModule.statuses.${st.statusId}`),
                value: st._id
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
    } catch(e) {
        console.log(e)
        return null;
    }
}


export const getFaults = async (filters) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/faults/getFaults`, { filters });
        if (res) {
            return res.data;
        }
        
        return [];
    } catch(e) {
        console.log(e)
        return null;
    }
}

export const getFault = async (faultId, plain) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/faults/getFault`, { faultId, plain: plain });
        if (res) {
            return res.data;
        } 
        return null;
    } catch(e) {
        console.log(e)
        return null;
    }
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
        return null;
    }
}

export const updateFault = async (details) => {
    let formData = new FormData();
    Object.entries(details).forEach(f => {
        if (f[0] === 'images') {
            for (let i = 0; i < details.images.length; i++) {
                formData.append("images", details.images[i]);
              }
        } else if (f[0] === 'uploadedImages') { 
            formData.append("uploadedImages", JSON.stringify(f[1]))
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
        return null;
    }

}

export const updateFaultOwner = async (faultId, userId) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/faults/updateFaultOwner`, { faultId, userId });
        if (res) {
            return res.data;
        } 
        return null;
    } catch(e) {
        console.log(e)
        return null;
    }
}

export const removeFollowingUser = async (faultId, userId) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/faults/removeFollower`, { faultId, userId });
        if (res) {
            return res.data;
        }
    } catch (e) {
        console.log(e.message);
        return null;
    }
}


export const addFollowingUser = async (faultId, userId) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/faults/addFollower`, { faultId, userId });
        if (res) {
            return res.data;
        }
    } catch (e) {
        console.log(e.message);
        return null;
    }
}

export const saveFaultComment = async (faultId, userId, text) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/faults/addFaultComment`, { faultId, userId, text });
        if (res) {
            return res.data;
        }
    } catch (e) {
        console.log(e.message);
        return null;
    }
}

export const updateFaultComment = async (faultId, commentId, text) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/faults/updateFaultComment`, { faultId, commentId, text });
        if (res) {
            return res.data;
        }
    } catch (e) {
        console.log(e.message);
        return null;
    }
}

export const updateFaultStatus = async (faultId, status ) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/faults/changeFaultStatus`, { faultId, status });
        if (res) {
            return res.data;
        }
    } catch (e) {
        console.log(e.message);
        return null;
    }
}

