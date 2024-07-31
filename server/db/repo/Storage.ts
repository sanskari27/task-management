import mongoose from 'mongoose';
import IStorage, { IStorageModel } from '../types/storage';

const StorageSchema = new mongoose.Schema<IStorage>({
	key: {
		type: String,
		required: true,
		unique: true,
	},
	value: {
		type: String,
	},
	object: {
		type: Object,
	},
});

StorageSchema.statics.getString = async function (key: string): Promise<string | null> {
	const Storage: IStorage = await this.findOne({ key });
	if (Storage === null || Storage.value === undefined) {
		return null;
	}
	return Storage.value;
};

StorageSchema.statics.getObject = async function (key: string): Promise<object | null> {
	const Storage: IStorage = await this.findOne({ key });
	if (Storage === null || Storage.object === undefined) {
		return null;
	}
	return Storage.object;
};

StorageSchema.statics.incValue = async function (key: string, value: number) {
	const Storage: IStorage = await this.findOne({ key });
	if (Storage === null || Storage.object === undefined) {
		return null;
	}
	Storage.object = (Number(Storage.object) + value) as any;
	await Storage.save();
};

StorageSchema.statics.setString = async function (key: string, value: string): Promise<void> {
	const Storage: IStorage = await this.findOne({ key });

	if (Storage === null) {
		this.create({ key, value });
	} else {
		Storage.value = value;
		Storage.object = undefined;
		await Storage.save();
	}
};

StorageSchema.statics.setObject = async function (key: string, value: object): Promise<void> {
	const Storage: IStorage = await this.findOne({ key });
	if (Storage === null) {
		this.create({ key, object: value });
	} else {
		Storage.value = undefined;
		Storage.object = value;
		Storage.save();
	}
};

StorageSchema.statics.deleteKey = async function (key: string): Promise<void> {
	await this.deleteOne({ key });
};
const StorageDB = mongoose.model<IStorage, IStorageModel>('Storage', StorageSchema);

export default StorageDB;
