import { StorageDB } from '@/db';
import axios from 'axios';
import Logger from 'n23-logger';
import { META_AUTH_TOKEN, META_PHONE_ID } from '../../config/const';
export { default as WhatsappTemplates } from './templates';

const whatsapp = axios.create({
	baseURL: `https://graph.facebook.com/v20.0/`,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		Authorization: `Bearer ${META_AUTH_TOKEN}`,
	},
});

export async function sendWhatsapp(opts: any) {
	try {
		await whatsapp.post(`${META_PHONE_ID}/messages`, opts);
		StorageDB.incValue('whatsapp_sent', 1);
	} catch (err) {
		if (axios.isAxiosError(err)) {
			Logger.error('Whatsapp Error', err, {
				...(err.response as any).data,
				details: 'Error Sending whatsapp message',
			});
		} else {
			Logger.error('Whatsapp Error', err as Error, {
				...(err as Error),
				details: 'Error Sending whatsapp message',
			});
		}
	}
}
