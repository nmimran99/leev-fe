import axios from 'axios';
import { getServerError, getUnauthorizedMessage } from './genericApi';

export const createNewConversation = async (tenant, participants, type) => {
    try {   
        const res = await axios.post(
            `${process.env.REACT_APP_CHAT_URL}/conversation/createConversation`,
            { tenant, participants, type }
        );
        if (res.status === 200) {
            return res.data;
        }
        return null;
    } catch(e) {
        if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return getServerError();
    }
}

export const isNewMessage = (data, user) => {
    return data.messages.filter(m => !m.read && m.from !== user).length
}

export const countUnreadMessages = (messages, sender) => {
    return messages.reduce((total, m) => {
        if (!m.read && m.from !== sender) {
            return total + 1
        };
        return total
    }, 0)
}