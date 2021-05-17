import axios from 'axios';

export const getMapData = async (filters) => {

    try {
        const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/map/getMapData`,
            { filters },
            {
                headers: {
                    requesttype: 'read',
                    module: 'map'
                }
            }
        );
        if (res) {
            let assets = res.data.assets;
            res.data.assets.forEach((a,i) => {
                assets[i].faultCount = res.data.faults.filter(f => {
                    return f.asset._id == a._id
                }).length;
                    
            })
            return {...res.data, assets };
        }
        return [];
    } catch (e) {
        console.log(e.message);
        return null;
    }
}

export const getMapFilters = (query) => {
    return new Promise((resolve, rejecet) => {
        if (!query) resolve(null);
        delete query.lat;
        delete query.lng;
        resolve(query);
    })
    
}


