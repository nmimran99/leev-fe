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
		share: 2
	};
	return types[requesttype];
};

export const getRoles = async (tenant) => {
    try {
        let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/roles/getRoles`, { tenant }, {
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

export const createRole = async (roleName, permissions) => {
    try {
        let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/roles/createRole`, {
			roleName,
			permissions
		} , {
            headers: {
                module: 'roles',
                requesttype: 'create'
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

export const updateRole = async (roleId, roleName, permissions) => {
    try {
        let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/roles/updateRole`, {
			roleId,
			roleName,
			permissions
		} , {
            headers: {
                module: 'roles',
                requesttype: 'update'
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

export const filterRoles = async (roles, searchText) => {
	const sArray = searchText.split(' ');
	 const filteredRoles = roles.filter(r => 
		 sArray.some(sa => r.roleName.includes(sa) ||
		 r.roleName.includes(sa)  
	 ));
	 return Promise.resolve(filteredRoles);
}

export const getRole = async (roleId) => {
	try {
        let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/roles/getRole`, { roleId } ,{
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

export const getInitialPermissionsObject = () => {
	return [
		{
			module: "faults",
			read: 0,
			create: 0,
			update: 0,
			delete: 0,
			changeOwner: 0,
			changeRelatedUsers: 0,
			changeStatus: 0,
			comment: 0
		},
		{
			module: "tasks",
			read: 0,
			create: 0,
			update: 0,
			delete: 0,
			changeOwner: 0,
			changeRelatedUsers: 0,
			changeStatus: 0,
			changeSchedule: 0,
			comment: 0
		},
		{
			module: "assets",
			read: 0,
			create: 0,
			update: 0,
			delete: 0,
			changeOwner: 0
		},
		{
			module: "systems",
			read: 0,
			create: 0,
			update: 0,
			delete: 0,
			changeOwner: 0,
			changeRelatedUsers: 0
		},
		{
			module: "documents",
			read: 0,
			create: 0,
			update: 0,
			delete: 0
		},
		{
			module: "users",
			read: 0,
			create: 0,
			update: 0,
			delete: 0,
			viewUserPage: 0
		},
		{
			module: "roles",
			read: 0,
			create: 0,
			update: 0,
			delete: 0,
			viewUserPage: 0
		},
		{
			module: "map",
			read: 0
		}
	]
}