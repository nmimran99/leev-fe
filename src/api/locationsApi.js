import axios from "axios";
import i18next from "i18next";
import { getServerError, getUnauthorizedMessage } from "./genericApi";

export const createLocation = async (details) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/locations/createLocation`,
			{ ...details }, {
                headers: {
                    requesttype: 'create',
                    module: 'locations'
                }
            }
		);
		if (res) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return getServerError();
	}
};

export const updateLocation = async (details) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/locations/updateLocation`,
			{ ...details }, {
                headers: {
                    requesttype: 'update',
                    module: 'locations'
                }
            }
		);
		if (res) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return getServerError();
	}
};

export const checkLocationName = async (details) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/locations/checkLocationName`,
			{ ...details }, {
                headers: {
                    requesttype: 'read',
                    module: 'locations'
                }
            }
		);
		if (res) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return getServerError();
	}
};

export const getLocationsByAsset = async (assetId) => {
    try {   
        const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/locations/getAssetLocations`,
            { assetId },
            {
                headers: {
                    module: 'locations',
                    requesttype: 'read',
                },
            }
        );
        if (res.status === 200) {
            return res.data;
        }
        return [];
    } catch(e) {
        if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return getServerError();
    }
	
};

export const createLocationMenuOptions = (locations) => {
	return new Promise((resolve, reject) => {
		let options = [{ text: i18next.t('general.none'), value: '' }];
		locations.forEach((l) => {
			options.push({ text: l.name, value: l._id });
		});
		resolve(options);
	});
};

export const getLocationData = async (locationId) => {
    try {   
        const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/locations/getLocationData`,
            { locationId },
            {
                headers: {
                    module: 'locations',
                    requesttype: 'read',
                },
            }
        );
        if (res.status === 200) {
            return res.data;
        }
        return [];
    } catch(e) {
        if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return getServerError();
    }
}
