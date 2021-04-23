import axios from 'axios';
import { getUnauthorizedMessage, specialStringPurge } from './genericApi';
import i18next from 'i18next';

axios.defaults.headers.common['token'] = localStorage.getItem('wb_token');

export const getTask = async (taskId, plain) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/tasks/getTask`,
			{ taskId, plain },
			{
				headers: {
					requesttype: 'read',
					module: 'tasks',
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

export const createNewTask = async (details) => {
	let formData = new FormData();
	Object.entries(details).forEach((f) => {
		if (f[0] === 'images') {
			for (let i = 0; i < details.images.length; i++) {
				formData.append('images', details.images[i]);
			}
		} else if (f[1] instanceof Array) {
			formData.append(f[0], JSON.stringify(f[1]));
		} else {
			formData.append(f[0], f[1]);
		}
	});
	let config = {
		headers: {
            'Content-Type': `multipart/form-data`,
            requesttype: 'create',
            module: 'tasks'
		},
	};
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/tasks/createTask`,
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

export const getTasks = async (tenantId, query) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/tasks/getTasks`,
			{ tenantId, query },
			{
				headers: {
					requesttype: 'read',
					module: 'tasks',
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

export const updateTaskOwner = async (taskId, owner) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/tasks/updateTaskOwner`,
			{ taskId, owner },
			{
				headers: {
					requesttype: 'changeOwner',
					module: 'tasks',
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

export const updateTaskStatus = async (taskId, status) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/tasks/updateTaskStatus`,
			{ taskId, status },
			{
				headers: {
					requesttype: 'changeStatus',
					module: 'tasks',
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

export const saveTaskComment = async (taskId, userId, text) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/tasks/addTaskComment`,
			{ taskId, userId, text },
			{
				headers: {
					requesttype: 'comment',
					module: 'tasks',
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

export const updateTaskComment = async (taskId, commentId, text) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/tasks/updateTaskComment`,
			{ taskId, commentId, text },
			{
				headers: {
					requesttype: 'comment',
					module: 'tasks',
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

export const addTaskRelatedUser = async (taskId, userId) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/tasks/addRelatedUser`,
			{ taskId, userId },
			{
				headers: {
					requesttype: 'changeRelatedUsers',
					module: 'tasks',
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

export const removeTaskRelatedUser = async (taskId, userId) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/tasks/removeRelatedUser`,
			{ taskId, userId },
			{
				headers: {
					requesttype: 'changeRelatedUsers',
					module: 'tasks'
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

export const updateTask = async (details) => {
	let formData = new FormData();
	Object.entries(details).forEach((f) => {
		if (f[0] === 'images') {
			for (let i = 0; i < details.images.length; i++) {
				formData.append('images', details.images[i]);
			}
		} else if (f[0] === 'uploadedImages') {
			formData.append('uploadedImages', JSON.stringify(f[1]));
		} else if (f[1] instanceof Array) {
			formData.append(f[0], JSON.stringify(f[1]));
		} else {
			formData.append(f[0], f[1]);
		}
	});
	let config = {
		headers: {
            'Content-Type': `multipart/form-data`,
            requesttype: 'update',
            module: 'tasks'
		},
	};
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/tasks/updateTask`,
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

export const getTasksStatusList = async () => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/statuses/getStatusList`,
			{ module: 'tasks' },
			{
				headers: {
					requesttype: 'read',
					module: 'tasks'
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

export const getTasksStatusListSuggestions = async () => {
	const data = await getTasksStatusList();
	let statusList = [];
	if (data.length) {
		data.forEach((st) => {
			statusList.push({
				label: i18next.t(`tasksModule.statuses.${st.statusId}`),
				value: st._id,
			});
		});
	}
	return statusList;
};

export const updateTaskSchedule = async (taskId, schedule) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/tasks/updateTaskSchedule`,
			{ taskId, schedule },
			{
				headers: {
					requesttype: 'update',
					module: 'tasks'
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

export const getTaskOptionsByAssetOrSystem = async (asset, system) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/tasks/getTaskOptions`,
			{ asset, system },
			{
				headers: {
                    requesttype: 'read',
					module: 'tasks'
				},
			}
		);
		let options = [];
		if (!res) return [];
		res.data.forEach((t) => {
			options.push({ label: t.taskId, value: t._id });
		});
		return options;
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};
