import axios from "axios";
import { getServerError, getUnauthorizedMessage } from "./genericApi";

export const getTenants = async () => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/tenants/getTenants`
		);
		if (res.status === 200) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return getServerError();
	}
};

export const createTenant = async (details) => {
    try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/tenants/createTenant`,
            { ...details }
		);
		if (res.status === 200) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return getServerError();
	}
}

export const deleteTenant = async (tenantId) => {
    try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/tenants/deleteTenant`,
            { tenantId }
		);
		if (res.status === 200) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return getServerError();
	}
}

export const updateTenant = async (details) => {
    try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/tenants/updateTenant`,
            { ...details }
		);
		if (res.status === 200) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return getServerError();
	}
}

export const getTenant = async (tenantId) => {
    try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/tenants/getTenant`,
            { tenantId }
		);
		if (res.status === 200) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return getServerError();
	}
}

export const getTenantOptions = async () => {
	try {
		const tenants = await getTenants();
		if (!tenants.length) return [];
		return tenants.map(t => {
			return {
				label: t.name,
				value: t._id
			}
		})
	} catch (e) {
		console.log(e.message);
		return [];
	}
}