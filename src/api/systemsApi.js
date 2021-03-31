import axios from 'axios';
import i18next from 'i18next';
import { getAssets, getFullAddress } from './assetsApi'

export const createNewSystem = async (details) => {
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/systems/createSystem`, { ...details });
    if (res.data) {
        return res.data;
    }
    return [];
}

export const getAssetsSuggestions = async (searchText) => {
    const res = await getAssets();
    let result = [{ text: i18next.t("general.none"), value: ''}];
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

export const updateSystemAdditionalData = async (systemData) => {
    const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/systems/updateSystemData`, { systemData });
    if (res.data) {
        return res.data;
    }
    return null;
}

export const createSystemMenuOptions = (systems) => {
    return new Promise((resolve, reject) => {
        let options = [];
        systems.forEach(s => {
            options.push({ text: s.name, value: s._id})
        });
        resolve(options);
    })
}

export const getSystemsByAssetOptions = async (asset) => {
    try {
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
    } catch(e) {
        console.log(e)
        return null;
    }
}