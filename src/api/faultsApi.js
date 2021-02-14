import axios from 'axios'
import i18next from 'i18next';

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