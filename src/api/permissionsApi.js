import axios from "axios";
import { getUnauthorizedMessage } from "./genericApi";

export const getMinPermLevel = (requesttype) => {
	const types = {
		create: 2,
		update: 1,
		delete: 2,
		read: 1,
		changeOwner: 1,
		changeStatus: 1,
		changeRelatedUsers: 1,
		changeSchedule: 1,
		comment: 1,
		upload: 2,
		download: 2,

	};
	return types[requesttype];
};

export const getRoles = async () => {
    try {
        let res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/roles/getRoles`, {
            headers: {
                module: 'roles',
                requesttype: 'read'
            }
        });
        if (res.status === 200) {
            return res.data;
        }
    } catch(e) {
        if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
    }
}

export const getRolesSuggestions = (data) => {
	if (!data) return;
	return new Promise((resolve, reject) => {
		resolve([...data.map(r => ({ name: r.roleName, value: r._id}))]);	
	})
}