import express from 'express';
import SessionRoute from './auth/auth.route';
import OrganizationRoute from './organization/organization.route';
import TasksRoute from './tasks/tasks.route';
import UploadsRoute from './uploads/uploads.route';

import { COMMON_ERRORS, CustomError } from '@/errors';
import VerifySession from '@/middleware/VerifySession';
import FileUpload, { SingleFileUploadOptions } from '../config/FileUpload';
import { Respond, RespondFile, generateRandomID } from '../utils/ExpressUtils';

const router = express.Router();

// Next routes will be webhooks routes

router.use('/auth', SessionRoute);
router.use('/organization', VerifySession, OrganizationRoute);
router.use('/tasks', VerifySession, TasksRoute);
router.use('/uploads', VerifySession, UploadsRoute);

router
	.route('/conversation-message-key')
	.all(VerifySession)
	.post(async function (req, res, next) {
		const key = generateRandomID();

		Respond({
			res,
			status: 200,
			data: {
				key,
			},
		});
	});

router.post('/upload-media', async function (req, res, next) {
	const fileUploadOptions: SingleFileUploadOptions = {
		field_name: 'file',
		options: {},
	};

	try {
		const uploadedFile = await FileUpload.SingleFileUpload(req, res, fileUploadOptions);
		return Respond({
			res,
			status: 200,
			data: {
				name: uploadedFile.filename,
			},
		});
	} catch (err: unknown) {
		return next(new CustomError(COMMON_ERRORS.FILE_UPLOAD_ERROR, err));
	}
});

router.get('/media/:filename', async function (req, res, next) {
	try {
		const path = __basedir + '/static/' + req.params.filename;
		return RespondFile({
			res,
			filename: req.params.filename,
			filepath: path,
		});
	} catch (err: unknown) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
});

export default router;
