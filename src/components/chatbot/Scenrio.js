import i18next from 'i18next';
import { checkEmailExists } from '../../api/chatbotApi';

export const assetNotFound = {
	questions: [
		{
			order: 1,
            text: i18next.t('chatbot.welcomeMessage'),
			actionRequired: false,
			inputType: null,
            submitFunc: null
		},
		{
			order: 2,
            text: i18next.t('chatbot.assetNotFound'),
			actionRequired: false,
			inputType: null,
            submitFunc: null
		},
	]
};

export const notLoggedIn = {
	questions: [
		{
			order: 1,
            text: i18next.t('chatbot.welcomeMessage'),
			actionRequired: false,
			inputType: null,
            submitFunc: null
		},
		{
			order: 2,
            text: i18next.t('chatbot.notLoggedIn.requestSystem'),
			actionRequired: true,
			inputType: 'select',
            submitFunc: (data) => {
				return data;
			}
		},
		{
			order: 3,
            text: i18next.t('chatbot.notLoggedIn.requestDescription1'),
            actionRequired: false,
			inputType: null,
            submitFunc: null
		},
		{
			order: 4,
            text: i18next.t('chatbot.notLoggedIn.requestDescription2'),
			actionRequired: true,
			inputType: 'string',
            submitFunc: (data) => {
				return data;
			}
		},
		{
			order: 5,
            text: i18next.t('chatbot.notLoggedIn.requestPhotos'),
			actionRequired: true,
			inputType: 'image',
            submitFunc: (data) => {
				return data;
			}
		},
		{
			order: 6,
            text: i18next.t('chatbot.notLoggedIn.faultOpenedSuccessfully'),
            actionRequired: false,
			inputType: null,
            submitFunc: null
		},
		{
			order: 7,
            text: i18next.t('chatbot.notLoggedIn.thankyou'),
            actionRequired: true,
			inputType: 'string',
            submitFunc: null
		},
	],
	errors: [
		{
			order: 4,
            text: i18next.t('chatbot.notLoggedIn.emailNotFound'),
            actionRequired: true,
            submitFunc: async (data) => {
                
            }
		},
		{
			order: 5,
            text: i18next.t('chatbot.notLoggedIn.verificationFailed'),
            actionRequired: true,
            submitFunc: async (data) => {
                
            }
		},
	],
	common: [
		{
			order: 0,
            text: i18next.t('chatbot.notLoggedIn.requestRestart'),
            actionRequired: false
		},
	],
};

export const loggedIn = {}
