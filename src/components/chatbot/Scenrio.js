import i18next from 'i18next';
import { assignUserToFault, checkEmailExists } from '../../api/chatbotApi';
import { createExternalFault } from '../../api/faultsApi';

export const welcome = {
	querstions: [
		
	]
}

export const assetNotFound = {
	type: 'assetNotFound',
	questions: [
		{
			order: 0,
            text: i18next.t('chatbot.assetNotFound'),
			actionRequired: false,
			inputType: null,
            submitFunc: null
		},
	]
};

export const openFault = {
	type: 'openFault',
	data: {
		asset: null,
		system: null,
		location: null,
		description: null,
		images: null
	},
	submitInput: function(data, field) {
		this.data[field] = data;
		return Promise.resolve();
	},
	submit: async function(vault) {
		let createdBy = vault.user ? vault.user._id : null;
		const res = await createExternalFault({...this.data, createdBy})
		if (res) {
			return res;
		}
		return false;
	},
	questions: [
		{
			order: 0,
            text: i18next.t('chatbot.welcomeMessage'),
			actionRequired: false,
			inputType: null,
            submitFunc: null
		},
		{
			order: 1,
            text: i18next.t('chatbot.notLoggedIn.requestSystem'),
			actionRequired: true,
			inputType: 'select',
			inputField: 'system'
		},
		{
			order: 2,
            text: i18next.t('chatbot.notLoggedIn.requestLocation'),
			actionRequired: true,
			inputType: 'select',
			inputField: 'location'
		},
		{
			order: 3,
            text: i18next.t('chatbot.notLoggedIn.requestDescription1'),
            actionRequired: false,
			inputType: null,
			inputField: null
           
		},
		{
			order: 4,
            text: i18next.t('chatbot.notLoggedIn.requestDescription2'),
			actionRequired: true,
			inputType: 'string',
			inputField: 'description'
		},
		{
			order: 5,
            text: i18next.t('chatbot.notLoggedIn.requestPhotos'),
			actionRequired: true,
			inputType: 'image',
			inputField: 'images',
			submit: true
		},
		{
			order: 6,
            text: i18next.t('chatbot.notLoggedIn.faultOpenedSuccessfully'),
            actionRequired: false,
			inputType: null,
			inputField: null
		}
	]
};

export const followFault = {
	type: 'followFault',
	data: {
		shouldFollow: false,
		assignStatus: null
	},
	submitInput: function(data, field) {
		this.data[field] = data;
		return Promise.resolve();
	},
	submit: async function(vault) {
		if (!this.data.shouldFollow) {
			this.data.assignStatus = false;
			return this.data;
		}
		try {
			if (!vault.user) return this.data;
			let data = await assignUserToFault(vault.user._id, vault._id);
			if (data) {
				this.data.assignStatus = true;
				return this.data;
			}
		} catch (e) {
			console.log(e.message);
			return false;
		}
	},
	questions: [
		{
			order: 0,
            text: i18next.t('chatbot.requestFollow'),
			actionRequired: true,
			inputType: 'boolean',
			inputField: 'shouldFollow',
            submit: true
		}
	]
};

export const checkUserAuthentication = {
	type: 'checkUserAuthentication',
	data: {
		email: null,
		authenticated: false
	},
	submitInput: function(data, field) {
		this.data[field] = data;
		return Promise.resolve();
	},
	submit: async function(vault) {
		if (!this.data.email) return false;
		try {
			let res = await checkEmailExists(this.data.email);
			if (!res) {
				this.data.authenticated = false;
				return true;
			}
			this.data.authenticated = true;
			let data = await assignUserToFault(res.userId, vault._id);
			if (data) {
				return true;
			}
		} catch (e) {
			console.log(e.message);
			return false;
		}
	},
	questions: [
		{
			order: 0,
            text: i18next.t('chatbot.requestEmail'),
			actionRequired: true,
			inputType: 'string',
			inputField: 'email',
            submit: true
		}
	]
}

export const assignedSuccessfully = {
	questions: [
		{
			order: 0,
			text: i18next.t('chatbot.assignedSuccessfully'),
			actionRequired: false,
			inputType: null,
			inputField: null,
			submit: false
		}
	]
}

export const assignFailed = {
	questions: [
		{
			order: 0,
			text: i18next.t('chatbot.userNotFound'),
			actionRequired: false,
			inputType: null,
			inputField: null,
			submit: false
		}
	]
}


export const userAssigned = {
	type: 'userAssigned',
	questions: [
		{
			order: 0,
            text: i18next.t('chatbot.notLoggedIn.emailSent'),
            actionRequired: false,
			inputType: null,
			inputField: null,
            submitFunc: null
		}
	]
}

export const thankyou = {
	questions: [
		{
			order: 0,
            text: i18next.t('chatbot.notLoggedIn.thankyou'),
            actionRequired: false,
			inputType: null,
			inputField: null,
            submitFunc: null
		}
	]
}

export const getNextScenario = (currentScenario, auth) => {
	return new Promise((resolve, reject) => {
		if (currentScenario.type === 'openFault') {
			resolve(followFault);
		};
		if (currentScenario.type === 'followFault') {
			if (currentScenario.data.shouldFollow) {
				if (currentScenario.data.assignStatus) {
					resolve(userAssigned);
				} else {
					resolve(checkUserAuthentication);
				}
			}
			resolve(thankyou);
		}
		if (currentScenario.type === 'checkUserAuthentication') {
			if (currentScenario.data.authenticated) {
				resolve(assignedSuccessfully)
			} else {
				resolve(assignFailed)
			}
		}
		if (['assignedSuccessfully', 'assignFailed'].includes(currentScenario.type)) {
			resolve(thankyou);
		}
	})
	
}