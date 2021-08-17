import axios from 'axios';
import { getUnauthorizedMessage } from './genericApi';

export const getReportData = async (details) => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/reports/getReportData`,
            { ...details },
            {
                headers: {
                    module: 'reports',
                    requesttype: 'read',
                },
            }
        );
        if (res.status === 200) {
            return res.data;
        }
    } catch(e) {
        if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
    }   
};

export const getSystemData = (bySystem) => {
    let series = [];
    let labels = [];
    Object.values(bySystem).forEach(e => {
        series.push(e.count);
        labels.push(e.data.name)
    });

    return Promise.resolve({
        series,
        labels
    })
}

export const getLocationData = (byLocation) => {
    let series = [];
    let labels = [];
    Object.values(byLocation).forEach(e => {
        series.push(e.count);
        labels.push(e.data.name)
    });

    return Promise.resolve({
        series,
        labels
    })
}

export const getCombinationData = (byCombination) => {
    let series = [];
    let labels = [];
    Object.values(byCombination).forEach(e => {
        series.push(e.count);
        labels.push(`${e.location.name} - ${e.system.name}`)
    });

    return Promise.resolve({
        series,
        labels
    })
}

export const getMostUsedTags = (data) => {
    return Object.values(data).map(d => {
        return {
            count: d.count,
            value: d.data.value
        }
    })
}

export const generateReportLink = async (details) => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/reports/createReport`,
            details,
            {
                headers: {
                    module: 'reports',
                    requesttype: 'create',
                },
            }
        );
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

export const generateLink = (reportId) => {
    return `${process.env.REACT_APP_FRONTEND_URL}/workspace/reports/faults/${reportId}`
}

export const distributeReport = async (reportId, userList) => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/reports/distributeReport`,
            { reportId, userList },
            {
                headers: {
                    module: 'reports',
                    requesttype: 'distribute',
                },
            }
        );
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

export const getReportPublic = async (reportId) => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/reports/getReportPublic`,
            { reportId},
            {
                headers: {
                    module: 'reports',
                    requesttype: 'read',
                },
            }
        );
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

export const getReports = async () => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/reports/getReports`,
            {
                headers: {
                    module: 'reports',
                    requesttype: 'read',
                },
            }
        );
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