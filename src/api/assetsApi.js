import axios from 'axios';
import { specialStringPurge } from './genericApi'

export const getAsset = async (assetId) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/assets/getAsset`, { assetId });
        if (res.status === 200) {
            return res;
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
    return `${data.address.street} ${data.address.streetNumber}${data.address.entrance || ''}, ${data.address.city}`
}


export const updateAssetAddress = async (assetId, address, addInfo, type) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/assets/updateAssetAddress`, { assetId, address, addInfo, type });
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
                return  asset.owner._id == filters.owner
            })
        }
        resolve(assets);
    });
   

}

export const createAssetAddress = (address) => {
    if (!address) return '';
    return `${address.street} ${address.streetNumber} ${address.city}`;
}



export const getOpenTasksForAsset = () => {

}

export const getOpenFaultsForAsset = () => {
    
}