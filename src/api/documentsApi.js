import axios from 'axios';
import i18next from 'i18next';
import path from 'path';

export const getDocuments = async (tenant, filters) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/documents/getDocuments`, { tenant, filters });
        if (res) {
            return res.data;
        }
        return [];
    } catch(e) {
        console.log(e)
        return null;
    }
}

export const deleteDocument = async (tenant, documentId) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/documents/deleteDocument`, { tenant, documentId });
        if (res) {
            return res.data;
        }
        return [];
    } catch(e) {
        console.log(e)
        return null;
    }
}

export const getFileTypeName = (type) => {
    if (type === '.doc' || type === '.docx') {
        return 'MS Word'
    } else if (type === '.xls' || type === '.xlsx') {
        return 'MS Excel'
    } else if (type === '.ppt' || type === '.pptx') {
        return 'MS PowerPoint'
    } else if (type === '.csv') {
        return 'CSV File'
    } else if(type === 'pdf') {
        return 'PDF File'
    };
    return 'Text File'
}

export const downloadDocument = async (url) => {
    const filename = path.basename(url);
    try {
       const res = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/documents/download?url=${url}`,
            responseType: 'blob'
        });
        const file = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = file;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
    } catch(e) {
        console.log(e)
        return null;
    }
}

export const uploadDocument = async (details) => {
    let formData = new FormData();
    Object.entries(details).forEach(f => {   
        if(!f[1]) return;
        formData.append(f[0], f[1])
    });
    let config = {
        headers: {
            'Content-Type': `multipart/form-data`
        }
    }
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/documents/createDocument`, formData, config);
        if (res) {
            return res.data;
        }
        return [];
    } catch(e) {
        console.log(e)
        return null;
    }
}