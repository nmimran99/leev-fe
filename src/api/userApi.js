import axios from 'axios';

export const attemptToSignin = async (payload) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/loginUser`, payload );
        if (res.status === 200) {
            return res;
        }
    } catch (e){
        return e.response;
    } 
};

export const authenticate = async (token) => {
    try {
        let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/reloginUser`, token);
        if (res.status === 200) {
            await handleLS('wb_token', 'set', res.data.token);
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
        let res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/getUserList`);
        if (res.status === 200) {
            return res.data;
        }
    } catch(e) {
        return e.response;
    }
}