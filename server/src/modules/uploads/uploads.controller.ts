import { NextFunction, Request, Response } from 'express';
import FileUpload, { ResolvedFile } from '../../config/FileUpload';
import { CustomError } from '../../errors';
import COMMON_ERRORS from '../../errors/common-errors';
import { Respond } from '../../utils/ExpressUtils';

async function uploadMedia(req: Request, res: Response, next: NextFunction) {
	let uploadedFile: ResolvedFile | null = null;
	try {
		uploadedFile = await FileUpload.SingleFileUpload(req, res, {
			field_name: 'file',
			options: {},
		});
	} catch (e) {
		return next(new CustomError(COMMON_ERRORS.FILE_UPLOAD_ERROR));
	}

	return Respond({
		res,
		status: 200,
		data: {
			file: uploadedFile.filename,
		},
	});
}

const Controller = {
	uploadMedia,
};

export default Controller;
