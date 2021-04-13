import axios from 'axios';
import { specialStringPurge } from './genericApi'
import i18next from 'i18next'

export const getAsset = async (assetId, plain) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/assets/getAsset`, { assetId, plain });
        if (res.status === 200) {
            return res.data;
        }
    } catch (e){
        return e.response;
    } 
};

export const getAssets = async () => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/assets/getAssets`);
        if (res.status === 200) {
            return res;
        }
    } catch (e){
        return e.response;
    } 
};

export const removeAsset = async (assetId) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/assets/removeAsset`, { assetId });
        if (res.status === 200) {
            return res;
        }
    } catch (e){
        return e.response;
    } 
}

export const getFullAddress = (data) => {
    let unit = data.type === 'apartment' ? data.addInfo.unit || '' : '';
    return `${data.address.street} ${data.address.streetNumber}${data.address.entrance || ''}, ${data.address.city}${Boolean(unit) ? `, ${i18next.t("assetsModule.unit")} ${unit}` : ''}`
}

export const getShortAddress = (data) => {
    return `${data.address.street} ${data.address.streetNumber}${data.address.entrance || ''}, ${data.address.city}`;
}

export const getUnit = (data) => {
    let unit = data.type === 'apartment' ? data.addInfo.unit || '' : '';
    return `${Boolean(unit) ? `${i18next.t("assetsModule.unit")} ${unit}` : ''}`
}

export const updateAsset = async (details) => {
    const { _id, owner, address, addInfo, type } = details;
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/assets/updateAsset`, { assetId: _id, owner, address, addInfo, type });
        if (res.status === 200) {
            return res;
        }
    } catch (e) {
        console.log(e.message);

    }
}


export const applyFilters = (filters, assets) => {
    return new Promise((resolve, reject) => {
        if (!filters) resolve(assets);
        if (filters.sortBy) {
            if (['city', 'street'].indexOf(filters.sortBy) !== -1) {
                 assets = assets.sort((a,b) => {
                     return (
                         filters.sortOrder === 'asc' 
                         ?   a['address'][filters.sortBy] > b['address'][filters.sortBy] ? 1 : -1
                         :   a['address'][filters.sortBy] < b['address'][filters.sortBy] ? 1 : -1
                     )      
                 })
            } else if (filters.sortBy === 'owner') {
                assets = assets.sort((a,b) => {
                    let aName = `${a.owner.firstName} ${a.owner.lastName}`
                    let bName = `${b.owner.firstName} ${b.owner.lastName}`
                    return (
                        filters.sortOrder === 'asc' 
                        ?   aName > bName ? 1 : -1
                        :   aName < bName ? 1 : -1
                    )      
                })
            }

        }
        if(filters.searchText){
            assets = assets.filter(asset => {
                return createAssetAddress(asset.address)
                        .includes(specialStringPurge(filters.searchText))
                          
            })
        }
        if (filters.owner) {
            assets = assets.filter(asset => {
                if (filters.owner instanceof Array) {
                    return filters.owner.indexOf(asset.owner._id) !== -1
                }
                return  asset.owner._id === filters.owner
            })
        }
        resolve(assets);
    });
   

}

export const createAssetAddress = (address) => {
    if (!address) return '';
    return `${address.street} ${address.streetNumber} ${address.city}`;
}

export const createNewAsset = async (details) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/assets/createAsset`, { ...details  });
        if (res) {
            return res.data;
        }
    } catch(e) {
        console.log(e);
        return e.message;
    }
}