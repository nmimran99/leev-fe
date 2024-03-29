import axios from 'axios';
import { getServerError, getUnauthorizedMessage, specialStringPurge } from './genericApi';
import i18next from 'i18next';

axios.defaults.headers.common['token'] = localStorage.getItem('wb_token');

export const getAsset = async (assetId, plain) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/assets/getAsset`,
			{ assetId, plain }, {
                headers: {
                    requesttype: 'read',
                    module: 'assets'
                }
            }
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

export const getAssetExtended = async (assetId) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/assets/getAssetExtended`,
			{ assetId}, {
                headers: {
                    requesttype: 'read',
                    module: 'assets'
                }
            }
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

export const getAssetData = async (assetId, module) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/assets/getAssetData`,
			{ assetId, module }, {
                headers: {
                    requesttype: 'read',
                    module: 'assets'
                }
            }
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

export const getAssets = async (filters) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/assets/getAssets`,
			{ filters }, {
                headers: {
                    requesttype: 'read',
                    module: 'assets'
                }
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

export const removeAsset = async (assetId) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/assets/removeAsset`,
			{ assetId }, {
                headers: {
                    requesttype: 'delete',
                    module: 'assets'
                }
            }
		);
		if (res.status === 200) {
			return res;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const getFullAddress = (data) => {
	let unit = data.type === 'apartment' ? data.addInfo.unit || '' : '';
	return `${data.address.street} ${data.address.streetNumber}${
		data.address.entrance || ''
	}, ${data.address.city}${
		Boolean(unit) ? `, ${i18next.t('assetsModule.unit')} ${unit}` : ''
	}`;
};

export const getAddress = (data) => {
	let unit = data.type === 'apartment' ? data.addInfo.unit || '' : '';
	return `${data.address.street} ${data.address.streetNumber}${
		data.address.entrance || ''
	}${
		Boolean(unit) ? `, ${i18next.t('assetsModule.unit')} ${unit}` : ''
	}`;
};

export const getSecondaryAddress = (data) => {
	return `${data.address.city}, ${data.address.country}`;
}

export const getShortAddress = (data) => {
	return `${data.address.street} ${data.address.streetNumber}${
		data.address.entrance || ''
	}, ${data.address.city}`;
};

export const getUnit = (data) => {
	let unit = data.type === 'apartment' ? data.addInfo.unit || '' : '';
	return `${
		Boolean(unit) ? `${i18next.t('assetsModule.unit')} ${unit}` : ''
	}`;
};

export const updateAsset = async (details) => {
	try {
		let formData = new FormData();
		Object.entries(details).forEach((f) => {
			if (f[0] === 'images') {
				for (let i = 0; i < details.images.length; i++) {
					formData.append('images', details.images[i]);
				}
			} else if (f[1] instanceof Object) {
				formData.append(f[0], JSON.stringify(f[1]));
			} else {
				formData.append(f[0], f[1]);
			}
		});

		let config = {
			headers: {
				'Content-Type': `multipart/form-data`,
				module: 'assets',
				requesttype: 'update',
			},
		};
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/assets/updateAsset`,
			formData, config
		);
		if (res.status === 200) {
			return res;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const applyFilters = (filters, assets) => {
	return new Promise((resolve, reject) => {
		if (!filters) resolve(assets);
		if (filters.sortBy) {
			if (['city', 'street'].indexOf(filters.sortBy) !== -1) {
				assets = assets.sort((a, b) => {
					return filters.sortOrder === 'asc'
						? a['address'][filters.sortBy] >
						  b['address'][filters.sortBy]
							? 1
							: -1
						: a['address'][filters.sortBy] <
						  b['address'][filters.sortBy]
						? 1
						: -1;
				});
			} else if (filters.sortBy === 'owner') {
				assets = assets.sort((a, b) => {
					let aName = `${a.owner.firstName} ${a.owner.lastName}`;
					let bName = `${b.owner.firstName} ${b.owner.lastName}`;
					return filters.sortOrder === 'asc'
						? aName > bName
							? 1
							: -1
						: aName < bName
						? 1
						: -1;
				});
			}
		}
		if (filters.searchText) {
			assets = assets.filter((asset) => {
				return createAssetAddress(asset.address).toLowerCase().includes(
					specialStringPurge(filters.searchText.toLowerCase())
				);
			});
		}
		if (filters.owner) {
			assets = assets.filter((asset) => {
				if (filters.owner instanceof Array) {
					return filters.owner.indexOf(asset.owner._id) !== -1;
				}
				return asset.owner._id === filters.owner;
			});
		}
		resolve(assets);
	});
};

export const createAssetAddress = (address) => {
	if (!address) return '';
	return `${address.street} ${address.streetNumber} ${address.city}`;
};

export const createNewAsset = async (details) => {
	try {
		let formData = new FormData();
		Object.entries(details).forEach((f) => {
			if (f[0] === 'images') {
				for (let i = 0; i < details.images.length; i++) {
					formData.append('images', details.images[i]);
				}
			} else if (f[1] instanceof Object) {
				formData.append(f[0], JSON.stringify(f[1]));
			} else {
				formData.append(f[0], f[1]);
			}
		});

		let config = {
			headers: {
				'Content-Type': `multipart/form-data`,
				module: 'assets',
				requesttype: 'create',
			},
		};
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/assets/createAsset`,formData, config
		);
		if (res) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
};

export const getAssetExternal = async ( assetId ) => {
	try {
		const res = await axios.post(
			`${process.env.REACT_APP_BACKEND_URL}/assets/getAssetExternal`,
			{ assetId }
		);
		if (res) {
			return res.data;
		}
	} catch (e) {
		if (e.message.includes('403')) {
			return getUnauthorizedMessage();
		};
		return { error: true, reason: 'general', status: 500 };
	}
}