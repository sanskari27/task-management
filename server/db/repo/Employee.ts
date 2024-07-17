import mongoose from 'mongoose';
import IEmployee from '../types/employee';
import { AccountDB_name } from './Account';
import { OrganizationDB_name } from './Organization';

export const EmployeeDB_name = 'Employee';

const schema = new mongoose.Schema<IEmployee>({
	organization: {
		type: mongoose.Schema.Types.ObjectId,
		ref: OrganizationDB_name,
		required: true,
	},
	parent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: EmployeeDB_name,
	},
	account_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: AccountDB_name,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	can_create_others: {
		type: Boolean,
		default: false,
	},
	can_let_others_create: {
		type: Boolean,
		default: false,
	},
	name: String,
	email: String,
	phone: String,
});

schema.index({ account_id: 1, organization: 1 }, { unique: true });

const EmployeeDB = mongoose.model<IEmployee>(EmployeeDB_name, schema);

export default EmployeeDB;
