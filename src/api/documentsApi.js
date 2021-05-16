import axios from 'axios';
import i18next from 'i18next';
import path from 'path';
import { getUnauthorizedMessage } from './genericApi';

export const getDocument = async (documentId) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/documents/getDocument`,
			{ documentId },
			{
				headers: {
					module: 'documents',
					requesttype: 'read',
				},
			}
		);
		if (res.status === 200) {
			return res.data;
		}
		return [];
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const getDocuments = async (tenant, filters) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/documents/getDocuments`,
			{ filters },
			{
				headers: {
					module: 'documents',
					requesttype: 'read',
				},
			}
		);
		if (res.status === 200) {
			return res.data;
		}
		return [];
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const deleteDocument = async (tenant, documentId) => {
	try {
		const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/documents/deleteDocument`, {
			tenant,
			documentId,
		},
        {
            headers: {
                module: 'documents',
                requesttype: 'delete',
            },
        });
		if (res.status === 200) {
			return res.data;
		}
		return [];
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const getFileTypeName = (type) => {
	if (type === '.doc' || type === '.docx') {
		return 'MS Word';
	} else if (type === '.xls' || type === '.xlsx') {
		return 'MS Excel';
	} else if (type === '.ppt' || type === '.pptx') {
		return 'MS PowerPoint';
	} else if (type === '.csv') {
		return 'CSV File';
	} else if (type === 'pdf') {
		return 'PDF File';
	}
	return 'Text File';
};

export const downloadDocument = async (url) => {
	const filename = path.basename(url);
	try {
		const res = await axios({
			method: 'get',
			url: `${process.env.REACT_APP_BACKEND_URL}/documents/download?url=${url}`,
            responseType: 'blob',
            headers: {
                module: 'documents',
                requesttype: 'download'
            }
        });
        if (res.status === 200) {
			console.log(res.data)
            const file = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = file;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            return;
        };
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const uploadDocument = async (details) => {
	let formData = new FormData();
	Object.entries(details).forEach((f) => {
		if (!f[1]) return;
		formData.append(f[0], f[1]);
	});
	let config = {
		headers: {
            'Content-Type': `multipart/form-data`,
            module: 'documents',
            requesttype: 'upload'
		},
	};
	try {
		const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/documents/createDocument`, formData, config);
		if (res.status === 200) {
			return res.data;
		}
		return [];
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const updateDocumentDetails = async (details) => {
	try {
		const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/documents/updateDocumentDetails`, {
			details
		},
        {
            headers: {
                module: 'documents',
                requesttype: 'update',
            },
        });
		if (res.status === 200) {
			return res.data;
		}
		return [];
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
} 
