import axios from 'axios';

export const checkEmailExists = async (email) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/verifyEmailExists`, { email });
        if (res.status === 200) {
            if (res.data.error) {
                return false
            };
            return res.data;
        }
    } catch(e) {
        console.log(e.message);
        return false;
    }
}

export const assignUserToFault = async (userId, faultId) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/faults/assignUserToExternalFault`, { userId, faultId });
        if (res.status === 200) {
            if (res.data.error) {
                return false
            };
            return res.data;
        }
    } catch(e) {
        console.log(e.message);
        return false;
    }
}
