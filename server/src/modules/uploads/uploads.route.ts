import express from 'express';
import Controller from './uploads.controller';

const router = express.Router();

router.route('/upload-media').post(Controller.uploadMedia);

export default router;
