import mongoose from 'mongoose';
export {
	AccountDB,
	EmployeeDB,
	OrganizationDB,
	ReminderDB,
	SessionDB,
	StorageDB,
	TaskDB,
} from './repo';
export type {
	IAccount,
	IEmployee,
	IOrganization,
	IReminder,
	ISession,
	IStorage,
	ITask,
} from './types';

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
