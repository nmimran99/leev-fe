import axios from 'axios';
import { specialStringPurge } from './genericApi'

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

export const updateSiteAddress = async (siteId, address, addInfo, type) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/updateSiteAddress`, { siteId, address, addInfo, type });
        if (res.status === 200) {
            return res;
        }
    } catch (e) {
        console.log(e.message);

    }
}


export const applyFilters = (filters, sites) => {
    return new Promise((resolve, reject) => {
        if (!filters) resolve(sites);
        if (filters.sortBy) {
            if (['city', 'street'].indexOf(filters.sortBy) !== -1) {
                 sites = sites.sort((a,b) => {
                     return (
                         filters.sortOrder === 'asc' 
                         ?   a['address'][filters.sortBy] > b['address'][filters.sortBy] ? 1 : -1
                         :   a['address'][filters.sortBy] < b['address'][filters.sortBy] ? 1 : -1
                     )      
                 })
            } else if (filters.sortBy === 'siteOwner') {
                sites = sites.sort((a,b) => {
                    let aName = `${a.siteOwner.firstName} ${a.siteOwner.lastName}`
                    let bName = `${b.siteOwner.firstName} ${b.siteOwner.lastName}`
                    return (
                        filters.sortOrder === 'asc' 
                        ?   aName > bName ? 1 : -1
                        :   aName < bName ? 1 : -1
                    )      
                })
            }

        }
        if(filters.searchText){
            sites = sites.filter(site => {
                console.log(createSiteAddress(site.address))
                return createSiteAddress(site.address)
                        .includes(specialStringPurge(filters.searchText))
                          
            })
        }
        if (filters.siteOwner) {
            sites = sites.filter(site => {
                console.log(site.siteOwner, filters.siteOwner)
                return site.siteOwner._id == filters.siteOwner
            })
        }
        resolve(sites);
    });
   

}

export const createSiteAddress = (address) => {
    if (!address) return '';
    return `${address.street} ${address.streetNumber} ${address.city}`;
}



export const getOpenTasksForSite = () => {

}

export const getOpenFaultsForSite = () => {
    
}