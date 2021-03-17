import axios from 'axios';
import { specialStringPurge } from './genericApi'
import i18next from 'i18next'

export const getTask = async (taskId, plain) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks/getTask`, { taskId, plain });
        if (res.status === 200) {
            return res.data;
        }
    } catch (e){
        return e.response;
    } 
};

export const createNewTask = async details => {
    let formData = new FormData();
    Object.entries(details).forEach(f => {
        if (f[0] === 'images') {
            for (let i = 0; i < details.images.length; i++) {
                formData.append("images", details.images[i]);
              }
        } else if (f[1] instanceof Array){
            formData.append(f[0], JSON.stringify(f[1]))
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
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks/createTask`, formData, config); 
        if (res) {
            return res.data
        };
    } catch(e) {
        console.log(e)
        return null;
    }
}

export const getTasks = async (tenantId, query) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks/getTasks`, { tenantId, query });
        if (res.status === 200) {
            return res.data;
        }
    } catch (e){
        return e.response;
    } 
}

export const updateTaskOwner = async ( taskId, owner ) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks/updateTaskOwner`, { taskId, owner });
        if (res.status === 200) {
            return res.data;
        }
    } catch (e){
        return e.response;
    } 
}

export const updateTaskStatus = async ( taskId, status ) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks/updateTaskStatus`, { taskId, status });
        if (res.status === 200) {
            return res.data;
        }
    } catch (e){
        return e.response;
    } 
}

export const saveTaskComment = async (taskId, userId, text) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks/addTaskComment`, { taskId, userId, text });
        if (res) {
            return res.data;
        }
    } catch (e) {
        console.log(e.message);
        return null;
    }
}

export const updateTaskComment = async (taskId, commentId, text) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks/updateTaskComment`, { taskId, commentId, text });
        if (res) {
            return res.data;
        }
    } catch (e) {
        console.log(e.message);
        return null;
    }
}

export const addTaskRelatedUser = async (taskId, userId) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks/addRelatedUser`, { taskId, userId });
        if (res) {
            return res.data;
        }
    } catch (e) {
        console.log(e.message);
        return null;
    }
}

export const removeTaskRelatedUser = async (taskId, userId) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks/removeRelatedUser`, { taskId, userId });
        if (res) {
            return res.data;
        }
    } catch (e) {
        console.log(e.message);
        return null;
    }
}

export const updateTask = async (details) => {
    let formData = new FormData();
    Object.entries(details).forEach(f => {
        if (f[0] === 'images') {
            for (let i = 0; i < details.images.length; i++) {
                formData.append("images", details.images[i]);
              }
        } else if (f[0] === 'uploadedImages') { 
            formData.append("uploadedImages", JSON.stringify(f[1]))
        } else if (f[1] instanceof Array ) {
            formData.append(f[0], JSON.stringify(f[1]))
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
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks/updateTask`, formData, config); 
        if (res) {
            return res.data
        };
    } catch(e) {
        console.log(e)
        return null;
    }
}

export const getTasksStatusList = async () => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/statuses/getStatusList`, { module: 'tasks' });
        if (res.status === 200) {
            return res.data;
        }
    } catch(e) {
        console.log(e)
        return null;
    }
}

export const getTasksStatusListSuggestions = async () => {
    const data = await getTasksStatusList();
    let statusList = [];
    if (data.length) { 
        data.forEach(st => {
            statusList.push({
                label: i18next.t(`tasksModule.statuses.${st.statusId}`),
                value: st._id
            })
        });
    }
    return statusList;
}
