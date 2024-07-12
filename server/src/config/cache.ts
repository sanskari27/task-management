import Logger from 'n23-logger';
import { createClient } from 'redis';
import { CACHE_TIMEOUT } from './const';

const client = createClient({
	url: 'redis://127.0.0.1:6379',
});

// Handle connection events
client.on('connect', () => {
	console.log('Connected to Redis server');
});

client.on('error', (err) => {
	console.error('Redis error:', err);
});

export async function getOrCache<T>(key: string, cb: () => Promise<T>) {
	try {
		const value = await client.get(key);
		if (value) {
			return JSON.parse(value) as T;
		}
	} catch (err) {
		Logger.error('ERROR-CACHE: Error fetching Data ' + key, err as Error);
	}
	try {
		const updatedData = await cb();
		await client.setEx(key, CACHE_TIMEOUT, JSON.stringify(updatedData));
		return updatedData as T;
	} catch (err) {
		Logger.error('ERROR-CACHE: Error Generating Data ' + key, err as Error);
	}
	throw new Error('Error generating cache');
}

export function saveToCache(key: string, value: string | string[] | number | object) {
	return new Promise(async (resolve, reject) => {
		try {
			await client.setEx(key, CACHE_TIMEOUT, JSON.stringify(value));
			resolve(null);
		} catch (err) {
			reject(new Error('Error saving to cache'));
		}
	});
}

export function removeFromCache(key: string) {
	return new Promise(async (resolve, reject) => {
		await client.del(key);
		resolve(null);
	});
}

export default client;
