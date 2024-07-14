import { DEFAULT_CATEGORIES } from '@/config/const';
import mongoose from 'mongoose';
import IOrganization from '../types/organization';
import { AccountDB_name } from './Account';

export const OrganizationDB_name = 'Organization';

const schema = new mongoose.Schema<IOrganization>({
	name: {
		type: String,
		required: true,
	},
	industry: {
		type: String,
		default: '',
	},
	domain: {
		type: String,
		default: '',
	},
	logo: {
		type: String,
		default: '',
	},
	address: {
		type: {
			street: String,
			city: String,
			state: String,
			zip: String,
			country: String,
		},
		default: {
			street: '',
			city: '',
			state: '',
			zip: '',
			country: '',
		},
	},
	timezone: String,

	categories: {
		type: [String],
		default: DEFAULT_CATEGORIES,
	},

	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: AccountDB_name,
		required: true,
	},
});

const OrganizationDB = mongoose.model<IOrganization>(OrganizationDB_name, schema);

export default OrganizationDB;
