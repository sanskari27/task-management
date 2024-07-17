import api from '@/lib/api';

export default class MediaService {
	static async uploadFile(file: File) {
		try {
			const formData = new FormData();
			formData.append('file', file);
			const { data } = await api.post(`/upload-media`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return data.name;
		} catch (error) {
			return null;
		}
	}
}
