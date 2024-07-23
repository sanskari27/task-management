import api from '@/lib/api';

export default class MediaService {
	static async uploadFile(file: File | Blob, filename?: string): Promise<string> {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('filename', filename ?? '');
		const { data } = await api.post(`/upload-media`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return data.name as string;
	}
}
