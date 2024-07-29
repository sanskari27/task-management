import { Document, Model } from 'mongoose';

export interface IStorageModel extends Model<IStorage> {
	getString(key: string): Promise<string | null>;
	getObject(key: string): Promise<object | null>;
	setString(key: string, value: string): Promise<void>;
	setObject(key: string, value: object): Promise<void>;
	incValue(key: string, value: number): Promise<void>;
	deleteKey(key: string): Promise<void>;
}

export default interface IStorage extends Document {
	key: string;
	value: string | undefined;
	object: object | undefined;
	expireAt: Date;
}
