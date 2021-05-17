import axios from 'axios';
import i18next from 'i18next';
import { getFullName } from './genericApi';

axios.defaults.headers.common['token'] = localStorage.getItem('wb_token');

export const getNotifications = async (page) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/notifications/getNotifications`, { page: page || 0 });
        if (res.status === 200) {
            return res.data;
        }
    } catch(e) {
        console.log(e)
        return null;
    }
}

export const generateNotificationBody = (data) => {
    let text = i18next.t(`notificationsModule.${data.actionType}.body`);
    let fullName = getFullName(data.actionBy);
    if (text.includes('%%name%%')) {
        text = text.replace('%%name%%', fullName);
    };
    if (text.includes('%%status%%')) {
        text = text.replace('%%status%%', i18next.t(`${data.actionOn.objectType}Module.statuses.${data.data.statusName}`));
    };
    if (text.includes('%%owner%%')) {
        text = text.replace('%%owner%%', getFullName(data.data.owner));
    };
    if (text.includes('%%comment%%')) {
        let comment = data.data.commentText.length > 40 ? `"${data.data.commentText.substr(0, 40)} ..."` : `"${data.data.commentText}"`;
        text = text.replace('%%comment%%', comment); 
    }
    if (text.includes('%%itemid%%')) {
        text = text.replace('%%itemid%%', data.actionOn.externalId);
    };
    if (text.includes('%%type%%')){
        text = text.replace('%%type%%', i18next.t(`notificationsModule.${data.actionOn.objectType.slice(0,-1)}`));
    };
    return text;
}   

export const generateNotificationHeader = (data) => {
    let text = i18next.t(`notificationsModule.${data.actionType}.header`);
   
    if (text.includes('%%type%%')){
        text = text.replace('%%type%%', i18next.t(`notificationsModule.${data.actionOn.objectType.slice(0,-1)}`));
    };
    if (text.includes('%%itemid%%')) {
        text = text.replace('%%itemid%%', data.actionOn.externalId);
    };
    
    return text;
}   

export const updateNotificationRead = async (notificationId, read) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/notifications/updateNotificationRead`, { notificationId, read });
        if (res.status === 200) {
            return res.data;
        }
    } catch(e) {
        console.log(e)
        return null;
    }
}