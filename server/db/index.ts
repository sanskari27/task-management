import mongoose from 'mongoose';
export { AccountDB, EmployeeDB, OrganizationDB, PermissionDB, SessionDB, StorageDB } from './repo';
export type { IAccount, IEmployee, IOrganization, IPermission, ISession, IStorage } from './types';

export default function connectDB(database_url: string) {
	return new Promise((resolve, reject) => {
		mongoose.set('strict', false);
		mongoose.set('strictQuery', false);
		mongoose.set('strictPopulate', false);
		mongoose
			.connect(database_url)
			.then(() => {
				resolve('Successfully connected to database');
			})
			.catch((error) => {
				reject(error);
			});
	});
}
