import axios from 'axios';
import i18next from 'i18next';
import { getFullAddress } from './assetsApi';
import { getUnauthorizedMessage } from './genericApi';

axios.defaults.headers.common['token'] = localStorage.getItem('wb_token');

export const getFaultsStatusList = async () => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/statuses/getStatusList`,
			{ module: 'faults' },
			{
				headers: {
					requesttype: 'read',
					module: 'faults',
				},
			}
		);
		if (res.status === 200) {
			return res.data;
		}
	} catch (e) {
		console.log(e);
		return null;
	}
};

export const getFaultsStatusListSuggestions = async () => {
	const data = await getFaultsStatusList();
	let statusList = [];
	if (data.length) {
		data.forEach((st) => {
			statusList.push({
				label: i18next.t(`faultsModule.statuses.${st.statusId}`),
				value: st._id,
			});
		});
	}
	return statusList;
};

export const getMinifiedFaults = async (filters) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/faults/getFaults`,
			{ filters },
			{
				headers: {
					requesttype: 'read',
					module: 'faults',
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

export const getFaults = async (filters) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/faults/getFaults`,
			{ filters },
			{
				headers: {
					requesttype: 'read',
					module: 'faults',
				},
			}
		);
		if (res) {
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

export const getFault = async (faultId, plain) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/faults/getFault`,
			{ faultId, plain: plain },
			{
				headers: {
					requesttype: 'read',
					module: 'faults',
				},
			}
		);
		if (res.status === 200) {
			return res.data;
		}
		return null;
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const createNewFault = async (details) => {
	let formData = new FormData();
	Object.entries(details).forEach((f) => {
		if (f[0] === 'images') {
			for (let i = 0; i < details.images.length; i++) {
				formData.append('images', details.images[i]);
			}
		} else if (Array.isArray(f[1])) { 
			formData.append(f[0], JSON.stringify(f[1]));
		} else {
			formData.append(f[0], f[1]);
		}
	});

	let config = {
		headers: {
			'Content-Type': `multipart/form-data`,
			token: localStorage.getItem('wb_token'),
			module: 'faults',
			requesttype: 'create',
		},
	};

	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/faults/createFault`,
			formData,
			config
		);

		if (res.status === 200) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const updateFault = async (details) => {
	let formData = new FormData();
	Object.entries(details).forEach((f) => {
		if (f[0] === 'images') {
			for (let i = 0; i < details.images.length; i++) {
				formData.append('images', details.images[i]);
			}
		} else if (f[0] === 'uploadedImages') {
			formData.append('uploadedImages', JSON.stringify(f[1]));
		} else if (Array.isArray(f[1])) { 
			formData.append(f[0], JSON.stringify(f[1]));
		} else {
			formData.append(f[0], f[1]);
		}
	});
	let config = {
		headers: {
			'Content-Type': `multipart/form-data`,
			token: localStorage.getItem('wb_token'),
			module: 'faults',
			requesttype: 'update',
		},
	};

	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/faults/updateFaultData`,
			formData,
			config
		);
		if (res.status === 200) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const updateFaultOwner = async (faultId, userId) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/faults/updateFaultOwner`,
			{ faultId, userId },
			{
				headers: {
					requesttype: 'changeOwner',
					module: 'faults',
				},
			}
		);
		if (res.status === 200) {
			return res.data;
		}
		return null;
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const removeRelatedUser = async (faultId, userId) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/faults/removeRelatedUser`,
			{ faultId, userId },
			{
				headers: {
					requesttype: 'changeRelatedUsers',
					module: 'faults',
				},
			}
		);
		if (res.status === 200) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const addRelatedUser = async (faultId, userId) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/faults/addRelatedUser`,
			{ faultId, userId },
			{
				headers: {
					requesttype: 'changeRelatedUsers',
					module: 'faults',
				},
			}
		);
		if (res.status === 200) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const saveFaultComment = async (faultId, userId, text, image) => {
	try {
		let formData = new FormData();
		formData.append('faultId', faultId)
		formData.append('userId', userId)
		formData.append('text', text)
		formData.append('image', image || null)
	
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/faults/addFaultComment`,
			formData,
			{
				headers: {
					'Content-Type': `multipart/form-data`,
					requesttype: 'comment',
					module: 'faults',
				},
			}
		);
		if (res.status === 200) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const updateFaultComment = async (faultId, commentId, text) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/faults/updateFaultComment`,
			{ faultId, commentId, text },
			{
				headers: {
					requesttype: 'comment',
					module: 'faults',
				},
			}
		);
		if (res.status === 200) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const updateFaultStatus = async (faultId, status) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/faults/changeFaultStatus`,
			{ faultId, status },
			{
				headers: {
					requesttype: 'changeStatus',
					module: 'faults',
				},
			}
		);
		if (res.status === 200) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const getFaultOptionsByAssetOrSystem = async (asset, system) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/faults/getFaultOptions`,
			{ asset, system },
			{
				headers: {
					module: 'faults',
					requesttype: 'read',
				},
			}
		);
		let options = [];
		if (!res) return [];
		res.data.forEach((f) => {
			options.push({ label: f.faultId, value: f._id });
		});
		return options;
	} catch (e) {
		console.log(e);
		return null;
	}
};

export const createExternalFault = async (details) => {
	let formData = new FormData();
	Object.entries(details).forEach((f) => {
		if (f[0] === 'images' && details.images) {
			for (let i = 0; i < details.images.length; i++) {
				formData.append('images', details.images[i]);
			}
		} else {
			formData.append(f[0], f[1]);
		}
	});

	let config = {
		headers: {
			'Content-Type': `multipart/form-data`
		},
	};

	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/faults/createExternalFault`,
			formData,
			config
		);

		if (res.status === 200) {
			return res.data;
		}
	} catch (e) {
		return { error: true, reason: 'general', status: 500 };
	}
}

export const createTag = async (value) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/faults/createTag`,
			{ value },
			{
				headers: {
					requesttype: 'update',
					module: 'faults',
				},
			}
		);
		if (res.status === 200) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const addFaultTag = async (faultId, tagId) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/faults/addFaultTag`,
			{ faultId, tagId },
			{
				headers: {
					requesttype: 'update',
					module: 'faults',
				},
			}
		);
		if (res.status === 200) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const removeFaultTag = async (faultId, tagId) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/faults/removeFaultTag`,
			{ faultId, tagId },
			{
				headers: {
					requesttype: 'update',
					module: 'faults',
				},
			}
		);
		if (res.status === 200) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const getFaultTagOptions = async (faultId, searchText) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/faults/getFaultTagOptions`,
			{ faultId, searchText },
			{
				headers: {
					requesttype: 'update',
					module: 'faults',
				},
			}
		);
		if (res.status === 200) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};