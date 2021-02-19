import axios from 'axios';
import { getAssets, getFullAddress } from './assetsApi'

export const getAssetsSuggestions = async (searchText) => {
    const res = await getAssets();
    let result = [];
    if (!searchText) { 
        res.data.forEach(asset => {
            result.push({ 
                text: getFullAddress(asset),
                value: asset._id
            })
        });
        return result;
    };
    let filtered =  res.data.filter(asset => {
        return getFullAddress(asset).indexOf(searchText) !== -1
    });
    filtered.forEach(asset => {
        result.push({ 
            label: getFullAddress(asset),
            value: asset._id
        })
    });
    return result;
}

export const getSystemsByAsset = async (assetId) => {
    
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/systems/getSystems`, { assetId });
    if (res.data) {
        return res.data;
    }
    return [];
}

export const applyFilters = (filters, systems) => {
    return new Promise((resolve, reject) => {
        if (!filters) resolve(systems);
        if (filters.sortBy) {
            if (filters.sortBy === 'systemName') {
                 systems = systems.sort((a,b) => {
                     
                     return (
                         filters.sortOrder === 'asc' 
                         ?   a.name > b.name ? 1 : -1
                         :   a.name < b.name ? 1 : -1
                     )      
                 })
            } else if (filters.sortBy === 'owner') {
                systems = systems.sort((a,b) => {
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
        if(filters.name){
           systems = systems.filter(system => {
               return system.name.indexOf(filters.name) !== -1
           })
        }
        if (filters.owner) {
            systems = systems.filter(system => {
                if (filters.owner instanceof Array) {
                    return filters.owner.indexOf(system.owner._id) !== -1
                }
                return  system.owner._id == filters.owner
            })
        }
        resolve(systems);
    });
   

}


export const updateSystemOwner = async (systemId, owner) => {
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/systems/updateSystemOwner`, { systemId, owner });
    if (res.data) {
        return res.data;
    }
    return [];
}

export const updateSystemName = async (systemId, name) => {
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/systems/updateSystemName`, { systemId, name });
    if (res.data) {
        return res.data;
    }
    return [];
}

export const removeSystemUser = async (systemId, userId) => {
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/systems/removeUser`, { systemId, userId });
    if (res.data) {
        return res.data;
    }
    return [];
}

export const addUser = async (systemId, userId) => {
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/systems/addUser`, { systemId, userId });
    if (res.data) {
        return res.data;
    }
    return null;
}