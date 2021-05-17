import axios from 'axios';
import { getFullName, getServerError, getUnauthorizedMessage } from './genericApi';

export const attemptToSignin = async (payload) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/loginUser`, payload );
        if (res.status === 200) {
            return res;
        }
    } catch (e){
        console.log(e.message);
        return { status: 401 }
    } 
};

export const authenticate = async (token) => {
    try {
        let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/reloginUser`, token);
        if (res.status === 200) {
            await handleLS('wb_token', 'set', res.data.token);
            axios.defaults.headers.common['token'] = localStorage.getItem('wb_token');
            return res.data;
        }
    } catch(e) {
        return e.response;
    }
}

export const handleLS = async (field , action, payload) => {
    return new Promise((resolve, reject) => {
        let res = true;
        if (action === 'set') {
            localStorage.setItem(field, JSON.stringify(payload))
        } else if (action === 'remove'){
            localStorage.removeItem(field);
        } else if (action === 'get') {
            res = JSON.parse(localStorage.getItem(field));
        }
        resolve(res);
    })  
}

export const checkUserAuthentication = async () => {
    let token = await handleLS('wb_token', 'get');
    if (!token) return false;
    let res = await authenticate(token);
    if (res.auth) {
        return {
            isAuth: res.auth,
            user: res.user,
            token: res.token.token,
            refreshToken: res.token.refreshToken
        };  
    }
    return {
        isAuth: false,
        user: null,
        token: null,
        refreshToken: null
    }
  }

export const getUserList = async () => {
    try {
        let res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/getUserList`, {
            headers: {
                module: 'users',
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
		return getServerError();
    }
}

export const getUserDataById = async (userId) => {
    try {
        let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/getUserDataById`, { userId }, {
            headers: {
                module: 'users',
                requesttype: "read"
            }
        });
        if (res.status === 200) {
            return res.data;
        }
    } catch(e) {
        if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return getServerError();
    }
} 

export const createUserOptions = () => {
    return getUserList()
    .then(data => {
        if (!data) {
            return [];
        }
        let userList = [];
        data.forEach(user => {
            userList.push({label: `${user.firstName} ${user.lastName}`, value: user._id, ...user  })
        });
        return userList;
    });
};

export const clearUserLS = async () => {
    axios.defaults.headers.common['token'] = null;
    return Promise.all([handleLS('wb_user', 'remove'), handleLS('wb_token', 'remove')]); 
}

export const uploadAvatar = async (avatar) => {
    if (!avatar) return;
    let formData = new FormData();
	formData.append('avatar', avatar);
		
	let config = {
		headers: {
			'Content-Type': `multipart/form-data`,
			token: localStorage.getItem('wb_token'),
			module: 'users',
			requesttype: 'update',
		},
	};

	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/users/uploadAvatar`,
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
		return getServerError();
	}
}

export const filterUsers = async (users, searchText) => {
   const sArray = searchText.split(' ');
    const filteredUsers = users.filter(u => 
        sArray.some(sa => u.firstName.includes(sa) ||
        u.lastName.includes(sa) ||
        u.phoneNumber.includes(sa) ||
        u.role.roleName.includes(sa)    
    ));
    return Promise.resolve(filteredUsers);

}

export const createUser = async (details) => {
    try {
        let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/registerUser`, { ...details }, {
            headers: {
                module: 'users',
                requesttype: "create"
            }
        });
        if (res.status === 200) {
            return res.data;
        }
    } catch(e) {
        if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return getServerError();
    }
} 

export const updateUserData = async (details) => {
    try {
        let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/updateUserData`, { ...details }, {
            headers: {
                module: 'users',
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
		return getServerError();
    }
} 